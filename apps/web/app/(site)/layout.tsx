import { Footer, Navigation } from "@nodal/ui";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
