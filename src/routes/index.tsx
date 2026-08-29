import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "@/components/icons";
import { BiInline } from "@/components/Bilingual";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Listening to Neurological Health | Écouter la santé neurologique" },
      {
        name: "description",
        content:
          "An interactive bilingual research demo: speech enhancement with signal processing and machine-learning analysis of speech for neurological health markers.",
      },
      { property: "og:title", content: "Listening to Neurological Health · Écouter la santé neurologique" },
      {
        property: "og:description",
        content:
          "Explore speech noise reduction and machine-learning analysis of speech in an interactive academic demo, in English and French.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen">
      <section className="scholar-gradient relative overflow-hidden text-primary-foreground">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-primary-foreground/70">
            Speech · Signal Processing · Machine Learning
          </p>
          <p lang="fr" className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-primary-foreground/50">
            Parole · Traitement du signal · Apprentissage automatique
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight font-semibold text-primary-foreground sm:text-6xl">
            Listening to Neurological Health
          </h1>
          <p
            lang="fr"
            className="mt-2 max-w-3xl font-display text-2xl italic leading-tight text-primary-foreground/75 sm:text-4xl"
          >
            Écouter la santé neurologique
          </p>
          <p className="mt-5 max-w-2xl font-display text-xl text-primary-foreground/85">
            Speech Analysis with Signal Processing and Machine Learning
          </p>
          <p lang="fr" className="max-w-2xl font-display text-xl italic text-primary-foreground/60">
            Analyse de la parole par traitement du signal et apprentissage automatique
          </p>
          <div className="mt-8 max-w-xl border-l-2 border-gold pl-4">
            <p className="text-base text-primary-foreground/80">
              Speech is a rich signal. What can we learn from it?
            </p>
            <p lang="fr" className="text-base italic text-primary-foreground/60">
              La parole est un signal riche. Que pouvons-nous en apprendre ?
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <p className="rule-heading">
          Choose a demonstration · <span lang="fr" className="italic">Choisissez une démonstration</span>
        </p>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <DemoCard
            to="/process"
            index="01"
            title="Process Speech"
            titleFr="Traiter la parole"
            kicker="Noise Reduction"
            kickerFr="Réduction du bruit"
            body="Hear how a speech enhancement front-end recovers a voice recorded in a bus, a cafeteria, a street or a pedestrian area."
            bodyFr="Écoutez comment un module de rehaussement de la parole récupère une voix enregistrée dans un bus, une cafétéria, une rue ou une zone piétonne."
          />
          <DemoCard
            to="/analyse"
            index="02"
            title="Analyse Speech"
            titleFr="Analyser la parole"
            kicker="Neurological Health"
            kickerFr="Santé neurologique"
            body="Follow the pipeline from acoustic features to a machine-learning prediction, and see which measurements drove the outcome."
            bodyFr="Suivez le pipeline des paramètres acoustiques jusqu'à une prédiction par apprentissage automatique, et voyez quelles mesures ont déterminé le résultat."
          />
        </div>

        <p className="mt-12 max-w-2xl text-sm text-muted-foreground">
          This is a research demonstrator. Nothing shown here is a medical device or a diagnosis.
        </p>
        <p lang="fr" className="max-w-2xl text-sm italic text-muted-foreground/80">
          Ceci est un démonstrateur de recherche. Rien de ce qui est présenté ici n'est un dispositif médical ni un
          diagnostic.
        </p>
      </main>
    </div>
  );
}

function DemoCard({
  to,
  index,
  title,
  titleFr,
  kicker,
  kickerFr,
  body,
  bodyFr,
}: {
  to: string;
  index: string;
  title: string;
  titleFr: string;
  kicker: string;
  kickerFr: string;
  body: string;
  bodyFr: string;
}) {
  return (
    <Link to={to} className="paper group flex flex-col p-6 transition-transform hover:-translate-y-0.5">
      <span className="font-mono text-xs text-gold">{index}</span>
      <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
      <p lang="fr" className="font-display text-xl italic text-ink-soft">
        {titleFr}
      </p>
      <p className="rule-heading mt-1">
        {kicker} · <span lang="fr" className="italic">{kickerFr}</span>
      </p>
      <p className="mt-4 text-sm text-muted-foreground">{body}</p>
      <p lang="fr" className="mt-2 flex-1 text-sm italic text-muted-foreground/80">
        {bodyFr}
      </p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
        <BiInline en="Open" fr="Ouvrir" />
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
