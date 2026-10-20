import Link from "next/link";
import type { Specialist } from "@nodal/content";
import { cn } from "../lib/cn";
import { Icon } from "./Icon";
import { Portrait } from "./Portrait";
import { Tag } from "./Tag";

/** Specialist Card — Figma `Specialist Card`. Whole card links to /team/{slug}. */
export function SpecialistCard({ specialist: s, className, note }: { specialist: Specialist; className?: string; note?: string }) {
  return (
    <Link
      href={`/team/${s.slug}`}
      className={cn(
        "group/card flex flex-col overflow-hidden rounded-lg border border-line-subtle bg-surface-1 transition-[background-color,border-color,box-shadow,transform] duration-[320ms] ease-standard",
        "hover:-translate-y-1 hover:border-line-strong hover:bg-surface-2 hover:shadow-elev-2 focus-visible:shadow-focus",
        className,
      )}
    >
      <div className="overflow-hidden">
        <Portrait initials={s.initials} className="h-[260px] w-full transition-transform duration-[640ms] ease-standard group-hover/card:scale-[1.04]" />
      </div>
      <div className="flex flex-1 flex-col gap-3.5 p-5">
        <span className={cn("inline-flex items-center gap-1.5 type-mono-s", s.availability.tone === "now" ? "text-success" : "text-warning")}>
          <span className={cn("size-1.5 rounded-full", s.availability.tone === "now" ? "bg-success" : "bg-warning")} />
          {s.availability.label}
        </span>
        <div className="flex flex-col gap-1">
          <span className="type-h5">{s.name}</span>
          <span className="type-body-s text-fg-muted">{note ?? s.role}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {s.stackTags.slice(0, 3).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-line-subtle pt-3.5">
          <span className="inline-flex items-center gap-1.5 type-mono-s text-fg-subtle">
            <Icon name="globe" size={14} />
            {s.timezone} · {s.city}
          </span>
          <span className="inline-flex items-center gap-1.5 type-label-s group-hover/card:text-accent">
            Profile <Icon name="arrow-up-right" size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
