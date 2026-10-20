import { Kicker, Reveal } from "@nodal/ui";

const PRINCIPLES = [
  ["01", "Senior by default", "Everyone shipping your code has run production systems for six years or more. No juniors learning on your budget."],
  ["02", "Overlap, not handoffs", "At least four hours of shared working time with your team every weekday, whatever the time zone."],
  ["03", "Demo every Friday", "Working software in a real environment each week — not status decks."],
  ["04", "Leave it documented", "Decision records, runbooks and onboarding notes are part of “done”, so you’re never locked in."],
];

/** S6 · Operating principles (static). Not a testimonial — a stated policy. */
export function Principles() {
  return (
    <section id="principles" className="bg-raised py-28 desktop:py-40">
      <div className="container-nd flex flex-col gap-20">
        <div className="grid gap-10 desktop:grid-cols-12 desktop:items-end">
          <Reveal className="flex flex-col gap-6 desktop:col-span-7">
            <Kicker>07 — How we operate</Kicker>
            <p className="type-serif text-[clamp(48px,7vw,112px)] leading-[0.95]">We’d rather tell you what not to build.</p>
          </Reveal>
          <p className="type-body-l text-fg-muted desktop:col-span-5">Four rules every engagement runs on — whether you hire one of us or all of us. They’re in our contracts, not just on this page.</p>
        </div>
        <div className="grid tablet:grid-cols-2 desktop:grid-cols-4">
          {PRINCIPLES.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 60} className={`flex flex-col gap-5 border-t border-line py-8 tablet:pr-8 ${i ? "desktop:border-l desktop:pl-8" : ""}`}>
              <span className="type-mono-m text-accent">{n}</span>
              <h3 className="type-h4">{t}</h3>
              <p className="type-body-m text-fg-muted">{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
