# Production setup

`apps/web` is the public site. `apps/cms` is the CMS (admin and specialist portal). Both are Next.js apps and both talk to one Supabase project. The CMS signs in with Supabase Auth and writes through Row Level Security. The public site reads published rows with the publishable key.

Live Vercel projects, identified from their deployed pages:

| Vercel project | App | What it serves |
|---|---|---|
| `kerllabs` | `apps/web` | Public site at https://kerllabs.vercel.app |
| `kerllabs-pegq` | `apps/web` | The same public site on its project URL |
| `kerllabs-k4dq` | `apps/cms` | CMS. The project URL redirects to `/login` |

Set the env vars on each Vercel project, then redeploy. Apply the database migrations before the first deploy that has these variables, or the build will query tables that do not exist yet.

## 1. Apply the database migrations

From the Supabase dashboard for project `sjshiqtrkicoqwxgfufd`, open the SQL editor and run these files in order:

1. `supabase/migrations/20261021042620_init_content_schema.sql`
2. `supabase/migrations/20261021042710_seed_sample_content.sql`

Or, with the Supabase CLI logged in and linked to that project:

```bash
supabase link --project-ref sjshiqtrkicoqwxgfufd
supabase db push
```

The second file loads the fictional sample content already in the repo (services, specialists, case studies, solutions, the review queue, and sample consultations). The public site shows the published rows. Nothing in the seed creates a login.

The migration also creates a public Storage bucket named `media` (PNG, JPG, WebP, GIF, 8 MB). Admins and editors can upload anywhere in that bucket. Specialists can upload only under `specialists/{their user id}/`.

## 2. Environment variables

The apps do not use the service role key or the database password. Do not add `SUPABASE_SERVICE_ROLE_KEY` to either Vercel project. Authorization uses the signed-in user's JWT plus Row Level Security.

### Public site — `kerllabs` and `kerllabs-pegq`

| Variable | Public or secret | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Yes. `https://sjshiqtrkicoqwxgfufd.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | Yes. The `sb_publishable_...` key |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | No. Legacy JWT anon key, used only if the publishable key is unset |
| `NEXT_PUBLIC_SITE_URL` | Public | Yes. `https://kerllabs.vercel.app` on the production project. Use that project's own URL on `kerllabs-pegq` |
| `REVALIDATE_SECRET` | Secret | Yes, if publishes should show up immediately. Same random string on the CMS |

### CMS — `kerllabs-k4dq`

| Variable | Public or secret | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Yes. Same URL as the public site |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | Yes. Same publishable key |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | No. Same fallback as above |
| `NEXT_PUBLIC_SITE_URL` | Public | Yes. `https://kerllabs.vercel.app` |
| `NEXT_PUBLIC_CMS_URL` | Public | Yes. The CMS project URL, for example `https://kerllabs-k4dq.vercel.app` |
| `REVALIDATE_SECRET` | Secret | Yes. The same value as on the public site |

`REVALIDATE_SECRET` is read only on the server. After a CMS change, the CMS calls `POST {NEXT_PUBLIC_SITE_URL}/api/revalidate`. Without the secret, the public site still refreshes on its own (about every five minutes).

Generate the secret with `openssl rand -base64 32`.

Local copies of these names are in `apps/web/.env.example` and `apps/cms/.env.example`. With the Supabase variables unset, both apps keep using the in-memory sample data.

## 3. Auth settings

In the Supabase dashboard for this project:

- Authentication → URL configuration. Set Site URL to the CMS origin (`NEXT_PUBLIC_CMS_URL`). Add that origin and `http://localhost:3001` to the redirect allow list.
- Authentication → Providers → Email. For local and first-time setup, turn off "Confirm email" so a new specialist can sign in immediately. If you leave confirmation on, registration ends on the sign-in page until the person confirms.

Roles are stored in `auth.users.raw_app_meta_data.role` (`admin`, `editor`, `pm`, or `specialist`). That value is copied onto the JWT as `app_metadata.role`. The apps never trust `user_metadata` for access. Self-serve registration always becomes a specialist and creates a draft profile.

## 4. Create the first admin

1. In the Supabase dashboard, open Authentication → Users → Add user. Enter the email and a password of at least 12 characters. Turn on "Auto Confirm User". You can set the display name in user metadata as `name`. Do not put the role in user metadata.
2. Run this in the SQL editor, with the admin's email:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin')
where email = 'you@example.com';
```

A trigger copies that role onto `public.profiles`. Sign out and sign in again if that person already has a session, because the JWT keeps the previous role until it is refreshed.

The same statement with `'editor'` or `'pm'` creates those roles. Editors can change the catalog and publish. Product managers can read the consultation queue and update bookings. Specialists can edit only the profile row owned by their user id, and they cannot publish it themselves.

Creating the user before that SQL runs makes them a specialist for a moment, so they also get an unpublished draft profile. That draft stays unpublished and does not appear on the public site. You can delete it later from the CMS once you are signed in as admin.

There is no service-role call in the apps, so promoting someone is always this SQL update (or the Auth admin API, which also writes `app_metadata`).

## 5. Redeploy

Redeploy `kerllabs`, `kerllabs-pegq`, and `kerllabs-k4dq` after the variables are saved. Then sign in to the CMS with the admin user, edit a published record, and confirm the public site updates.
