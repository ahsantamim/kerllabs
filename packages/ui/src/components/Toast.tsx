import { cn } from "../lib/cn";
import { Icon } from "./Icon";

/** Toast — Figma `Toast`. role=status (success/info) or alert (error). */
export function Toast({ kind = "success", title, message, onClose }: { kind?: "success" | "error" | "info"; title: string; message?: string; onClose?: () => void }) {
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={cn(
        "flex w-full max-w-[440px] items-start gap-3.5 rounded-md border bg-surface-2 px-5 py-4 shadow-elev-2 animate-[nd-toast_320ms_var(--ease-enter)]",
        kind === "success" ? "border-success/60" : kind === "error" ? "border-error/60" : "border-line-strong",
      )}
    >
      <Icon name={kind === "success" ? "check" : kind === "error" ? "alert" : "clock"} className={kind === "success" ? "text-success" : kind === "error" ? "text-error" : "text-fg-muted"} />
      <div className="flex flex-1 flex-col gap-1">
        <span className="type-label-m">{title}</span>
        {message && <span className="type-body-s text-fg-muted">{message}</span>}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Dismiss" className="text-fg-subtle hover:text-fg">
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
}
