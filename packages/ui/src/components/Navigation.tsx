"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "../lib/cn";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export const siteLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Team", href: "/team" },
  { label: "Process", href: "/#process" },
  { label: "Solutions", href: "/#solutions" },
];

/**
 * Navigation — Figma `Navigation` (Desktop Top/Scrolled, Mobile Closed/Open).
 * Transparent over the hero; after 24px scroll → 78% surface + 24px backdrop blur + hairline.
 */
export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-[240ms]",
        scrolled || open ? "border-b border-line-subtle bg-base/80 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 tablet:h-20 tablet:px-10 desktop:px-12" aria-label="Main">
        <Link href="/" aria-label="NODAL home">
          <Logo />
        </Link>
        <ul className="hidden items-center gap-1 rounded-full border border-line-subtle bg-surface-1/60 p-1 desktop:flex">
          {siteLinks.map((l) => {
            const active = l.href !== "/" && !l.href.includes("#") && pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn("rounded-full px-4 py-2 type-label-m transition-colors", active ? "bg-surface-3 text-fg" : "text-fg-muted hover:text-fg")}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-2 tablet:gap-3">
          <ThemeToggle />
          <span className="hidden desktop:inline-flex">
            <Button href="/consult" variant="ghost" icon={false}>Book a free call</Button>
          </span>
          <span className="hidden tablet:inline-flex">
            <Button href="/hire/team">Start a project</Button>
          </span>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className="grid size-11 place-items-center rounded-full border border-line desktop:hidden"
          >
            <Icon name={open ? "x" : "menu"} />
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-64px)] overflow-y-auto bg-base px-5 pb-10 desktop:hidden">
          <ul className="flex flex-col">
            {[...siteLinks, { label: "Contact", href: "/contact" }].map((l, i) => (
              <li key={l.href} className="nd-stagger border-b border-line-subtle" style={{ animationDelay: `${i * 40}ms` }}>
                <Link href={l.href} className="flex items-center justify-between py-[18px] type-h3">
                  {l.label}
                  <span className="type-mono-s text-fg-subtle">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <Button href="/hire/team" size="L" fullWidth>Hire the full team</Button>
            <Button href="/team" size="L" variant="secondary" fullWidth>Find a specialist</Button>
            <Button href="/consult" size="L" variant="ghost" icon={false} fullWidth>Book a free consultation</Button>
          </div>
        </div>
      )}
    </header>
  );
}
