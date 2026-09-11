#!/bin/bash
#SBATCH --time 00:30:00
#SBATCH --nodes 1
#SBATCH --ntasks 1
#SBATCH --cpus-per-task 8
#SBATCH --partition gpu
#SBATCH --gpus 1
#SBATCH --account pause
#SBATCH --job-name=webenh
#SBATCH --output=/idiap/temp/mhou/code/slurm_logs/webenh-%j.out

# Usage (submitted by the bridge):  sbatch enhance_one.sh <job_id>
# Place this file in $SLURM_REMOTE_DIR (e.g. /idiap/temp/mhou/code/webdemo).

set -e
JOB_ID=$1
WORK=/idiap/temp/mhou/code/webdemo/$JOB_ID
MODEL=${wsj0_model_pred:-/idiap/temp/mhou/code/models/wsj0_nemo_se.nemo}

# --- environment (same as your usual shell.sh) -------------------------------
source /idiap/temp/mhou/miniconda3/etc/profile.d/conda.sh
conda activate nemo

# --- 1. convert the browser recording to 16 kHz mono wav ---------------------
IN=$(ls "$WORK"/input.* | head -1)
ffmpeg -y -i "$IN" -ac 1 -ar 16000 "$WORK/input.wav"

# --- 2. one-line manifest for NeMo -------------------------------------------
python - "$WORK" <<'PY'
import json, sys, wave
w = sys.argv[1]
with wave.open(f"{w}/input.wav") as f:
    dur = f.getnframes() / f.getframerate()
json.dump({"audio_filepath": f"{w}/input.wav", "duration": dur},
          open(f"{w}/manifest.json", "w")); print(file=open(f"{w}/manifest.json","a"))
PY

# --- 3. enhancement ----------------------------------------------------------
python /idiap/temp/mhou/code/NeMo/examples/audio/audio_to_audio_eval.py \
  model_path="$MODEL" \
  dataset_manifest="$WORK/manifest.json" \
  output_dir="$WORK/out" \
  batch_size=1 \
  amp=True

# --- 4. expose the result where the bridge expects it ------------------------
cp "$(find "$WORK/out" -name '*.wav' | head -1)" "$WORK/enhanced.wav"
echo "done -> $WORK/enhanced.wav"
