/**
 * NODAL design tokens — source of truth mirrored from the Figma file
 * (collections "Theme / Dark", "Theme / Light", "Primitives").
 * CSS custom properties live in ./theme.css; keep both in sync.
 */
export const color = {
  dark: {
    "bg-base": "#0A0A0B",
    "bg-raised": "#0F0F11",
    "surface-1": "#141417",
    "surface-2": "#1B1B1F",
    "surface-3": "#24242A",
    "surface-inverse": "#F2F1EE",
    "border-subtle": "#232328",
    "border-default": "#2E2E35",
    "border-strong": "#45454F",
    "text-primary": "#F2F1EE",
    "text-secondary": "#A6A5A1",
    "text-tertiary": "#6F6E6A",
    "text-inverse": "#0A0A0B",
    "text-disabled": "#4A4A50",
    "accent": "#FF5A1F",
    "accent-hover": "#FF7A47",
    "accent-pressed": "#E04812",
    "accent-subtle": "rgba(255, 90, 31, 0.12)",
    "accent-on": "#0A0A0B",
    "focus-ring": "#FFB08F",
    "success": "#3DD68C",
    "error": "#FF6363",
    "warning": "#F5B841",
    "success-subtle": "rgba(61, 214, 140, 0.12)",
    "error-subtle": "rgba(255, 99, 99, 0.12)",
    "art-line": "rgba(242, 241, 238, 0.14)",
    "art-glow": "rgba(255, 90, 31, 0.35)",
  },
  light: {
    "bg-base": "#F4F2EE",
    "bg-raised": "#FAF9F6",
    "surface-1": "#FFFFFF",
    "surface-2": "#ECE9E3",
    "surface-3": "#E2DED6",
    "surface-inverse": "#121214",
    "border-subtle": "#DEDAD2",
    "border-default": "#CBC6BC",
    "border-strong": "#A39E94",
    "text-primary": "#121214",
    "text-secondary": "#4F4D49",
    "text-tertiary": "#86827B",
    "text-inverse": "#F4F2EE",
    "text-disabled": "#B5B1A9",
    "accent": "#E04A12",
    "accent-hover": "#C93F0C",
    "accent-pressed": "#AE360A",
    "accent-subtle": "rgba(224, 74, 18, 0.10)",
    "accent-on": "#0A0A0B",
    "focus-ring": "#7A2A08",
    "success": "#13804B",
    "error": "#C42B2B",
    "warning": "#9A6A00",
    "success-subtle": "rgba(19, 128, 75, 0.10)",
    "error-subtle": "rgba(196, 43, 43, 0.08)",
    "art-line": "rgba(18, 18, 20, 0.16)",
    "art-glow": "rgba(224, 74, 18, 0.22)",
  },
} as const;

export type ThemeName = keyof typeof color;
export type ColorToken = keyof (typeof color)["dark"];

export const space = [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160] as const;
export const radius = { none: 0, xs: 4, sm: 8, md: 12, lg: 20, xl: 28, full: 999 } as const;

export const font = {
  sans: '"Geist", ui-sans-serif, system-ui, sans-serif',
  serif: '"Instrument Serif", ui-serif, Georgia, serif',
  mono: '"Geist Mono", ui-monospace, SFMono-Regular, monospace',
} as const;

/** [fontSize px, lineHeight multiplier, letterSpacing em, weight, family] */
export const type = {
  "display-xxl": [136, 0.9, -0.05, 500, "sans"],
  "display-xl": [104, 0.94, -0.045, 500, "sans"],
  "display-l": [80, 0.98, -0.04, 500, "sans"],
  h1: [60, 1.04, -0.03, 500, "sans"],
  h2: [44, 1.1, -0.025, 500, "sans"],
  h3: [30, 1.2, -0.015, 500, "sans"],
  h4: [22, 1.3, -0.01, 500, "sans"],
  h5: [18, 1.35, -0.005, 500, "sans"],
  "serif-display": [112, 0.95, -0.02, 400, "serif"],
  "serif-heading": [48, 1.05, -0.01, 400, "serif"],
  "serif-quote": [32, 1.25, -0.005, 400, "serif"],
  "body-l": [20, 1.5, -0.005, 400, "sans"],
  "body-m": [16, 1.6, -0.002, 400, "sans"],
  "body-s": [14, 1.55, 0, 400, "sans"],
  "label-l": [16, 1.25, -0.002, 500, "sans"],
  "label-m": [14, 1.25, 0, 500, "sans"],
  "label-s": [12, 1.25, 0.002, 500, "sans"],
  "mono-m": [13, 1.45, 0.02, 400, "mono"],
  "mono-s": [11, 1.45, 0.06, 400, "mono"],
} as const;

export const motion = {
  duration: { instant: 100, fast: 180, base: 320, slow: 640, cinematic: 1200 },
  ease: {
    standard: "cubic-bezier(0.22, 1, 0.36, 1)",
    enter: "cubic-bezier(0.16, 1, 0.3, 1)",
    exit: "cubic-bezier(0.7, 0, 0.84, 0)",
    spatial: "cubic-bezier(0.45, 0, 0.15, 1)",
  },
} as const;

export const layout = {
  breakpoints: { mobile: 390, tablet: 834, desktop: 1440 },
  container: 1280,
  margin: { mobile: 20, tablet: 40, desktop: 80 },
  gutter: { mobile: 16, tablet: 20, desktop: 24 },
  columns: { mobile: 4, tablet: 8, desktop: 12 },
} as const;
