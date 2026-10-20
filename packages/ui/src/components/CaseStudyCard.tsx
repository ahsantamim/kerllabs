import Link from "next/link";
import type { CaseStudy } from "@nodal/content";
import { cn } from "../lib/cn";
import { Icon } from "./Icon";
import { Tag } from "./Tag";
import { UiPlane } from "./UiPlane";

/** Case Study Card — Figma `Case Study Card`. All sample projects are labelled as fictional concepts. */
export function CaseStudyCard({ study, className }: { study: CaseStudy; className?: string }) {
  return (
    <Link href={`/work/${study.slug}`} className={cn("group/case flex flex-col gap-5", className)}>
      <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-line-subtle bg-surface-2 transition-colors group-hover/case:border-line-strong">
        <div className="absolute -right-24 -top-28 size-[520px] rounded-full bg-[radial-gradient(closest-side,var(--nd-art-glow),transparent)]" />
        <UiPlane className="absolute left-[13%] top-[25%] w-[74%] transition-transform duration-[640ms] ease-standard group-hover/case:-translate-x-2 group-hover/case:-translate-y-2" />
        <span className="absolute left-5 top-5 rounded-full border border-line bg-base/80 px-2.5 py-1.5 type-mono-s text-fg-muted">
          Concept project · fictional
        </span>
      </div>
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-2">
          <span className="type-h3">{study.title}</span>
          <span className="type-body-m text-fg-muted">{study.summary}</span>
        </div>
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-surface-2 transition-colors group-hover/case:bg-accent group-hover/case:text-on-accent">
          <Icon name="arrow-up-right" />
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {study.disciplines.slice(0, 3).map((d) => (
          <Tag key={d}>{d}</Tag>
        ))}
        <Tag tone="filled">{study.duration.split(" +")[0]}</Tag>
      </div>
    </Link>
  );
}
