import type { ContentRepository } from "@nodal/content";
import {
  mapCaseStudy,
  mapHomepage,
  mapHost,
  mapProcess,
  mapService,
  mapSolution,
  mapSpecialist,
  specialistSelect,
  timezoneSpan,
  type SpecialistRow,
} from "./map";
import { createPublicClient } from "./public";

function unwrap<T>(result: { data: T; error: { message: string } | null }) {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}

export const supabaseRepository: ContentRepository = {
  async getStats() {
    const client = createPublicClient();
    const [specialists, services, settings] = await Promise.all([
      unwrap(await client.from("specialists").select("utc_offset").eq("status", "published")),
      unwrap(await client.from("services").select("slug").eq("status", "published")),
      unwrap(await client.from("site_settings").select("key, value")),
    ]);
    const values = Object.fromEntries((settings as { key: string; value: unknown }[]).map((row) => [row.key, row.value]));
    const unlisted = Number(values.unlisted_engineers ?? 0);
    const founded = typeof values.founded === "string" ? values.founded : "2019";
    return {
      engineers: (specialists as unknown[]).length + (Number.isFinite(unlisted) ? unlisted : 0),
      disciplines: (services as unknown[]).length,
      timezoneSpan: timezoneSpan((specialists as { utc_offset: number }[]).map((row) => Number(row.utc_offset))),
      founded,
    };
  },
  async getServices() {
    const client = createPublicClient();
    const rows = unwrap(await client.from("services").select("*").eq("status", "published").order("sort_order"));
    return (rows as Parameters<typeof mapService>[0][]).map(mapService);
  },
  async getService(slug) {
    const client = createPublicClient();
    const row = unwrap(await client.from("services").select("*").eq("slug", slug).eq("status", "published").maybeSingle());
    return row ? mapService(row) : undefined;
  },
  async getSpecialists(opts) {
    const client = createPublicClient();
    let query = client.from("specialists").select(specialistSelect).eq("status", "published");
    if (opts?.featured) query = query.eq("featured", true);
    if (opts?.discipline) query = query.eq("discipline", opts.discipline);
    const rows = unwrap(await query);
    return (rows as SpecialistRow[]).map(mapSpecialist);
  },
  async getSpecialist(slug) {
    const client = createPublicClient();
    const row = unwrap(
      await client.from("specialists").select(specialistSelect).eq("slug", slug).eq("status", "published").maybeSingle(),
    );
    return row ? mapSpecialist(row as SpecialistRow) : undefined;
  },
  async getCaseStudies() {
    const client = createPublicClient();
    const rows = unwrap(await client.from("case_studies").select("*").eq("status", "published").order("title"));
    return (rows as Parameters<typeof mapCaseStudy>[0][]).map(mapCaseStudy);
  },
  async getCaseStudy(slug) {
    const studies = await this.getCaseStudies();
    return studies.find((study) => study.slug === slug);
  },
  async getSolutions() {
    const client = createPublicClient();
    const rows = unwrap(
      await client.from("solutions").select("*").eq("status", "published").order("published_at", { ascending: false }),
    );
    return (rows as Parameters<typeof mapSolution>[0][]).map(mapSolution);
  },
  async getHosts() {
    const client = createPublicClient();
    const rows = unwrap(await client.from("hosts").select("*").order("name"));
    return (rows as Parameters<typeof mapHost>[0][]).map(mapHost);
  },
  async getProcess() {
    const client = createPublicClient();
    const rows = unwrap(await client.from("process_stages").select("*").order("sort_order"));
    return (rows as Parameters<typeof mapProcess>[0][]).map(mapProcess);
  },
  async getHomepageSections() {
    const client = createPublicClient();
    const rows = unwrap(await client.from("homepage_sections").select("*").order("sort_order"));
    return (rows as Parameters<typeof mapHomepage>[0][]).map(mapHomepage);
  },
  async getConsultations() {
    const client = createPublicClient();
    const rows = unwrap(await client.from("consultations").select("*").order("created_at"));
    const list = rows as { company_domain: string; free: boolean; id: string; contact_name: string; when_label: string; host_name: string; topic: string; status: "scheduled" | "recommendation_due" | "recommendation_sent" }[];
    const used = new Map<string, number>();
    for (const row of list) if (row.free) used.set(row.company_domain, (used.get(row.company_domain) ?? 0) + 1);
    return list.map((row) => ({
      id: row.id,
      company: row.company_domain,
      contact: row.contact_name,
      when: row.when_label,
      host: row.host_name,
      topic: row.topic,
      freeUsed: (used.get(row.company_domain) ?? 1) >= 2 ? 2 : 1,
      status: row.status,
    }));
  },
};
