"use client";
import { useState } from "react";
import { cn } from "../lib/cn";

/** Switch — Figma `Switch`. role=switch, instant save. */
export function Switch({ label, defaultChecked = false, disabled, onChange, srLabel }: { label?: string; srLabel?: string; defaultChecked?: boolean; disabled?: boolean; onChange?: (v: boolean) => void }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label ? undefined : srLabel}
      disabled={disabled}
      onClick={() => {
        setOn(!on);
        onChange?.(!on);
      }}
      className="inline-flex items-center gap-2.5 type-label-s text-fg disabled:text-fg-disabled"
    >
      <span className={cn("relative h-6 w-10 rounded-full transition-colors duration-[180ms]", on ? "bg-accent" : disabled ? "bg-surface-2" : "bg-surface-3")}>
        <span className={cn("absolute top-[3px] size-[18px] rounded-full transition-[left] duration-[180ms] ease-standard", on ? "left-[19px] bg-on-accent" : "left-[3px] bg-fg")} />
      </span>
      {label}
    </button>
  );
}
