"use client";
import { useState } from "react";
import type { Host } from "@nodal/content";
import { Button, Headline, Icon, Kicker, Portrait, Tag, cn } from "@nodal/ui";

/** S2b · Free consultation — FULL-BLEED LEFT. The conversion hook for undecided visitors (2 free sessions per company). */
export function Consultation({ hosts }: { hosts: Host[] }) {
  const [host, setHost] = useState(hosts[0]?.id);
  const [slot, setSlot] = useState(0);
  const current = hosts.find((h) => h.id === host);
  return (
    <section className="py-20 desktop:py-32" aria-labelledby="consult-title">
      <div className="grid items-center gap-12 desktop:grid-cols-[1fr_minmax(0,500px)] desktop:gap-16 desktop:pr-[max(80px,calc((100vw-1280px)/2))]">
        {/* Bleed panel: anchored to the LEFT viewport edge on desktop */}
        <div className="flex flex-col gap-7 bg-accent-subtle px-5 py-14 tablet:px-10 desktop:rounded-r-xl desktop:py-[72px] desktop:pl-[max(80px,calc((100vw-1280px)/2))] desktop:pr-[72px]">
          <Kicker>02 — Not sure yet?</Kicker>
          <Headline as="h2" text="Team or specialist? Talk to a product manager first." emphasis="first" accent className="type-display-l text-balance" />
          <p id="consult-title" className="max-w-[620px] type-body-l text-fg-muted">
            Book a 45-minute call with one of our product managers or product engineers. We’ll look at your product, your team
            and your timeline — and tell you honestly what kind of help you need.
          </p>
          <div className="flex flex-col gap-3">
            <span className="type-mono-s text-fg-subtle">You’ll leave with</span>
            {["A recommendation: full team, one specialist — or neither", "A shortlist of named people who fit", "A rough scope, team shape and timeline"].map((t) => (
              <span key={t} className="flex items-center gap-2.5 type-body-m"><Icon name="check" size={16} className="text-accent" />{t}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {["2 free sessions per company", "45 minutes", "No obligation"].map((t) => <Tag key={t} tone="filled" dot={false}>{t}</Tag>)}
          </div>
        </div>

        <div className="mx-5 flex flex-col gap-5 rounded-xl border border-line bg-surface-1 p-6 shadow-elev-2 tablet:mx-10 tablet:p-8 desktop:mx-0">
          <h3 className="type-h4">Who would you like to talk to?</h3>
          <div role="radiogroup" aria-label="Host" className="flex flex-col gap-3">
            {hosts.map((h) => (
              <button
                key={h.id}
                type="button"
                role="radio"
                aria-checked={host === h.id}
                onClick={() => setHost(h.id)}
                className={cn(
                  "flex items-center gap-3.5 rounded-lg border p-4 text-left transition-colors",
                  host === h.id ? "border-accent bg-accent-subtle" : "border-line-subtle bg-raised hover:border-line-strong",
                )}
              >
                <Portrait initials={h.initials} size="avatar" className="size-12 shrink-0 rounded-full" />
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="type-label-l">{h.name}</span>
                  <span className="type-body-s text-fg-muted">{h.role} · {h.timezone}</span>
                  <span className={cn("type-mono-s", host === h.id ? "text-accent" : "text-fg-subtle")}>Next: {h.nextSlot} your time</span>
                </span>
                <span className={cn("size-5 rounded-full border-[1.5px]", host === h.id ? "border-accent bg-accent" : "border-line-strong")} />
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="type-mono-s text-fg-subtle">Earliest times with {current?.name.split(" ")[0]} · your time</span>
            <div className="grid grid-cols-3 gap-2">
              {["Tue 13:00", "Tue 15:30", "Thu 12:00"].map((t, i) => (
                <button key={t} type="button" onClick={() => setSlot(i)} aria-pressed={slot === i} className={cn("rounded-md border border-line-subtle py-2.5 type-label-s transition-colors", slot === i ? "bg-inverse text-fg-inverse" : "bg-surface-2 hover:border-line-strong")}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Button href={`/consult?host=${host}`} size="L" fullWidth>Book a free consultation</Button>
          <span className="type-mono-s text-fg-subtle">Uses 1 of your 2 free sessions · reschedule anytime</span>
        </div>
      </div>
    </section>
  );
}
