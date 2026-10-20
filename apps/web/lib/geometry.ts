/**
 * Projection helpers used to draw the static key frames of the 3D moments.
 * The same math was used to generate the Figma art; a Three.js scene can replace these later.
 */
export type V3 = [number, number, number];

export function rotate([x, y, z]: V3, a: number, b: number): V3 {
  const y1 = y * Math.cos(a) - z * Math.sin(a);
  const z1 = y * Math.sin(a) + z * Math.cos(a);
  return [x * Math.cos(b) + z1 * Math.sin(b), y1, -x * Math.sin(b) + z1 * Math.cos(b)];
}

export function project([x, y, z]: V3, cx: number, cy: number, f: number): [number, number, number, number] {
  const s = f / (f - z);
  return [cx + x * s, cy + y * s, s, z];
}

export function fibonacciSphere(n: number): V3[] {
  const pts: V3[] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * 2.399963;
    pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }
  return pts;
}

/** Splits a tilted circle into back (z<0) and front (z>0) SVG path strings. */
export function orbit(R: number, a: number, b: number, cx: number, cy: number, f: number, steps = 180) {
  let back = "";
  let front = "";
  let prev: boolean | null = null;
  for (let s = 0; s <= steps; s++) {
    const th = (s / steps) * Math.PI * 2;
    const p = rotate([R * Math.cos(th), 0, R * Math.sin(th)], a, b);
    const [x, y] = project(p, cx, cy, f);
    const isF = p[2] > 0;
    const seg = `${x.toFixed(1)} ${y.toFixed(1)}`;
    if (isF) front += (prev === true ? " L" : " M") + seg;
    else back += (prev === false ? " L" : " M") + seg;
    prev = isF;
  }
  return { back: back.trim(), front: front.trim() };
}
