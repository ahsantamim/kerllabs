import { cn } from "../lib/cn";

/** Kerl Labs lockup: three connected nodes (team · specialist · client) + wordmark. */
export function Logo({ className, markOnly = false }: { className?: string; markOnly?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-fg", className)} aria-label="Kerl Labs">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M6 21L14 7L22 21Z" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="14" cy="7" r="3.5" className="fill-accent" />
        <circle cx="6" cy="21" r="3.5" fill="currentColor" />
        <circle cx="22" cy="21" r="3.5" fill="currentColor" />
      </svg>
      {!markOnly && <span className="text-[22px] font-semibold tracking-[0.08em]">KERL LABS</span>}
    </span>
  );
}
