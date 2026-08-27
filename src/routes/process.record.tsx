import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageShell, Notice } from "@/components/PageShell";
import { Mic, Play, Square, Trash2 } from "@/components/icons";

export const Route = createFileRoute("/process/record")({
  head: () => ({
    meta: [
      { title: "Try Noise Reduction With Your Own Voice" },
      {
        name: "description",
        content:
          "Record a short sample and hear it enhanced. Recordings are used only to demonstrate noise reduction and are never analysed for neurological conditions.",
      },
      { property: "og:title", content: "Want to try it with your own voice?" },
      {
        property: "og:description",
        content: "Record, enhance and delete your own speech sample in the noise-reduction demo.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RecordPage,
});

type Status = "idle" | "recording" | "recorded" | "queued" | "processing" | "ready";

export function RecordPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [seconds, setSeconds] = useState(0);
  const [jobLog, setJobLog] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const urlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunks.current = [];
      mr.ondataavailable = (e) => chunks.current.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: mr.mimeType || "audio/webm" });
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = URL.createObjectURL(blob);
        setStatus("recorded");
      };
      recorder.current = mr;
      mr.start();
      setSeconds(0);
      setStatus("recording");
      timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      toast.error("Microphone access was blocked", {
        description: "Allow microphone permission in your browser to record a sample.",
      });
    }
  };

  const stopRecording = () => {
    if (timer.current) clearInterval(timer.current);
    recorder.current?.stop();
  };

  const analyse = () => {
    setStatus("queued");
    setJobLog(["Uploading sample to the compute cluster…"]);
    const steps: [number, string, Status][] = [
      [900, "sbatch submitted · job 481207 · partition gpu · queued", "queued"],
      [2000, "Job 481207 running on node gpu-04 (NVIDIA A100)", "processing"],
      [3400, "Speech enhancement model inference complete", "processing"],
      [4300, "Enhanced audio written · job 481207 COMPLETED", "ready"],
    ];
    steps.forEach(([delay, line, next]) => {
      setTimeout(() => {
        setJobLog((l) => [...l, line]);
        setStatus(next);
      }, delay);
    });
  };

  const togglePlay = () => {
    if (!urlRef.current) return;
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }
    const el = audioRef.current ?? new Audio(urlRef.current);
    el.src = urlRef.current;
    audioRef.current = el;
    el.onended = () => setPlaying(false);
    void el.play();
    setPlaying(true);
  };

  const deleteRecording = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    chunks.current = [];
    setPlaying(false);
    setSeconds(0);
    setJobLog([]);
    setStatus("idle");
    toast.success("Recording has been deleted");
  };

  return (
    <PageShell
      eyebrow="Demonstration 01 · Optional"
      title="Want to try it with your own voice?"
      steps={[
        { label: "Enhance", active: false },
        { label: "Your voice", active: true },
      ]}
    >
      <Notice tone="warn">
        Your recording will only be used to demonstrate noise reduction. Your voice will
        <strong> NOT </strong>
        be analysed for neurological conditions.
      </Notice>

      <div className="paper mt-8 p-8">
        <div className="flex flex-wrap items-center gap-4">
          {status === "recording" ? (
            <Button size="lg" variant="destructive" onClick={stopRecording}>
              <Square className="size-4" />
              Stop recording
            </Button>
          ) : (
            <Button size="lg" onClick={startRecording}>
              <Mic className="size-4" />
              {status === "idle" ? "Record" : "Record again"}
            </Button>
          )}
          <span className="font-mono text-sm text-muted-foreground">
            {status === "recording" ? `● recording ${seconds}s` : status === "idle" ? "no sample" : `sample · ${seconds}s`}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-6">
          <Button
            variant="outline"
            disabled={status !== "recorded"}
            onClick={analyse}
          >
            Analyse your speech
          </Button>
          <Button
            onClick={togglePlay}
            disabled={status !== "ready"}
            className={
              status === "ready"
                ? "bg-success text-success-foreground hover:bg-success/90"
                : undefined
            }
          >
            {playing ? <Square className="size-4" /> : <Play className="size-4" />}
            Play enhanced speech
          </Button>
          {status === "queued" || status === "processing" ? (
            <span className="font-mono text-sm text-muted-foreground">processing on GPU…</span>
          ) : null}
        </div>

        {jobLog.length > 0 ? (
          <pre className="mt-6 overflow-x-auto rounded-md bg-surface-deep p-4 font-mono text-xs leading-relaxed text-primary-foreground/85">
            {jobLog.map((l) => `$ ${l}`).join("\n")}
          </pre>
        ) : null}
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <Button variant="outline" onClick={deleteRecording} disabled={status === "idle"}>
          <Trash2 className="size-4" />
          Delete my recording
        </Button>
      </div>
    </PageShell>
  );
}
