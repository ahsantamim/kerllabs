import { notFound } from "next/navigation";
import { Button, Kicker, UiPlane } from "@nodal/ui";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { content } from "@/lib/content";

export async function generateStaticParams() {
  return (await content().getCaseStudies()).map((s) => ({ slug: s.slug }));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = await content().getCaseStudies();
  const s = all.find((x) => x.slug === slug);
  if (!s) notFound();
  const next = all[(all.indexOf(s) + 1) % all.length]!;
  const Block = ({ k, title, children }: { k: string; title?: string; children: React.ReactNode }) => (
    <section className="container-nd grid gap-8 border-b border-line-subtle py-24 desktop:grid-cols-[360px_1fr] desktop:gap-20">
      <Kicker>{k}</Kicker>
      <div className="flex flex-col gap-6">{title && <h2 className="type-h2">{title}</h2>}{children}</div>
    </section>
  );
  return (
    <article>
      <header className="relative overflow-hidden pb-16 pt-32">
        <div className="absolute -right-40 top-20 size-[900px] rounded-full bg-[radial-gradient(closest-side,var(--nd-art-glow),transparent)]" aria-hidden="true" />
        <div className="container-nd relative flex flex-col gap-6">
          <Breadcrumbs items={[["Home", "/"], ["Work", "/work"], [s.title]]} />
          <span className="w-fit rounded-full border border-line bg-base px-3 py-1.5 type-mono-s text-fg-muted">Concept project · fictional client</span>
          <h1 className="text-[clamp(72px,14vw,200px)] font-medium leading-[0.9] tracking-[-0.06em]">{s.title}</h1>
          <p className="max-w-[560px] type-h3 text-fg-muted">{s.summary}</p>
        </div>
        <div className="pointer-events-none relative mt-10 h-[260px] desktop:absolute desktop:right-0 desktop:top-[260px] desktop:mt-0 desktop:h-[520px] desktop:w-[52vw]" aria-hidden="true">
          <UiPlane className="absolute left-[30%] top-0 w-[60%] opacity-40" />
          <UiPlane className="absolute left-[8%] top-[18%] w-[80%]" />
        </div>
      </header>
      <dl className="grid border-y border-line-subtle tablet:grid-cols-4">
        {[["Industry", s.industry], ["Engagement", s.engagement], ["Duration", s.duration], ["Disciplines", s.disciplines.join(" · ")]].map(([k, v], i) => (
          <div key={k} className={`flex flex-col gap-2 px-8 py-7 ${i ? "tablet:border-l border-line-subtle" : ""}`}>
            <dt className="type-mono-s text-fg-subtle">{k}</dt><dd className="type-label-l">{v}</dd>
          </div>
        ))}
      </dl>
      <Block k="Context" title="The problem"><p className="type-body-l text-fg-muted">{s.context}</p></Block>
      {s.constraints.length > 0 && (
        <Block k="Constraints">
          <div className="grid gap-4 tablet:grid-cols-2">{s.constraints.map((c) => <div key={c.title} className="flex flex-col gap-2 rounded-lg border border-line-subtle bg-surface-1 p-7"><h3 className="type-h5">{c.title}</h3><p className="type-body-s text-fg-muted">{c.text}</p></div>)}</div>
        </Block>
      )}
      <Block k="Approach" title="Boring, observable, auditable."><p className="type-body-l text-fg-muted">{s.approach}</p></Block>
      {s.metrics.length > 0 && (
        <Block k="Measuring success">
          <p className="type-body-m text-fg-muted">In a real engagement these targets are agreed with the client in Discovery and reported weekly. This is a concept, so there are no results to report.</p>
          <div className="grid gap-4 tablet:grid-cols-3">{s.metrics.map((m) => <div key={m.name} className="flex flex-col gap-3 rounded-lg border border-line p-7"><span className="type-mono-s text-fg-subtle">Metric · target TBD</span><h3 className="type-h4">{m.name}</h3><p className="type-body-s text-fg-muted">{m.definition}</p></div>)}</div>
        </Block>
      )}
      <section className="bg-raised">
        <div className="container-nd flex flex-col justify-between gap-8 py-24 desktop:flex-row desktop:items-center">
          <div className="flex flex-col gap-3"><span className="type-mono-s text-fg-subtle">Next concept</span><span className="type-display-l">{next.title}</span></div>
          <div className="flex flex-wrap gap-3"><Button href={`/work/${next.slug}`} size="L" variant="secondary">Next case study</Button><Button href="/hire/team" size="L">Start a similar project</Button></div>
        </div>
      </section>
    </article>
  );
}
