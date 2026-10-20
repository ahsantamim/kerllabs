# NODAL — Design Guide

> Source of truth: Figma file **“NODAL — Engineering Team Portfolio & Service Brand”**
> (https://www.figma.com/design/Pu7ygNaXIj3bZsQnhZyJ7R). Code mirror: `packages/tokens` + `packages/ui`.
> NODAL is a **fictional placeholder brand**. All people, projects and products in samples are fictional.

---

## 1. Brand in one line

**“Engineered editorial.”** A technical journal crossed with a spatial interface: oversized, tightly-tracked
headlines; one Instrument Serif *italic* phrase per headline for voice; hairline rules; mono metadata; and only
three restrained 3D moments built from the node motif in the logo.

### Principles
| Principle | What it means in practice |
|---|---|
| Engineered editorial | Asymmetric 7/5 and 8/4 splits, numbered sections (`01 —`), mono captions, hairlines instead of boxes. |
| Depth with restraint | Three spatial scenes only (Hero, Capabilities, Final CTA). Depth comes from layering, focus and light falloff — not particles. |
| One signal colour | Ion Orange marks action, selection, progress and the light source inside 3D scenes. Never body text. |
| Honest by design | No logos, testimonials or metrics we can’t back. Sample work is labelled “Concept project · fictional”. |

### Logo
Three connected nodes (team · specialist · client) + `NODAL` wordmark (Geist SemiBold 22px, +8% tracking).
The top node is always accent. Min width 96px; clearspace = height of the mark. Component: `Brand/Logo` → `<Logo />`.

---

## 2. Colour

Dark is the default theme. Light is applied with `<html data-theme="light">`.
Every colour is a CSS variable (`--nd-*`) and a Tailwind utility via `@theme inline` (see `packages/tokens/src/theme.css`).

### 2.1 Theme tokens

| Token (Figma) | CSS var | Tailwind | Dark | Light | Use |
|---|---|---|---|---|---|
| color/bg/base | `--nd-bg-base` | `bg-base` | `#0A0A0B` | `#F4F2EE` | Page background |
| color/bg/raised | `--nd-bg-raised` | `bg-raised` | `#0F0F11` | `#FAF9F6` | Alternate section bands, sidebars |
| color/surface/1 | `--nd-surface-1` | `bg-surface-1` | `#141417` | `#FFFFFF` | Cards, inputs |
| color/surface/2 | `--nd-surface-2` | `bg-surface-2` | `#1B1B1F` | `#ECE9E3` | Hover surface, chips |
| color/surface/3 | `--nd-surface-3` | `bg-surface-3` | `#24242A` | `#E2DED6` | Pressed, icon tiles, tracks |
| color/surface/inverse | `--nd-surface-inverse` | `bg-inverse` | `#F2F1EE` | `#121214` | Selected chips, toggle knob |
| color/border/subtle | `--nd-border-subtle` | `border-line-subtle` | `#232328` | `#DEDAD2` | Hairlines, card borders |
| color/border/default | `--nd-border-default` | `border-line` | `#2E2E35` | `#CBC6BC` | Inputs, outline tags |
| color/border/strong | `--nd-border-strong` | `border-line-strong` | `#45454F` | `#A39E94` | Hover borders, secondary button |
| color/text/primary | `--nd-text-primary` | `text-fg` | `#F2F1EE` | `#121214` | Headlines, body |
| color/text/secondary | `--nd-text-secondary` | `text-fg-muted` | `#A6A5A1` | `#4F4D49` | Supporting copy |
| color/text/tertiary | `--nd-text-tertiary` | `text-fg-subtle` | `#6F6E6A` | `#86827B` | Mono metadata, hints |
| color/text/inverse | `--nd-text-inverse` | `text-fg-inverse` | `#0A0A0B` | `#F4F2EE` | Text on inverse surfaces |
| color/text/disabled | `--nd-text-disabled` | `text-fg-disabled` | `#4A4A50` | `#B5B1A9` | Disabled controls |
| **color/accent/default** | `--nd-accent` | `bg-accent` / `text-accent` | **`#FF5A1F`** | **`#E04A12`** | Primary actions, selection, progress |
| color/accent/hover | `--nd-accent-hover` | `bg-accent-hover` | `#FF7A47` | `#C93F0C` | Primary hover |
| color/accent/pressed | `--nd-accent-pressed` | `bg-accent-pressed` | `#E04812` | `#AE360A` | Primary active |
| color/accent/subtle | `--nd-accent-subtle` | `bg-accent-subtle` | `#FF5A1F` @ 12% | `#E04A12` @ 10% | Selected option tint, bleed panel |
| color/accent/on | `--nd-accent-on` | `text-on-accent` | `#0A0A0B` | `#0A0A0B` | Text/icons on accent (5.3:1+) |
| color/focus/ring | `--nd-focus-ring` | `shadow-focus` | `#FFB08F` | `#7A2A08` | 3px focus ring |
| color/status/success | `--nd-success` | `text-success` | `#3DD68C` | `#13804B` | Valid, available, published |
| color/status/error | `--nd-error` | `text-error` | `#FF6363` | `#C42B2B` | Errors, changes requested |
| color/status/warning | `--nd-warning` | `text-warning` | `#F5B841` | `#9A6A00` | Availability “from”, limits |
| color/status/success-subtle | `--nd-success-subtle` | `bg-success-subtle` | `#3DD68C` @ 12% | `#13804B` @ 10% | Badge backgrounds |
| color/status/error-subtle | `--nd-error-subtle` | `bg-error-subtle` | `#FF6363` @ 12% | `#C42B2B` @ 8% | Error summary |
| color/art/line | `--nd-art-line` | `stroke-fg` + opacity | `#F2F1EE` @ 14% | `#121214` @ 16% | 3D-art lines |
| color/art/glow | `--nd-art-glow` | — | `#FF5A1F` @ 35% | `#E04A12` @ 22% | Radial glows |

**Ratio:** 60 base / 30 surfaces / 9 text / **1 accent**. If everything is orange, nothing is.
Annotation colour (Figma only, not UI): `#1E2A4A` / `#9DB6FF`.

### 2.2 Primary button colours (quick reference)
| State | Background | Label | Icon chip |
|---|---|---|---|
| Default | `accent/default` `#FF5A1F` | `accent/on` `#0A0A0B` | chip `#0A0A0B`, icon `#FF5A1F` |
| Hover | `accent/hover` `#FF7A47` | same | icon nudges +2px ↗ (180ms) |
| Pressed | `accent/pressed` `#E04812` | same | scale 0.98 |
| Focus | default + 3px `focus/ring` | same | — |
| Disabled | `surface/3` `#24242A` | `text/disabled` `#4A4A50` | chip `surface/2` |
| Loading | default | spinner + “Sending…” | width locked |

---

## 3. Typography

| Family | Role | Source |
|---|---|---|
| **Geist** (Medium 500 / Regular 400 / SemiBold 600) | UI, display, body | `geist` npm package (`--font-geist-sans`) |
| **Instrument Serif** *Italic* 400 | One expressive phrase per headline | `@fontsource/instrument-serif` |
| **Geist Mono** Regular 400 | Metadata, kickers, labels (UPPERCASE) | `geist` (`--font-geist-mono`) |

| Style (Figma) | Utility | Size / line-height / tracking | Weight |
|---|---|---|---|
| Display/XXL | `type-display-xxl` | 136 / 0.90 / −5% | 500 |
| Display/XL | `type-display-xl` | 104 / 0.94 / −4.5% | 500 |
| Display/L | `type-display-l` | 80 / 0.98 / −4% | 500 |
| Heading/H1 | `type-h1` | 60 / 1.04 / −3% | 500 |
| Heading/H2 | `type-h2` | 44 / 1.10 / −2.5% | 500 |
| Heading/H3 | `type-h3` | 30 / 1.20 / −1.5% | 500 |
| Heading/H4 | `type-h4` | 22 / 1.30 / −1% | 500 |
| Heading/H5 | `type-h5` | 18 / 1.35 / −0.5% | 500 |
| Serif/Display Italic | `type-serif` + size | 112 / 0.95 / −2% | 400 italic |
| Serif/Quote | `type-quote` | 32 / 1.25 | 400 |
| Body/L | `type-body-l` | 20 / 1.5 / −0.5% | 400 |
| Body/M | `type-body-m` | 16 / 1.6 | 400 |
| Body/S | `type-body-s` | 14 / 1.55 | 400 |
| Label/L · M · S | `type-label-l/m/s` | 16 · 14 · 12 / 1.25 | 500 |
| Mono/M | `type-mono-m` | 13 / 1.45 / +2% UPPER | 400 |
| Mono/S | `type-mono-s` | 11 / 1.45 / +6% UPPER | 400 |
| Mobile/Display · H1 · H2 · Body | (clamp in utilities) | 48 · 36 · 28 · 16 | — |

Display/heading utilities use `clamp()` so they scale between mobile and desktop values.

**The serif move:** exactly one phrase per headline, via `<Headline text="…" emphasis="just the hard part" accent />`.
Accent-coloured only on hero/CTA/section-level statements; plain on card titles (“The *full* team”).

---

## 4. Space, radius, elevation

**Spacing (4px base):** 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160 (`Primitives/space/*`).
Desktop rhythm: **160** between major sections, **96** inside, **24** gutters.

| Radius | Value | Use |
|---|---|---|
| xs | 4 | Checkbox, kbd |
| sm | 8 | Small tiles |
| md | 12 | Inputs, slots, toasts |
| lg | 20 | Cards |
| xl | 28 | Feature panels, boards, case art |
| full | 999 | Buttons, chips, pills |

| Effect | Value |
|---|---|
| Elevation/1 | `0 8px 24px -8px rgb(0 0 0 / .35)` |
| Elevation/2 | `0 24px 64px -16px rgb(0 0 0 / .5)` (`shadow-elev-2`) — floating panels, hovered cards |
| Glow/Accent | `0 0 32px rgb(255 90 31 / .45)` (`shadow-glow`) — selected node, active step |
| Focus/Ring | `0 0 0 3px var(--nd-focus-ring)` (`shadow-focus`) |
| Blur/Glass | 24px background blur — scrolled nav |

Borders are always **1px hairlines**; 1.5px only for focus/error/selected states.

---

## 5. Layout & grid

| Breakpoint | Width | Columns | Margin | Gutter | Tailwind |
|---|---|---|---|---|---|
| Mobile | 390 | 4 | 20 | 16 | default |
| Tablet | 834 | 8 | 40 | 20 | `tablet:` |
| Desktop | 1440 (≥1280) | 12 | 80 | 24 | `desktop:` |

Container: `container-nd` (max 1440, padding 20/40/80). Content often spans **7/5** or **8/4**, rarely centred 6/6.

### Full-bleed sections (deliberate exceptions)
Only these escape the container:
1. **Consultation — FULL-BLEED LEFT.** The accent-tinted panel is anchored to the left viewport edge
   (`padding-left: max(80px, (100vw − 1280px)/2)`); the booking card stays on the grid.
2. **Selected Work — FULL-BLEED RIGHT.** The plane stage is anchored to the right edge (`width: calc(50vw + 120px)`)
   and the oversized title bleeds off the left edge; copy + tabs stay on the grid.
3. **Final CTA — FULL-BLEED CENTRE.** Horizon rings + glow are sized to 100vw and touch both edges.
Mobile: work and team carousels bleed off the right edge (`-mr-5`, snap scrolling).

---

## 6. Motion

| Token | Value | Use |
|---|---|---|
| motion/duration/instant | 100ms | Toggles, ticks |
| motion/duration/fast | 180ms | Hover, colour, focus |
| motion/duration/base | 320ms | Panels, toasts, step change, theme toggle |
| motion/duration/slow | 640ms | Section reveals, image zoom |
| motion/duration/cinematic | 1200ms | 3D camera moves |
| motion/ease/standard | `cubic-bezier(.22,1,.36,1)` | Default UI (`ease-standard`) |
| motion/ease/enter | `cubic-bezier(.16,1,.3,1)` | Reveals (`ease-enter`) |
| motion/ease/exit | `cubic-bezier(.7,0,.84,0)` | Dismissals |
| motion/ease/spatial | `cubic-bezier(.45,0,.15,1)` | Camera / plane transitions |
| motion/ease/spring | mass 1, stiffness 170, damping 26 | Hover lift, tilt |

**Rules**
- Reveal once on scroll: opacity 0→1, y 24→0, 640ms enter (`<Reveal>`).
- Depth explains hierarchy, never decoration. No constant spinning, particle storms, cursor trails or scroll-jacking.
- Text, nav and CTAs are always DOM — never inside a canvas.
- Pause render loops off-screen / tab hidden. Hero canvas ≤120 draw calls, DPR ≤1.75. Fallback image paints first (LCP).
- **Reduced motion:** identical layout and content; every 3D canvas → its static key frame; parallax/camera off; 150ms fades only (handled globally in `theme.css`).

### 3D / motion moments (spec IDs from the Figma annotations)
| ID | Section | Layers | Movement & trigger | Timing | Mobile | Build |
|---|---|---|---|---|---|---|
| M-01 | Hero — Engineering Universe | L0 DOM labels · L1 near orbits, hub rings · L2 48-node lattice (10 hubs) · L3 glow + rear orbits | Load: dolly-in 6% + 8° orbit, lattice assembles. Idle breathe ±2px. Pointer parallax ≤12px; drag orbit ±20°; scroll pulls back | 1200ms spatial; labels 320ms, 60ms stagger | Pre-rendered loop ≤600KB | Three.js/R3F InstancedMesh + Line2 + drei Html; code: `components/art/HeroUniverse.tsx` (static frame) + `Parallax` |
| M-02 | Capabilities — Connected Systems | Tilted graph plane, sphere nodes, tube edges, accent pulses on selected | Enter: fly-in by tier. Hover traces edges; click/Enter selects, camera eases 8%; unrelated dim to 38% | 900ms assemble; 480ms select; 180ms hover | Stacked tiers + bottom sheet | R3F; code: `sections/Capabilities.tsx` (2D) |
| M-03 | Selected Work — Spatial showcase | Planes z 0/−120/−240, title z −400, glow | Scroll parallax 1.0/0.8/0.6/0.4; next: planes slide + rotateY −8°, title wipe; auto-advance 7s | 720ms spatial; wipe 560ms | Swipe carousel | CSS 3D (perspective 1600px); `sections/SelectedWork.tsx` |
| M-04 | How we work — Guided motion | Connector, markers, stage copy, detail panel | Pin ~5× viewport; scroll scrubs connector; stage activates (marker 0.6→1 + glow, copy +16px) | Scrub linear; 320ms enter | Vertical timeline, no pin | GSAP ScrollTrigger / Framer `useScroll`; `sections/Process.tsx` |
| M-05 | Final CTA — Dimensional signature | 4 gyroscope rings + node triangle + light cone; horizon rings 100vw | Enter: rings assemble. Idle precession 1 rev/40s. CTA hover → rings align (State B) | 1200ms assemble; 640ms align | Static render | Three.js torus ×4 or Spline (States A/B); `art/Gyroscope.tsx` |

---

## 7. Components (Figma ↔ code)

All live in `packages/ui/src/components`. Figma component names in **bold**.

| Figma | Code | Variants / props | Notes |
|---|---|---|---|
| **Button** | `<Button variant size icon loading href>` | Primary · Secondary · Ghost · Link × L(56px) · M(44px) × Default/Hover/Pressed/Focus/Disabled/Loading | Pill radius. Trailing icon in a round chip (40/32px). One Primary per view. |
| **Tag** | `<Tag tone selected dot onClick>` | Outline · Filled · Accent × Default/Hover/Selected | Becomes a `button[aria-pressed]` when interactive (filters). |
| **Input Field** | `<TextField> <TextArea> <SelectField>` | Default/Hover/Focus/Filled/Error/Success/Disabled | Label always visible; height 52 (textarea 140); radius 12; error = 1.5px `status/error` + icon + message (`role=alert`). |
| **Option Card** | `<OptionCard type=radio\|checkbox>` | Default/Hover/Focus/Selected/Disabled | Native input inside label → whole card is the hit target, arrow-key navigation. Selected: 1.5px accent + `accent/subtle`. |
| **Checkbox** | `<Checkbox error>` | Unchecked/Checked/Focus/Error/Disabled | 20px, radius 4. |
| **Switch** | `<Switch>` | On/Off/Disabled | `role=switch`; track 40×24, knob 18. |
| **Theme Toggle** | `<ThemeToggle>` | Dark/Light × Default/Hover/Focus | 76×40; knob translates 36px (320ms); persists in `localStorage("nodal-theme")`; `themeInitScript` avoids flash. |
| **Navigation** | `<Navigation>` | Desktop Top/Scrolled · Mobile Closed/Open | Scrolled after 24px: 80% base + blur + hairline. Right side: theme · “Book a free call” · “Start a project”. |
| **Footer** | `<Footer>` | — | Decorative 320px wordmark at 7% opacity (`aria-hidden`). |
| **Section Header** | `<SectionHeader kicker title emphasis description>` | — | Kicker = 24px accent rule + Mono/S. |
| **Capability Node** | `<CapabilityNode state>` | Default/Hover/Focus/Selected/Dimmed | Selected: accent fill + glow; Dimmed 38–40%. |
| **Specialist Card** | `<SpecialistCard specialist note>` | Default/Hover/Focus | Whole card links to `/team/{slug}`; hover lifts 4px, portrait zooms 1.04 (640ms). |
| **Portrait Placeholder** | `<Portrait initials src>` | card · hero · avatar | Replace with real photography; never stock/AI faces. |
| **Case Study Card** | `<CaseStudyCard study>` | Default/Hover | Always labelled “Concept project · fictional”. UI plane shifts −8px on hover. |
| **Process Step** | `<ProcessStep state>` | Upcoming/Active/Complete | Connector fills on progress. |
| **Hiring Stepper** | `<Stepper steps current>` | Current 1–4 | Bars: done = text, current = accent, next = border. |
| **Toast** | `<Toast kind>` | Success/Error/Info | Enter 16px rise 320ms; auto-dismiss 6s; `role=status/alert`. |
| **Stat Card** | `<StatCard live>` | Default · Live counter | “AUTO” badge = computed from published content. |
| **Status Badge** | `<StatusBadge status>` | Published · Draft · In review · Changes requested · Scheduled · Archived | CMS lifecycle. |
| **Role Badge** | `<RoleBadge role>` | Admin · Editor · PM · Specialist | — |
| **Upload Dropzone** | `<Dropzone>` | Default/Drag over/Uploading/Uploaded/Error | Client-side size/type check (8MB). |
| **Admin / Nav Item** | `Shell` sidebar link | Default/Hover/Active + count | Active = 3px accent rail. |
| **Annotation / Motion Spec** | — (Figma only) | — | Handoff documentation. |
| icon/* (23) | `<Icon name>` | 24px grid, 1.6 stroke, round caps | Colour via `currentColor`. |

---

## 8. Accessibility

- Contrast: body text ≥ 4.5:1 in both themes; accent-on text 5.3:1+.
- Focus: visible 3px ring on every interactive element (`:focus-visible`).
- Forms: visible labels, `aria-invalid`, `aria-describedby`, error summary with `role=alert` that names each field; never colour alone.
- Carousels: `aria-roledescription="carousel"`, tabs, pause on hover/focus, no auto-advance under reduced motion.
- Graph: every node is a button (`aria-pressed`), detail panel is `aria-live="polite"`; list view available.
- Skip link, landmark structure, `lang`, decorative SVGs `aria-hidden`.

---

## 9. Content rules

- Never fabricate client logos, testimonials, quotes or results. Sample projects = **concept projects with fictional clients**; success metrics are listed as *definitions with targets TBD*.
- Specialist profiles in samples are fictional and labelled as such.
- Voice: plain, specific, senior. Prefer “A lead engineer replies within one business day” over superlatives.

---

## 10. Product rules encoded in the system

- **Free consultation:** 2 free 45-minute sessions **per company domain** (`FREE_CONSULTATIONS_PER_COMPANY` in `@nodal/content`), with a Product Manager or Product Engineer. Outcome: recommendation (full team / specialist / neither) + shortlist within 24h.
- **Roles:** Admin (everything) · Editor (site + catalog + publish) · PM (consultations, recommendations, own profile) · Specialist (**own** profile, services, portfolio, availability only). See `packages/content/src/permissions.ts`.
- **Publishing:** specialist edits → `in_review` → admin approves (`published`) or requests changes (`changes_requested`).
- **Dynamic sections:** hero counters, capabilities graph, products & solutions, team preview and specialist portfolios render from the CMS.
