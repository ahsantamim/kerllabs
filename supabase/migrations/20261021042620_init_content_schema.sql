-- Kerl Labs content schema.
-- Public (anon) can read published site content only.
-- Writes follow the CMS roles stored in auth.users.raw_app_meta_data.role
-- (admin, editor, pm, specialist). That claim is not user-editable.
-- Never authorize from user_metadata.

create schema if not exists private;

comment on schema private is
  'Privileged helpers. This schema is not exposed through the Data API.';

revoke all on schema private from public;
grant usage on schema private to postgres, service_role, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.app_role as enum ('admin', 'editor', 'pm', 'specialist');
create type public.publish_status as enum (
  'draft', 'in_review', 'changes_requested', 'published', 'scheduled', 'archived'
);
create type public.content_tier as enum ('experience', 'product_logic', 'infrastructure');
create type public.solution_type as enum ('product', 'solution', 'open_source');
create type public.portfolio_kind as enum ('case', 'open_source', 'nda', 'talk');
create type public.consultation_status as enum (
  'scheduled', 'recommendation_due', 'recommendation_sent', 'cancelled'
);
create type public.availability_tone as enum ('now', 'soon');
create type public.host_role as enum ('Product Manager', 'Product Engineer');
create type public.inquiry_kind as enum ('team', 'specialist', 'contact');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  name text not null,
  role public.app_role not null default 'specialist',
  created_at timestamptz not null default now()
);

comment on table public.profiles is
  'Mirror of auth.users for display. role is copied from app_metadata and is not a client-writable authorization source.';

create table public.services (
  slug text primary key,
  code text not null check (char_length(code) between 1 and 2),
  name text not null,
  tier public.content_tier not null,
  summary text not null default '',
  tags text[] not null default '{}',
  sort_order integer not null default 0,
  show_on_graph boolean not null default true,
  connects text[] not null default '{}',
  status public.publish_status not null default 'draft',
  updated_at timestamptz not null default now()
);

create table public.specialists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid unique references public.profiles (id) on delete cascade,
  slug text not null unique,
  name text not null,
  initials text not null,
  role_line text not null default '',
  discipline text not null default '',
  headline text not null default '',
  about text[] not null default '{}',
  location text not null default '',
  timezone text not null default '',
  utc_offset numeric not null default 0,
  city text not null default '',
  languages text[] not null default '{}',
  years_experience text not null default '',
  engagement text not null default '',
  response_time text not null default '',
  availability_label text not null default '',
  availability_tone public.availability_tone not null default 'soon',
  hours_per_week integer not null default 0,
  capacity integer[] not null default '{0,0,0,0,0,0,0,0,0,0}',
  stack_tags text[] not null default '{}',
  featured boolean not null default false,
  status public.publish_status not null default 'draft',
  links jsonb not null default '[]'::jsonb,
  best_at jsonb not null default '[]'::jsonb,
  experience jsonb not null default '[]'::jsonb,
  stack jsonb not null default '{}'::jsonb,
  writing jsonb not null default '[]'::jsonb,
  credentials jsonb not null default '[]'::jsonb,
  portrait_url text,
  updated_at timestamptz not null default now()
);

create table public.specialist_services (
  id uuid primary key default gen_random_uuid(),
  specialist_id uuid not null references public.specialists (id) on delete cascade,
  title text not null,
  format text not null default '',
  description text not null default '',
  deliverables text[] not null default '{}',
  cta text not null default 'book' check (cta in ('book', 'discuss', 'request')),
  featured boolean not null default false,
  sort_order integer not null default 0
);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  specialist_id uuid not null references public.specialists (id) on delete cascade,
  kind public.portfolio_kind not null default 'case',
  title text not null,
  summary text not null default '',
  role_line text,
  contribution text,
  stack text[] not null default '{}',
  images text[] not null default '{}',
  case_slug text,
  nda boolean not null default false,
  sort_order integer not null default 0
);

create table public.profile_revisions (
  id uuid primary key default gen_random_uuid(),
  specialist_id uuid not null references public.specialists (id) on delete cascade,
  status public.publish_status not null default 'in_review',
  changes jsonb not null default '[]'::jsonb check (jsonb_typeof(changes) = 'array'),
  note text,
  submitted_at date not null default current_date,
  reviewed_at timestamptz
);

create table public.case_studies (
  slug text primary key,
  title text not null,
  summary text not null default '',
  industry text not null default '',
  duration text not null default '',
  engagement text not null default '',
  disciplines text[] not null default '{}',
  context text not null default '',
  constraints jsonb not null default '[]'::jsonb,
  approach text not null default '',
  metrics jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  fictional boolean not null default true,
  status public.publish_status not null default 'draft',
  updated_at timestamptz not null default now()
);

create table public.solutions (
  slug text primary key,
  type public.solution_type not null,
  name text not null,
  summary text not null default '',
  stack text[] not null default '{}',
  cover_url text,
  is_new boolean not null default false,
  published_at date,
  status public.publish_status not null default 'draft',
  updated_at timestamptz not null default now()
);

create table public.homepage_sections (
  id text primary key,
  label text not null,
  data_source text not null default '',
  visible boolean not null default true,
  sort_order integer not null default 0
);

create table public.process_stages (
  id text primary key,
  title text not null,
  body text not null default '',
  duration text not null default '',
  sort_order integer not null default 0
);

create table public.hosts (
  id text primary key,
  name text not null,
  initials text not null,
  role public.host_role not null,
  timezone text not null,
  next_slot text not null default '',
  years integer not null default 0
);

create table public.site_settings (
  key text primary key,
  value jsonb not null
);

create table public.consultations (
  id uuid primary key default gen_random_uuid(),
  company_domain text not null,
  contact_name text not null,
  contact_email text not null,
  host_name text not null default '',
  topic text not null,
  when_label text not null default '',
  notes text not null default '',
  free boolean not null default true,
  status public.consultation_status not null default 'scheduled',
  created_at timestamptz not null default now(),
  constraint consultations_email_check check (contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint consultations_topic_check check (char_length(topic) between 1 and 200)
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  kind public.inquiry_kind not null,
  name text not null,
  email text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint inquiries_email_check check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint inquiries_payload_size check (octet_length(payload::text) < 8000)
);

create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  label text not null check (char_length(label) between 1 and 500)
);

create index services_status_order_idx on public.services (status, sort_order);
create index specialists_status_idx on public.specialists (status);
create index specialists_featured_idx on public.specialists (featured) where status = 'published';
create index specialists_owner_idx on public.specialists (owner_id);
create index specialist_services_owner_idx on public.specialist_services (specialist_id, sort_order);
create index portfolio_items_owner_idx on public.portfolio_items (specialist_id, sort_order);
create index profile_revisions_queue_idx on public.profile_revisions (specialist_id, status);
create index solutions_published_idx on public.solutions (status, published_at desc);
create index case_studies_status_idx on public.case_studies (status);
create index consultations_domain_idx on public.consultations (company_domain) where free;
create index inquiries_created_idx on public.inquiries (created_at desc);
create index activity_log_occurred_idx on public.activity_log (occurred_at desc);

-- ---------------------------------------------------------------------------
-- Authorization helpers
-- jwt_role() reads app_metadata, which only the Auth admin / SQL can set.
-- The top-level JWT "role" claim is the Postgres role (anon/authenticated) and
-- must not be used for CMS permissions.
-- ---------------------------------------------------------------------------

create or replace function public.jwt_role()
returns text
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '');
$$;

revoke all on function public.jwt_role() from public;
grant execute on function public.jwt_role() to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Private helpers
-- ---------------------------------------------------------------------------

create or replace function private.slugify(input text)
returns text
language sql
immutable
security invoker
set search_path = ''
as $$
  select trim(both '-' from regexp_replace(lower(coalesce(input, '')), '[^a-z0-9]+', '-', 'g'));
$$;

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function private.guard_specialist_update()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor text := coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '');
begin
  if actor = 'specialist' then
    new.featured := old.featured;
    new.owner_id := old.owner_id;
    new.slug := old.slug;
    new.name := old.name;
    new.initials := old.initials;
    new.discipline := old.discipline;
    if new.status in ('published', 'scheduled', 'archived') then
      new.status := old.status;
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

-- Counts free sessions without granting SELECT on consultations.
create or replace function private.free_sessions_used(target_email text)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
  from public.consultations
  where free = true
    and company_domain = lower(split_part(coalesce(target_email, ''), '@', 2))
    and lower(split_part(coalesce(target_email, ''), '@', 2)) <> '';
$$;

create or replace function private.enforce_free_consultation_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  used integer;
begin
  new.company_domain := lower(new.company_domain);
  if new.free is not true then
    return new;
  end if;
  perform pg_advisory_xact_lock(hashtext('consultation:' || new.company_domain));
  select count(*) into used
  from public.consultations
  where company_domain = new.company_domain
    and free = true;
  if used >= 2 then
    raise exception 'free consultation limit reached' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create or replace function private.assign_default_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Self-serve signup cannot choose a role. Only a role already written to
  -- raw_app_meta_data (SQL editor or Auth admin API) is preserved.
  if coalesce(new.raw_app_meta_data ->> 'role', '') not in ('admin', 'editor', 'pm', 'specialist') then
    new.raw_app_meta_data :=
      coalesce(new.raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'specialist');
  end if;
  return new;
end;
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  assigned text := new.raw_app_meta_data ->> 'role';
  display_name text;
  base_slug text;
  final_slug text;
  initials text := '';
  part text;
  suffix integer := 0;
begin
  if assigned not in ('admin', 'editor', 'pm', 'specialist') then
    assigned := 'specialist';
  end if;

  display_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    split_part(coalesce(new.email, 'specialist'), '@', 1)
  );

  insert into public.profiles (id, email, name, role)
  values (new.id, lower(coalesce(new.email, new.id::text || '@users.kerllabs.local')), display_name, assigned::public.app_role);

  if assigned = 'specialist' then
    for part in select regexp_split_to_table(display_name, '\s+') loop
      if part <> '' then
        initials := initials || upper(left(part, 1));
      end if;
    end loop;
    initials := left(coalesce(nullif(initials, ''), 'S'), 2);

    base_slug := private.slugify(display_name);
    if base_slug = '' then
      base_slug := 'specialist';
    end if;
    final_slug := base_slug;
    while exists (select 1 from public.specialists where slug = final_slug) loop
      suffix := suffix + 1;
      final_slug := base_slug || '-' || suffix::text;
    end loop;

    insert into public.specialists (
      owner_id, slug, name, initials, role_line, headline, status,
      availability_label, availability_tone, capacity
    ) values (
      new.id,
      final_slug,
      display_name,
      initials,
      'Specialist',
      'Complete your profile to introduce yourself to clients.',
      'draft',
      'Availability to be added',
      'soon',
      array[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
  end if;

  return new;
end;
$$;

create or replace function private.sync_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  next_role text := new.raw_app_meta_data ->> 'role';
begin
  if next_role in ('admin', 'editor', 'pm', 'specialist')
     and next_role is distinct from coalesce(old.raw_app_meta_data ->> 'role', '') then
    update public.profiles
    set role = next_role::public.app_role
    where id = new.id;
  end if;
  return new;
end;
$$;

revoke all on all functions in schema private from public, anon, authenticated;
grant execute on function private.free_sessions_used(text) to anon, authenticated, service_role;
grant execute on function private.enforce_free_consultation_limit() to anon, authenticated;
grant execute on function private.guard_specialist_update() to authenticated;
grant execute on function private.touch_updated_at() to authenticated;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'supabase_auth_admin') then
    grant usage on schema private to supabase_auth_admin;
    grant execute on function private.assign_default_role() to supabase_auth_admin;
    grant execute on function private.handle_new_user() to supabase_auth_admin;
    grant execute on function private.sync_profile_role() to supabase_auth_admin;
  end if;
end $$;

-- Public wrapper so the site can ask "how many free sessions has this email used?"
-- without being able to list consultations. The privileged read stays in private.
create or replace function public.free_sessions_used(target_email text)
returns integer
language sql
stable
security invoker
set search_path = ''
as $$
  select private.free_sessions_used(target_email);
$$;

revoke all on function public.free_sessions_used(text) from public;
grant execute on function public.free_sessions_used(text) to anon, authenticated, service_role;

create trigger specialists_guard
  before update on public.specialists
  for each row execute function private.guard_specialist_update();

create trigger services_touch
  before update on public.services
  for each row execute function private.touch_updated_at();

create trigger solutions_touch
  before update on public.solutions
  for each row execute function private.touch_updated_at();

create trigger case_studies_touch
  before update on public.case_studies
  for each row execute function private.touch_updated_at();

create trigger consultations_limit
  before insert on public.consultations
  for each row execute function private.enforce_free_consultation_limit();

create trigger on_auth_user_created_role
  before insert on auth.users
  for each row execute function private.assign_default_role();

create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute function private.handle_new_user();

create trigger on_auth_user_role_changed
  after update of raw_app_meta_data on auth.users
  for each row execute function private.sync_profile_role();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.specialists enable row level security;
alter table public.specialist_services enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.profile_revisions enable row level security;
alter table public.case_studies enable row level security;
alter table public.solutions enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.process_stages enable row level security;
alter table public.hosts enable row level security;
alter table public.site_settings enable row level security;
alter table public.consultations enable row level security;
alter table public.inquiries enable row level security;
alter table public.activity_log enable row level security;

create policy profiles_select on public.profiles
  for select to authenticated
  using (
    id = (select auth.uid())
    or (select public.jwt_role()) in ('admin', 'editor', 'pm')
  );

create policy services_select on public.services
  for select to anon, authenticated
  using (
    status = 'published'
    or (select public.jwt_role()) in ('admin', 'editor', 'pm')
  );

create policy services_write on public.services
  for all to authenticated
  using ((select public.jwt_role()) in ('admin', 'editor'))
  with check ((select public.jwt_role()) in ('admin', 'editor'));

create policy specialists_select on public.specialists
  for select to anon, authenticated
  using (
    status = 'published'
    or owner_id = (select auth.uid())
    or (select public.jwt_role()) in ('admin', 'editor', 'pm')
  );

create policy specialists_insert on public.specialists
  for insert to authenticated
  with check ((select public.jwt_role()) = 'admin');

create policy specialists_update on public.specialists
  for update to authenticated
  using (
    owner_id = (select auth.uid())
    or (select public.jwt_role()) in ('admin', 'editor')
  )
  with check (
    owner_id = (select auth.uid())
    or (select public.jwt_role()) in ('admin', 'editor')
  );

create policy specialists_delete on public.specialists
  for delete to authenticated
  using ((select public.jwt_role()) = 'admin');

create policy specialist_services_select on public.specialist_services
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.specialists as specialist
      where specialist.id = specialist_id
        and (
          specialist.status = 'published'
          or specialist.owner_id = (select auth.uid())
          or (select public.jwt_role()) in ('admin', 'editor', 'pm')
        )
    )
  );

create policy specialist_services_write on public.specialist_services
  for all to authenticated
  using (
    exists (
      select 1 from public.specialists as specialist
      where specialist.id = specialist_id
        and (
          specialist.owner_id = (select auth.uid())
          or (select public.jwt_role()) in ('admin', 'editor')
        )
    )
  )
  with check (
    exists (
      select 1 from public.specialists as specialist
      where specialist.id = specialist_id
        and (
          specialist.owner_id = (select auth.uid())
          or (select public.jwt_role()) in ('admin', 'editor')
        )
    )
  );

create policy portfolio_items_select on public.portfolio_items
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.specialists as specialist
      where specialist.id = specialist_id
        and (
          specialist.status = 'published'
          or specialist.owner_id = (select auth.uid())
          or (select public.jwt_role()) in ('admin', 'editor', 'pm')
        )
    )
  );

create policy portfolio_items_write on public.portfolio_items
  for all to authenticated
  using (
    exists (
      select 1 from public.specialists as specialist
        where specialist.id = specialist_id
        and (
          specialist.owner_id = (select auth.uid())
          or (select public.jwt_role()) in ('admin', 'editor')
        )
    )
  )
  with check (
    exists (
      select 1 from public.specialists as specialist
      where specialist.id = specialist_id
        and (
          specialist.owner_id = (select auth.uid())
          or (select public.jwt_role()) in ('admin', 'editor')
        )
    )
  );

create policy revisions_select on public.profile_revisions
  for select to authenticated
  using (
    (select public.jwt_role()) in ('admin', 'editor')
    or exists (
      select 1 from public.specialists as specialist
      where specialist.id = specialist_id
        and specialist.owner_id = (select auth.uid())
    )
  );

create policy revisions_insert on public.profile_revisions
  for insert to authenticated
  with check (
    (select public.jwt_role()) in ('admin', 'editor')
    or exists (
      select 1 from public.specialists as specialist
      where specialist.id = specialist_id
        and specialist.owner_id = (select auth.uid())
    )
  );

create policy revisions_update on public.profile_revisions
  for update to authenticated
  using ((select public.jwt_role()) in ('admin', 'editor'))
  with check ((select public.jwt_role()) in ('admin', 'editor'));

create policy case_studies_select on public.case_studies
  for select to anon, authenticated
  using (
    status = 'published'
    or (select public.jwt_role()) in ('admin', 'editor', 'pm')
  );

create policy case_studies_write on public.case_studies
  for all to authenticated
  using ((select public.jwt_role()) in ('admin', 'editor'))
  with check ((select public.jwt_role()) in ('admin', 'editor'));

create policy solutions_select on public.solutions
  for select to anon, authenticated
  using (
    status = 'published'
    or (select public.jwt_role()) in ('admin', 'editor', 'pm')
  );

create policy solutions_write on public.solutions
  for all to authenticated
  using ((select public.jwt_role()) in ('admin', 'editor'))
  with check ((select public.jwt_role()) in ('admin', 'editor'));

create policy homepage_select on public.homepage_sections
  for select to anon, authenticated
  using (true);

create policy homepage_write on public.homepage_sections
  for all to authenticated
  using ((select public.jwt_role()) in ('admin', 'editor'))
  with check ((select public.jwt_role()) in ('admin', 'editor'));

create policy process_select on public.process_stages
  for select to anon, authenticated
  using (true);

create policy process_write on public.process_stages
  for all to authenticated
  using ((select public.jwt_role()) in ('admin', 'editor'))
  with check ((select public.jwt_role()) in ('admin', 'editor'));

create policy hosts_select on public.hosts
  for select to anon, authenticated
  using (true);

create policy hosts_write on public.hosts
  for all to authenticated
  using ((select public.jwt_role()) in ('admin', 'editor'))
  with check ((select public.jwt_role()) in ('admin', 'editor'));

create policy settings_select on public.site_settings
  for select to anon, authenticated
  using (true);

create policy settings_write on public.site_settings
  for all to authenticated
  using ((select public.jwt_role()) in ('admin', 'editor'))
  with check ((select public.jwt_role()) in ('admin', 'editor'));

create policy consultations_select on public.consultations
  for select to authenticated
  using ((select public.jwt_role()) in ('admin', 'editor', 'pm'));

create policy consultations_public_insert on public.consultations
  for insert to anon, authenticated
  with check (
    free = true
    and status = 'scheduled'
    and company_domain = lower(split_part(contact_email, '@', 2))
    and char_length(contact_name) between 1 and 120
    and char_length(topic) between 1 and 200
    and char_length(notes) <= 2000
    and char_length(when_label) <= 120
    and char_length(host_name) <= 120
  );

create policy consultations_staff_update on public.consultations
  for update to authenticated
  using ((select public.jwt_role()) in ('admin', 'pm'))
  with check ((select public.jwt_role()) in ('admin', 'pm'));

create policy consultations_admin_delete on public.consultations
  for delete to authenticated
  using ((select public.jwt_role()) = 'admin');

create policy inquiries_select on public.inquiries
  for select to authenticated
  using ((select public.jwt_role()) in ('admin', 'editor', 'pm'));

create policy inquiries_insert on public.inquiries
  for insert to anon, authenticated
  with check (
    char_length(name) between 1 and 120
    and char_length(email) between 5 and 254
  );

create policy inquiries_admin_delete on public.inquiries
  for delete to authenticated
  using ((select public.jwt_role()) = 'admin');

create policy activity_select on public.activity_log
  for select to authenticated
  using ((select public.jwt_role()) in ('admin', 'editor', 'pm'));

create policy activity_insert on public.activity_log
  for insert to authenticated
  with check ((select public.jwt_role()) in ('admin', 'editor', 'pm', 'specialist'));

-- ---------------------------------------------------------------------------
-- Grants. RLS still decides which rows are visible.
-- Cloud projects also grant via default privileges; revoke the sensitive ones.
-- ---------------------------------------------------------------------------

grant select on
  public.services,
  public.specialists,
  public.specialist_services,
  public.portfolio_items,
  public.case_studies,
  public.solutions,
  public.homepage_sections,
  public.process_stages,
  public.hosts,
  public.site_settings
to anon, authenticated;

grant select, insert, update, delete on
  public.services,
  public.specialists,
  public.specialist_services,
  public.portfolio_items,
  public.profile_revisions,
  public.case_studies,
  public.solutions,
  public.homepage_sections,
  public.process_stages,
  public.hosts,
  public.site_settings,
  public.consultations,
  public.inquiries,
  public.activity_log,
  public.profiles
to authenticated;

revoke all on table
  public.profiles,
  public.profile_revisions,
  public.consultations,
  public.inquiries,
  public.activity_log
from anon;

grant insert on table public.consultations, public.inquiries to anon;

revoke insert, update, delete on table
  public.services,
  public.specialists,
  public.specialist_services,
  public.portfolio_items,
  public.case_studies,
  public.solutions,
  public.homepage_sections,
  public.process_stages,
  public.hosts,
  public.site_settings
from anon;

-- ---------------------------------------------------------------------------
-- Storage: public read of the media bucket, writes by role.
-- Upsert needs insert + select + update.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  8388608,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy media_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

create policy media_staff_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'media'
    and (select public.jwt_role()) in ('admin', 'editor')
  );

create policy media_specialist_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'media'
    and (select public.jwt_role()) = 'specialist'
    and (storage.foldername(name))[1] = 'specialists'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );

create policy media_staff_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'media'
    and (select public.jwt_role()) in ('admin', 'editor')
  )
  with check (
    bucket_id = 'media'
    and (select public.jwt_role()) in ('admin', 'editor')
  );

create policy media_specialist_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'media'
    and owner = (select auth.uid())
    and (select public.jwt_role()) = 'specialist'
  )
  with check (
    bucket_id = 'media'
    and owner = (select auth.uid())
    and (storage.foldername(name))[1] = 'specialists'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );

create policy media_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'media'
    and (
      (select public.jwt_role()) in ('admin', 'editor')
      or (
        owner = (select auth.uid())
        and (select public.jwt_role()) = 'specialist'
      )
    )
  );
