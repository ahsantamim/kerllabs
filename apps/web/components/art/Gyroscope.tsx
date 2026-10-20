import { orbit, project, rotate } from "@/lib/geometry";

/** Final CTA — Dimensional Signature (static State B key frame). Rings align toward the CTA on hover. */
const W = 620, C = 310, F = 1300;
const rings = [
  [230, 1.2, 0.3, 1.6],
  [205, 1.35, -0.55, 1.2],
  [180, 0.5, 1.1, 1],
  [155, 1.5, 0.05, 0.8],
].map(([r, a, b, w]) => ({ ...orbit(r!, a!, b!, C, C, F, 200), w: w! }));
const tri = ([[0, -70, 0], [-62, 40, 20], [62, 40, -20]] as [number, number, number][]).map((p) => project(rotate(p, 0.3, 0.5), C, C, F));

export function Gyroscope({ className }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${W}`} className={className} aria-hidden="true">
      <defs>
        <radialGradient id="gy-glow">
          <stop offset="0" stopColor="var(--nd-accent)" stopOpacity="0.3" />
          <stop offset="1" stopColor="var(--nd-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r="300" fill="url(#gy-glow)" />
      {rings.map((r, i) => (
        <path key={`b${i}`} d={r.back} fill="none" className="stroke-fg" strokeOpacity="0.14" strokeWidth={r.w} />
      ))}
      {rings.map((r, i) => (
        <path key={`f${i}`} d={r.front} fill="none" className={i === 0 ? "stroke-accent" : "stroke-fg"} strokeOpacity={i === 0 ? 0.9 : 0.5} strokeWidth={r.w} />
      ))}
      <path d={`M${tri[0]![0]} ${tri[0]![1]} L${tri[1]![0]} ${tri[1]![1]} L${tri[2]![0]} ${tri[2]![1]} Z`} fill="none" className="stroke-fg" strokeOpacity="0.55" strokeWidth="1.2" />
      {tri.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === 0 ? 11 : 8} className={i === 0 ? "fill-accent" : "fill-fg"} />
      ))}
      <circle cx={tri[0]![0]} cy={tri[0]![1]} r="22" fill="none" className="stroke-accent" strokeOpacity="0.5" />
    </svg>
  );
}

/** Full-bleed horizon rings (100vw) behind the CTA. */
export function Horizon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 700" preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="hz-glow" cx="50%" cy="51%" r="62%">
          <stop offset="0" stopColor="var(--nd-accent)" stopOpacity="0.2" />
          <stop offset="1" stopColor="var(--nd-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="720" cy="360" rx="900" ry="260" fill="url(#hz-glow)" />
      {[[1000, 150, 0.16], [860, 118, 0.22], [720, 92, 0.12], [1180, 190, 0.08]].map(([rx, ry, o]) => (
        <ellipse key={rx} cx="720" cy="360" rx={rx} ry={ry} fill="none" className="stroke-fg" strokeOpacity={o} vectorEffect="non-scaling-stroke" />
      ))}
      <line x1="0" y1="360" x2="1440" y2="360" className="stroke-fg" strokeOpacity="0.1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
