import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/PageShell";
import { SignalPanel } from "@/components/SignalPanel";
import { BiInline } from "@/components/Bilingual";
import { ArrowRight } from "@/components/icons";
import { parseCsv } from "@/lib/csv";

export const Route = createFileRoute("/analyse/measure")({
  head: () => ({
    meta: [
      { title: "Analyse · Analyser — What Does the Computer Measure?" },
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
      eyebrow={<BiInline en="Step 2 of 4" fr="Étape 2 sur 4" />}
      title="Analyse"
      titleFr="Analyser"
      intro="What does the computer measure?"
      introFr="Que mesure l'ordinateur ?"
      steps={[
        { label: "Intro", labelFr: "Intro", active: false },
        { label: "Listen", labelFr: "Écouter", active: false },
        { label: "Analyse", labelFr: "Analyser", active: true },
        { label: "Predict", labelFr: "Prédire", active: false },
        { label: "Why", labelFr: "Pourquoi", active: false },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <SignalPanel
          seed="speakerB"
          variant="clean"
          label="Speaker B"
          labelFr="Locuteur B"
          caption="Sustained sentence reading task"
          captionFr="Tâche de lecture de phrase soutenue"
        />

        <div className="paper overflow-hidden">
          <div className="border-b border-border px-4 py-2.5">
            <span className="font-display text-base font-semibold text-ink">Speech features</span>
            <span lang="fr" className="block font-display text-base italic text-ink-soft">
              Paramètres de la parole
            </span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="rule-heading border-b border-border text-left">
                <th className="px-4 py-2 font-normal">
                  Feature / <span lang="fr" className="italic">Paramètre</span>
                </th>
                <th className="px-4 py-2 text-right font-normal">
                  Value / <span lang="fr" className="italic">Valeur</span>
                </th>
                <th className="px-4 py-2 font-normal">
                  Unit / <span lang="fr" className="italic">Unité</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {(rows ?? []).map((r) => (
                <tr key={r["feature"]} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-2 text-ink-soft">
                    {r["feature"]}
                    {r["feature_fr"] && r["feature_fr"] !== r["feature"] ? (
                      <span lang="fr" className="block text-xs italic text-muted-foreground">
                        {r["feature_fr"]}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-2 text-right font-mono align-top">{r["value"]}</td>
                  <td className="px-4 py-2 font-mono text-xs align-top text-muted-foreground">{r["unit"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <Button asChild>
          <Link to="/analyse/predict">
            <BiInline en="Next" fr="Suivant" />
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
