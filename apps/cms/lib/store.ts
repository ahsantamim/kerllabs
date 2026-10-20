import { sampleData, type PublishStatus, type Specialist, type SpecialistService, type PortfolioItem } from "@nodal/content";

/**
 * In-memory store for local development (resets on restart). Production: Prisma models in @nodal/db
 * — Specialist, SpecialistService, PortfolioItem, ProfileRevision, Service, Solution, HomepageSection.
 */
type Revision = { slug: string; submittedAt: string; changes: { field: string; before: string; after: string }[]; status: PublishStatus; note?: string };
type MockUser = { id: string; name: string; email: string; passwordHash: string; role: "specialist"; specialistSlug: string };

const g = globalThis as unknown as { __nodalStore?: ReturnType<typeof init> };
function init() {
  return {
    specialists: structuredClone(sampleData.specialists) as Specialist[],
    services: structuredClone(sampleData.services),
    solutions: structuredClone(sampleData.solutions),
    homepage: structuredClone(sampleData.homepageSections),
    consultations: structuredClone(sampleData.consultations),
    users: [] as MockUser[],
    revisions: [
      { slug: "amara-okafor", submittedAt: "2026-10-19", status: "in_review", changes: [
        { field: "Services", before: "RAG system build · Embedded AI engineer", after: "+ LLM evaluation audit (2-week fixed) · RAG system build · Embedded AI engineer" },
        { field: "Availability", before: "From 1 Mar 2027 · 20 hrs/week", after: "From 1 Feb 2027 · 30 hrs/week" },
      ] },
      { slug: "tomasz-wielgus", submittedAt: "2026-10-20", status: "in_review", changes: [{ field: "Portfolio", before: "—", after: "+ Kafka migration" }] },
      { slug: "hana-sato", submittedAt: "2026-10-21", status: "in_review", changes: [{ field: "Headline", before: "Product Designer at Kerl Labs.", after: "Research-led product designer." }] },
      { slug: "noor-haddad", submittedAt: "2026-10-15", status: "changes_requested", note: "Add one deliverable example.", changes: [{ field: "Services", before: "—", after: "+ Core Web Vitals sprint" }] },
    ] as Revision[],
    activity: [
      ["10:42", "Mira published product “Slotwise” — homepage grid updated"],
      ["09:15", "Elif completed consultation with ferrolabs.dev (2/2 used)"],
      ["Yesterday", "Counter “Engineers” changed 13 → 14 (Hana Sato published)"],
    ] as [string, string][],
  };
}
export const store = (g.__nodalStore ??= init());

export const newId = () => Math.random().toString(36).slice(2, 9);
export type { MockUser, Revision, SpecialistService, PortfolioItem };
