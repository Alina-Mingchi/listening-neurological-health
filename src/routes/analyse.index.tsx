import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageShell, Notice } from "@/components/PageShell";
import { Pipeline } from "@/components/Pipeline";
import { BiInline } from "@/components/Bilingual";
import { ArrowRight } from "@/components/icons";

export const Route = createFileRoute("/analyse/")({
  head: () => ({
    meta: [
      { title: "Analyse Speech · Analyser la parole — Research Demo" },
      {
        name: "description",
        content:
          "How can subtle characteristics of speech provide information about neurological health? Walk through features, model prediction and explanation, in English and French.",
      },
      { property: "og:title", content: "Analyse Speech · Analyser la parole" },
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
      eyebrow={<BiInline en="Demonstration 02" fr="Démonstration 02" />}
      title="Analyse speech"
      titleFr="Analyser la parole"
      subtitle="Speech analysis & Machine Learning"
      subtitleFr="Analyse de la parole et apprentissage automatique"
      intro="How can subtle characteristics of speech provide information about neurological health?"
      introFr="Comment des caractéristiques subtiles de la parole peuvent-elles renseigner sur la santé neurologique ?"
      steps={[
        { label: "Intro", labelFr: "Intro", active: true },
        { label: "Listen", labelFr: "Écouter", active: false },
        { label: "Analyse", labelFr: "Analyser", active: false },
        { label: "Predict", labelFr: "Prédire", active: false },
        { label: "Why", labelFr: "Pourquoi", active: false },
      ]}
    >
      <div className="paper p-6">
        <p className="rule-heading mb-4">
          The pipeline · <span lang="fr" className="italic">Le pipeline</span>
        </p>
        <Pipeline
          steps={[
            { en: "Speech", fr: "Parole" },
            { en: "Extract speech features", fr: "Extraction des paramètres" },
            { en: "Machine learning", fr: "Apprentissage automatique" },
            { en: "Prediction", fr: "Prédiction" },
            { en: "Explanation", fr: "Explication" },
          ]}
        />
      </div>

      <div className="mt-8">
        <Notice tone="warn">
          Uses pre-recorded research speech only.
          <br />
          <span lang="fr" className="italic">
            Utilise uniquement des enregistrements de parole de recherche préenregistrés.
          </span>
        </Notice>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <Button asChild size="lg">
          <Link to="/analyse/listen">
            <BiInline en="Start" fr="Commencer" />
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
