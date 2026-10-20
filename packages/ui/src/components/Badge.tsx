import type { PublishStatus, Role } from "@nodal/content";
import { cn } from "../lib/cn";

const statusMap: Record<PublishStatus, [string, string, string]> = {
  published: ["Published", "bg-success-subtle text-success", "bg-success"],
  draft: ["Draft", "bg-surface-3 text-fg-muted", "bg-fg-muted"],
  in_review: ["In review", "bg-accent-subtle text-accent", "bg-accent"],
  changes_requested: ["Changes requested", "bg-error-subtle text-error", "bg-error"],
  scheduled: ["Scheduled", "bg-surface-2 text-fg", "bg-fg"],
  archived: ["Archived", "bg-surface-2 text-fg-subtle", "bg-fg-subtle"],
};

/** Status Badge — content lifecycle (Figma `Status Badge`). */
export function StatusBadge({ status, label }: { status: PublishStatus; label?: string }) {
  const [text, cls, dot] = statusMap[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 type-label-s", cls)}>
      <span className={cn("size-1.5 rounded-full", dot)} />
      {label ?? text}
    </span>
  );
}

const roleMap: Record<Role, string> = {
  admin: "bg-accent text-on-accent",
  editor: "bg-inverse text-fg-inverse",
  pm: "bg-[#1E2A4A] text-[#9DB6FF]",
  specialist: "bg-surface-3 text-fg",
};

/** Role Badge — Figma `Role Badge`. */
export function RoleBadge({ role }: { role: Role }) {
  return <span className={cn("inline-flex rounded-sm px-2.5 py-1 type-mono-s", roleMap[role])}>{role === "pm" ? "PM" : role}</span>;
}
