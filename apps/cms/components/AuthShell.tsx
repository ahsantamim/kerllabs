import type { ReactNode } from "react";
import { Headline, Kicker, Logo } from "@nodal/ui";
import { AuthUniverse } from "./AuthUniverse";

/** Split auth layout: Three.js universe on the left (tablet+), form panel on the right. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh tablet:grid-cols-[1.1fr_1fr]">
      <aside className="relative hidden overflow-hidden border-r border-line-subtle bg-base tablet:block">
        <AuthUniverse className="absolute inset-0" />
        <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between p-10 desktop:p-14">
          <Logo />
          <div className="flex max-w-[460px] flex-col gap-4">
            <Kicker>Kerl Labs CMS</Kicker>
            <Headline
              as="p"
              text="Your specialist profile, kept in orbit."
              emphasis="kept in orbit"
              accent
              className="type-h2 text-balance"
            />
            <p className="type-body-m text-fg-muted">Manage the profile, work and availability clients see on kerllabs.com.</p>
          </div>
        </div>
      </aside>
      <main className="flex items-center justify-center px-5 py-10 tablet:px-10">
        <div className="flex w-full max-w-[440px] flex-col gap-6">
          <div className="tablet:hidden"><Logo /></div>
          {children}
        </div>
      </main>
    </div>
  );
}
