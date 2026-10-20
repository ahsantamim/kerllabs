import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";
import { Icon, type IconName } from "./Icon";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
export type ButtonSize = "L" | "M";

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Trailing icon (in a round chip for primary/secondary/ghost). Pass `false` to hide. */
  icon?: IconName | false;
  loading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = Common & { href: string; target?: string; onClick?: () => void; "aria-label"?: string };

const base =
  "group/btn relative inline-flex select-none items-center justify-between whitespace-nowrap rounded-full transition-[background-color,border-color,color,transform,box-shadow] duration-[180ms] ease-standard active:scale-[0.98] focus-visible:shadow-focus focus-visible:outline-none disabled:pointer-events-none aria-disabled:pointer-events-none";

const sizes: Record<Exclude<ButtonVariant, "link">, Record<ButtonSize, [string, string]>> = {
  primary: { L: ["h-14 gap-4 pl-6 pr-2 type-label-l", "h-14 px-6 type-label-l"], M: ["h-11 gap-3 pl-[18px] pr-1.5 type-label-m", "h-11 px-[18px] type-label-m"] },
  secondary: { L: ["h-14 gap-4 pl-6 pr-2 type-label-l", "h-14 px-6 type-label-l"], M: ["h-11 gap-3 pl-[18px] pr-1.5 type-label-m", "h-11 px-[18px] type-label-m"] },
  ghost: { L: ["h-14 gap-4 pl-6 pr-2 type-label-l", "h-14 px-6 type-label-l"], M: ["h-11 gap-3 pl-[18px] pr-1.5 type-label-m", "h-11 px-[18px] type-label-m"] },
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-pressed disabled:bg-surface-3 disabled:text-fg-disabled",
  secondary:
    "border border-line-strong text-fg hover:border-fg hover:bg-surface-2 active:bg-surface-3 disabled:border-line-subtle disabled:text-fg-disabled",
  ghost: "text-fg hover:bg-surface-2 active:bg-surface-3 disabled:text-fg-disabled",
  link: "gap-2 py-1 type-label-m text-fg hover:text-accent hover:underline underline-offset-4 disabled:text-fg-disabled",
};

const chips: Record<Exclude<ButtonVariant, "link">, string> = {
  primary: "bg-on-accent text-accent",
  secondary: "bg-inverse text-fg-inverse",
  ghost: "bg-surface-3 text-fg",
};

/** Button — Figma component `Button` (Variant × Size × State). */
export function Button(props: AsButton | AsLink) {
  const { variant = "primary", size = "M", icon = "arrow-up-right", loading, loadingLabel = "Sending…", fullWidth, className, children } = props;
  const isLink = variant === "link";
  const showIcon = icon !== false;
  const cls = cn(
    base,
    variants[variant],
    !isLink && sizes[variant][size][showIcon ? 0 : 1],
    fullWidth ? "w-full" : "w-fit",
    className,
  );
  const chipSize = size === "L" ? "size-10" : "size-8";
  const content = (
    <>
      <span className="inline-flex items-center gap-2">
        {loading && <Icon name="loader" size={18} className="animate-spin" />}
        {loading ? loadingLabel : children}
      </span>
      {showIcon &&
        (isLink ? (
          <Icon name={icon === "arrow-up-right" ? "arrow-right" : icon} size={18} className="transition-transform duration-[180ms] group-hover/btn:translate-x-0.5" />
        ) : (
          <span className={cn("inline-grid shrink-0 place-items-center rounded-full", chipSize, chips[variant as keyof typeof chips])}>
            <Icon name={icon} size={size === "L" ? 18 : 16} className="transition-transform duration-[180ms] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </span>
        ))}
    </>
  );
  if ("href" in props && props.href) {
    return (
      <Link href={props.href} target={props.target} className={cls} onClick={props.onClick} aria-label={props["aria-label"]}>
        {content}
      </Link>
    );
  }
  const { variant: _v, size: _s, icon: _i, loading: _l, loadingLabel: _ll, fullWidth: _f, className: _c, children: _ch, ...rest } = props as AsButton;
  return (
    <button {...rest} className={cls} aria-busy={loading || undefined} disabled={rest.disabled || loading}>
      {content}
    </button>
  );
}
