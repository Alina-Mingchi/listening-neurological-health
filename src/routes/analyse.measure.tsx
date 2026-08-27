import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/PageShell";
import { SignalPanel } from "@/components/SignalPanel";
import { ArrowRight } from "@/components/icons";
import { parseCsv } from "@/lib/csv";

export const Route = createFileRoute("/analyse/measure")({
  head: () => ({
    meta: [
      { title: "Analyse — What Does the Computer Measure?" },
      {
        name: "description",
        content:
          "See the acoustic features extracted from a research speech sample: pitch, pitch variation, loudness, formants, speech rate and voice quality.",
      },
      { property: "og:title", content: "Analyse — What does the computer measure?" },
      {
        property: "og:description",
        content: "Waveform, spectrogram and the extracted acoustic feature table side by side.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MeasurePage,
});

function MeasurePage() {
  const { data: rows } = useQuery({
    queryKey: ["features-csv"],
    queryFn: async () => parseCsv(await (await fetch("/data/features.csv")).text()),
  });

  return (
    <PageShell
      eyebrow="Step 2 of 4"
      title="Analyse"
      intro="What does the computer measure?"
      steps={[
        { label: "Intro", active: false },
        { label: "Listen", active: false },
        { label: "Analyse", active: true },
        { label: "Predict", active: false },
        { label: "Why", active: false },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <SignalPanel seed="speakerB" variant="clean" label="Speaker B" caption="Sustained sentence reading task" />

        <div className="paper overflow-hidden">
          <div className="border-b border-border px-4 py-2.5">
            <span className="font-display text-base font-semibold text-ink">Speech features</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="rule-heading border-b border-border text-left">
                <th className="px-4 py-2 font-normal">Feature</th>
                <th className="px-4 py-2 text-right font-normal">Value</th>
                <th className="px-4 py-2 font-normal">Unit</th>
              </tr>
            </thead>
            <tbody>
              {(rows ?? []).map((r) => (
                <tr key={r["feature"]} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-2 text-ink-soft">{r["feature"]}</td>
                  <td className="px-4 py-2 text-right font-mono">{r["value"]}</td>
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{r["unit"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <Button asChild>
          <Link to="/analyse/predict">
            Next
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
