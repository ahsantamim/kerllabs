import { fibonacciSphere, orbit, project, rotate } from "@/lib/geometry";

/**
 * Hero — Interactive Engineering Universe (static key frame).
 * Depth layers: L3 glow + rear orbits · L2 node lattice · L1 near orbits + hub rings · L0 DOM labels.
 * Future: replace with a Three.js / R3F scene (InstancedMesh nodes, Line2 edges) — keep this as the
 * reduced-motion / no-WebGL fallback and as the LCP image.
 */
const W = 900, C = 450, R = 265, F = 1150;
const pts3 = fibonacciSphere(48).map((p) => rotate(p, 0.42, 0.62).map((v) => v * R) as [number, number, number]);
const pts2 = pts3.map((p) => project(p, C, C, F));
const edges = (() => {
  const set = new Set<string>();
  pts3.forEach((a, i) => {
    pts3
      .map((b, j) => [j, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])] as const)
      .filter(([j]) => j !== i)
      .sort((p, q) => p[1] - q[1])
      .slice(0, 3)
      .forEach(([j]) => set.add(i < j ? `${i}-${j}` : `${j}-${i}`));
  });
  return [...set].map((k) => k.split("-").map(Number) as [number, number]);
})();
export const HUBS = [3, 8, 13, 17, 22, 27, 31, 36, 40, 45];
export const ACCENT_HUB = 22;
const op = (z: number) => 0.06 + 0.5 * ((z + R) / (2 * R));
const orbits = [
  [360, 1.25, 0.28, false],
  [420, 1.38, -0.42, true],
  [318, 0.32, 1.05, false],
].map(([r, a, b, dash]) => ({ ...orbit(r as number, a as number, b as number, C, C, F), dash: dash as boolean }));

export function hubPosition(i: number) {
  const p = pts2[i]!;
  return { x: p[0] / W, y: p[1] / W, z: p[3] };
}

export function HeroUniverseLayers() {
  return {
    back: (
      <svg viewBox={`0 0 ${W} ${W}`} className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <radialGradient id="hu-glow">
            <stop offset="0" stopColor="var(--nd-accent)" stopOpacity="0.32" />
            <stop offset="0.45" stopColor="var(--nd-accent)" stopOpacity="0.08" />
            <stop offset="1" stopColor="var(--nd-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={C} cy={C} r="430" fill="url(#hu-glow)" />
        {orbits.map((o, i) => (
          <path key={i} d={o.back} className="stroke-fg" strokeOpacity="0.12" fill="none" strokeDasharray={o.dash ? "2 6" : undefined} />
        ))}
      </svg>
    ),
    mid: (
      <svg viewBox={`0 0 ${W} ${W}`} className="absolute inset-0 size-full" aria-hidden="true">
        {edges.map(([a, b]) => {
          const hot = a === ACCENT_HUB || b === ACCENT_HUB;
          const z = (pts3[a]![2] + pts3[b]![2]) / 2;
          return (
            <line
              key={`${a}-${b}`}
              x1={pts2[a]![0]} y1={pts2[a]![1]} x2={pts2[b]![0]} y2={pts2[b]![1]}
              className={hot ? "stroke-accent" : "stroke-fg"}
              strokeOpacity={hot ? 0.9 : op(z) * 0.7}
              strokeWidth={hot ? 1.4 : 1}
            />
          );
        })}
        {pts2.map(([x, y, s, z], i) => {
          const hub = HUBS.includes(i);
          return (
            <circle
              key={i} cx={x} cy={y} r={(hub ? 5.5 : 2.2) * s}
              className={i === ACCENT_HUB ? "fill-accent" : "fill-fg"}
              fillOpacity={i === ACCENT_HUB ? 1 : hub ? Math.min(1, op(z) + 0.35) : op(z)}
            />
          );
        })}
        <defs>
          <radialGradient id="hu-core">
            <stop offset="0" stopColor="var(--nd-accent)" stopOpacity="0.9" />
            <stop offset="1" stopColor="var(--nd-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={C} cy={C} r="34" fill="url(#hu-core)" />
        <circle cx={C} cy={C} r="6" className="fill-accent" />
      </svg>
    ),
    front: (
      <svg viewBox={`0 0 ${W} ${W}`} className="absolute inset-0 size-full" aria-hidden="true">
        {orbits.map((o, i) => (
          <path key={i} d={o.front} className="stroke-fg" strokeOpacity="0.32" fill="none" strokeDasharray={o.dash ? "2 6" : undefined} />
        ))}
        {HUBS.filter((i) => pts2[i]![3] > -40).map((i) => {
          const [x, y, s] = pts2[i]!;
          return <circle key={i} cx={x} cy={y} r={5.5 * s + 7} fill="none" className={i === ACCENT_HUB ? "stroke-accent" : "stroke-fg"} strokeOpacity={i === ACCENT_HUB ? 0.8 : 0.35} />;
        })}
      </svg>
    ),
  };
}
