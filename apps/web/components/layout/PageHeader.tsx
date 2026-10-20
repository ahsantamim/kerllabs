import { Button, Headline } from "@nodal/ui";
import Link from "next/link";
import type { ReactNode } from "react";

export function Breadcrumbs({ items }: { items: [string, string?][] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2.5 type-mono-s">
      {items.map(([label, href], i) => (
        <span key={label} className="flex items-center gap-2.5">
          {href ? <Link href={href} className="text-fg-subtle hover:text-fg">{label}</Link> : <span className="text-fg" aria-current="page">{label}</span>}
          {i < items.length - 1 && <span className="text-fg-subtle">/</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({ crumbs, title, emphasis, aside, children }: { crumbs: [string, string?][]; title: string; emphasis?: string; aside?: ReactNode; children?: ReactNode }) {
  return (
    <header className="container-nd flex flex-col gap-8 pb-16 pt-36 desktop:pt-44">
      <Breadcrumbs items={crumbs} />
      <div className="flex flex-col justify-between gap-8 desktop:flex-row desktop:items-end">
        <Headline as="h1" text={title} emphasis={emphasis} accent className="type-display-l max-w-[920px] text-balance" />
        {aside}
      </div>
      {children}
    </header>
  );
}

export function CtaBand({ title, emphasis, primary, secondary }: { title: string; emphasis: string; primary: [string, string]; secondary: [string, string] }) {
  return (
    <section className="border-t border-line-subtle bg-raised">
      <div className="container-nd flex flex-col justify-between gap-8 py-24 desktop:flex-row desktop:items-center">
        <Headline as="h2" text={title} emphasis={emphasis} accent className="type-h1 max-w-[760px]" />
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={primary[1]} primary>{primary[0]}</ButtonLink>
          <ButtonLink href={secondary[1]}>{secondary[0]}</ButtonLink>
        </div>
      </div>
    </section>
  );
}

function ButtonLink({ href, primary, children }: { href: string; primary?: boolean; children: string }) {
  return <Button href={href} size="L" variant={primary ? "primary" : "secondary"}>{children}</Button>;
}
