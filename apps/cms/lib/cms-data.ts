import type { Consultation, HomepageSection, Service, Solution, Specialist } from "@nodal/content";
import {
  mapConsultation,
  mapHomepage,
  mapService,
  mapSolution,
  mapSpecialist,
  specialistSelect,
  type SpecialistRow,
} from "@nodal/supabase";
import { hasSupabaseEnv } from "@nodal/supabase";
import { createClient } from "@nodal/supabase/server";
import { store, type Revision } from "./store";

export type CmsSnapshot = {
  specialists: Specialist[];
  services: Service[];
  solutions: Solution[];
  homepage: HomepageSection[];
  consultations: Consultation[];
  revisions: Revision[];
  activity: [string, string][];
  unlistedEngineers: number;
  founded: string;
};

function assertOk<T>(result: { data: T; error: { message: string } | null }) {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export async function loadCms(): Promise<CmsSnapshot> {
  if (!hasSupabaseEnv()) {
    return {
      specialists: store.specialists,
      services: store.services,
      solutions: store.solutions,
      homepage: store.homepage,
      consultations: store.consultations,
      revisions: store.revisions,
      activity: store.activity,
      unlistedEngineers: 6,
      founded: "2019",
    };
  }

  const supabase = await createClient();
  const [specialists, services, solutions, homepage, consultations, revisions, activity, setting] = await Promise.all([
    supabase.from("specialists").select(specialistSelect).order("name"),
    supabase.from("services").select("*").order("sort_order"),
    supabase.from("solutions").select("*").order("published_at", { ascending: false }),
    supabase.from("homepage_sections").select("*").order("sort_order"),
    supabase.from("consultations").select("*").order("created_at", { ascending: false }),
    supabase
      .from("profile_revisions")
      .select("status, changes, note, submitted_at, specialists (slug)")
      .in("status", ["in_review", "changes_requested"])
      .order("submitted_at", { ascending: false }),
    supabase.from("activity_log").select("occurred_at, label").order("occurred_at", { ascending: false }).limit(8),
    supabase.from("site_settings").select("key, value"),
  ]);

  const specialistRows = assertOk(specialists) as SpecialistRow[];
  const consultationRows = assertOk(consultations) as {
    id: string;
    company_domain: string;
    contact_name: string;
    when_label: string;
    host_name: string;
    topic: string;
    status: Consultation["status"];
    free: boolean;
  }[];
  const used = new Map<string, number>();
  for (const row of consultationRows) {
    if (row.free) used.set(row.company_domain, (used.get(row.company_domain) ?? 0) + 1);
  }

  const settings = settingsMap(assertOk(setting) as { key: string; value: unknown }[]);
  const revisionRows = assertOk(revisions) as {
    status: Revision["status"];
    changes: Revision["changes"];
    note: string | null;
    submitted_at: string;
    specialists: { slug: string } | { slug: string }[] | null;
  }[];

  return {
    specialists: specialistRows.map(mapSpecialist),
    services: (assertOk(services) as Parameters<typeof mapService>[0][]).map(mapService),
    solutions: (assertOk(solutions) as Parameters<typeof mapSolution>[0][]).map(mapSolution),
    homepage: (assertOk(homepage) as Parameters<typeof mapHomepage>[0][]).map(mapHomepage),
    consultations: consultationRows.map((row) => mapConsultation(row, used.get(row.company_domain) ?? 1)),
    revisions: revisionRows.flatMap((row) => {
      const related = Array.isArray(row.specialists) ? row.specialists[0] : row.specialists;
      if (!related?.slug) return [];
      return [{
        slug: related.slug,
        submittedAt: row.submitted_at,
        status: row.status,
        note: row.note ?? undefined,
        changes: row.changes ?? [],
      }];
    }),
    activity: (assertOk(activity) as { occurred_at: string; label: string }[]).map((row) => [formatWhen(row.occurred_at), row.label]),
    unlistedEngineers: Number(settings.unlisted_engineers ?? 0),
    founded: typeof settings.founded === "string" ? settings.founded : "2019",
  };
}

function settingsMap(rows: { key: string; value: unknown }[]) {
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}
