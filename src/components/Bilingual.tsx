import { cn } from "@/lib/utils";

/** English text with the French translation stacked underneath. */
export function Bi({
  en,
  fr,
  className,
  frClassName,
}: {
  en: React.ReactNode;
  fr: React.ReactNode;
  className?: string;
  frClassName?: string;
}) {
  return (
    <span className={cn("block", className)}>
      <span className="block">{en}</span>
      <span lang="fr" className={cn("block font-normal italic text-muted-foreground", frClassName)}>
        {fr}
      </span>
    </span>
  );
}

/** English and French on a single line, separated by a divider. Best for buttons and chips. */
export function BiInline({
  en,
  fr,
  className,
}: {
  en: React.ReactNode;
  fr: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-1.5", className)}>
      <span>{en}</span>
      <span aria-hidden className="opacity-40">
        ·
      </span>
      <span lang="fr" className="italic opacity-80">
        {fr}
      </span>
    </span>
  );
}
