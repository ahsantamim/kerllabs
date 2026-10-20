import * as data from "./data";
import type { ContentRepository } from "./types";

const published = <T extends { status: string }>(xs: T[]) => xs.filter((x) => x.status === "published");

/** In-memory repository backed by the sample data. Swap for the Prisma repository in @nodal/db. */
export const mockRepository: ContentRepository = {
  async getStats() {
    const specs = published(data.specialists);
    const offsets = specs.map((s) => s.utcOffset);
    const fmt = (n: number) => (n < 0 ? `UTC−${Math.abs(n)}` : `UTC+${n}`);
    return {
      engineers: specs.length + 6, // + engineers without public profiles yet (sample)
      disciplines: published(data.services).length,
      timezoneSpan: `${fmt(Math.min(...offsets))} → ${fmt(Math.floor(Math.max(...offsets)))}`,
      founded: "2019",
    };
  },
  async getServices() {
    return published(data.services).sort((a, b) => a.order - b.order);
  },
  async getService(slug) {
    return data.services.find((s) => s.slug === slug);
  },
  async getSpecialists(opts) {
    return published(data.specialists).filter(
      (s) => (opts?.featured ? s.featured : true) && (opts?.discipline ? s.discipline === opts.discipline : true),
    );
  },
  async getSpecialist(slug) {
    return data.specialists.find((s) => s.slug === slug);
  },
  async getCaseStudies() {
    return data.caseStudies;
  },
  async getCaseStudy(slug) {
    return data.caseStudies.find((c) => c.slug === slug);
  },
  async getSolutions() {
    return published(data.solutions).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  },
  async getHosts() {
    return data.hosts;
  },
  async getProcess() {
    return data.process;
  },
  async getHomepageSections() {
    return [...data.homepageSections].sort((a, b) => a.order - b.order);
  },
  async getConsultations() {
    return data.consultations;
  },
};
