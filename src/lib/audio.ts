// Lightweight deterministic signal synthesis for the demo.
// No audio assets are shipped: waveforms, spectrograms and playback are all
// generated from a seeded pseudo-random generator so the demo is reproducible.

export type Variant = "clean" | "noisy" | "enhanced";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Envelope of a short "sentence": a few syllable bursts. */
function envelope(t: number, rnd: () => number, bursts: number[]) {
  let e = 0;
  for (const c of bursts) {
    const d = (t - c) / 0.13;
    e += Math.exp(-d * d);
  }
  return Math.min(1, e) * (0.85 + 0.15 * rnd());
}

export interface SignalOptions {
  seed: string;
  variant: Variant;
  duration?: number;
  samples?: number;
}

/** Returns a normalised waveform array in [-1, 1]. */
export function makeWaveform({
  seed,
  variant,
  duration = 2.4,
  samples = 900,
}: SignalOptions): Float32Array {
  const rnd = mulberry32(hashSeed(seed + variant));
  const brnd = mulberry32(hashSeed(seed));
  const bursts = Array.from({ length: 6 }, (_, i) => 0.25 + i * 0.36 + brnd() * 0.06);
  const noiseLevel = variant === "noisy" ? 0.45 : variant === "enhanced" ? 0.09 : 0.03;
  const out = new Float32Array(samples);
  for (let i = 0; i < samples; i++) {
    const t = (i / samples) * duration;
    const env = envelope(t, rnd, bursts);
    const voiced =
      Math.sin(2 * Math.PI * 118 * t) * 0.6 +
      Math.sin(2 * Math.PI * 236 * t) * 0.25 +
      Math.sin(2 * Math.PI * 354 * t) * 0.12;
    const noise = (rnd() * 2 - 1) * noiseLevel;
    out[i] = Math.max(-1, Math.min(1, voiced * env * 0.9 + noise));
  }
  return out;
}

/** Returns a [timeBins][freqBins] magnitude matrix in [0, 1]. */
export function makeSpectrogram({
  seed,
  variant,
  timeBins = 140,
  freqBins = 56,
  duration = 2.4,
}: SignalOptions & { timeBins?: number; freqBins?: number }): number[][] {
  const rnd = mulberry32(hashSeed(seed + variant + "spec"));
  const brnd = mulberry32(hashSeed(seed));
  const bursts = Array.from({ length: 6 }, (_, i) => 0.25 + i * 0.36 + brnd() * 0.06);
  const noiseFloor = variant === "noisy" ? 0.42 : variant === "enhanced" ? 0.1 : 0.05;
  const formants = [3, 9, 17, 26];
  const m: number[][] = [];
  for (let x = 0; x < timeBins; x++) {
    const t = (x / timeBins) * duration;
    const env = envelope(t, rnd, bursts);
    const col: number[] = [];
    for (let y = 0; y < freqBins; y++) {
      let v = noiseFloor * (0.5 + rnd() * 0.7) * (1 - y / (freqBins * 1.6));
      for (let f = 0; f < formants.length; f++) {
        const centre = formants[f] + Math.sin(t * 3 + f) * 1.5;
        const d = (y - centre) / 2.2;
        v += env * Math.exp(-d * d) * (0.95 - f * 0.16);
      }
      // harmonic striations
      if (y % 3 === 0) v *= 1.12;
      col.push(Math.max(0, Math.min(1, v)));
    }
    m.push(col);
  }
  return m;
}

/* ---------------------------------- playback --------------------------------- */

let ctx: AudioContext | null = null;
let current: { source: AudioBufferSourceNode; stop: () => void } | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
}

export function stopPlayback() {
  if (current) {
    try {
      current.source.stop();
    } catch {
      /* already stopped */
    }
    current = null;
  }
}

/** Synthesises and plays a short speech-like sound for the given variant. */
export function playSignal(seed: string, variant: Variant, onEnded?: () => void): number {
  stopPlayback();
  const audio = getCtx();
  void audio.resume();
  const duration = 2.4;
  const sr = audio.sampleRate;
  const buffer = audio.createBuffer(1, Math.floor(sr * duration), sr);
  const data = buffer.getChannelData(0);
  const rnd = mulberry32(hashSeed(seed + variant + "audio"));
  const brnd = mulberry32(hashSeed(seed));
  const bursts = Array.from({ length: 6 }, (_, i) => 0.25 + i * 0.36 + brnd() * 0.06);
  const noiseLevel = variant === "noisy" ? 0.28 : variant === "enhanced" ? 0.05 : 0.015;
  const f0 = 108 + (hashSeed(seed) % 30);
  let phase = 0;
  for (let i = 0; i < data.length; i++) {
    const t = i / sr;
    const env = envelope(t, rnd, bursts);
    const vib = 1 + Math.sin(2 * Math.PI * 4.5 * t) * 0.02;
    phase += (2 * Math.PI * f0 * vib) / sr;
    const voiced =
      Math.sin(phase) * 0.5 + Math.sin(phase * 2) * 0.22 + Math.sin(phase * 3) * 0.1;
    data[i] = voiced * env * 0.35 + (rnd() * 2 - 1) * noiseLevel;
  }
  const source = audio.createBufferSource();
  source.buffer = buffer;
  const gain = audio.createGain();
  gain.gain.value = 0.9;
  source.connect(gain).connect(audio.destination);
  source.onended = () => {
    current = null;
    onEnded?.();
  };
  source.start();
  current = { source, stop: () => source.stop() };
  return duration;
}
