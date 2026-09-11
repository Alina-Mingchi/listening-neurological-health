"""
SLURM bridge for the "try it with your own voice" demo.

Run this on a machine that can SSH to your Idiap VWS (your laptop is fine).
The web UI at http://localhost:8080/process/record talks to it over HTTP.

    pip install fastapi uvicorn python-multipart
    export SLURM_SSH_HOST=mhou@vws.idiap.ch          # ssh target
    export SLURM_REMOTE_DIR=/idiap/temp/mhou/code/webdemo
    uvicorn server:app --host 127.0.0.1 --port 8000

Flow per request:
  1. browser POSTs the recording       -> saved locally
  2. scp the file to $SLURM_REMOTE_DIR/<job>/input.<ext>
  3. ssh "sbatch enhance_one.sh <job>" -> remember the SLURM job id
  4. browser polls GET /jobs/<id>      -> we run `sacct` over ssh
  5. when COMPLETED we scp back enhanced.wav and serve it
  6. DELETE /jobs/<id> removes local + remote files
"""

from __future__ import annotations

import os
import shutil
import subprocess
import uuid
from pathlib import Path

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

SSH_HOST = os.environ.get("SLURM_SSH_HOST", "mhou@vws.idiap.ch")
REMOTE_DIR = os.environ.get("SLURM_REMOTE_DIR", "/idiap/temp/mhou/code/webdemo")
LOCAL_DIR = Path(os.environ.get("BRIDGE_WORK_DIR", "./work")).resolve()
ALLOWED_ORIGINS = os.environ.get(
    "BRIDGE_ALLOWED_ORIGINS", "http://localhost:8080"
).split(",")

LOCAL_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

JOBS: dict[str, dict] = {}


def sh(args: list[str]) -> str:
    out = subprocess.run(args, capture_output=True, text=True, timeout=120)
    if out.returncode != 0:
        raise RuntimeError((out.stderr or out.stdout).strip())
    return out.stdout.strip()


@app.post("/jobs")
async def create_job(file: UploadFile = File(...)):
    job_id = uuid.uuid4().hex[:12]
    work = LOCAL_DIR / job_id
    work.mkdir(parents=True, exist_ok=True)
    suffix = Path(file.filename or "recording.webm").suffix or ".webm"
    local_in = work / f"input{suffix}"
    with local_in.open("wb") as f:
        shutil.copyfileobj(file.file, f)

    log = [f"received {local_in.name} ({local_in.stat().st_size} bytes)"]
    try:
        sh(["ssh", SSH_HOST, f"mkdir -p {REMOTE_DIR}/{job_id}"])
        sh(["scp", str(local_in), f"{SSH_HOST}:{REMOTE_DIR}/{job_id}/{local_in.name}"])
        log.append(f"uploaded to {REMOTE_DIR}/{job_id}")
        out = sh(["ssh", SSH_HOST, f"cd {REMOTE_DIR} && sbatch enhance_one.sh {job_id}"])
        slurm_id = out.split()[-1]
        log.append(f"sbatch submitted · job {slurm_id} · partition gpu")
    except Exception as exc:  # noqa: BLE001
        JOBS[job_id] = {"state": "failed", "log": log, "error": str(exc)}
        return JSONResponse({"id": job_id, "state": "failed", "log": log, "error": str(exc)}, 200)

    JOBS[job_id] = {"state": "queued", "slurm_job_id": slurm_id, "log": log, "error": None}
    return {"id": job_id, "state": "queued", "slurm_job_id": slurm_id, "log": log}


@app.get("/jobs/{job_id}")
def job_status(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(404, "unknown job")
    if job["state"] in ("completed", "failed"):
        return {"id": job_id, **job, "enhanced_url": job.get("enhanced_url")}

    slurm_id = job["slurm_job_id"]
    try:
        state = sh(
            ["ssh", SSH_HOST, f"sacct -j {slurm_id} --format=State --noheader --parsable2 | head -1"]
        ).strip()
    except Exception as exc:  # noqa: BLE001
        return {"id": job_id, "state": job["state"], "log": job["log"], "error": str(exc)}

    if state.startswith("RUNNING") and job["state"] != "running":
        job["state"] = "running"
        job["log"].append(f"job {slurm_id} RUNNING on gpu partition")
    elif state.startswith("COMPLETED"):
        local_out = LOCAL_DIR / job_id / "enhanced.wav"
        try:
            sh(["scp", f"{SSH_HOST}:{REMOTE_DIR}/{job_id}/enhanced.wav", str(local_out)])
        except Exception as exc:  # noqa: BLE001
            job["state"] = "failed"
            job["error"] = f"no enhanced.wav returned: {exc}"
            return {"id": job_id, **job}
        job["state"] = "completed"
        job["enhanced_url"] = f"/jobs/{job_id}/enhanced.wav"
        job["log"].append(f"job {slurm_id} COMPLETED · enhanced audio retrieved")
    elif state and not state.startswith(("PENDING", "RUNNING")):
        job["state"] = "failed"
        job["error"] = f"SLURM state {state}"
        job["log"].append(f"job {slurm_id} {state}")

    return {"id": job_id, **job}


@app.get("/jobs/{job_id}/enhanced.wav")
def enhanced_audio(job_id: str):
    path = LOCAL_DIR / job_id / "enhanced.wav"
    if not path.exists():
        raise HTTPException(404, "not ready")
    return FileResponse(path, media_type="audio/wav")


@app.delete("/jobs/{job_id}")
def delete_job(job_id: str):
    shutil.rmtree(LOCAL_DIR / job_id, ignore_errors=True)
    try:
        sh(["ssh", SSH_HOST, f"rm -rf {REMOTE_DIR}/{job_id}"])
    except Exception:  # noqa: BLE001
        pass
    JOBS.pop(job_id, None)
    return {"deleted": True}
