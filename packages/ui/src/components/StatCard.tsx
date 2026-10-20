import { cn } from "../lib/cn";

/** Stat Card — Figma `Stat Card`. `live` = value is computed from published content (AUTO badge). */
export function StatCard({ label, value, meta, live, className }: { label: string; value: string | number; meta?: string; live?: boolean; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2.5 rounded-lg border border-line-subtle bg-surface-1 p-6", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="type-body-s text-fg-muted">{label}</span>
        {live && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-subtle px-2 py-0.5 type-mono-s text-success">
            <span className="size-1.5 rounded-full bg-success" />
            Auto
          </span>
        )}
      </div>
      <span className="type-h1">{value}</span>
      {meta && <span className="type-mono-s text-fg-subtle">{meta}</span>}
    </div>
  );
}
