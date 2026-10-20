import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, Logo, RoleBadge, cn, type IconName } from "@nodal/ui";
import type { Session } from "@/lib/session";
import { signOut } from "@/lib/actions";

export type NavItem = { label: string; href: string; icon: IconName; count?: number };

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "menu" },
  { label: "Homepage", href: "/admin/homepage", icon: "globe" },
  { label: "Services", href: "/admin/services", icon: "filter" },
  { label: "Products & solutions", href: "/admin/solutions", icon: "arrow-up-right" },
  { label: "Specialists", href: "/admin/specialists", icon: "search" },
  { label: "Consultations", href: "/admin/consultations", icon: "calendar" },
  { label: "Roles & access", href: "/admin/roles", icon: "check" },
];

export const PORTAL_NAV: NavItem[] = [
  { label: "My profile", href: "/portal/profile", icon: "search" },
  { label: "My services", href: "/portal/services", icon: "filter" },
  { label: "My portfolio", href: "/portal/portfolio", icon: "play" },
];

/** Admin / portal shell — Figma frames “Admin · …” and “Specialist portal · …”. */
export function Shell({ session, nav, active, title, subtitle, actions, children }: { session: Session; nav: NavItem[]; active: string; title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-[264px] shrink-0 flex-col gap-1 border-r border-line-subtle bg-raised px-4 py-6 tablet:flex">
        <div className="flex items-center gap-2.5 px-2 pb-5"><Logo /><RoleBadge role={session.role} /></div>
        <nav aria-label="CMS" className="flex flex-col gap-1">
          {nav.map((n) => {
            const on = n.href === active;
            return (
              <Link key={n.href} href={n.href} aria-current={on ? "page" : undefined} className={cn("relative flex items-center gap-3 rounded-md px-3 py-2.5 type-label-m transition-colors", on ? "bg-surface-3 text-fg" : "text-fg-muted hover:bg-surface-2 hover:text-fg")}>
                {on && <span className="absolute left-0 h-[18px] w-[3px] rounded-full bg-accent" />}
                <Icon name={n.icon} size={18} />
                <span className="flex-1">{n.label}</span>
                {!!n.count && <span className={cn("rounded-full px-2 py-0.5 type-mono-s", on ? "bg-accent text-on-accent" : "bg-surface-3")}>{n.count}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex items-center gap-3 rounded-md bg-surface-1 p-3">
          <span className="grid size-9 place-items-center rounded-full bg-surface-3 type-mono-s">{session.name.split(" ").map((x) => x[0]).join("")}</span>
          <div className="flex flex-1 flex-col"><span className="type-label-m">{session.name}</span><span className="type-mono-s text-fg-subtle">{session.role}</span></div>
          <form action={signOut}><button className="type-label-s text-fg-muted hover:text-fg" aria-label="Sign out">Exit</button></form>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line-subtle px-8 py-5">
          <div className="flex flex-col gap-1"><h1 className="type-h3">{title}</h1>{subtitle && <p className="type-body-s text-fg-muted">{subtitle}</p>}</div>
          <div className="flex flex-wrap items-center gap-2.5">{actions}</div>
        </header>
        <main className="flex flex-col gap-6 p-8">{children}</main>
      </div>
    </div>
  );
}

export function Card({ title, extra, children, className }: { title?: string; extra?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("flex flex-col gap-4 rounded-lg border border-line-subtle bg-surface-1 p-6", className)}>
      {(title || extra) && <div className="flex items-center justify-between gap-3">{title && <h2 className="type-h5">{title}</h2>}{extra}</div>}
      {children}
    </section>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line-subtle">
      <table className="w-full min-w-[760px] text-left">
        <thead className="bg-raised"><tr>{head.map((h) => <th key={h} className="px-5 py-3 type-mono-s font-normal text-fg-subtle">{h}</th>)}</tr></thead>
        <tbody className="[&>tr]:border-t [&>tr]:border-line-subtle [&>tr]:bg-surface-1 [&_td]:px-5 [&_td]:py-3.5 [&_td]:type-body-s [&_td]:text-fg-muted">{children}</tbody>
      </table>
    </div>
  );
}

export function Person({ initials, name, sub }: { initials: string; name: string; sub?: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-3 type-mono-s text-fg">{initials}</span>
      <span className="flex flex-col"><span className="type-label-m text-fg">{name}</span>{sub && <span className="type-body-s text-fg-subtle">{sub}</span>}</span>
    </span>
  );
}
