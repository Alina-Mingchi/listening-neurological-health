import { useEffect, useRef, useState } from "react";
import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BiInline } from "@/components/Bilingual";
import { makeSpectrogram, makeWaveform, playSignal, stopPlayback, type Variant } from "@/lib/audio";

interface Props {
  seed: string;
  variant: Variant;
  label: string;
  labelFr?: string;
  caption?: string;
  captionFr?: string;
  compact?: boolean;
}

function useCanvas(draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, deps: unknown[]) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    draw(ctx, rect.width, rect.height);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

function cssVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

export function SignalPanel({ seed, variant, label, labelFr, caption, captionFr, compact }: Props) {
  const [playing, setPlaying] = useState(false);

  const waveRef = useCanvas(
    (ctx, w, h) => {
      const data = makeWaveform({ seed, variant });
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = cssVar("--border", "#dbe2ec");
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
      ctx.strokeStyle = cssVar("--primary", "#2f5aa8");
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = (i / (data.length - 1)) * w;
        const y = h / 2 - (data[i] ?? 0) * (h / 2 - 2);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    },
    [seed, variant],
  );

  const specRef = useCanvas(
    (ctx, w, h) => {
      const m = makeSpectrogram({ seed, variant });
      const cols = m.length;
      const rows = m[0]?.length ?? 1;
      const cw = w / cols;
      const ch = h / rows;
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const v = m[x]?.[y] ?? 0;
          const l = 12 + v * 68;
          const c = 0.03 + v * 0.16;
          const hue = 262 - v * 60;
          ctx.fillStyle = `oklch(${l}% ${c} ${hue})`;
          ctx.fillRect(x * cw, h - (y + 1) * ch, cw + 1, ch + 1);
        }
      }
    },
    [seed, variant],
  );

  useEffect(() => () => stopPlayback(), []);

  const toggle = () => {
    if (playing) {
      stopPlayback();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    playSignal(seed, variant, () => setPlaying(false));
  };

  return (
    <figure className="paper overflow-hidden">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <div>
          <span className="font-display text-base font-semibold text-ink">{label}</span>
          {labelFr ? (
            <span lang="fr" className="block font-display text-base italic text-ink-soft">
              {labelFr}
            </span>
          ) : null}
          {caption ? <p className="text-xs text-muted-foreground">{caption}</p> : null}
          {captionFr ? (
            <p lang="fr" className="text-xs italic text-muted-foreground/80">
              {captionFr}
            </p>
          ) : null}
        </div>
        <Button size="sm" variant={playing ? "secondary" : "outline"} onClick={toggle}>
          {playing ? <Square className="size-3.5" /> : <Play className="size-3.5" />}
          {playing ? (
            <BiInline en="Stop" fr="Arrêter" />
          ) : (
            <BiInline en="Listen" fr="Écouter" />
          )}
        </Button>
      </figcaption>
      <div className="bg-card px-2 pt-2">
        <canvas ref={waveRef} className="block h-16 w-full" />
      </div>
      <div className="px-2 pb-2">
        <canvas ref={specRef} className={compact ? "block h-24 w-full rounded-sm" : "block h-36 w-full rounded-sm"} />
      </div>
      <div className="flex justify-between border-t border-border px-4 py-1.5 font-mono text-[0.65rem] text-muted-foreground">
        <span>0.0 s</span>
        <span>
          waveform · spectrogram (0–8 kHz) / <span lang="fr">forme d'onde · spectrogramme</span>
        </span>
        <span>2.4 s</span>
      </div>
    </figure>
  );
}
