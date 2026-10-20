import Link from "next/link";
import { Logo } from "./Logo";

const cols = [
  ["Hire", [["Full team", "/hire/team"], ["Specialists", "/team"], ["Free consultation", "/consult"], ["Start a project", "/hire/team"]]],
  ["Explore", [["Services", "/services"], ["Selected work", "/work"], ["Process", "/#process"], ["Products & solutions", "/#solutions"]]],
  ["Company", [["About", "/#principles"], ["Careers", "/contact"], ["Contact", "/contact"], ["Accessibility", "/contact"]]],
] as const;

/** Footer — Figma `Footer`. Decorative wordmark is aria-hidden. */
export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-line-subtle bg-base">
      <div className="container-nd flex flex-col gap-16 pb-10 pt-20">
        <div className="flex flex-col justify-between gap-12 desktop:flex-row">
          <div className="flex max-w-[320px] flex-col gap-5">
            <Logo />
            <p className="type-body-m text-fg-muted">A senior engineering team for hire — whole, or one specialist at a time.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 tablet:grid-cols-4 tablet:gap-20">
            {cols.map(([h, links]) => (
              <div key={h} className="flex flex-col gap-3.5">
                <span className="type-mono-s text-fg-subtle">{h}</span>
                {links.map(([l, href]) => (
                  <Link key={l} href={href} className="type-body-m hover:text-accent">
                    {l}
                  </Link>
                ))}
              </div>
            ))}
            <div className="flex flex-col gap-3.5">
              <span className="type-mono-s text-fg-subtle">Contact</span>
              <a href="mailto:hello@kerllabs.example" className="type-body-m hover:text-accent">hello@kerllabs.example</a>
              <span className="type-body-s text-fg-muted">Replies within 1 business day</span>
            </div>
          </div>
        </div>
        <span aria-hidden="true" className="select-none text-[clamp(96px,22vw,320px)] font-medium leading-[0.8] tracking-[-0.06em] text-fg/[0.07]">
          KERL LABS
        </span>
        <div className="flex flex-col justify-between gap-4 type-body-s text-fg-subtle tablet:flex-row">
          <span>© 2026 Kerl Labs</span>
          <span className="flex gap-6">
            <Link href="/contact">Privacy</Link>
            <Link href="/contact">Terms</Link>
            <Link href="/contact">Accessibility statement</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
