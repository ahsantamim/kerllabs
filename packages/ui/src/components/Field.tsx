"use client";
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "../lib/cn";
import { Icon } from "./Icon";

type FieldState = "default" | "error" | "success";
interface FieldChrome {
  label: string;
  required?: boolean;
  helper?: ReactNode;
  state?: FieldState;
  className?: string;
}

const box = (state: FieldState) =>
  cn(
    "w-full rounded-md bg-surface-1 px-4 type-body-m text-fg placeholder:text-fg-subtle transition-[border-color,box-shadow] duration-[180ms] ease-standard",
    "border hover:border-line-strong focus:outline-none focus:border-accent focus:border-[1.5px] focus:shadow-focus",
    "disabled:bg-surface-2 disabled:text-fg-disabled disabled:border-line-subtle",
    state === "error" && "border-error border-[1.5px]",
    state === "success" && "border-success",
    state === "default" && "border-line",
  );

function Chrome({ id, label, required, helper, state = "default", className, children }: FieldChrome & { id: string; children: ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="type-label-m text-fg">
          {label}
        </label>
        {required && <span className="type-mono-s text-fg-subtle">Required</span>}
      </div>
      {children}
      {helper && (
        <p
          id={`${id}-help`}
          role={state === "error" ? "alert" : undefined}
          className={cn(
            "flex items-center gap-1.5 type-body-s",
            state === "error" ? "text-error" : state === "success" ? "text-success" : "text-fg-subtle",
          )}
        >
          {state === "error" && <Icon name="alert" size={14} />}
          {state === "success" && <Icon name="check" size={14} />}
          {helper}
        </p>
      )}
    </div>
  );
}

/** Input Field — Figma `Input Field` Type=Text. Labels are always visible; errors announced via role=alert. */
export function TextField({ label, required, helper, state = "default", className, ...rest }: FieldChrome & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Chrome id={id} label={label} required={required} helper={helper} state={state} className={className}>
      <input
        id={id}
        required={required}
        aria-invalid={state === "error" || undefined}
        aria-describedby={helper ? `${id}-help` : undefined}
        className={cn(box(state), "h-[52px]")}
        {...rest}
      />
    </Chrome>
  );
}

export function TextArea({ label, required, helper, state = "default", className, ...rest }: FieldChrome & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Chrome id={id} label={label} required={required} helper={helper} state={state} className={className}>
      <textarea
        id={id}
        required={required}
        aria-invalid={state === "error" || undefined}
        aria-describedby={helper ? `${id}-help` : undefined}
        className={cn(box(state), "min-h-[140px] resize-y py-3.5")}
        {...rest}
      />
    </Chrome>
  );
}

export function SelectField({
  label, required, helper, state = "default", className, options, ...rest
}: FieldChrome & SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }) {
  const id = useId();
  return (
    <Chrome id={id} label={label} required={required} helper={helper} state={state} className={className}>
      <div className="relative">
        <select id={id} required={required} className={cn(box(state), "h-[52px] appearance-none pr-10")} {...rest}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <Icon name="chev-down" size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-fg-muted" />
      </div>
    </Chrome>
  );
}
