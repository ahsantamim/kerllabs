# Kerl Labs — website + CMS monorepo

Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · TypeScript · pnpm workspaces · Turborepo · Prisma.
Built from the Figma file *NODAL — Engineering Team Portfolio & Service Brand*. Design rules live in **[DESIGN.md](./DESIGN.md)**.

> Every person, project and product in `packages/content/src/data.ts` is fictional. Replace it before launch.

## Quick start

```bash
corepack enable                # pnpm 10
pnpm install
cp .env.example .env
pnpm dev                       # web → http://localhost:3000 · cms → http://localhost:3001
```

The CMS runs on in-memory mock data by default. Sign in at `/login` as any of the four dev users:

| User | Role | Can |
|---|---|---|
| Mira | Admin | Everything |
| Jon | Editor | Site sections, services, solutions, publishing |
| Elif | PM | Consultations, recommendations, own profile |
| Amara | Specialist | **Only** her own profile, services, portfolio, availability (`/portal`) |

## Structure

```
nodal/
├─ apps/
│  ├─ web/                    Public site (Next.js)
│  │  ├─ app/(site)/          Home, services, services/[slug], team, team/[slug], work, work/[slug], contact
│  │  ├─ app/(flow)/          Focused flows: hire/team, hire/specialist, consult, consult/recommendation
│  │  ├─ app/actions.ts       Server actions: inquiries, consultation booking (2 free per company)
│  │  ├─ components/sections/ Homepage sections (Hero, TwoWays, Consultation, Capabilities, SelectedWork, …)
│  │  ├─ components/art/      Static key-frames of the 3D scenes (HeroUniverse, Gyroscope, Parallax)
│  │  ├─ components/flow/     Multi-step hiring + consultation flows
│  │  └─ lib/                 Content access, geometry helpers
│  └─ cms/                    Admin panel + specialist portal (Next.js)
│     ├─ app/admin/           Dashboard, specialists (+review), services, solutions, homepage, consultations, roles
│     ├─ app/portal/          Specialist self-service: profile, services, portfolio
│     ├─ middleware.ts        Role guard for /admin and /portal
│     └─ lib/                 Session, permission-checked server actions, store
├─ packages/
│  ├─ tokens/                 Design tokens (TS + generated theme.css for Tailwind v4 @theme)
│  ├─ ui/                     Shared component library (Button, Field, OptionCard, SpecialistCard, Navigation, …)
│  ├─ content/                Domain types, permissions/roles, fictional sample data, ContentRepository
│  ├─ db/                     Prisma schema, Prisma-backed repository, seed
│  └─ config/                 Shared tsconfig presets
├─ DESIGN.md                  Design guide (tokens, components, motion, a11y)
└─ turbo.json
```

### Architecture

- **One design system, two apps.** `@nodal/tokens` → CSS variables (`--nd-*`) for dark + light themes, mapped to Tailwind utilities with `@theme inline`. `@nodal/ui` holds the presentational components; both apps import them.
- **Content behind an interface.** Pages call `getRepository()` from `@nodal/content`. The default is `mockRepository`. Set `NODAL_DATA_SOURCE=prisma` and register `prismaRepository` from `@nodal/db` to use Postgres:
  ```bash
  pnpm db:generate && pnpm db:migrate && pnpm db:seed
  ```
- **Permissions in one place.** `packages/content/src/permissions.ts` defines capabilities per role. `can()` and `canEditSpecialist()` are enforced in middleware **and** again inside every server action, so a specialist can't edit another profile even with a hand-crafted request.
- **Moderated publishing.** Specialist edits create a `ProfileRevision` (`in_review`). An admin approves or requests changes.
- **Dynamic homepage.** Counters (engineers, countries, services), the capabilities graph, solutions and team preview are computed from published content. Section visibility and order come from `HomepageSection`.

## Before production

- [ ] Replace the dev cookie session (`apps/cms/lib/session.ts`) with Auth.js / your SSO. Keep the `Session` shape so the guards keep working.
- [ ] Switch to Prisma + Postgres and move uploads to object storage (S3/R2).
- [ ] Wire `submitInquiry` / `bookConsultation` to email + calendar (e.g. Resend + Cal.com).
- [ ] Build the 3D scenes (M-01, M-02, M-05 in DESIGN.md) with React Three Fiber. The static key-frames shipped here are the LCP / reduced-motion fallbacks.
- [ ] Replace all fictional content, portraits and concept projects.

## Scripts

| Command | Does |
|---|---|
| `pnpm dev` / `dev:web` / `dev:cms` | Run apps |
| `pnpm build` | Build everything (Turbo cache) |
| `pnpm typecheck` | Type-check all packages |
| `pnpm db:generate` / `db:migrate` / `db:seed` | Prisma |
# kerllabs
