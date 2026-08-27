import { ArrowRight } from "@/components/icons";

export function Pipeline({ steps, activeIndex }: { steps: string[]; activeIndex?: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span
            className={
              i === activeIndex
                ? "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                : "rounded-md border border-border bg-card px-3 py-2 text-sm text-ink-soft"
            }
          >
            {s}
          </span>
          {i < steps.length - 1 ? <ArrowRight className="size-4 text-muted-foreground" /> : null}
        </li>
      ))}
    </ol>
  );
}
