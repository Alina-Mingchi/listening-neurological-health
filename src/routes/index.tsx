import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "@/components/icons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Listening to Neurological Health | Speech Analysis Demo" },
      {
        name: "description",
        content:
          "An interactive research demo: speech enhancement with signal processing and machine-learning analysis of speech for neurological health markers.",
      },
      { property: "og:title", content: "Listening to Neurological Health" },
      {
        property: "og:description",
        content:
          "Explore speech noise reduction and machine-learning analysis of speech in an interactive academic demo.",
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
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight font-semibold text-primary-foreground sm:text-6xl">
            Listening to Neurological Health
          </h1>
          <p className="mt-4 max-w-2xl font-display text-xl text-primary-foreground/85">
            Speech Analysis with Signal Processing and Machine Learning
          </p>
          <p className="mt-8 max-w-xl border-l-2 border-gold pl-4 text-base text-primary-foreground/80">
            Speech is a rich signal. What can we learn from it?
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <p className="rule-heading">Choose a demonstration</p>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <DemoCard
            to="/process"
            index="01"
            title="Process Speech"
            kicker="Noise Reduction"
            body="Hear how a speech enhancement front-end recovers a voice recorded in a bus, a cafeteria, a street or a pedestrian area."
          />
          <DemoCard
            to="/analyse"
            index="02"
            title="Analyse Speech"
            kicker="Neurological Health"
            body="Follow the pipeline from acoustic features to a machine-learning prediction, and see which measurements drove the outcome."
          />
        </div>

        <p className="mt-12 max-w-2xl text-sm text-muted-foreground">
          This is a research demonstrator. Nothing shown here is a medical device or a diagnosis.
        </p>
      </main>
    </div>
  );
}

function DemoCard({
  to,
  index,
  title,
  kicker,
  body,
}: {
  to: string;
  index: string;
  title: string;
  kicker: string;
  body: string;
}) {
  return (
    <Link
      to={to}
      className="paper group flex flex-col p-6 transition-transform hover:-translate-y-0.5"
    >
      <span className="font-mono text-xs text-gold">{index}</span>
      <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
      <p className="rule-heading mt-1">{kicker}</p>
      <p className="mt-4 flex-1 text-sm text-muted-foreground">{body}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
        Open
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
