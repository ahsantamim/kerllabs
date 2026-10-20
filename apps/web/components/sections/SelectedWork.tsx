"use client";
import { useEffect, useState } from "react";
import type { CaseStudy } from "@nodal/content";
import { Button, Icon, Kicker, Tag, UiPlane, cn } from "@nodal/ui";

/**
 * S4 · Selected Work — Spatial Project Showcase, FULL-BLEED RIGHT (motion spec M-03).
 * Copy/tabs stay on the grid; the plane stage is anchored to the viewport's right edge and the
 * oversized title bleeds off the left. CSS 3D transforms only — no WebGL needed.
 */
export function SelectedWork({ studies }: { studies: CaseStudy[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const s = studies[i]!;
  useEffect(() => {
    if (paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((i + 1) % studies.length), 7000);
    return () => clearTimeout(t);
  }, [i, paused, studies.length]);
  const go = (d: number) => setI((i + d + studies.length) % studies.length);

  return (
    <section
      className="relative overflow-hidden py-28 desktop:py-36"
      aria-roledescription="carousel"
      aria-label="Selected work"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
    >
      <div className="container-nd flex items-end justify-between gap-6">
        <div className="flex flex-col gap-4">
          <Kicker>04 — Selected work</Kicker>
          <p className="max-w-[560px] type-body-l text-fg-muted">Concept projects. Fictional clients, real engineering approaches.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="type-mono-m">{String(i + 1).padStart(2, "0")} / {String(studies.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => go(-1)} aria-label="Previous project" className="grid size-[52px] place-items-center rounded-full border border-line-strong hover:bg-surface-2"><Icon name="chev-left" /></button>
          <button type="button" onClick={() => go(1)} aria-label="Next project" className="grid size-[52px] place-items-center rounded-full bg-inverse text-fg-inverse hover:opacity-90"><Icon name="chev-right" /></button>
        </div>
      </div>

      <div className="relative mt-6 desktop:min-h-[760px]">
        {/* Oversized title — bleeds off the LEFT edge */}
        <h3 key={s.slug} aria-live="polite" className="nd-stagger ml-[0.06em] select-none px-5 text-[clamp(72px,18vw,260px)] font-medium leading-[0.9] tracking-[-0.06em] tablet:px-10 desktop:absolute desktop:-left-9 desktop:top-0 desktop:px-0">
          {s.title}
        </h3>

        {/* Plane stage — anchored to the RIGHT viewport edge */}
        <div className="pointer-events-none relative mt-8 h-[300px] overflow-hidden tablet:h-[440px] desktop:absolute desktop:right-0 desktop:top-[200px] desktop:mt-0 desktop:h-[620px] desktop:w-[calc(50vw+120px)] desktop:overflow-visible" aria-hidden="true">
          <div className="absolute -right-40 top-0 size-[1100px] rounded-full bg-[radial-gradient(closest-side,var(--nd-art-glow),transparent)] opacity-70" />
          <div key={s.slug} className="absolute inset-0 [perspective:1600px]">
            <UiPlane className="absolute left-[34%] top-[0%] w-[66%] opacity-35 transition-transform duration-[720ms] ease-spatial desktop:w-[500px] desktop:[transform:rotateY(-6deg)]" />
            <UiPlane className="absolute left-[18%] top-[10%] w-[70%] opacity-60 transition-transform duration-[720ms] ease-spatial desktop:w-[560px]" />
            <UiPlane className="absolute left-[2%] top-[22%] w-[82%] desktop:w-[700px]" />
            <span className="absolute left-[3%] top-[16%] rounded-full border border-line bg-base px-2.5 py-1.5 type-mono-s text-fg-muted">Concept project · fictional client</span>
          </div>
        </div>

        <div className="container-nd relative z-10 mt-10 desktop:mt-0 desktop:pt-[300px]">
          <div className="flex max-w-[520px] flex-col gap-7">
            <span className="type-mono-s text-fg-subtle">{s.industry} · {s.duration.split(" +")[0]}</span>
            <div className="flex flex-col gap-2">
              <span className="type-label-m">Challenge</span>
              <p className="type-body-m text-fg-muted">{s.summary}. {s.context.split(".")[0]}.</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="type-label-m">Approach</span>
              <p className="type-body-m text-fg-muted">{s.approach}</p>
            </div>
            <div className="flex flex-wrap gap-2">{s.disciplines.map((d) => <Tag key={d}>{d}</Tag>)}</div>
            <Button href={`/work/${s.slug}`} size="L" variant="secondary">Read the case study</Button>
          </div>
        </div>
      </div>

      <div className="container-nd mt-16 grid grid-cols-2 gap-6 tablet:grid-cols-4 tablet:gap-0" role="tablist">
        {studies.map((st, k) => (
          <button key={st.slug} role="tab" aria-selected={k === i} type="button" onClick={() => setI(k)} className="flex flex-col gap-2.5 pr-6 pt-5 text-left">
            <span className="relative h-0.5 w-full bg-line">
              {k === i && <span className={cn("absolute inset-y-0 left-0 bg-accent", !paused && "animate-[nd-progress_7s_linear_forwards]")} />}
            </span>
            <span className="flex items-center gap-2.5">
              <span className={cn("type-mono-s", k === i ? "text-accent" : "text-fg-subtle")}>0{k + 1}</span>
              <span className={cn("type-label-l", k === i ? "text-fg" : "text-fg-muted")}>{st.title}</span>
            </span>
            <span className="type-body-s text-fg-subtle">{st.summary}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
