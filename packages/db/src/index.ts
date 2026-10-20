/**
 * Prisma-backed implementation of ContentRepository.
 * Usage (after `pnpm db:generate && pnpm db:migrate && pnpm db:seed`):
 *   import { setRepository } from "@nodal/content";
 *   import { prismaRepository } from "@nodal/db";
 *   setRepository(prismaRepository);
 */
import { PrismaClient } from "@prisma/client";
import type { ContentRepository, Specialist } from "@nodal/content";
import { mockRepository } from "@nodal/content";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const lower = <T extends string>(s: T) => s.toLowerCase();

export const prismaRepository: ContentRepository = {
  ...mockRepository, // fall back for collections not yet migrated
  async getStats() {
    const [engineers, disciplines] = await Promise.all([
      prisma.specialist.count({ where: { status: "PUBLISHED" } }),
      prisma.service.count({ where: { status: "PUBLISHED" } }),
    ]);
    const tz = await prisma.siteSetting.findUnique({ where: { key: "timezoneSpan" } });
    return { engineers, disciplines, timezoneSpan: String(tz?.value ?? "UTC−5 → UTC+8"), founded: "2019" };
  },
  async getServices() {
    const rows = await prisma.service.findMany({ where: { status: "PUBLISHED" }, orderBy: { order: "asc" } });
    return rows.map((r) => ({ ...r, tier: lower(r.tier) as never, status: "published" as const }));
  },
  async getSpecialist(slug) {
    const s = await prisma.specialist.findUnique({
      where: { slug },
      include: { services: true, portfolio: true, experience: true, writing: true, disciplines: true },
    });
    if (!s) return undefined;
    return {
      ...s,
      discipline: s.disciplines[0]?.slug ?? "",
      city: s.location,
      availability: { label: s.availabilityLabel, tone: "soon", hoursPerWeek: s.hoursPerWeek },
      status: lower(s.status) as Specialist["status"],
      stack: s.stack as Specialist["stack"],
      bestAt: s.bestAt as Specialist["bestAt"],
      links: s.links as Specialist["links"],
      services: s.services.map((x) => ({ ...x, cta: x.cta as "book" })),
      portfolio: s.portfolio.map((p) => ({ ...p, kind: lower(p.kind) as never, role: p.role ?? undefined, contribution: p.contribution ?? undefined, caseSlug: undefined })),
      credentials: [],
      updatedAt: s.updatedAt.toISOString().slice(0, 10),
    };
  },
};
