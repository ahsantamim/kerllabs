import { Button, Headline, Icon, Reveal, SectionHeader, Tag } from "@nodal/ui";

/** S2 · Two ways to hire (static). */
export function TwoWays() {
  return (
    <section className="container-nd flex flex-col gap-16 py-28 desktop:py-40" aria-label="Two ways to hire">
      <Reveal>
        <SectionHeader
          kicker="01 — Two ways to hire"
          title="Hire the whole team. Or exactly one engineer."
          description="Same people, same standards, two engagement models. Choose based on how much of the product you want us to own."
        />
      </Reveal>
      <div className="grid gap-6 desktop:grid-cols-12">
        <Reveal className="desktop:col-span-7">
          <article className="flex h-full flex-col gap-8 rounded-xl border border-line-subtle bg-surface-1 p-8 tablet:p-12">
            <div className="flex items-center justify-between">
              <span className="type-mono-s text-accent">Model A · End-to-end</span>
              <Tag tone="filled" dot={false}>Typically 10–24 weeks</Tag>
            </div>
            <Headline as="h3" text="The full team" emphasis="full" className="type-h1" />
            <p className="type-body-l text-fg-muted">
              A dedicated pod — staff engineer lead, product designer and the engineers your product needs — owns delivery from
              architecture to launch, then hands over a system your team can run.
            </p>
            <ul className="grid gap-3.5 tablet:grid-cols-2">
              {["Discovery & architecture", "Product & UI design", "Frontend + backend build", "Cloud, CI/CD & observability", "QA automation from week one", "Launch, handover & runbooks"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 type-body-m">
                  <Icon name="check" size={16} className="text-accent" /> {t}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-5 border-t border-line-subtle pt-6 tablet:flex-row tablet:items-center">
              <div className="flex -space-x-2.5">
                {["LD", "UX", "FE", "BE", "DO", "QA"].map((c, i) => (
                  <span key={c} className={`grid size-11 place-items-center rounded-full border-2 border-surface-1 type-mono-s ${i === 0 ? "bg-accent text-on-accent" : "bg-surface-3"}`}>{c}</span>
                ))}
              </div>
              <p className="type-body-s text-fg-muted">A pod of 4–7, led by a staff engineer you talk to directly — no account managers in between.</p>
            </div>
            <div className="mt-auto flex flex-wrap items-center gap-6">
              <Button href="/hire/team" size="L">Hire the full team</Button>
              <Button href="/services" variant="link">How engagements work</Button>
            </div>
          </article>
        </Reveal>
        <Reveal className="desktop:col-span-5" delay={80}>
          <article className="flex h-full flex-col gap-8 rounded-xl border border-line bg-raised p-8 tablet:p-12">
            <div className="flex items-center justify-between">
              <span className="type-mono-s text-accent">Model B · Embedded</span>
              <Tag tone="filled" dot={false}>From 20 hrs / week</Tag>
            </div>
            <Headline as="h3" text="One specialist" emphasis="One" className="type-h1" />
            <p className="type-body-l text-fg-muted">Bring one senior engineer into your team for a specific problem — a slow database, an LLM feature, a flaky pipeline.</p>
            <ul className="flex flex-col gap-2.5">
              {["Joins your Slack, repo and rituals", "Starts in 1–2 weeks", "Rolling monthly — pause anytime"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 type-body-m">
                  <Icon name="check" size={16} className="text-accent" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <Button href="/team" size="L" variant="secondary">Browse specialists</Button>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
