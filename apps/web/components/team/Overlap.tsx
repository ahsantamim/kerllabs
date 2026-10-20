"use client";
import { useEffect, useState } from "react";

/** Working-hours overlap between the specialist (09–17 local) and the visitor (detected time zone). */
export function Overlap({ name, utcOffset, timezone }: { name: string; utcOffset: number; timezone: string }) {
  const [mine, setMine] = useState<number | null>(null);
  useEffect(() => setMine(-new Date().getTimezoneOffset() / 60), []);
  const toUtc = (o: number): [number, number] => [(((9 - o) % 24) + 24) % 24, (((17 - o) % 24) + 24) % 24];
  const theirs = toUtc(utcOffset);
  const yours = mine === null ? null : toUtc(mine);
  const overlap = (() => {
    if (!yours) return 0;
    const range = (a: number, b: number) => { const s = new Set<number>(); for (let h = a; h !== b; h = (h + 1) % 24) s.add(h); return s; };
    const A = range(...theirs), B = range(...yours);
    return [...A].filter((h) => B.has(h)).length;
  })();
  const Bar = ({ span, cls }: { span: [number, number]; cls: string }) => {
    const [a, b] = span;
    const segs = a < b ? [[a, b]] : [[a, 24], [0, b]];
    return (
      <span className="relative block h-3 rounded-full bg-surface-3">
        {segs.map(([s, e]) => <span key={s} className={`absolute inset-y-0 rounded-full ${cls}`} style={{ left: `${(s! / 24) * 100}%`, width: `${((e! - s!) / 24) * 100}%` }} />)}
      </span>
    );
  };
  const fmt = (o: number) => (o < 0 ? `UTC−${Math.abs(o)}` : `UTC+${o}`);
  return (
    <div className="flex flex-col gap-4">
      <span className="type-label-m">Overlap with your time zone</span>
      <div className="flex flex-col gap-1.5"><span className="type-mono-s text-fg-subtle">{name} · {timezone}</span><Bar span={theirs} cls="bg-accent" /></div>
      <div className="flex flex-col gap-1.5"><span className="type-mono-s text-fg-subtle">You · {mine === null ? "detecting…" : `${fmt(mine)} (detected)`}</span>{yours && <Bar span={yours} cls="bg-fg-muted" />}</div>
      <span className="type-body-s text-fg-muted">{yours ? `${overlap} hours of shared working time on weekdays` : " "}</span>
    </div>
  );
}
