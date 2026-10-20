import Link from "next/link";
import { Button, Icon, Kicker, cn } from "@nodal/ui";
import { CtaBand, PageHeader } from "@/components/layout/PageHeader";
import { content } from "@/lib/content";

export const metadata = { title: "Services" };

const TIERS = [["experience", "Experience", "What your users see and find"], ["product_logic", "Product logic", "What makes it work"], ["infrastructure", "Infrastructure", "What keeps it running"]] as const;

export default async function ServicesPage() {
  const services = await content().getServices();
  return (
    <>
      <PageHeader
        crumbs={[["Home", "/"], ["Services"]]}
        title="Ten disciplines, one standard of engineering."
        emphasis="one standard"
        aside={<p className="max-w-[380px] type-body-l text-fg-muted">Hire any discipline on its own, or combine them into a full product team. Every service shares the same review, testing and documentation practices.</p>}
      />
      <div className="container-nd pb-28">
        {TIERS.map(([tier, label, sub]) => (
          <section key={tier} className="grid gap-6 border-t border-line-subtle py-10 desktop:grid-cols-[280px_1fr] desktop:gap-12">
            <div className="flex flex-col gap-2">
              <span className="type-mono-s text-accent">{label}</span>
              <span className="type-body-s text-fg-subtle">{sub}</span>
            </div>
            <ul>
              {services.filter((s) => s.tier === tier).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="group grid grid-cols-[32px_1fr_auto] items-center gap-6 rounded-lg px-4 py-7 transition-colors hover:bg-surface-1 tablet:grid-cols-[40px_300px_1fr_auto] tablet:px-6">
                    <span className="type-mono-m text-fg-subtle group-hover:text-accent">{String(s.order).padStart(2, "0")}</span>
                    <span className="type-h3">{s.name}</span>
                    <span className="col-span-3 type-body-m text-fg-muted tablet:col-span-1">{s.summary}</span>
                    <span className={cn("hidden size-11 place-items-center rounded-full bg-surface-2 transition-colors group-hover:bg-accent group-hover:text-on-accent tablet:grid")}><Icon name="arrow-up-right" size={18} /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="border-t border-line-subtle bg-raised py-24">
        <div className="container-nd flex flex-col gap-12">
          <Kicker>Engagement models</Kicker>
          <h2 className="type-h1">Three ways to start.</h2>
          <div className="grid gap-6 desktop:grid-cols-3">
            {[
              ["10–24 weeks typical", "Full team", "End-to-end product delivery by a dedicated pod.", "Hire the full team", "/hire/team", true],
              ["From 20 hrs / week", "Specialist", "One senior engineer embedded in your team.", "Find a specialist", "/team", false],
              ["2 weeks · fixed fee", "Fixed-scope audit", "A two-week review of architecture, performance, security or SEO with a written plan.", "Ask about an audit", "/contact", false],
            ].map(([m, t, d, b, h, p]) => (
              <div key={t as string} className={cn("flex flex-col gap-5 rounded-xl border bg-surface-1 p-9", p ? "border-accent" : "border-line-subtle")}>
                <span className="type-mono-s text-fg-subtle">{m}</span>
                <h3 className="type-h3">{t}</h3>
                <p className="type-body-m text-fg-muted">{d}</p>
                <Button href={h as string} variant={p ? "primary" : "secondary"} className="mt-auto w-fit">{b as string}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title="Not sure which discipline you need? Start with a free call." emphasis="free call" primary={["Book a free consultation", "/consult"]} secondary={["Contact us", "/contact"]} />
    </>
  );
}
