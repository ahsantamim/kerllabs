"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Service, Specialist } from "@nodal/content";
import { Button, SelectField, SpecialistCard, Tag, TextField } from "@nodal/ui";

/** Specialist directory: search + discipline chips + availability filter, with an honest empty state. */
export function Directory({ specialists, services }: { specialists: Specialist[]; services: Service[] }) {
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const [discipline, setDiscipline] = useState(params.get("discipline") ?? "all");
  const [availability, setAvailability] = useState("Any time");
  const list = useMemo(
    () =>
      specialists.filter((s) => {
        const hay = `${s.name} ${s.role} ${s.stackTags.join(" ")}`.toLowerCase();
        return (
          (!q || hay.includes(q.toLowerCase())) &&
          (discipline === "all" || s.discipline === discipline) &&
          (availability === "Any time" || s.availability.tone === "now")
        );
      }),
    [specialists, q, discipline, availability],
  );
  const count = (slug: string) => specialists.filter((s) => s.discipline === slug).length;
  return (
    <div className="container-nd flex flex-col gap-8 pb-28">
      <div className="grid gap-4 tablet:grid-cols-[2fr_1fr]">
        <TextField label="Search" placeholder="Name, skill or tool — e.g. Postgres" value={q} onChange={(e) => setQ(e.target.value)} />
        <SelectField label="Availability" options={["Any time", "Available now"]} value={availability} onChange={(e) => setAvailability(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by discipline">
        <Tag tone="filled" dot={false} selected={discipline === "all"} onClick={() => setDiscipline("all")}>All {specialists.length}</Tag>
        {services.filter((s) => count(s.slug)).map((s) => (
          <Tag key={s.slug} tone="filled" dot={false} selected={discipline === s.slug} onClick={() => setDiscipline(s.slug)}>
            {s.name} {count(s.slug)}
          </Tag>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-line-subtle pt-6">
        <span className="type-body-s text-fg-muted" aria-live="polite">Showing {list.length} of {specialists.length} · sorted by availability</span>
      </div>
      {list.length ? (
        <ul className="grid gap-6 tablet:grid-cols-2 desktop:grid-cols-4">
          {[...list].sort((a, b) => (a.availability.tone === "now" ? -1 : 1) - (b.availability.tone === "now" ? -1 : 1)).map((s) => (
            <li key={s.slug}><SpecialistCard specialist={s} className="h-full" /></li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-line-subtle bg-raised px-6 py-16 text-center">
          <h2 className="type-h3">No specialists match those filters.</h2>
          <p className="max-w-[560px] type-body-m text-fg-muted">Try widening the filters — or book a free consultation and a PM will tell you honestly whether we can help.</p>
          <div className="flex gap-3">
            <Button variant="ghost" icon={false} onClick={() => { setQ(""); setDiscipline("all"); setAvailability("Any time"); }}>Clear filters</Button>
            <Button href="/consult">Book a free consultation</Button>
          </div>
        </div>
      )}
    </div>
  );
}
