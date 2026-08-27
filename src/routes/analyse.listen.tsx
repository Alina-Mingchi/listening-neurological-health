import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageShell, Notice } from "@/components/PageShell";
import { SignalPanel } from "@/components/SignalPanel";
import { ArrowRight } from "@/components/icons";

export const Route = createFileRoute("/analyse/listen")({
  head: () => ({
    meta: [
      { title: "Listen — Can You Hear Subtle Differences?" },
      {
        name: "description",
        content:
          "Compare two pre-recorded research speakers and judge which sounds more typical of healthy speech before the model answers.",
      },
      { property: "og:title", content: "Listen — Can you hear subtle differences?" },
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
  { label: "Intro", active: false },
  { label: "Listen", active: true },
  { label: "Analyse", active: false },
  { label: "Predict", active: false },
  { label: "Why", active: false },
];

function ListenPage() {
  const [choice, setChoice] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <PageShell eyebrow="Step 1 of 4" title="Listen" intro="Can you hear subtle differences?" steps={STEPS}>
      <div className="grid gap-6 md:grid-cols-2">
        <SignalPanel seed="speakerA" variant="clean" label="Speaker A" caption="Pre-recorded research speech" compact />
        <SignalPanel seed="speakerB" variant="enhanced" label="Speaker B" caption="Pre-recorded research speech" compact />
      </div>

      <div className="paper mt-8 p-6">
        <h2 className="text-xl font-semibold">Which sounds more typical of healthy speech?</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {["A", "B", "Not sure"].map((o) => (
            <Button
              key={o}
              variant={choice === o ? "default" : "outline"}
              onClick={() => setChoice(o)}
            >
              {o}
            </Button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <Button variant="secondary" disabled={!choice} onClick={() => setRevealed(true)}>
            Reveal
          </Button>
          {revealed ? (
            <span className="text-sm text-muted-foreground">
              Speaker A is the healthy control; Speaker B carries a pathological label in the research corpus.
              {choice === "A" ? " Your answer matched." : choice === "B" ? " Your answer did not match — these differences are hard to hear." : " Most listeners are unsure — that is exactly the point."}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-8">
        <Notice tone="warn">Uses pre-recorded research speech only.</Notice>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <Button asChild>
          <Link to="/analyse/measure">
            Next
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
