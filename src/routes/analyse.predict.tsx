import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageShell, Notice } from "@/components/PageShell";
import { Pipeline } from "@/components/Pipeline";
import { BiInline } from "@/components/Bilingual";
import { ArrowRight } from "@/components/icons";

export const Route = createFileRoute("/analyse/predict")({
  head: () => ({
    meta: [
      { title: "Predict · Prédire — Model Output on Research Speech" },
      {
        name: "description",
        content:
          "See how extracted speech features flow into a machine-learning model and produce healthy versus pathological probabilities, for research only.",
      },
      { property: "og:title", content: "Predict — Speech features to model output" },
      {
        property: "og:description",
        content: "Model probabilities for a research speech sample, with a clear non-diagnostic disclaimer.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PredictPage,
});

const RESULT = [
  { label: "Healthy", labelFr: "Sain", value: 27 },
  { label: "Pathological", labelFr: "Pathologique", value: 73 },
];

function PredictPage() {
  return (
    <PageShell
      eyebrow={<BiInline en="Step 3 of 4" fr="Étape 3 sur 4" />}
      title="Predict"
      titleFr="Prédire"
      steps={[
        { label: "Intro", labelFr: "Intro", active: false },
        { label: "Listen", labelFr: "Écouter", active: false },
        { label: "Analyse", labelFr: "Analyser", active: false },
        { label: "Predict", labelFr: "Prédire", active: true },
        { label: "Why", labelFr: "Pourquoi", active: false },
      ]}
    >
      <div className="paper p-6">
        <p className="rule-heading mb-4">
          Pipeline · <span lang="fr" className="italic">Pipeline</span>
        </p>
        <Pipeline
          steps={[
            { en: "Speech features", fr: "Paramètres de la parole" },
            { en: "ML Model", fr: "Modèle d'apprentissage" },
            { en: "Prediction", fr: "Prédiction" },
          ]}
          activeIndex={1}
        />

        <div className="mt-8 space-y-4">
          {RESULT.map((r) => (
            <div key={r.label}>
              <div className="flex items-baseline justify-between">
                <span className="font-display text-lg text-ink">
                  {r.label} · <span lang="fr" className="italic text-ink-soft">{r.labelFr}</span>
                </span>
                <span className="font-mono text-lg text-primary">{r.value}%</span>
              </div>
              <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={r.label === "Pathological" ? "h-full bg-primary" : "h-full bg-accent-foreground/50"}
                  style={{ width: `${r.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
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
          <Link to="/analyse/why">
            <BiInline en="Why this prediction?" fr="Pourquoi cette prédiction ?" />
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
