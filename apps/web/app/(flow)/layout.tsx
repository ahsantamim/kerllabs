import Link from "next/link";
import { Button, Logo, ThemeToggle } from "@nodal/ui";

/** Minimal chrome for task flows (hiring, consultation): no main nav, always an exit. */
export default function FlowLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line-subtle bg-base/90 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 tablet:px-12">
          <Link href="/" aria-label="Kerl Labs home"><Logo /></Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button href="/" variant="ghost" icon={false}>Save &amp; exit</Button>
          </div>
        </div>
      </header>
      <main id="main">{children}</main>
    </>
  );
}
