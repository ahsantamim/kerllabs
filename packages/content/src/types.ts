/** Domain model shared by the public site and the CMS. Mirrors packages/db/prisma/schema.prisma. */
export type PublishStatus = "draft" | "in_review" | "changes_requested" | "published" | "scheduled" | "archived";
export type Tier = "experience" | "product_logic" | "infrastructure";
export type Role = "admin" | "editor" | "pm" | "specialist";

export interface Service {
  slug: string;
  code: string; // 2-letter node code, e.g. "AI"
  name: string;
  tier: Tier;
  summary: string;
  tags: string[];
  order: number;
  showOnGraph: boolean;
  connects: string[]; // service slugs
  status: PublishStatus;
}

export interface SpecialistService {
  id: string;
  title: string;
  format: string; // "Fixed scope · 2 weeks"
  description: string;
  deliverables: string[];
  cta: "book" | "discuss" | "request";
  featured?: boolean;
}

export interface PortfolioItem {
  id: string;
  kind: "case" | "open_source" | "nda" | "talk";
  title: string;
  summary: string;
  role?: string;
  contribution?: string;
  stack: string[];
  caseSlug?: string;
  imageUrl?: string;
}

export interface Specialist {
  slug: string;
  name: string;
  initials: string;
  role: string;
  discipline: string; // service slug
  headline: string;
  about: string[];
  location: string;
  timezone: string; // "UTC+1"
  utcOffset: number;
  city: string;
  languages: string[];
  yearsExperience: string;
  engagement: string;
  responseTime: string;
  availability: { label: string; tone: "now" | "soon"; hoursPerWeek: number };
  capacity: number[]; // free hours per week for the next 10 weeks
  stackTags: string[];
  featured: boolean;
  status: PublishStatus;
  links: { label: string; href: string }[];
  bestAt: { title: string; text: string }[];
  services: SpecialistService[];
  portfolio: PortfolioItem[];
  experience: { period: string; title: string; org: string; summary: string }[];
  stack: Record<string, string[]>;
  writing: { date: string; title: string; kind: string }[];
  credentials: { kind: string; title: string }[];
  updatedAt: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  summary: string;
  industry: string;
  duration: string;
  engagement: string;
  disciplines: string[];
  context: string;
  constraints: { title: string; text: string }[];
  approach: string;
  metrics: { name: string; definition: string }[];
  featured: boolean;
}

export interface Solution {
  slug: string;
  type: "product" | "solution" | "open_source";
  name: string;
  summary: string;
  stack: string[];
  isNew?: boolean;
  publishedAt: string;
  status: PublishStatus;
  coverUrl?: string;
}

export interface Host {
  id: string;
  name: string;
  initials: string;
  role: "Product Manager" | "Product Engineer";
  timezone: string;
  nextSlot: string;
  years: number;
}

export interface ProcessStage {
  index: string;
  title: string;
  text: string;
  duration: string;
}

export interface SiteStats {
  engineers: number;
  disciplines: number;
  timezoneSpan: string;
  founded: string;
}

export interface HomepageSection {
  id: string;
  label: string;
  dataSource: string;
  visible: boolean;
  order: number;
}

export interface Consultation {
  id: string;
  company: string;
  contact: string;
  when: string;
  host: string;
  topic: string;
  freeUsed: 1 | 2;
  status: "scheduled" | "recommendation_due" | "recommendation_sent";
}

export interface ContentRepository {
  getStats(): Promise<SiteStats>;
  getServices(): Promise<Service[]>;
  getService(slug: string): Promise<Service | undefined>;
  getSpecialists(opts?: { featured?: boolean; discipline?: string }): Promise<Specialist[]>;
  getSpecialist(slug: string): Promise<Specialist | undefined>;
  getCaseStudies(): Promise<CaseStudy[]>;
  getCaseStudy(slug: string): Promise<CaseStudy | undefined>;
  getSolutions(): Promise<Solution[]>;
  getHosts(): Promise<Host[]>;
  getProcess(): Promise<ProcessStage[]>;
  getHomepageSections(): Promise<HomepageSection[]>;
  getConsultations(): Promise<Consultation[]>;
}
