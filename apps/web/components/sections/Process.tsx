"use client";
import { useState } from "react";
import type { ProcessStage } from "@nodal/content";
import { Headline, Icon, ProcessStep, Reveal, SectionHeader } from "@nodal/ui";

const DETAIL: Record<string, { title: string; emphasis: string; text: string; time: string; deliverables: [string, string][] }> = {
  Design: {
    title: "See it working before we build it.", emphasis: "working",
    text: "We prototype the riskiest flows first and put them in front of real users. You approve behaviour, not just screenshots.",
    time: "Your time: two 60-min reviews per week",
    deliverables: [["Clickable prototype", "Core flows, tested with 5+ users"], ["Design tokens", "Colour, type, spacing — shared with code"], ["Validated scope", "Updated backlog with build estimates"]],
  },
};

/**
 * S5 · How we work — Guided motion (motion spec M-04).
 * Implementation note: pin + scrub with GSAP ScrollTrigger / Framer `useScroll`; here stages are clickable.
 */
export function Process({ stages }: { stages: ProcessStage[] }) {
  const [active, setActive] = useState(2);
  const st = stages[active]!;
  const d = DETAIL[st.title] ?? { title: st.title, emphasis: st.title, text: st.text, time: `Duration: ${st.duration}`, deliverables: [] as [string, string][] };
  return (
    <section id="process" className="container-nd flex flex-col gap-16 border-t border-line-subtle py-28 desktop:py-40">
      <div className="flex flex-col justify-between gap-8 desktop:flex-row desktop:items-end">
        <Reveal>
          <SectionHeader kicker="06 — How we work" title="From first call to production, in six visible stages." description="Each stage activates in turn, so the process reads like a guided walkthrough rather than a list." />
        </Reveal>
        <div className="flex flex-col items-end gap-3">
          <span className="type-mono-m">{st.index} / 0{stages.length} — {st.title}</span>
          <span className="relative h-0.5 w-60 bg-line"><span className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-[320ms]" style={{ width: `${((active + 1) / stages.length) * 100}%` }} /></span>
        </div>
      </div>
      <ol className="grid grid-cols-2 gap-x-4 gap-y-10 tablet:grid-cols-3 desktop:grid-cols-6">
        {stages.map((s, i) => (
          <li key={s.index}>
            <ProcessStep stage={s} state={i < active ? "complete" : i === active ? "active" : "upcoming"} onSelect={() => setActive(i)} />
          </li>
        ))}
      </ol>
      <div key={st.title} className="nd-stagger grid gap-10 rounded-xl border border-line-subtle bg-surface-1 p-8 tablet:p-12 desktop:grid-cols-12">
        <div className="flex flex-col gap-5 desktop:col-span-5">
          <span className="type-mono-s text-accent">Stage {st.index} · {st.title}</span>
          <Headline as="h3" text={d.title} emphasis={d.emphasis} className="type-h2" />
          <p className="type-body-l text-fg-muted">{d.text}</p>
          <span className="inline-flex w-fit items-center gap-2.5 rounded-full bg-surface-2 px-3.5 py-2 type-label-s"><Icon name="calendar" size={16} className="text-fg-muted" />{d.time}</span>
        </div>
        {d.deliverables.length > 0 && (
          <div className="grid gap-4 tablet:grid-cols-3 desktop:col-span-7">
            {d.deliverables.map(([t, x], i) => (
              <div key={t} className={`flex flex-col gap-3 rounded-lg border p-6 ${i === 0 ? "border-line-strong bg-surface-2" : "border-line-subtle bg-raised"}`}>
                <span className="type-mono-s text-fg-subtle">Deliverable</span>
                <span className="type-h5">{t}</span>
                <span className="type-body-s text-fg-muted">{x}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
