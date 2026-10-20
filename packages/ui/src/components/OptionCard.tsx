"use client";
import { cn } from "../lib/cn";
import { Icon, type IconName } from "./Icon";

/** Option Card — Figma `Option Card`. A native radio/checkbox inside a label → full-card hit target + keyboard support. */
export function OptionCard({
  name, value, title, description, icon = "globe", checked, defaultChecked, disabled, type = "radio", onChange, className,
}: {
  name: string;
  value: string;
  title: string;
  description?: string;
  icon?: IconName;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  type?: "radio" | "checkbox";
  onChange?: (value: string, checked: boolean) => void;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "group/opt relative flex cursor-pointer flex-col gap-4 rounded-lg border border-line bg-surface-1 p-6 transition-[background-color,border-color] duration-[180ms]",
        "hover:border-line-strong hover:bg-surface-2",
        "has-[:checked]:border-[1.5px] has-[:checked]:border-accent has-[:checked]:bg-accent-subtle",
        "has-[:focus-visible]:shadow-focus has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-raised has-[:disabled]:text-fg-disabled",
        className,
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={(e) => onChange?.(value, e.currentTarget.checked)}
        className="peer sr-only"
      />
      <span className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-md bg-surface-3 text-fg group-has-[:checked]/opt:bg-accent group-has-[:checked]/opt:text-on-accent">
          <Icon name={icon} size={20} />
        </span>
        <span className="grid size-5 place-items-center rounded-full border-[1.5px] border-line-strong group-has-[:checked]/opt:border-accent group-has-[:checked]/opt:bg-accent">
          <span className="hidden size-2 rounded-full bg-on-accent group-has-[:checked]/opt:block" />
        </span>
      </span>
      <span className="type-h5">{title}</span>
      {description && <span className="type-body-s text-fg-muted">{description}</span>}
    </label>
  );
}
