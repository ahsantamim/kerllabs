import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export type TagStyle = "outline" | "filled" | "accent";

/** Tag / filter chip — Figma `Tag` (Style × State). Render as button when interactive. */
export function Tag({
  children,
  tone = "outline",
  selected,
  dot = true,
  onClick,
  className,
}: {
  children: ReactNode;
  tone?: TagStyle;
  selected?: boolean;
  dot?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      aria-pressed={onClick ? !!selected : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-2 type-label-s transition-colors duration-[180ms]",
        tone === "outline" && !selected && "border border-line text-fg-muted hover:border-line-strong hover:text-fg",
        tone === "filled" && !selected && "bg-surface-2 text-fg hover:bg-surface-3",
        tone === "accent" && !selected && "bg-accent-subtle text-accent hover:ring-1 hover:ring-accent",
        selected && (tone === "accent" ? "bg-accent text-on-accent" : "bg-inverse text-fg-inverse"),
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            "size-1.5 rounded-full",
            selected ? (tone === "accent" ? "bg-on-accent" : "bg-accent") : tone === "accent" ? "bg-accent" : "bg-fg-subtle",
          )}
        />
      )}
      {children}
    </Comp>
  );
}
