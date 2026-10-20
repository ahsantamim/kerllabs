import type { SiteStats, Specialist } from "@nodal/content";
import { Button, Reveal, SectionHeader, SpecialistCard } from "@nodal/ui";

/** S7 · Team preview — 4 featured specialists (admin-curated), count = published profiles. */
export function TeamPreview({ specialists, stats }: { specialists: Specialist[]; stats: SiteStats }) {
  return (
    <section className="overflow-hidden py-28 desktop:py-40">
      <div className="container-nd flex flex-col gap-12">
        <div className="flex flex-col justify-between gap-8 desktop:flex-row desktop:items-end">
          <Reveal><SectionHeader kicker="08 — The team" title={`${stats.engineers} engineers. Browse them like a directory, not a sales deck.`} /></Reveal>
          <Button href="/team" size="L" variant="secondary">Browse all specialists</Button>
        </div>
        {/* Mobile: horizontal scroller that bleeds right. Desktop: 4-col grid. */}
        <div className="-mr-5 flex snap-x gap-4 overflow-x-auto pb-4 tablet:-mr-10 desktop:mr-0 desktop:grid desktop:grid-cols-4 desktop:gap-6 desktop:overflow-visible">
          {specialists.slice(0, 4).map((s) => (
            <SpecialistCard key={s.slug} specialist={s} className="w-[280px] shrink-0 snap-start desktop:w-auto" />
          ))}
        </div>
        <span className="type-mono-s text-fg-subtle">Sample profiles — fictional people for design purposes.</span>
      </div>
    </section>
  );
}
