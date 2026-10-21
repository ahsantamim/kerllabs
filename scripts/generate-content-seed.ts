/**
 * Regenerates supabase/migrations/20261021042710_seed_sample_content.sql
 * from the fictional sample content in @nodal/content.
 *
 *   pnpm --filter @nodal/db exec tsx ../../scripts/generate-content-seed.ts
 */
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sampleData } from "@nodal/content";
import type { Consultation, PublishStatus } from "@nodal/content";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = path.join(root, "supabase/migrations/20261021042710_seed_sample_content.sql");

function uuid(key: string) {
  const hex = createHash("sha256").update(`kerllabs:${key}`).digest("hex").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function dollar(value: string) {
  let tag = "seed";
  while (value.includes(`$${tag}$`)) tag += "x";
  return `$${tag}$${value}$${tag}$`;
}

function textArray(values: readonly string[]) {
  if (!values.length) return "array[]::text[]";
  return `array[${values.map((value) => dollar(value)).join(", ")}]::text[]`;
}

function intArray(values: readonly number[]) {
  if (!values.length) return "array[]::integer[]";
  return `array[${values.join(", ")}]::integer[]`;
}

function jsonb(value: unknown) {
  return `${dollar(JSON.stringify(value))}::jsonb`;
}

const lines: string[] = [];
lines.push("-- Fictional sample content copied from packages/content/src/data.ts.");
lines.push("-- Safe to load into an empty project. Replace it from the CMS before launch.");
lines.push("-- Seeded specialists have no owner; an admin or editor can edit them.");
lines.push("-- Self-registered specialists receive their own draft profile from the auth trigger.");
lines.push("");

lines.push("insert into public.services (slug, code, name, tier, summary, tags, sort_order, show_on_graph, connects, status) values");
lines.push(
  sampleData.services
    .map(
      (service) =>
        `  (${dollar(service.slug)}, ${dollar(service.code)}, ${dollar(service.name)}, ${dollar(service.tier)}::public.content_tier, ${dollar(service.summary)}, ${textArray(service.tags)}, ${service.order}, ${service.showOnGraph}, ${textArray(service.connects)}, ${dollar(service.status)}::public.publish_status)`,
    )
    .join(",\n") + ";",
);
lines.push("");

lines.push(`insert into public.specialists (
  id, slug, name, initials, role_line, discipline, headline, about, location, timezone, utc_offset, city,
  languages, years_experience, engagement, response_time, availability_label, availability_tone, hours_per_week,
  capacity, stack_tags, featured, status, links, best_at, experience, stack, writing, credentials, updated_at
) values`);
lines.push(
  sampleData.specialists
    .map((specialist) => {
      const id = uuid(`specialist:${specialist.slug}`);
      return `  ('${id}', ${dollar(specialist.slug)}, ${dollar(specialist.name)}, ${dollar(specialist.initials)}, ${dollar(specialist.role)}, ${dollar(specialist.discipline)}, ${dollar(specialist.headline)}, ${textArray(specialist.about)}, ${dollar(specialist.location)}, ${dollar(specialist.timezone)}, ${specialist.utcOffset}, ${dollar(specialist.city)}, ${textArray(specialist.languages)}, ${dollar(specialist.yearsExperience)}, ${dollar(specialist.engagement)}, ${dollar(specialist.responseTime)}, ${dollar(specialist.availability.label)}, ${dollar(specialist.availability.tone)}::public.availability_tone, ${specialist.availability.hoursPerWeek}, ${intArray(specialist.capacity)}, ${textArray(specialist.stackTags)}, ${specialist.featured}, ${dollar(specialist.status)}::public.publish_status, ${jsonb(specialist.links)}, ${jsonb(specialist.bestAt)}, ${jsonb(specialist.experience)}, ${jsonb(specialist.stack)}, ${jsonb(specialist.writing)}, ${jsonb(specialist.credentials)}, ${dollar(specialist.updatedAt)}::timestamptz)`;
    })
    .join(",\n") + ";",
);
lines.push("");

const offers = sampleData.specialists.flatMap((specialist) =>
  specialist.services.map((service, index) => ({ specialist, service, index })),
);
if (offers.length) {
  lines.push("insert into public.specialist_services (id, specialist_id, title, format, description, deliverables, cta, featured, sort_order) values");
  lines.push(
    offers
      .map(
        ({ specialist, service, index }) =>
          `  ('${uuid(`offer:${specialist.slug}:${service.id}`)}', '${uuid(`specialist:${specialist.slug}`)}', ${dollar(service.title)}, ${dollar(service.format)}, ${dollar(service.description)}, ${textArray(service.deliverables)}, ${dollar(service.cta)}, ${Boolean(service.featured)}, ${index})`,
      )
      .join(",\n") + ";",
  );
  lines.push("");
}

const portfolio = sampleData.specialists.flatMap((specialist) =>
  specialist.portfolio.map((item, index) => ({ specialist, item, index })),
);
if (portfolio.length) {
  lines.push("insert into public.portfolio_items (id, specialist_id, kind, title, summary, role_line, contribution, stack, case_slug, nda, sort_order) values");
  lines.push(
    portfolio
      .map(({ specialist, item, index }) => {
        const nda = item.kind === "nda";
        return `  ('${uuid(`portfolio:${specialist.slug}:${item.id}`)}', '${uuid(`specialist:${specialist.slug}`)}', ${dollar(item.kind)}::public.portfolio_kind, ${dollar(item.title)}, ${dollar(item.summary)}, ${item.role ? dollar(item.role) : "null"}, ${item.contribution ? dollar(item.contribution) : "null"}, ${textArray(item.stack)}, ${item.caseSlug ? dollar(item.caseSlug) : "null"}, ${nda}, ${index})`;
      })
      .join(",\n") + ";",
  );
  lines.push("");
}

lines.push("insert into public.case_studies (slug, title, summary, industry, duration, engagement, disciplines, context, constraints, approach, metrics, featured, fictional, status) values");
lines.push(
  sampleData.caseStudies
    .map(
      (study) =>
        `  (${dollar(study.slug)}, ${dollar(study.title)}, ${dollar(study.summary)}, ${dollar(study.industry)}, ${dollar(study.duration)}, ${dollar(study.engagement)}, ${textArray(study.disciplines)}, ${dollar(study.context)}, ${jsonb(study.constraints)}, ${dollar(study.approach)}, ${jsonb(study.metrics)}, ${study.featured}, true, 'published'::public.publish_status)`,
    )
    .join(",\n") + ";",
);
lines.push("");

lines.push("insert into public.solutions (slug, type, name, summary, stack, is_new, published_at, status) values");
lines.push(
  sampleData.solutions
    .map(
      (solution) =>
        `  (${dollar(solution.slug)}, ${dollar(solution.type)}::public.solution_type, ${dollar(solution.name)}, ${dollar(solution.summary)}, ${textArray(solution.stack)}, ${Boolean(solution.isNew)}, ${dollar(solution.publishedAt)}::date, ${dollar(solution.status)}::public.publish_status)`,
    )
    .join(",\n") + ";",
);
lines.push("");

lines.push("insert into public.homepage_sections (id, label, data_source, visible, sort_order) values");
lines.push(
  sampleData.homepageSections
    .map((section) => `  (${dollar(section.id)}, ${dollar(section.label)}, ${dollar(section.dataSource)}, ${section.visible}, ${section.order})`)
    .join(",\n") + ";",
);
lines.push("");

lines.push("insert into public.process_stages (id, title, body, duration, sort_order) values");
lines.push(
  sampleData.process
    .map((stage, index) => `  (${dollar(stage.index)}, ${dollar(stage.title)}, ${dollar(stage.text)}, ${dollar(stage.duration)}, ${index + 1})`)
    .join(",\n") + ";",
);
lines.push("");

lines.push("insert into public.hosts (id, name, initials, role, timezone, next_slot, years) values");
lines.push(
  sampleData.hosts
    .map((host) => `  (${dollar(host.id)}, ${dollar(host.name)}, ${dollar(host.initials)}, ${dollar(host.role)}::public.host_role, ${dollar(host.timezone)}, ${dollar(host.nextSlot)}, ${host.years})`)
    .join(",\n") + ";",
);
lines.push("");

lines.push("insert into public.site_settings (key, value) values");
lines.push(`  ('founded', ${jsonb("2019")}),`);
lines.push(`  ('unlisted_engineers', ${jsonb(6)});`);
lines.push("");

const consultations: Consultation[] = [
  ...sampleData.consultations,
  {
    id: "c1-prior",
    company: "ferrolabs.dev",
    contact: "Maya L.",
    when: "Prior session",
    host: "Elif Demir",
    topic: "Earlier working session",
    freeUsed: 2,
    status: "recommendation_sent",
  },
  {
    id: "c5-prior",
    company: "loomwise.app",
    contact: "S. Ito",
    when: "Prior session",
    host: "Sam Whitfield",
    topic: "Earlier working session",
    freeUsed: 2,
    status: "recommendation_sent",
  },
];

lines.push("insert into public.consultations (id, company_domain, contact_name, contact_email, host_name, topic, when_label, free, status) values");
lines.push(
  consultations
    .map((consultation) => {
      const email = `contact@${consultation.company}`;
      return `  ('${uuid(`consultation:${consultation.id}`)}', ${dollar(consultation.company)}, ${dollar(consultation.contact)}, ${dollar(email)}, ${dollar(consultation.host)}, ${dollar(consultation.topic)}, ${dollar(consultation.when)}, true, ${dollar(consultation.status)}::public.consultation_status)`;
    })
    .join(",\n") + ";",
);
lines.push("");

const revisions: { slug: string; submittedAt: string; status: PublishStatus; note?: string; changes: { field: string; before: string; after: string }[] }[] = [
  {
    slug: "amara-okafor",
    submittedAt: "2026-10-19",
    status: "in_review",
    changes: [
      { field: "Services", before: "RAG system build · Embedded AI engineer", after: "+ LLM evaluation audit (2-week fixed) · RAG system build · Embedded AI engineer" },
      { field: "Availability", before: "From 1 Mar 2027 · 20 hrs/week", after: "From 1 Feb 2027 · 30 hrs/week" },
    ],
  },
  {
    slug: "tomasz-wielgus",
    submittedAt: "2026-10-20",
    status: "in_review",
    changes: [{ field: "Portfolio", before: "—", after: "+ Kafka migration" }],
  },
  {
    slug: "hana-sato",
    submittedAt: "2026-10-21",
    status: "in_review",
    changes: [{ field: "Headline", before: "Product Designer at Kerl Labs.", after: "Research-led product designer." }],
  },
  {
    slug: "noor-haddad",
    submittedAt: "2026-10-15",
    status: "changes_requested",
    note: "Add one deliverable example.",
    changes: [{ field: "Services", before: "—", after: "+ Core Web Vitals sprint" }],
  },
];

lines.push("insert into public.profile_revisions (id, specialist_id, status, changes, note, submitted_at) values");
lines.push(
  revisions
    .map(
      (revision) =>
        `  ('${uuid(`revision:${revision.slug}:${revision.submittedAt}`)}', '${uuid(`specialist:${revision.slug}`)}', ${dollar(revision.status)}::public.publish_status, ${jsonb(revision.changes)}, ${revision.note ? dollar(revision.note) : "null"}, ${dollar(revision.submittedAt)}::date)`,
    )
    .join(",\n") + ";",
);
lines.push("");

const activity = [
  ["2026-10-21T10:42:00Z", "Mira published product “Slotwise” — homepage grid updated"],
  ["2026-10-21T09:15:00Z", "Elif completed consultation with ferrolabs.dev (2/2 used)"],
  ["2026-10-20T18:00:00Z", "Counter “Engineers” changed 13 → 14 (Hana Sato published)"],
];
lines.push("insert into public.activity_log (id, occurred_at, label) values");
lines.push(
  activity
    .map(([at, label], index) => `  ('${uuid(`activity:${index}`)}', ${dollar(at!)}::timestamptz, ${dollar(label!)})`)
    .join(",\n") + ";",
);
lines.push("");

writeFileSync(out, lines.join("\n"));
console.log(`Wrote ${out}`);
