import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { themeInitScript } from "@nodal/ui";
import "./globals.css";

export const metadata: Metadata = { title: { default: "Kerl Labs CMS", template: "%s · Kerl Labs CMS" }, robots: { index: false } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeInitScript }} /></head>
      <body className="min-h-dvh bg-base text-fg">{children}</body>
    </html>
  );
}
