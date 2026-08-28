import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageShell, Notice } from "@/components/PageShell";
import { SignalPanel } from "@/components/SignalPanel";
import { ArrowRight, RotateCcw } from "@/components/icons";
import { parseCsv } from "@/lib/csv";

export const Route = createFileRoute("/process/")({
  head: () => ({
    meta: [
      { title: "Process Speech — Noise Reduction Demo" },
      {
        name: "description",
        content:
          "Compare clean, noisy and enhanced speech recorded in bus, cafeteria, street and pedestrian environments, with measured SNR improvement.",
      },
      { property: "og:title", content: "Process Speech — Noise Reduction" },
      {
        property: "og:description",
        content: "Waveforms, spectrograms and measured noise reduction for four acoustic environments.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProcessPage,
});

const ENVS = ["BUS", "CAF", "STR", "PED"] as const;

function ProcessPage() {
  const [env, setEnv] = useState<string | null>(null);

  const { data: rows } = useQuery({
    queryKey: ["noise-reduction-csv"],
    queryFn: async () => parseCsv(await (await fetch("/data/noise_reduction.csv")).text()),
  });

  const row = rows?.find((r) => r['environment'] === env);

  return (
    <PageShell
      eyebrow="Demonstration 01"
      title="Process speech"
      intro="Choose an environment. Recordings are loaded from the local sample set."
      steps={[
        { label: "Enhance", active: true },
        { label: "Your voice", active: false },
      ]}
    >
      <div className="flex flex-wrap gap-3">
        {ENVS.map((e) => (
          <Button
            key={e}
            variant={env === e ? "default" : "outline"}
            onClick={() => setEnv(e)}
            className="font-mono tracking-widest"
          >
            {e}
          </Button>
        ))}
      </div>

      {!env ? (
        <p className="mt-8 text-sm text-muted-foreground">
          BUS — bus interior · CAF — cafeteria · STR — street · PED — pedestrian area
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          <p className="rule-heading">
            {row?.['label'] ?? env} · {row?.['file'] ?? "sample.wav"}
          </p>

          <div className="grid gap-6">
            <SignalPanel seed={env} variant="clean" label="Clean" caption="Reference studio recording" />
            <SignalPanel
              seed={env}
              variant="noisy"
              label="Noisy"
              caption={`Recording mixed with ${row?.['label'] ?? env} noise${row?.['input_snr_db'] ? ` · input SNR ${row['input_snr_db']} dB` : ""}`}
            />
            <SignalPanel seed={env} variant="enhanced" label="Enhanced" caption="After the noise-reduction front-end" />
          </div>

          <Notice>
            Noise reduction:{" "}
            <span className="font-mono text-lg text-primary">+{row?.['snr_gain_db'] ?? "—"} dB</span>{" "}
            SNR improvement for this recording.
          </Notice>

          <div className="flex flex-wrap gap-3 border-t border-border pt-6">
            <Button variant="outline" onClick={() => setEnv(null)}>
              <RotateCcw className="size-4" />
              Try another
            </Button>
            <Button asChild>
              <Link to="/process/record">
                Next
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
