import type { Service, SiteStats } from "@nodal/content";
import { Button, Headline, Icon } from "@nodal/ui";
import { HUBS, ACCENT_HUB, HeroUniverseLayers, hubPosition } from "../art/HeroUniverse";
import { Parallax } from "../art/Parallax";

/** S1 · Hero — Interactive Engineering Universe (motion spec M-01). Copy and CTAs stay in the DOM layer. */
export function Hero({ stats, services }: { stats: SiteStats; services: Service[] }) {
  const layers = HeroUniverseLayers();
  const labelled = HUBS.map((i, k) => ({ i, k, ...hubPosition(i) }))
    .filter((h) => h.z > 20)
    .sort((a, b) => b.z - a.z)
    .slice(0, 4);
  return (
    <section className="relative overflow-hidden pt-24 tablet:pt-28" aria-labelledby="hero-title">
      <div className="container-nd relative grid min-h-[min(960px,100dvh)] items-center desktop:grid-cols-12">
        {/* Canvas layers (decorative) */}
        <div className="pointer-events-none relative order-first mx-auto aspect-square w-full max-w-[560px] desktop:pointer-events-auto desktop:absolute desktop:right-[-40px] desktop:top-6 desktop:w-[900px] desktop:max-w-none" aria-hidden="true">
          <Parallax depth={0.4} className="absolute inset-0">{layers.back}</Parallax>
          <Parallax depth={0.7} className="absolute inset-0">{layers.mid}</Parallax>
          <Parallax depth={1} className="absolute inset-0">
            {layers.front}
            {labelled.map((h) => {
              const others = services.filter((x) => x.slug !== "ai-engineering");
              const s = others[h.k % others.length];
              const isA = h.i === ACCENT_HUB;
              return (
                <span
                  key={h.i}
                  className={`absolute hidden items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 type-label-s tablet:inline-flex ${isA ? "border-accent bg-accent text-on-accent" : "border-line bg-surface-1 text-fg"}`}
                  style={{ left: `calc(${h.x * 100}% + 14px)`, top: `calc(${h.y * 100}% - 36px)` }}
                >
                  <span className={`grid size-6 place-items-center rounded-full type-mono-s ${isA ? "bg-on-accent text-accent" : "bg-surface-3"}`}>{isA ? "AI" : s?.code}</span>
                  {isA ? "AI Engineering" : s?.name}
                </span>
              );
            })}
          </Parallax>
        </div>

        <div className="relative z-10 flex flex-col gap-8 pb-16 desktop:col-span-7 desktop:pb-0">
          <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-line bg-surface-1 py-2 pl-2.5 pr-3.5 type-label-s text-fg-muted">
            <span className="size-2 rounded-full bg-success shadow-[0_0_12px_var(--nd-success)]" />
            Booking engagements from January 2027
          </span>
          <Headline
            as="h1"
            text="Ship the whole product — or just the hard part."
            emphasis="just the hard part"
            accent
            className="type-display-xl max-w-[760px]"
          />
          <p id="hero-title" className="max-w-[540px] type-body-l text-fg-muted">
            NODAL is a senior engineering team spread across six time zones. Hire all of us to take a product from architecture
            to launch — or bring in one specialist for the problem in front of you.
          </p>
          <div className="flex flex-col gap-3 tablet:flex-row">
            <Button href="/hire/team" size="L">Hire the full team</Button>
            <Button href="/team" size="L" variant="secondary">Find a specialist</Button>
          </div>
          <p className="flex flex-wrap items-center gap-2.5 type-body-m text-fg-muted">
            <Icon name="calendar" size={16} className="text-accent" /> Not sure which you need?
            <Button href="/consult" variant="link">Book a free call with a PM</Button>
          </p>
        </div>
      </div>
      <dl className="relative z-10 border-t border-line-subtle">
        <div className="container-nd grid grid-cols-2 gap-y-4 py-6 tablet:flex tablet:items-center tablet:justify-between">
          {[
            [String(stats.disciplines), "disciplines"],
            [String(stats.engineers), "senior engineers"],
            [stats.timezoneSpan, "working overlap"],
            [`Est. ${stats.founded}`, "remote-first"],
          ].map(([a, b]) => (
            <div key={b} className="flex items-center gap-2.5">
              <dt className="sr-only">{b}</dt>
              <dd className="type-label-m">{a}</dd>
              <span className="type-mono-s text-fg-subtle">{b}</span>
            </div>
          ))}
          <span className="hidden items-center gap-2 type-mono-s text-fg-subtle desktop:inline-flex">
            Scroll to explore <Icon name="chev-down" size={14} />
          </span>
        </div>
      </dl>
    </section>
  );
}
