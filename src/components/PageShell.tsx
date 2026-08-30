import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "@/components/icons";
import { BiInline } from "@/components/Bilingual";
import type { ReactNode } from "react";

interface Props {
  eyebrow?: ReactNode;
  title: ReactNode;
  titleFr?: ReactNode;
  subtitle?: ReactNode;
  subtitleFr?: ReactNode;
  intro?: ReactNode;
  introFr?: ReactNode;
  children: ReactNode;
  steps?: { label: string; labelFr: string; active: boolean }[];
}

export function PageShell({
  eyebrow,
  title,
  titleFr,
  subtitle,
  subtitleFr,
  intro,
  introFr,
  children,
  steps,
}: Props) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="size-4" />
            <BiInline en="Back to home" fr="Retour à l'accueil" />
          </Link>
          {steps ? (
            <ol className="hidden items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] sm:flex">
              {steps.map((s) => (
                <li
                  key={s.label}
                  className={
                    s.active
                      ? "rounded-full bg-primary px-2.5 py-1 text-primary-foreground"
                      : "rounded-full px-2.5 py-1 text-muted-foreground"
                  }
                >
                  {s.label} · <span lang="fr" className="italic">{s.labelFr}</span>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {eyebrow ? <p className="rule-heading mb-3">{eyebrow}</p> : null}
        <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
        {titleFr ? (
          <p lang="fr" className="mt-1 font-display text-2xl italic text-ink-soft sm:text-3xl">
            {titleFr}
          </p>
        ) : null}
        {subtitle ? <p className="mt-2 font-display text-xl text-ink-soft">{subtitle}</p> : null}
        {subtitleFr ? (
          <p lang="fr" className="font-display text-xl italic text-muted-foreground">
            {subtitleFr}
          </p>
        ) : null}
        {intro ? <p className="mt-4 max-w-2xl text-base text-muted-foreground">{intro}</p> : null}
        {introFr ? (
          <p lang="fr" className="max-w-2xl text-base italic text-muted-foreground/80">
            {introFr}
          </p>
        ) : null}
        <div className="mt-8">{children}</div>
      </main>

      <footer className="border-t border-border bg-card/80 py-6 text-center text-sm text-muted-foreground">
        <p>© 2026 Signal Processing for Communication (SPC) Group | Idiap Research Institute</p>
      </footer>
    </div>
  );
}

export function Notice({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "warn";
}) {
  return (
    <p
      className={
        tone === "warn"
          ? "rounded-md border-l-4 border-gold bg-gold/10 px-4 py-3 text-sm font-medium text-ink"
          : "rounded-md border-l-4 border-primary bg-accent/40 px-4 py-3 text-sm font-medium text-ink"
      }
    >
      {children}
    </p>
  );
}
