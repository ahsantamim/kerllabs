"use client";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export function Checkbox({ label, error, className, ...rest }: { label: ReactNode; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className={cn("inline-flex cursor-pointer items-center gap-3 type-body-s", error ? "text-error" : "text-fg")}>
        <input
          type="checkbox"
          aria-invalid={!!error || undefined}
          className={cn(
            "size-5 shrink-0 cursor-pointer appearance-none rounded-xs border-[1.5px] bg-transparent transition-colors",
            "checked:border-accent checked:bg-accent checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%230A0A0B%22 stroke-width=%222.4%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M5 12.5l4.5 4.5L19 7.5%22/></svg>')] checked:bg-center checked:bg-no-repeat",
            error ? "border-error" : "border-line-strong",
          )}
          {...rest}
        />
        {label}
      </label>
      {error && <p role="alert" className="type-body-s text-error">{error}</p>}
    </div>
  );
}
