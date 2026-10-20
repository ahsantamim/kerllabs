import { cn } from "../lib/cn";

/** Hiring Stepper — Figma `Hiring Stepper`. */
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex w-full gap-2" aria-label={`Step ${current} of ${steps.length}`}>
      {steps.map((s, i) => {
        const n = i + 1;
        return (
          <li key={s} className="flex flex-1 flex-col gap-2.5" aria-current={n === current ? "step" : undefined}>
            <span className={cn("h-[3px] rounded-full transition-colors duration-[320ms]", n < current ? "bg-fg" : n === current ? "bg-accent" : "bg-line")} />
            <span className="flex items-center gap-2">
              <span className={cn("type-mono-s", n === current ? "text-accent" : "text-fg-subtle")}>0{n}</span>
              <span className={cn("type-label-s", n <= current ? "text-fg" : "text-fg-subtle")}>{s}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
