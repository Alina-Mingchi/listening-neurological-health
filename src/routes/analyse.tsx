import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageShell, Notice } from "@/components/PageShell";
import { Pipeline } from "@/components/Pipeline";
import { ArrowRight } from "@/components/icons";

export const Route = createFileRoute("/analyse")({
  head: () => ({
    meta: [
      { title: "Analyse Speech — Neurological Health Research Demo" },
      {
        name: "description",
        content:
          "How can subtle characteristics of speech provide information about neurological health? Walk through features, model prediction and explanation.",
      },
      { property: "og:title", content: "Analyse Speech — Speech Analysis & Machine Learning" },
      {
        property: "og:description",
        content: "An interactive walkthrough from acoustic features to an explainable model prediction.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalysePage,
});

function AnalysePage() {
  return (
    <PageShell
      eyebrow="Demonstration 02"
      title="Analyse speech"
      subtitle="Speech analysis & Machine Learning"
      intro="How can subtle characteristics of speech provide information about neurological health?"
      steps={[
        { label: "Intro", active: true },
        { label: "Listen", active: false },
        { label: "Analyse", active: false },
        { label: "Predict", active: false },
        { label: "Why", active: false },
      ]}
    >
      <div className="paper p-6">
        <p className="rule-heading mb-4">The pipeline</p>
        <Pipeline
          steps={["Speech", "Extract speech features", "Machine learning", "Prediction", "Explanation"]}
        />
      </div>

      <div className="mt-8">
        <Notice tone="warn">Uses pre-recorded research speech only.</Notice>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <Button asChild size="lg">
          <Link to="/analyse/listen">
            Start
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
