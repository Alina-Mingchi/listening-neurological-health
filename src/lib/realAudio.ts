// Loading, analysis and playback of real audio files shipped in /public/audio.

export interface AudioAnalysis {
  /** Downsampled peak envelope in [-1, 1]. */
  waveform: Float32Array;
  /** [timeBins][freqBins] magnitudes in [0, 1]. */
  spectrogram: number[][];
  duration: number;
}

let ctx: AudioContext | null = null;
function getCtx(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
}

const cache = new Map<string, Promise<AudioAnalysis>>();

export function analyseFile(url: string): Promise<AudioAnalysis> {
  let p = cache.get(url);
  if (!p) {
    p = (async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Audio not found: ${url}`);
      const buf = await res.arrayBuffer();
      const decoded = await getCtx().decodeAudioData(buf);
      return analyseBuffer(decoded);
    })();
    cache.set(url, p);
  }
  return p;
}

export function analyseBuffer(buffer: AudioBuffer, samples = 900): AudioAnalysis {
  const data = buffer.getChannelData(0);
  const step = Math.max(1, Math.floor(data.length / samples));
  const wave = new Float32Array(samples);
  let peak = 1e-6;
  for (let i = 0; i < samples; i++) {
    const start = i * step;
    let max = 0;
    for (let j = start; j < Math.min(start + step, data.length); j++) {
      const v = data[j] ?? 0;
      if (Math.abs(v) > Math.abs(max)) max = v;
    }
    wave[i] = max;
    if (Math.abs(max) > peak) peak = Math.abs(max);
  }
  for (let i = 0; i < samples; i++) wave[i] = (wave[i] ?? 0) / peak;

  return {
    waveform: wave,
    spectrogram: computeSpectrogram(data, buffer.sampleRate),
    duration: buffer.duration,
  };
}

/* ------------------------------- spectrogram ------------------------------- */

function fft(re: Float32Array, im: Float32Array) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j] as number, re[i] as number];
      [im[i], im[j]] = [im[j] as number, im[i] as number];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wr = Math.cos(ang);
    const wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1;
      let ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const ar = re[i + k] as number;
        const ai = im[i + k] as number;
        const br = re[i + k + len / 2] as number;
        const bi = im[i + k + len / 2] as number;
        const tr = br * cr - bi * ci;
        const ti = br * ci + bi * cr;
        re[i + k] = ar + tr;
        im[i + k] = ai + ti;
        re[i + k + len / 2] = ar - tr;
        im[i + k + len / 2] = ai - ti;
        const ncr = cr * wr - ci * wi;
        ci = cr * wi + ci * wr;
        cr = ncr;
      }
    }
  }
}

/** STFT magnitudes, log-scaled and normalised, limited to 0–8 kHz. */
export function computeSpectrogram(
  data: Float32Array,
  sampleRate: number,
  timeBins = 220,
  freqBins = 64,
): number[][] {
  const N = 1024;
  const half = N / 2;
  const maxBin = Math.min(half, Math.round((8000 / (sampleRate / 2)) * half));
  const hop = Math.max(1, Math.floor((data.length - N) / timeBins));
  const window = new Float32Array(N);
  for (let i = 0; i < N; i++) window[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (N - 1));

  const cols: number[][] = [];
  let min = Infinity;
  let max = -Infinity;
  for (let t = 0; t < timeBins; t++) {
    const off = t * hop;
    const re = new Float32Array(N);
    const im = new Float32Array(N);
    for (let i = 0; i < N; i++) re[i] = (data[off + i] ?? 0) * (window[i] as number);
    fft(re, im);
    const col: number[] = [];
    for (let f = 0; f < freqBins; f++) {
      // logarithmic frequency mapping for a speech-friendly view
      const lo = Math.floor((maxBin * f) / freqBins);
      const hi = Math.max(lo + 1, Math.floor((maxBin * (f + 1)) / freqBins));
      let acc = 0;
      for (let b = lo; b < hi; b++) {
        const r = re[b] as number;
        const i2 = im[b] as number;
        acc += Math.sqrt(r * r + i2 * i2);
      }
      const db = 20 * Math.log10(acc / (hi - lo) + 1e-8);
      if (db < min) min = db;
      if (db > max) max = db;
      col.push(db);
    }
    cols.push(col);
  }
  const floor = Math.max(min, max - 70);
  const range = Math.max(1e-6, max - floor);
  return cols.map((c) => c.map((v) => Math.max(0, Math.min(1, (v - floor) / range))));
}

/* --------------------------------- playback -------------------------------- */

let currentEl: HTMLAudioElement | null = null;

export function stopFilePlayback() {
  if (currentEl) {
    currentEl.pause();
    currentEl.currentTime = 0;
    currentEl = null;
  }
}

export function playFile(url: string, onEnded?: () => void): HTMLAudioElement {
  stopFilePlayback();
  const el = new Audio(url);
  el.addEventListener("ended", () => {
    currentEl = null;
    onEnded?.();
  });
  el.addEventListener("error", () => {
    currentEl = null;
    onEnded?.();
  });
  void el.play();
  currentEl = el;
  return el;
}
