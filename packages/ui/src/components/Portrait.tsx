import { cn } from "../lib/cn";

/** Portrait placeholder — initials on an accent glow. Replace with real photography (`src`). */
export function Portrait({ initials, src, alt = "", className, size = "card" }: { initials: string; src?: string; alt?: string; className?: string; size?: "card" | "hero" | "avatar" }) {
  if (src) return <img src={src} alt={alt} className={cn("object-cover", className)} />;
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-2",
        "bg-[radial-gradient(60%_70%_at_20%_40%,var(--nd-art-glow),transparent_70%)]",
        className,
      )}
      role="img"
      aria-label={alt || `${initials} portrait placeholder`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
      {size !== "avatar" && <span className="absolute left-6 top-5 type-mono-s text-fg-subtle">Portrait · replace with photo</span>}
      <span
        className={cn(
          "absolute type-serif text-fg",
          size === "avatar" ? "inset-0 grid place-items-center text-[20px]" : size === "hero" ? "bottom-6 left-6 text-[160px] leading-none" : "bottom-4 left-6 text-[110px] leading-none",
        )}
      >
        {initials}
      </span>
    </div>
  );
}
