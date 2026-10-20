import { notFound } from "next/navigation";
import { Button, Headline, Icon, Kicker, Portrait, SpecialistCard, Tag, cn } from "@nodal/ui";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { Overlap } from "@/components/team/Overlap";
import { content } from "@/lib/content";

/**
 * Specialist portfolio — /team/{slug}. Every block renders from the specialist record and is
 * hidden when empty. Edited by the specialist in the CMS portal; published after admin review.
 */
export async function generateStaticParams() {
  return (await content().getSpecialists()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = await content().getSpecialist((await params).slug);
  return { title: s ? `${s.name} — ${s.role.split(" · ")[0]}` : "Specialist" };
}

const WEEKS = ["4 Jan", "11", "18", "25", "1 Feb", "8", "15", "22", "1 Mar", "8"];

export default async function SpecialistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const repo = content();
  const s = await repo.getSpecialist(slug);
  if (!s) notFound();
  const [services, similar] = await Promise.all([repo.getServices(), repo.getSpecialists()]);
  const discipline = services.find((x) => x.slug === s.discipline);
  const first = s.name.split(" ")[0];
  const tabs = [
    ["Overview", "overview", true],
    ["Services", "services", s.services.length],
    ["Work", "work", s.portfolio.length],
    ["Experience", "experience", s.experience.length],
    ["Writing", "writing", s.writing.length],
    ["Availability", "availability", true],
  ].filter(([, , show]) => show) as [string, string, number | boolean][];
  const max = Math.max(40, ...s.capacity);

  return (
    <article>
      <div className="border-b border-line-subtle pt-16 tablet:pt-20">
        <div className="container-nd flex flex-wrap items-center justify-between gap-4 py-5">
          <Breadcrumbs items={[["Team", "/team"], [discipline?.name ?? "Specialists", `/team?discipline=${s.discipline}`], [s.name]]} />
          <span className="type-mono-s text-fg-subtle">Profile maintained by {first} · updated {s.updatedAt}</span>
        </div>
      </div>

      {/* Hero */}
      <header className="container-nd grid gap-12 py-14 desktop:grid-cols-[480px_1fr] desktop:gap-[72px] desktop:pb-20">
        <div className="relative self-start">
          <Portrait initials={s.initials} size="hero" className="aspect-[4/5] w-full rounded-xl" alt={`${s.name} portrait`} />
          <span className={cn("absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-line bg-base px-3.5 py-2 type-label-s")}>
            <span className={cn("size-2 rounded-full", s.availability.tone === "now" ? "bg-success" : "bg-warning")} />
            {s.availability.label} · {s.availability.hoursPerWeek} hrs/wk
          </span>
        </div>
        <div className="flex flex-col gap-7">
          <span className="type-mono-s text-accent">{s.role}</span>
          <Headline as="h1" text={s.name} emphasis={s.name.split(" ").slice(-1)[0]} className="type-display-xl" />
          <p className="type-quote">“{s.headline}”</p>
          <dl className="grid overflow-hidden rounded-lg border border-line-subtle tablet:grid-cols-3">
            {[["Based in", s.location], ["Time zone", s.timezone], ["Experience", s.yearsExperience], ["Engagement", s.engagement], ["Languages", s.languages.join(", ")], ["Response time", s.responseTime]].map(([k, v], i) => (
              <div key={k} className={cn("flex flex-col gap-1 bg-surface-1 px-5 py-4", i % 3 && "tablet:border-l", i > 2 && "tablet:border-t", "border-line-subtle", i && "max-tablet:border-t")}>
                <dt className="type-mono-s text-fg-subtle">{k}</dt>
                <dd className="type-label-m">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-3">
            <Button href={`/hire/specialist?who=${s.slug}&step=3`} size="L">Book a call with {first}</Button>
            <Button href={`/hire/specialist?who=${s.slug}`} size="L" variant="secondary">Request {first} for a project</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-md border border-line-subtle bg-surface-1 px-4 py-3">
            <Icon name="calendar" size={18} className="text-accent" />
            <p className="flex-1 type-body-s text-fg-muted">Not sure you need {/^[AEIOU]/.test(discipline?.name ?? "") ? "an" : "a"} {discipline?.name ?? "specialist"} specialist? Talk to a product manager first — your first 2 consultations are free.</p>
            <Button href="/consult" variant="link">Book free consult</Button>
          </div>
          <div className="flex flex-wrap gap-2">{s.links.map((l) => <a key={l.label} href={l.href} className="rounded-full border border-line px-3.5 py-2 type-label-s text-fg-muted hover:text-fg">{l.label} ↗</a>)}</div>
        </div>
      </header>

      {/* Sticky section tabs */}
      <nav aria-label="Profile sections" className="sticky top-16 z-30 border-y border-line-subtle bg-base/90 backdrop-blur tablet:top-20">
        <ul className="container-nd flex gap-1 overflow-x-auto">
          {tabs.map(([label, id, n]) => (
            <li key={id}>
              <a href={`#${id}`} className="flex items-center gap-2 whitespace-nowrap px-4 py-4 type-label-m text-fg-muted hover:text-fg">
                {label} {typeof n === "number" && <span className="type-mono-s text-fg-subtle">{n}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="overview" className="container-nd grid scroll-mt-40 gap-12 py-24 desktop:grid-cols-[6fr_5fr] desktop:gap-20">
        <div className="flex flex-col gap-5">
          <Kicker>About</Kicker>
          {s.about.map((p) => <p key={p.slice(0, 20)} className="type-body-l text-fg-muted">{p}</p>)}
          <span className="type-mono-s text-fg-subtle">Sample profile — fictional person, written for design purposes.</span>
        </div>
        {s.bestAt.length > 0 && (
          <div className="flex flex-col gap-3">
            <span className="type-mono-s text-fg-subtle">Best at</span>
            {s.bestAt.map((b, i) => (
              <div key={b.title} className="flex gap-4 rounded-lg border border-line-subtle bg-surface-1 p-5">
                <span className="type-mono-m text-accent">0{i + 1}</span>
                <div className="flex flex-col gap-1.5"><span className="type-h5">{b.title}</span><span className="type-body-s text-fg-muted">{b.text}</span></div>
              </div>
            ))}
          </div>
        )}
      </section>

      {s.services.length > 0 && (
        <section id="services" className="scroll-mt-40 border-y border-line-subtle bg-raised py-24">
          <div className="container-nd flex flex-col gap-10">
            <div className="flex flex-col gap-4"><Kicker>Services {first} offers</Kicker><h2 className="type-h1">Book a defined piece of work.</h2></div>
            <div className="grid gap-5 desktop:grid-cols-3">
              {s.services.map((x) => (
                <div key={x.id} className={cn("flex flex-col gap-4 rounded-xl border bg-surface-1 p-8", x.featured ? "border-accent" : "border-line-subtle")}>
                  <div className="flex items-center justify-between gap-3"><span className="type-mono-s text-fg-subtle">{x.format}</span>{x.featured && <Tag tone="accent" dot={false}>Most requested</Tag>}</div>
                  <h3 className="type-h3">{x.title}</h3>
                  <p className="type-body-m text-fg-muted">{x.description}</p>
                  <ul className="flex flex-col gap-2.5 border-t border-line-subtle pt-4">
                    <li className="type-mono-s text-fg-subtle">You get</li>
                    {x.deliverables.map((d) => <li key={d} className="flex items-center gap-2.5 type-body-s"><Icon name="check" size={14} className="text-accent" />{d}</li>)}
                  </ul>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                    <span className="type-mono-s text-fg-subtle">Pricing on the intro call</span>
                    <Button href={`/hire/specialist?who=${s.slug}&service=${x.id}`} variant={x.featured ? "primary" : "secondary"}>{x.cta === "book" ? "Book this" : x.cta === "discuss" ? "Discuss" : `Request ${first}`}</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {s.portfolio.length > 0 && (
        <section id="work" className="container-nd flex scroll-mt-40 flex-col gap-10 py-24">
          <div className="flex flex-col gap-4"><Kicker>Work</Kicker><h2 className="type-h1">Things {first} has built.</h2></div>
          <div className="grid gap-5 tablet:grid-cols-2">
            {s.portfolio.map((p) => (
              <div key={p.id} className="flex flex-col gap-3 rounded-xl border border-line-subtle bg-surface-1 p-7">
                <span className="type-mono-s text-fg-subtle">{p.kind === "case" ? "Concept project · fictional" : p.kind === "nda" ? "Under NDA" : p.kind === "open_source" ? "Open source · sample" : "Talk"}</span>
                <h3 className="type-h3">{p.title}</h3>
                <p className="type-body-m text-fg-muted">{p.summary}</p>
                {p.role && <span className="type-mono-s text-accent">Role · {p.role}</span>}
                {p.contribution && <p className="type-body-s text-fg-muted">{p.contribution}</p>}
                <div className="flex flex-wrap gap-1.5">{p.stack.map((t) => <Tag key={t}>{t}</Tag>)}</div>
                {p.caseSlug && <Button href={`/work/${p.caseSlug}`} variant="link" className="mt-2 w-fit">View case study</Button>}
              </div>
            ))}
          </div>
        </section>
      )}

      {(s.experience.length > 0 || Object.keys(s.stack).length > 0) && (
        <section id="experience" className="scroll-mt-40 border-y border-line-subtle bg-raised py-24">
          <div className="container-nd grid gap-16 desktop:grid-cols-2">
            {s.experience.length > 0 && (
              <div className="flex flex-col gap-6">
                <Kicker>Experience</Kicker>
                <ol>
                  {s.experience.map((e, i) => (
                    <li key={e.period} className="grid grid-cols-[120px_1fr] gap-6 border-b border-line-subtle py-5">
                      <span className={cn("type-mono-s", i === 0 ? "text-accent" : "text-fg-subtle")}>{e.period}</span>
                      <span className="flex flex-col gap-1"><span className="type-label-l">{e.title} · {e.org}</span><span className="type-body-s text-fg-muted">{e.summary}</span></span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {Object.keys(s.stack).length > 0 && (
              <div className="flex flex-col gap-6">
                <Kicker>Stack</Kicker>
                {Object.entries(s.stack).map(([cat, items]) => (
                  <div key={cat} className="flex flex-col gap-2.5">
                    <span className="type-mono-s text-fg-subtle">{cat}</span>
                    <div className="flex flex-wrap gap-2">{items.map((t) => <Tag key={t}>{t}</Tag>)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {(s.writing.length > 0 || s.credentials.length > 0) && (
        <section id="writing" className="container-nd grid scroll-mt-40 gap-16 py-24 desktop:grid-cols-[7fr_5fr]">
          <div className="flex flex-col gap-5">
            <Kicker>Writing & talks</Kicker>
            <ul>{s.writing.map((w) => (
              <li key={w.title} className="grid grid-cols-[100px_1fr_auto] items-center gap-6 border-b border-line-subtle py-4">
                <span className="type-mono-s text-fg-subtle">{w.date}</span><span className="type-h5">{w.title}</span><span className="type-body-s text-fg-muted">{w.kind}</span>
              </li>
            ))}</ul>
          </div>
          <div className="flex flex-col gap-4">
            <Kicker>Credentials</Kicker>
            {s.credentials.map((c) => (
              <div key={c.title} className="flex flex-col gap-1.5 rounded-lg border border-line-subtle p-5"><span className="type-mono-s text-fg-subtle">{c.kind}</span><span className="type-label-m">{c.title}</span></div>
            ))}
          </div>
        </section>
      )}

      <section id="availability" className="scroll-mt-40 border-y border-line-subtle bg-raised py-24">
        <div className="container-nd flex flex-col gap-10">
          <div className="flex flex-col gap-4"><Kicker>Availability</Kicker><h2 className="type-h1">When {first} can start.</h2></div>
          <div className="grid gap-6 desktop:grid-cols-[7fr_5fr]">
            <div className="flex flex-col gap-5 rounded-xl border border-line-subtle bg-surface-1 p-7">
              <span className="type-label-m">Free hours per week · next 10 weeks</span>
              <div className="flex h-[150px] items-end gap-2.5" role="img" aria-label={`Capacity: ${s.capacity.join(", ")} hours per week`}>
                {s.capacity.map((h, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <span className={cn("w-full rounded-sm", h ? "bg-accent" : "bg-surface-3")} style={{ height: `${Math.max(4, (h / max) * 120)}px` }} />
                    <span className={cn("type-mono-s", h ? "text-fg" : "text-fg-subtle")}>{WEEKS[i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-line-subtle bg-surface-1 p-7"><Overlap name={first!} utcOffset={s.utcOffset} timezone={s.timezone} /></div>
          </div>
        </div>
      </section>

      <section className="container-nd flex flex-col gap-10 py-24">
        <div className="flex flex-wrap items-end justify-between gap-6"><div className="flex flex-col gap-4"><Kicker>Also consider</Kicker><h2 className="type-h2">Similar specialists</h2></div><Button href="/team" variant="secondary">View all specialists</Button></div>
        <div className="grid gap-6 tablet:grid-cols-3">
          {similar.filter((x) => x.slug !== s.slug).slice(0, 3).map((x) => <SpecialistCard key={x.slug} specialist={x} />)}
        </div>
      </section>

      <section className="border-t border-line-subtle bg-surface-1">
        <div className="container-nd flex flex-col justify-between gap-10 py-20 desktop:flex-row desktop:items-center">
          <div className="flex max-w-[760px] flex-col gap-4">
            <span className="type-mono-s text-accent">Free · 2 consultations per company</span>
            <Headline as="h2" text={`Not sure ${first} is the right fit? Talk it through with a PM.`} emphasis="Talk it through" accent className="type-h1" />
            <p className="type-body-l text-fg-muted">A product manager or product engineer helps you decide between one specialist and a full team — and shortlists people for you.</p>
          </div>
          <div className="flex flex-col gap-3"><Button href="/consult" size="L">Book a free consultation</Button><Button href={`/hire/specialist?who=${s.slug}`} variant="ghost" size="L" icon={false}>Request {first} directly</Button></div>
        </div>
      </section>
    </article>
  );
}
