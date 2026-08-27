import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "@/components/icons";
import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  intro?: string;
  children: ReactNode;
  steps?: { label: string; active: boolean }[];
}

export function PageShell({ eyebrow, title, subtitle, intro, children, steps }: Props) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
          {steps ? (
            <ol className="hidden items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] sm:flex">
              {steps.map((s) => (
                <li
                  key={s.label}
                  className={
                    s.active
                      ? "rounded-full bg-primary px-2.5 py-1 text-primary-foreground"
                      : "rounded-full px-2.5 py-1 text-muted-foreground"
                  }
                >
                  {s.label}
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {eyebrow ? <p className="rule-heading mb-3">{eyebrow}</p> : null}
        <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-2 font-display text-xl text-ink-soft">{subtitle}</p> : null}
        {intro ? <p className="mt-4 max-w-2xl text-base text-muted-foreground">{intro}</p> : null}
        <div className="mt-8">{children}</div>
      </main>
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
