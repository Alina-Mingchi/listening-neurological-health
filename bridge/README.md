# SLURM bridge for the voice demo

The browser cannot run `sbatch`. This small service does it for it.

```
browser (http://localhost:8080/process/record)
   |  POST /jobs  (the recording)
   v
bridge (http://localhost:8000)  --ssh/scp-->  VWS  --sbatch-->  GPU node
   ^  GET /jobs/<id>  (poll sacct, then scp enhanced.wav back)
```

## 1. Cluster side

Copy `enhance_one.sh` to `/idiap/temp/mhou/code/webdemo/` on the cluster and
adjust the conda env, model path and NeMo path at the top. Make sure
passwordless SSH works from the bridge machine:

```bash
ssh-copy-id mhou@vws.idiap.ch
ssh mhou@vws.idiap.ch 'mkdir -p /idiap/temp/mhou/code/webdemo'
scp bridge/enhance_one.sh mhou@vws.idiap.ch:/idiap/temp/mhou/code/webdemo/
```

## 2. Bridge side (your laptop)

```bash
pip install fastapi uvicorn python-multipart
export SLURM_SSH_HOST=mhou@vws.idiap.ch
export SLURM_REMOTE_DIR=/idiap/temp/mhou/code/webdemo
export BRIDGE_ALLOWED_ORIGINS=http://localhost:8080
cd bridge && uvicorn server:app --host 127.0.0.1 --port 8000
```

## 3. Web side

Nothing to do if the bridge is on `http://localhost:8000`. Otherwise set
`VITE_ENHANCE_API` in `.env` and restart the dev server.

If the bridge is not running the demo page falls back to the simulated
job log, so the demo still works offline.
