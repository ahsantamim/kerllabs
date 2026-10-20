"use client";
import { cn } from "@nodal/ui";

/** Slot picker grid (arrow-key navigable buttons). Times shown in the visitor's zone with the host's local time underneath. */
export function SlotPicker({ value, onChange, hostName, hostOffsetDiff = -5, days = ["Mon 25", "Tue 26", "Wed 27", "Thu 28", "Fri 29"], times = ["15:00", "16:30", "18:00", "19:30"], unavailable = ["0-0", "0-1", "4-3"] }: {
  value: string; onChange: (v: string) => void; hostName: string; hostOffsetDiff?: number; days?: string[]; times?: string[]; unavailable?: string[];
}) {
  const shift = (t: string) => { const [h, m] = t.split(":").map(Number) as [number, number]; return `${String((h + hostOffsetDiff + 24) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`; };
  return (
    <div className="grid grid-cols-5 gap-2.5 rounded-xl border border-line-subtle bg-surface-1 p-5 tablet:gap-3 tablet:p-7" role="grid" aria-label="Available times">
      {days.map((d, di) => (
        <div key={d} className="flex flex-col gap-2.5" role="row">
          <span className="flex flex-col items-center py-2"><span className="type-mono-s text-fg-subtle">{d.split(" ")[0]}</span><span className="type-h4">{d.split(" ")[1]}</span></span>
          {times.map((t, ti) => {
            const id = `${d} ${t}`;
            const off = unavailable.includes(`${di}-${ti}`);
            const sel = value === id;
            return (
              <button key={t} role="gridcell" type="button" disabled={off} aria-pressed={sel} onClick={() => onChange(id)}
                className={cn("flex flex-col items-center gap-0.5 rounded-md border px-1 py-3 transition-colors", sel ? "border-accent bg-accent text-on-accent" : off ? "border-line-subtle bg-raised text-fg-disabled" : "border-line-subtle bg-surface-2 hover:border-line-strong")}>
                <span className="type-label-m">{t}</span>
                <span className={cn("hidden type-mono-s tablet:block", sel ? "text-on-accent" : "text-fg-subtle")}>{hostName} {shift(t)}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
