"use client";
import { useState } from "react";
import type { Service } from "@nodal/content";
import { Button, CapabilityNode, Reveal, SectionHeader, Tag, cn, type NodeState } from "@nodal/ui";

/**
 * S3 · Engineering Capabilities — Connected Systems (motion spec M-02).
 * Desktop: tiered graph with traced edges + detail panel. Mobile: stacked tiers (2D fallback).
 * Future: R3F scene with tilted plane, DOM labels via drei <Html>.
 */
const POS: Record<string, [number, number]> = {
  "ui-ux-product-design": [150, 90], frontend: [420, 90], seo: [680, 90],
  "full-stack": [80, 300], backend: [330, 300], "ai-engineering": [570, 300], database: [800, 300],
  cloud: [200, 510], devops: [470, 510], "qa-automation": [720, 510],
};
const TIERS = [["experience", "Experience", 90], ["product_logic", "Product logic", 300], ["infrastructure", "Infrastructure", 510]] as const;

export function Capabilities({ services, specialistCounts }: { services: Service[]; specialistCounts: Record<string, number> }) {
  const [selected, setSelected] = useState("ai-engineering");
  const [hover, setHover] = useState<string | null>(null);
  const focus = hover ?? selected;
  const bySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
  const active = bySlug[selected];
  const linked = new Set(bySlug[focus]?.connects ?? []);
  const edges = services.flatMap((s) => s.connects.filter((c) => c > s.slug && POS[c]).map((c) => [s.slug, c] as const));
  const stateOf = (slug: string): NodeState =>
    slug === selected ? "selected" : slug === hover ? "hover" : linked.has(slug) || slug === focus ? "default" : "dimmed";

  return (
    <section className="border-y border-line-subtle bg-raised py-28 desktop:py-40" aria-labelledby="cap-title">
      <div className="container-nd flex flex-col gap-14">
        <Reveal>
          <SectionHeader
            kicker="03 — Capabilities"
            title="Ten disciplines. One connected system."
            description="Select a discipline to see what it covers and how it connects to the rest of a product. Every node is a real person on the team."
          />
        </Reveal>

        {/* Desktop graph */}
        <div className="hidden gap-10 desktop:grid desktop:grid-cols-[1fr_400px]">
          <div className="relative aspect-[880/640]">
            {TIERS.map(([, label, y]) => (
              <div key={label} className="absolute inset-x-0" style={{ top: `${((y - 80) / 640) * 100}%` }}>
                <span className="type-mono-s text-fg-subtle">{label}</span>
                <div className="mt-2 h-px bg-line-subtle" />
              </div>
            ))}
            <svg viewBox="0 0 880 640" className="absolute inset-0 size-full" aria-hidden="true">
              {edges.map(([a, b]) => {
                const [x1, y1] = POS[a]!;
                const [x2, y2] = POS[b]!;
                const hot = a === focus || b === focus;
                const my = (y1 + y2) / 2;
                const d = y1 === y2 ? `M${x1} ${y1} L${x2} ${y2}` : `M${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
                return (
                  <path key={a + b} d={d} fill="none" className={cn("transition-[stroke-opacity] duration-[320ms]", hot ? "stroke-accent" : "stroke-fg")} strokeOpacity={hot ? 0.85 : 0.1} strokeWidth={hot ? 1.5 : 1} strokeDasharray={hot ? undefined : "3 5"} />
                );
              })}
            </svg>
            {services.filter((s) => POS[s.slug]).map((s) => (
              <CapabilityNode
                key={s.slug}
                code={s.code}
                label={s.name}
                state={stateOf(s.slug)}
                onSelect={() => setSelected(s.slug)}
                onHover={(on) => setHover(on ? s.slug : null)}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(POS[s.slug]![0] / 880) * 100}%`, top: `${(POS[s.slug]![1] / 640) * 100}%` }}
              />
            ))}
          </div>
          {active && <DetailPanel service={active} count={specialistCounts[active.slug] ?? 0} bySlug={bySlug} index={services.indexOf(active) + 1} total={services.length} />}
        </div>

        {/* Mobile / tablet: 2D fallback */}
        <div className="flex flex-col gap-7 desktop:hidden">
          {TIERS.map(([tier, label]) => (
            <div key={tier} className="flex flex-col gap-3">
              <span className="type-mono-s text-fg-subtle">{label}</span>
              <div className="flex flex-wrap gap-2">
                {services.filter((s) => s.tier === tier).map((s) => (
                  <CapabilityNode key={s.slug} code={s.code} label={s.name} state={s.slug === selected ? "selected" : "default"} onSelect={() => setSelected(s.slug)} />
                ))}
              </div>
            </div>
          ))}
          {active && <DetailPanel service={active} count={specialistCounts[active.slug] ?? 0} bySlug={bySlug} index={services.indexOf(active) + 1} total={services.length} />}
        </div>

        <div className="hidden flex-wrap gap-8 desktop:flex">
          {[["Hover", "traces connections"], ["Click / Enter", "selects & opens panel"], ["Tab", "moves node to node"]].map(([k, v]) => (
            <span key={k} className="flex items-center gap-2 type-body-s text-fg-subtle">
              <kbd className="rounded-xs border border-line px-2 py-0.5 type-mono-s text-fg">{k}</kbd> {v}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function DetailPanel({ service, count, bySlug, index, total }: { service: Service; count: number; bySlug: Record<string, Service>; index: number; total: number }) {
  return (
    <aside key={service.slug} aria-live="polite" className="flex flex-col gap-6 self-start rounded-xl border border-line bg-surface-1 p-8 shadow-elev-2 nd-stagger">
      <div className="flex items-center justify-between">
        <span className="type-mono-s text-accent">{service.name}</span>
        <span className="type-mono-s text-fg-subtle">{String(index).padStart(2, "0")} / {total}</span>
      </div>
      <h3 id="cap-title" className="type-h3">{service.summary}</h3>
      <div className="flex flex-col gap-2.5">
        <span className="type-mono-s text-fg-subtle">Typical work</span>
        {service.tags.map((t) => (
          <span key={t} className="flex items-center gap-2.5 type-body-s"><span className="h-[1.5px] w-2.5 bg-accent" />{t}</span>
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        <span className="type-mono-s text-fg-subtle">Connects to</span>
        <div className="flex flex-wrap gap-1.5">
          {service.connects.slice(0, 4).map((c) => <Tag key={c} tone="accent">{bySlug[c]?.name ?? c}</Tag>)}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-line-subtle pt-5">
        <span className="type-label-m">{count} specialist{count === 1 ? "" : "s"}</span>
        <Button href={`/services/${service.slug}`} variant="link">Explore</Button>
      </div>
    </aside>
  );
}
