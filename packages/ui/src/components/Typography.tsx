import type { ElementType, ReactNode } from "react";
import { cn } from "../lib/cn";

/** “01 — Section” kicker: 24px accent rule + mono label. */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3 type-mono-s text-accent", className)}>
      <span className="h-px w-6 bg-accent" aria-hidden="true" />
      {children}
    </span>
  );
}

/**
 * Headline with one expressive Instrument Serif italic phrase (the brand's signature move).
 * `emphasis` must be a substring of `text`.
 */
export function Headline({
  text, emphasis, accent = false, as: Tag = "h2", className,
}: { text: string; emphasis?: string; accent?: boolean; as?: ElementType; className?: string }) {
  if (!emphasis || !text.includes(emphasis)) return <Tag className={className}>{text}</Tag>;
  const [before, after] = text.split(emphasis) as [string, string];
  return (
    <Tag className={className}>
      {before}
      <em className={cn("type-serif", accent && "text-accent")}>{emphasis}</em>
      {after}
    </Tag>
  );
}

/** Section Header — Figma `Section Header`. */
export function SectionHeader({
  kicker, title, emphasis, description, className, align = "left",
}: { kicker: string; title: string; emphasis?: string; description?: string; className?: string; align?: "left" | "center" }) {
  return (
    <div className={cn("flex max-w-[760px] flex-col gap-5", align === "center" && "mx-auto items-center text-center", className)}>
      <Kicker>{kicker}</Kicker>
      <Headline text={title} emphasis={emphasis} className="type-h1 text-balance" />
      {description && <p className="max-w-[620px] type-body-l text-fg-muted">{description}</p>}
    </div>
  );
}
