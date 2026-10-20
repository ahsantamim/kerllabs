"use client";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Pointer parallax for depth layers (max 12px, lerp 0.08). Disabled for reduced motion and coarse pointers.
 * Stand-in for the WebGL camera described in motion spec M-01.
 */
export function Parallax({ children, depth = 1, className }: { children: ReactNode; depth?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = ((e.clientX / innerWidth) - 0.5) * 24 * depth;
      ty = ((e.clientY / innerHeight) - 0.5) * 24 * depth;
    };
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [depth]);
  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
