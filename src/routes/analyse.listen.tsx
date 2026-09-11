import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageShell, Notice } from "@/components/PageShell";
import { SignalPanel } from "@/components/SignalPanel";
import { BiInline } from "@/components/Bilingual";
import { ArrowRight } from "@/components/icons";

export const Route = createFileRoute("/analyse/listen")({
  head: () => ({
    meta: [
      { title: "Listen · Écouter — Can You Hear Subtle Differences?" },
      {
        name: "description",
        content:
          "Compare two pre-recorded research speakers and judge which sounds more typical of healthy speech before the model answers.",
      },
      { property: "og:title", content: "Listen · Écouter — Can you hear subtle differences?" },
      {
        property: "og:description",
        content: "A listening test with two research speech samples in the neurological speech analysis demo.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ListenPage,
});

const STEPS = [
  { label: "Intro", labelFr: "Intro", active: false },
  { label: "Listen", labelFr: "Écouter", active: true },
  { label: "Analyse", labelFr: "Analyser", active: false },
  { label: "Predict", labelFr: "Prédire", active: false },
  { label: "Why", labelFr: "Pourquoi", active: false },
];

const OPTIONS = [
  { key: "A", en: "A", fr: "A" },
  { key: "B", en: "B", fr: "B" },
  { key: "Not sure", en: "Not sure", fr: "Je ne sais pas" },
];

function ListenPage() {
  const [choice, setChoice] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <PageShell
      eyebrow={<BiInline en="Step 1 of 4" fr="Étape 1 sur 4" />}
      title="Listen"
      titleFr="Écouter"
      intro="Can you hear subtle differences?"
      introFr="Entendez-vous des différences subtiles ?"
      steps={STEPS}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <SignalPanel
          seed="speakerA"
          src="/audio/hc.wav"
          variant="clean"
          label="Speaker A"
          labelFr="Locuteur A"
          caption="Pre-recorded research speech"
          captionFr="Parole de recherche préenregistrée"
          compact
        />
        <SignalPanel
          seed="speakerB"
          src="/audio/pd.wav"
          variant="enhanced"
          label="Speaker B"
          labelFr="Locuteur B"
          caption="Pre-recorded research speech"
          captionFr="Parole de recherche préenregistrée"
          compact
        />
      </div>

      <div className="paper mt-8 p-6">
        <h2 className="text-xl font-semibold">Which sounds more typical of healthy speech?</h2>
        <p lang="fr" className="font-display text-lg italic text-muted-foreground">
          Laquelle semble la plus typique d'une parole saine ?
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {OPTIONS.map((o) => (
            <Button
              key={o.key}
              variant={choice === o.key ? "default" : "outline"}
              onClick={() => setChoice(o.key)}
            >
              {o.en === o.fr ? o.en : <BiInline en={o.en} fr={o.fr} />}
            </Button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <Button variant="secondary" disabled={!choice} onClick={() => setRevealed(true)}>
            <BiInline en="Reveal" fr="Révéler" />
          </Button>
          {revealed ? (
            <div className="text-sm text-muted-foreground">
              <p>
                Speaker A is the healthy control; Speaker B carries a pathological label in the research corpus.
                {choice === "A"
                  ? " Your answer matched."
                  : choice === "B"
                    ? " Your answer did not match — these differences are hard to hear."
                    : " Most listeners are unsure — that is exactly the point."}
              </p>
              <p lang="fr" className="italic text-muted-foreground/80">
                Le locuteur A est le sujet témoin sain ; le locuteur B porte une étiquette pathologique dans le corpus
                de recherche.
                {choice === "A"
                  ? " Votre réponse correspond."
                  : choice === "B"
                    ? " Votre réponse ne correspond pas — ces différences sont difficiles à entendre."
                    : " La plupart des auditeurs hésitent — c'est précisément le propos."}
              </p>
            </div>
          ) : null}
        </div>
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
        <Button asChild>
          <Link to="/analyse/measure">
            <BiInline en="Next" fr="Suivant" />
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
