"use client";
import { useState } from "react";
import type { Solution } from "@nodal/content";
import { Button, Headline, Icon, Kicker, Reveal, Tag } from "@nodal/ui";

const LABEL: Record<Solution["type"], string> = { product: "Product", solution: "Solution", open_source: "Open source" };

/** S4b · Products & solutions — rendered from CMS `solutions[]` (newest first). */
export function Solutions({ solutions }: { solutions: Solution[] }) {
  const [filter, setFilter] = useState<"all" | Solution["type"]>("all");
  const list = solutions.filter((s) => filter === "all" || s.type === filter);
  const count = (t: Solution["type"]) => solutions.filter((s) => s.type === t).length;
  return (
    <section id="solutions" className="border-y border-line-subtle bg-raised py-28 desktop:py-36">
      <div className="container-nd flex flex-col gap-12">
        <Reveal className="flex flex-col gap-4">
          <Kicker>05 — Products & solutions</Kicker>
          <Headline text="Software we’ve built. Problems we’ve solved." emphasis="solved" accent className="type-h1 max-w-[900px]" />
          <p className="max-w-[640px] type-body-l text-fg-muted">Our own products, open-source tools and the solution patterns we deliver again and again — updated as we ship.</p>
        </Reveal>
        <div className="flex flex-wrap gap-2">
          <Tag tone="filled" dot={false} selected={filter === "all"} onClick={() => setFilter("all")}>All {solutions.length}</Tag>
          {(["product", "solution", "open_source"] as const).map((t) => (
            <Tag key={t} tone="filled" dot={false} selected={filter === t} onClick={() => setFilter(t)}>{LABEL[t]} {count(t)}</Tag>
          ))}
        </div>
        <ul className="grid gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
          {list.map((s) => (
            <li key={s.slug} className="flex flex-col gap-3.5 rounded-xl border border-line-subtle bg-surface-1 p-7 transition-colors hover:border-line-strong">
              <div className="flex items-center justify-between">
                <span className={s.type === "solution" ? "type-mono-s text-fg-subtle" : "type-mono-s text-accent"}>{LABEL[s.type]}</span>
                {s.isNew && <Tag tone="accent" dot={false}>New</Tag>}
              </div>
              <h3 className="type-h3">{s.name}</h3>
              <p className="type-body-m text-fg-muted">{s.summary}</p>
              <div className="flex flex-wrap gap-1.5">{s.stack.map((t) => <Tag key={t}>{t}</Tag>)}</div>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-2 type-label-m">
                {s.type === "solution" ? "See how we approach it" : "Explore"} <Icon name="arrow-up-right" size={14} />
              </span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between gap-4">
          <span className="type-mono-s text-fg-subtle">Sample entries — fictional products and patterns.</span>
          <Button href="/work" variant="secondary">View all</Button>
        </div>
      </div>
    </section>
  );
}
