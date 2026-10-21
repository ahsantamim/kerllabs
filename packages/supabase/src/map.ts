import type {
  CaseStudy,
  Consultation,
  HomepageSection,
  Host,
  PortfolioItem,
  ProcessStage,
  PublishStatus,
  Service,
  Solution,
  Specialist,
  SpecialistService,
} from "@nodal/content";

export const specialistSelect = `
  id, slug, name, initials, role_line, discipline, headline, about, location, timezone,
  utc_offset, city, languages, years_experience, engagement, response_time,
  availability_label, availability_tone, hours_per_week, capacity, stack_tags, featured,
  status, links, best_at, experience, stack, writing, credentials, updated_at,
  specialist_services (id, title, format, description, deliverables, cta, featured, sort_order),
  portfolio_items (id, kind, title, summary, role_line, contribution, stack, images, case_slug, nda, sort_order)
`;

type ServiceOfferRow = {
  id: string;
  title: string;
  format: string;
  description: string;
  deliverables: string[] | null;
  cta: SpecialistService["cta"];
  featured: boolean;
  sort_order: number;
};

type PortfolioRow = {
  id: string;
  kind: PortfolioItem["kind"];
  title: string;
  summary: string;
  role_line: string | null;
  contribution: string | null;
  stack: string[] | null;
  images: string[] | null;
  case_slug: string | null;
  sort_order: number;
};

export type SpecialistRow = {
  id: string;
  slug: string;
  name: string;
  initials: string;
  role_line: string;
  discipline: string;
  headline: string;
  about: string[] | null;
  location: string;
  timezone: string;
  utc_offset: number;
  city: string;
  languages: string[] | null;
  years_experience: string;
  engagement: string;
  response_time: string;
  availability_label: string;
  availability_tone: "now" | "soon";
  hours_per_week: number;
  capacity: number[] | null;
  stack_tags: string[] | null;
  featured: boolean;
  status: PublishStatus;
  links: Specialist["links"] | null;
  best_at: Specialist["bestAt"] | null;
  experience: Specialist["experience"] | null;
  stack: Specialist["stack"] | null;
  writing: Specialist["writing"] | null;
  credentials: Specialist["credentials"] | null;
  updated_at: string;
  specialist_services?: ServiceOfferRow[] | null;
  portfolio_items?: PortfolioRow[] | null;
};

const list = <T>(value: T[] | null | undefined) => value ?? [];

export function mapSpecialist(row: SpecialistRow): Specialist {
  const services = [...list(row.specialist_services)].sort((a, b) => a.sort_order - b.sort_order);
  const portfolio = [...list(row.portfolio_items)].sort((a, b) => a.sort_order - b.sort_order);
  return {
    slug: row.slug,
    name: row.name,
    initials: row.initials,
    role: row.role_line,
    discipline: row.discipline,
    headline: row.headline,
    about: list(row.about),
    location: row.location,
    timezone: row.timezone,
    utcOffset: Number(row.utc_offset),
    city: row.city,
    languages: list(row.languages),
    yearsExperience: row.years_experience,
    engagement: row.engagement,
    responseTime: row.response_time,
    availability: {
      label: row.availability_label,
      tone: row.availability_tone,
      hoursPerWeek: row.hours_per_week,
    },
    capacity: list(row.capacity),
    stackTags: list(row.stack_tags),
    featured: row.featured,
    status: row.status,
    links: list(row.links),
    bestAt: list(row.best_at),
    services: services.map((item) => ({
      id: item.id,
      title: item.title,
      format: item.format,
      description: item.description,
      deliverables: list(item.deliverables),
      cta: item.cta,
      featured: item.featured,
    })),
    portfolio: portfolio.map((item) => ({
      id: item.id,
      kind: item.kind,
      title: item.title,
      summary: item.summary,
      role: item.role_line ?? undefined,
      contribution: item.contribution ?? undefined,
      stack: list(item.stack),
      caseSlug: item.case_slug ?? undefined,
      imageUrl: item.images?.[0],
    })),
    experience: list(row.experience),
    stack: row.stack ?? {},
    writing: list(row.writing),
    credentials: list(row.credentials),
    updatedAt: row.updated_at.slice(0, 10),
  };
}

export function mapService(row: {
  slug: string;
  code: string;
  name: string;
  tier: Service["tier"];
  summary: string;
  tags: string[] | null;
  sort_order: number;
  show_on_graph: boolean;
  connects: string[] | null;
  status: PublishStatus;
}): Service {
  return {
    slug: row.slug,
    code: row.code,
    name: row.name,
    tier: row.tier,
    summary: row.summary,
    tags: list(row.tags),
    order: row.sort_order,
    showOnGraph: row.show_on_graph,
    connects: list(row.connects),
    status: row.status,
  };
}

export function mapSolution(row: {
  slug: string;
  type: Solution["type"];
  name: string;
  summary: string;
  stack: string[] | null;
  cover_url: string | null;
  is_new: boolean;
  published_at: string | null;
  status: PublishStatus;
}): Solution {
  return {
    slug: row.slug,
    type: row.type,
    name: row.name,
    summary: row.summary,
    stack: list(row.stack),
    isNew: row.is_new,
    publishedAt: row.published_at ?? "",
    status: row.status,
    coverUrl: row.cover_url ?? undefined,
  };
}

export function mapCaseStudy(row: {
  slug: string;
  title: string;
  summary: string;
  industry: string;
  duration: string;
  engagement: string;
  disciplines: string[] | null;
  context: string;
  constraints: CaseStudy["constraints"] | null;
  approach: string;
  metrics: CaseStudy["metrics"] | null;
  featured: boolean;
}): CaseStudy {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    industry: row.industry,
    duration: row.duration,
    engagement: row.engagement,
    disciplines: list(row.disciplines),
    context: row.context,
    constraints: list(row.constraints),
    approach: row.approach,
    metrics: list(row.metrics),
    featured: row.featured,
  };
}

export function mapHost(row: {
  id: string;
  name: string;
  initials: string;
  role: Host["role"];
  timezone: string;
  next_slot: string;
  years: number;
}): Host {
  return {
    id: row.id,
    name: row.name,
    initials: row.initials,
    role: row.role,
    timezone: row.timezone,
    nextSlot: row.next_slot,
    years: row.years,
  };
}

export function mapProcess(row: { id: string; title: string; body: string; duration: string }): ProcessStage {
  return { index: row.id, title: row.title, text: row.body, duration: row.duration };
}

export function mapHomepage(row: {
  id: string;
  label: string;
  data_source: string;
  visible: boolean;
  sort_order: number;
}): HomepageSection {
  return { id: row.id, label: row.label, dataSource: row.data_source, visible: row.visible, order: row.sort_order };
}

export function mapConsultation(
  row: {
    id: string;
    company_domain: string;
    contact_name: string;
    when_label: string;
    host_name: string;
    topic: string;
    status: Consultation["status"];
    free: boolean;
  },
  freeUsed: number,
): Consultation {
  return {
    id: row.id,
    company: row.company_domain,
    contact: row.contact_name,
    when: row.when_label,
    host: row.host_name,
    topic: row.topic,
    freeUsed: freeUsed >= 2 ? 2 : 1,
    status: row.status,
  };
}

export function timezoneSpan(offsets: number[]) {
  if (!offsets.length) return "UTC+0 → UTC+0";
  const fmt = (n: number) => (n < 0 ? `UTC−${Math.abs(n)}` : `UTC+${n}`);
  return `${fmt(Math.min(...offsets))} → ${fmt(Math.floor(Math.max(...offsets)))}`;
}
