import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageShell, Notice } from "@/components/PageShell";
import { BiInline } from "@/components/Bilingual";
import { parseCsv } from "@/lib/csv";

export const Route = createFileRoute("/analyse/why")({
  head: () => ({
    meta: [
      { title: "Why · Pourquoi — Feature Contributions Behind the Prediction" },
      {
        name: "description",
        content:
          "Explore SHAP-style feature contributions behind the model output and click any acoustic feature to read its definition.",
      },
      { property: "og:title", content: "Why did the model predict this?" },
      {
        property: "og:description",
        content: "Feature contribution chart with definitions for each acoustic measurement.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WhyPage,
});

function WhyPage() {
  const [selected, setSelected] = useState<Record<string, string> | null>(null);

  const { data: rows } = useQuery({
    queryKey: ["features-csv"],
    queryFn: async () => parseCsv(await (await fetch("/data/features.csv")).text()),
  });

  const sorted = [...(rows ?? [])].sort(
    (a, b) => Math.abs(Number(b["shap"])) - Math.abs(Number(a["shap"])),
  );
  const max = Math.max(0.01, ...sorted.map((r) => Math.abs(Number(r["shap"]))));

  return (
    <PageShell
      eyebrow={<BiInline en="Step 4 of 4" fr="Étape 4 sur 4" />}
      title="Why did the model predict this?"
      titleFr="Pourquoi le modèle a-t-il fait cette prédiction ?"
      intro="Click a feature to learn more."
      introFr="Cliquez sur un paramètre pour en savoir plus."
      steps={[
        { label: "Intro", labelFr: "Intro", active: false },
        { label: "Listen", labelFr: "Écouter", active: false },
        { label: "Analyse", labelFr: "Analyser", active: false },
        { label: "Predict", labelFr: "Prédire", active: false },
        { label: "Why", labelFr: "Pourquoi", active: true },
      ]}
    >
      <div className="paper p-6">
        <p className="rule-heading mb-5">
          Feature contribution (SHAP values) ·{" "}
          <span lang="fr" className="italic">Contribution des paramètres (valeurs SHAP)</span>
        </p>
        <ul className="space-y-2">
          {sorted.map((r) => {
            const shap = Number(r["shap"]);
            const width = (Math.abs(shap) / max) * 50;
            return (
              <li key={r["feature"]}>
                <button
                  onClick={() => setSelected(r)}
                  className="grid w-full grid-cols-[minmax(9rem,14rem)_1fr_4rem] items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-secondary"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-ink-soft">{r["feature"]}</span>
                    {r["feature_fr"] && r["feature_fr"] !== r["feature"] ? (
                      <span lang="fr" className="block truncate text-xs italic text-muted-foreground">
                        {r["feature_fr"]}
                      </span>
                    ) : null}
                  </span>
                  <span className="relative flex h-4 items-center">
                    <span className="absolute left-1/2 h-full w-px bg-border" />
                    <span
                      className={shap >= 0 ? "absolute left-1/2 h-3 rounded-r-sm bg-primary" : "absolute right-1/2 h-3 rounded-l-sm bg-gold"}
                      style={{ width: `${width}%` }}
                    />
                  </span>
                  <span className="text-right font-mono text-xs text-muted-foreground">
                    {shap >= 0 ? "+" : ""}
                    {shap.toFixed(2)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 text-xs text-muted-foreground">
          Bars to the right push the prediction towards <em>pathological</em>; bars to the left push towards{" "}
          <em>healthy</em>.
        </p>
        <p lang="fr" className="text-xs italic text-muted-foreground/80">
          Les barres vers la droite poussent la prédiction vers <em>pathologique</em> ; les barres vers la gauche la
          poussent vers <em>sain</em>.
        </p>
      </div>

      <div className="mt-8">
        <Notice tone="warn">
          Model prediction only for research development purpose, NOT a medical diagnosis.
          <br />
          <span lang="fr" className="italic">
            Prédiction du modèle uniquement à des fins de recherche et de développement, PAS un diagnostic médical.
          </span>
        </Notice>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <Button asChild size="lg">
          <Link to="/">
            <BiInline en="Finish" fr="Terminer" />
          </Link>
        </Button>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">
              {selected?.["feature"]}
              {selected?.["feature_fr"] && selected["feature_fr"] !== selected["feature"] ? (
                <span lang="fr" className="block text-base italic text-ink-soft">
                  {selected["feature_fr"]}
                </span>
              ) : null}
            </DialogTitle>
            <DialogDescription className="pt-2 text-left">
              {selected?.["definition"]}
              <span lang="fr" className="mt-2 block italic">
                {selected?.["definition_fr"]}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-6 border-t border-border pt-4 font-mono text-sm">
            <span>
              value / valeur: <strong>{selected?.["value"]}</strong> {selected?.["unit"]}
            </span>
            <span>
              SHAP: <strong>{selected?.["shap"]}</strong>
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
