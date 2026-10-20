import { cn } from "../lib/cn";

export type NodeState = "default" | "hover" | "selected" | "dimmed";

/** Capability Node — Figma `Capability Node`. */
export function CapabilityNode({
  code, label, state = "default", onSelect, onHover, className, style,
}: {
  code: string;
  label: string;
  state?: NodeState;
  onSelect?: () => void;
  onHover?: (on: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      onFocus={() => onHover?.(true)}
      onBlur={() => onHover?.(false)}
      aria-pressed={state === "selected"}
      style={style}
      className={cn(
        "inline-flex items-center gap-3 whitespace-nowrap rounded-full border py-2 pl-2 pr-[18px] transition-all duration-[180ms] ease-standard focus-visible:shadow-focus",
        state === "selected" && "border-accent bg-accent text-on-accent shadow-glow",
        state === "hover" && "-translate-y-1 border-line-strong bg-surface-3",
        state === "default" && "border-line bg-surface-1 hover:-translate-y-1 hover:border-line-strong hover:bg-surface-3",
        state === "dimmed" && "border-line bg-surface-1 opacity-40",
        className,
      )}
    >
      <span className={cn("grid size-10 place-items-center rounded-full type-mono-m", state === "selected" ? "bg-on-accent text-accent" : "bg-surface-3 text-fg")}>{code}</span>
      <span className="type-label-l">{label}</span>
    </button>
  );
}
