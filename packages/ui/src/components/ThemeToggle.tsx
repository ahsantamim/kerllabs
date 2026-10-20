"use client";
import { useEffect, useState } from "react";
import { cn } from "../lib/cn";
import { Icon } from "./Icon";

const KEY = "nodal-theme";

/** Theme toggle — Figma `Theme Toggle`. Dark is default; preference persisted per browser. */
export function ThemeToggle({ className }: { className?: string }) {
  const [mode, setMode] = useState<"dark" | "light">("dark");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as "dark" | "light" | null;
      if (saved) setMode(saved);
    } catch {}
  }, []);
  const toggle = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={mode === "light"}
      aria-label={mode === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={cn("relative h-10 w-[76px] shrink-0 rounded-full border border-line bg-surface-2 transition-colors hover:border-line-strong hover:bg-surface-3", className)}
    >
      <span className={cn("absolute top-1 size-8 rounded-full bg-inverse transition-[left] duration-[320ms] ease-standard", mode === "dark" ? "left-1" : "left-[39px]")} />
      <Icon name="moon" size={16} className={cn("absolute left-3 top-3 transition-colors", mode === "dark" ? "text-fg-inverse" : "text-fg-subtle")} />
      <Icon name="sun" size={16} className={cn("absolute left-12 top-3 transition-colors", mode === "light" ? "text-fg-inverse" : "text-fg-subtle")} />
    </button>
  );
}

/** Inline script to apply the saved theme before paint (avoids a flash). Render in <head>. */
export const themeInitScript = `try{var t=localStorage.getItem("${KEY}");if(t)document.documentElement.dataset.theme=t}catch(e){}`;
