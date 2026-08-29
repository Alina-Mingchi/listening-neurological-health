import { ArrowRight } from "@/components/icons";

export interface PipelineStep {
  en: string;
  fr: string;
}

export function Pipeline({ steps, activeIndex }: { steps: PipelineStep[]; activeIndex?: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {steps.map((s, i) => (
        <li key={s.en} className="flex items-center gap-2">
          <span
            className={
              i === activeIndex
                ? "block rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                : "block rounded-md border border-border bg-card px-3 py-2 text-sm text-ink-soft"
            }
          >
            <span className="block">{s.en}</span>
            <span
              lang="fr"
              className={
                i === activeIndex
                  ? "block text-xs italic text-primary-foreground/80"
                  : "block text-xs italic text-muted-foreground"
              }
            >
              {s.fr}
            </span>
          </span>
          {i < steps.length - 1 ? <ArrowRight className="size-4 text-muted-foreground" /> : null}
        </li>
      ))}
    </ol>
  );
}
