"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Three.js take on the web hero's "Engineering Universe": a Fibonacci node lattice with
 * nearest-neighbour edges, hub rings, tilted orbits and an accent core. Colours come from the
 * theme tokens; reduced motion renders a single still frame.
 */
const N = 48, R = 2.65;
const HUBS = [3, 8, 13, 17, 22, 27, 31, 36, 40, 45];
const ACCENT_HUB = 22;
const ORBITS: [number, number, number, boolean][] = [
  [3.6, 1.25, 0.28, false],
  [4.2, 1.38, -0.42, true],
  [3.18, 0.32, 1.05, false],
];

function fibonacciSphere(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * 2.399963;
    return new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(R);
  });
}

function nearestEdges(pts: THREE.Vector3[], k = 3) {
  const set = new Set<string>();
  pts.forEach((a, i) => {
    pts
      .map((b, j) => [j, a.distanceTo(b)] as const)
      .filter(([j]) => j !== i)
      .sort((p, q) => p[1] - q[1])
      .slice(0, k)
      .forEach(([j]) => set.add(i < j ? `${i}-${j}` : `${j}-${i}`));
  });
  return [...set].map((key) => key.split("-").map(Number) as [number, number]);
}

function spriteTexture(draw: (ctx: CanvasRenderingContext2D, s: number) => void) {
  const s = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = s;
  draw(canvas.getContext("2d")!, s);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const glowTexture = () =>
  spriteTexture((ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.45, "rgba(255,255,255,0.25)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });

const ringTexture = () =>
  spriteTexture((ctx, s) => {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, s / 2 - 4, 0, Math.PI * 2);
    ctx.stroke();
  });

function readColors() {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  return { fg: v("--nd-text-primary", "#F2F1EE"), accent: v("--nd-accent", "#FF5A1F"), bg: v("--nd-bg-base", "#0A0A0B") };
}

export function AuthUniverse({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 10, 16);
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.set(0, -0.7, 13);

    const world = new THREE.Group();
    world.rotation.set(0.42, 0.62, 0);
    scene.add(world);

    const fgMat = { line: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.35 }), node: new THREE.MeshBasicMaterial() };
    const accentLine = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9 });
    const accentNode = new THREE.MeshBasicMaterial();

    // Lattice: nodes + edges.
    const pts = fibonacciSphere(N);
    const edges = nearestEdges(pts);
    const plain = edges.filter(([a, b]) => a !== ACCENT_HUB && b !== ACCENT_HUB);
    const hot = edges.filter(([a, b]) => a === ACCENT_HUB || b === ACCENT_HUB);
    const edgeGeo = (list: [number, number][]) => new THREE.BufferGeometry().setFromPoints(list.flatMap(([a, b]) => [pts[a]!, pts[b]!]));
    world.add(new THREE.LineSegments(edgeGeo(plain), fgMat.line));
    world.add(new THREE.LineSegments(edgeGeo(hot), accentLine));

    const nodeGeo = new THREE.SphereGeometry(1, 12, 12);
    pts.forEach((p, i) => {
      const mesh = new THREE.Mesh(nodeGeo, i === ACCENT_HUB ? accentNode : fgMat.node);
      mesh.position.copy(p);
      mesh.scale.setScalar(HUBS.includes(i) ? 0.06 : 0.026);
      world.add(mesh);
    });

    // Hub rings face the camera.
    const ringTex = ringTexture();
    const ringMat = new THREE.SpriteMaterial({ map: ringTex, transparent: true, opacity: 0.4, depthWrite: false });
    const accentRingMat = new THREE.SpriteMaterial({ map: ringTex, transparent: true, opacity: 0.85, depthWrite: false });
    const rings = HUBS.map((i) => {
      const sprite = new THREE.Sprite(i === ACCENT_HUB ? accentRingMat : ringMat);
      sprite.position.copy(pts[i]!);
      sprite.scale.setScalar(0.3);
      world.add(sprite);
      return sprite;
    });

    // Orbits (one dashed), tilted like the hero art.
    const orbitMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.22 });
    const dashMat = new THREE.LineDashedMaterial({ transparent: true, opacity: 0.3, dashSize: 0.04, gapSize: 0.12 });
    const orbits = ORBITS.map(([r, a, b, dashed]) => {
      const curve = new THREE.EllipseCurve(0, 0, r, r).getPoints(200).map((p) => new THREE.Vector3(p.x, 0, p.y));
      const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(curve), dashed ? dashMat : orbitMat);
      if (dashed) line.computeLineDistances();
      line.rotation.set(a, b, 0);
      scene.add(line);
      return line;
    });

    // A satellite riding each orbit.
    const satellites = orbits.map((o, k) => {
      const m = new THREE.Mesh(nodeGeo, k === 1 ? accentNode : fgMat.node);
      m.scale.setScalar(0.045);
      o.add(m);
      return m;
    });

    // Core + ambient glow.
    const glowTex = glowTexture();
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    glow.scale.setScalar(9);
    const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    core.scale.setScalar(0.9);
    const coreDot = new THREE.Mesh(nodeGeo, accentNode);
    coreDot.scale.setScalar(0.07);
    scene.add(glow, core, coreDot);

    const applyColors = () => {
      const c = readColors();
      fgMat.line.color.set(c.fg);
      fgMat.node.color.set(c.fg);
      ringMat.color.set(c.fg);
      orbitMat.color.set(c.fg);
      dashMat.color.set(c.fg);
      accentLine.color.set(c.accent);
      accentNode.color.set(c.accent);
      accentRingMat.color.set(c.accent);
      (glow.material as THREE.SpriteMaterial).color.set(c.accent);
      (core.material as THREE.SpriteMaterial).color.set(c.accent);
      (scene.fog as THREE.Fog).color.set(c.bg);
      const light = document.documentElement.dataset.theme === "light";
      (glow.material as THREE.SpriteMaterial).blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
      (core.material as THREE.SpriteMaterial).blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    };
    applyColors();
    const themeObserver = new MutationObserver(() => {
      applyColors();
      if (reduced) render(0);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      // Keep the whole sphere + orbits in frame on narrow panels.
      camera.position.z = w / h < 1 ? 13 / Math.max(w / h, 0.6) : 13;
      camera.updateProjectionMatrix();
      if (reduced) render(0);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    // Pointer tilt (lerped), skipped for coarse pointers.
    let tx = 0, ty = 0, px = 0, py = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / innerWidth - 0.5) * 0.5;
      ty = (e.clientY / innerHeight - 0.5) * 0.35;
    };
    const finePointer = !matchMedia("(pointer: coarse)").matches;
    if (!reduced && finePointer) addEventListener("pointermove", onMove);

    function render(t: number) {
      const s = t / 1000;
      world.rotation.y = 0.62 + s * 0.12;
      px += (tx - px) * 0.05;
      py += (ty - py) * 0.05;
      scene.rotation.set(py, px, 0);
      orbits.forEach((o, k) => (o.rotation.z = s * (0.05 + k * 0.03) * (k % 2 ? -1 : 1)));
      satellites.forEach((m, k) => {
        const r = ORBITS[k]![0];
        const th = s * (0.35 - k * 0.08) + k * 2;
        m.position.set(Math.cos(th) * r, 0, Math.sin(th) * r);
      });
      const pulse = 1 + Math.sin(s * 2) * 0.08;
      core.scale.setScalar(0.9 * pulse);
      rings.forEach((r, k) => r.scale.setScalar(0.3 * (1 + Math.sin(s * 1.5 + k) * 0.06)));
      renderer.render(scene, camera);
    }

    let raf = 0;
    const loop = (t: number) => {
      render(t);
      raf = requestAnimationFrame(loop);
    };
    resize();
    if (reduced) render(0);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Sprite) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
      });
      ringTex.dispose();
      glowTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={ref} className={className} aria-hidden="true" />;
}
