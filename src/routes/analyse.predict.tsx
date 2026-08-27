import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageShell, Notice } from "@/components/PageShell";
import { Pipeline } from "@/components/Pipeline";
import { ArrowRight } from "@/components/icons";

export const Route = createFileRoute("/analyse/predict")({
  head: () => ({
    meta: [
      { title: "Predict — Model Output on Research Speech" },
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
  { label: "Healthy", value: 27 },
  { label: "Pathological", value: 73 },
];

function PredictPage() {
  return (
    <PageShell
      eyebrow="Step 3 of 4"
      title="Predict"
      steps={[
        { label: "Intro", active: false },
        { label: "Listen", active: false },
        { label: "Analyse", active: false },
        { label: "Predict", active: true },
        { label: "Why", active: false },
      ]}
    >
      <div className="paper p-6">
        <p className="rule-heading mb-4">Pipeline</p>
        <Pipeline steps={["Speech features", "ML Model", "Prediction"]} activeIndex={1} />

        <div className="mt-8 space-y-4">
          {RESULT.map((r) => (
            <div key={r.label}>
              <div className="flex items-baseline justify-between">
                <span className="font-display text-lg text-ink">{r.label}</span>
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
        </Notice>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <Button asChild size="lg">
          <Link to="/analyse/why">
            Why this prediction?
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
