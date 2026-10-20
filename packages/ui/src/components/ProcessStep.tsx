import type { ProcessStage } from "@nodal/content";
import { cn } from "../lib/cn";
import { Icon } from "./Icon";

export type StepState = "upcoming" | "active" | "complete";

/** Process Step — Figma `Process Step`. */
export function ProcessStep({ stage, state, onSelect }: { stage: ProcessStage; state: StepState; onSelect?: () => void }) {
  return (
    <button type="button" onClick={onSelect} aria-current={state === "active" ? "step" : undefined} className="group flex w-full flex-col gap-5 text-left">
      <span className="flex w-full items-center">
        <span
          className={cn(
            "grid size-7 shrink-0 place-items-center rounded-full border-[1.5px] transition-all duration-[320ms] ease-enter",
            state === "active" && "scale-100 border-accent bg-accent shadow-glow",
            state === "complete" && "border-inverse bg-inverse text-fg-inverse",
            state === "upcoming" && "scale-90 border-line-strong",
          )}
        >
          {state === "active" && <span className="size-2 rounded-full bg-on-accent" />}
          {state === "complete" && <Icon name="check" size={14} />}
        </span>
        <span className={cn("h-[1.5px] flex-1 transition-colors duration-[320ms]", state === "complete" ? "bg-fg" : state === "active" ? "bg-accent" : "bg-line")} />
      </span>
      <span className={cn("type-mono-m", state === "active" ? "text-accent" : "text-fg-subtle")}>{stage.index}</span>
      <span className={cn("type-h4", state === "upcoming" ? "text-fg-subtle" : "text-fg")}>{stage.title}</span>
      <span className={cn("type-body-s", state === "upcoming" ? "text-fg-subtle" : "text-fg-muted")}>{stage.text}</span>
      <span className="inline-flex items-center gap-1.5 type-mono-s text-fg-subtle">
        <Icon name="clock" size={14} /> {stage.duration}
      </span>
    </button>
  );
}
