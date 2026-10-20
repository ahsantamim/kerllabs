import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { themeInitScript } from "@nodal/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "NODAL — Hire the whole engineering team, or one specialist", template: "%s · NODAL" },
  description:
    "A senior, distributed engineering team. Hire all of us from architecture to launch — or one specialist for the problem in front of you. Free consultation with a product manager.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh bg-base text-fg">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
