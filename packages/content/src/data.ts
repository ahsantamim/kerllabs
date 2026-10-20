/**
 * Sample content — every person, project and product here is FICTIONAL and exists
 * for design/demo purposes only. Replace via the CMS (or db seed) before launch.
 */
import type {
  CaseStudy, Consultation, HomepageSection, Host, ProcessStage, Service, Solution, Specialist,
} from "./types";

export const services: Service[] = [
  { slug: "ui-ux-product-design", code: "UX", name: "UI/UX Product Design", tier: "experience", summary: "Research, flows, interface and design systems that engineers can build from.", tags: ["Discovery research", "Design systems", "Prototyping"], order: 1, showOnGraph: true, connects: ["frontend"], status: "published" },
  { slug: "frontend", code: "FE", name: "Frontend", tier: "experience", summary: "Fast, accessible web apps in React and TypeScript, built on your design system.", tags: ["React / Next.js", "Accessibility", "Performance"], order: 2, showOnGraph: true, connects: ["ui-ux-product-design", "seo", "full-stack", "backend", "ai-engineering", "qa-automation"], status: "published" },
  { slug: "seo", code: "SE", name: "SEO & Web Performance", tier: "experience", summary: "Technical SEO, Core Web Vitals and content architecture that compounds.", tags: ["Technical audits", "Core Web Vitals", "Schema"], order: 3, showOnGraph: true, connects: ["frontend"], status: "published" },
  { slug: "backend", code: "BE", name: "Backend", tier: "product_logic", summary: "APIs, services and integrations designed to be boring in production.", tags: ["Go / Node / Python", "API design", "Event-driven"], order: 4, showOnGraph: true, connects: ["frontend", "full-stack", "ai-engineering", "database", "cloud", "devops"], status: "published" },
  { slug: "full-stack", code: "FS", name: "Full-Stack", tier: "product_logic", summary: "One engineer across UI, API and data for focused features and MVPs.", tags: ["End-to-end features", "MVPs", "Internal tools"], order: 5, showOnGraph: true, connects: ["frontend", "backend"], status: "published" },
  { slug: "ai-engineering", code: "AI", name: "AI Engineering", tier: "product_logic", summary: "LLM features with retrieval, evaluation and guardrails — production-grade.", tags: ["RAG", "Evals", "Agents"], order: 6, showOnGraph: true, connects: ["frontend", "backend", "database", "cloud"], status: "published" },
  { slug: "database", code: "DB", name: "Database Engineering", tier: "product_logic", summary: "Schema design, query tuning, migrations and analytics pipelines.", tags: ["Postgres", "ClickHouse", "Data modelling"], order: 7, showOnGraph: true, connects: ["ai-engineering", "backend", "cloud"], status: "published" },
  { slug: "cloud", code: "CL", name: "Cloud Engineering", tier: "infrastructure", summary: "AWS / GCP architecture, cost control and security baselines.", tags: ["AWS / GCP", "IaC", "Cost reviews"], order: 8, showOnGraph: true, connects: ["backend", "ai-engineering", "database", "devops"], status: "published" },
  { slug: "devops", code: "DO", name: "DevOps", tier: "infrastructure", summary: "CI/CD, observability and release automation your team can own.", tags: ["CI/CD", "Kubernetes", "Observability"], order: 9, showOnGraph: true, connects: ["cloud", "qa-automation", "backend"], status: "published" },
  { slug: "qa-automation", code: "QA", name: "QA Automation", tier: "infrastructure", summary: "Test strategy and automation from unit to end-to-end and load.", tags: ["Playwright", "k6", "Test strategy"], order: 10, showOnGraph: true, connects: ["devops", "frontend"], status: "published" },
];

const base = {
  links: [{ label: "GitHub", href: "#" }, { label: "LinkedIn", href: "#" }],
  status: "published" as const,
  updatedAt: "2026-10-12",
};

export const specialists: Specialist[] = [
  {
    ...base,
    slug: "amara-okafor", name: "Amara Okafor", initials: "AO", role: "AI Engineer · LLM systems & evaluation", discipline: "ai-engineering",
    headline: "I make LLM features measurable, safe and affordable to run — then leave your team able to keep them that way.",
    about: [
      "Amara has spent nine years building data-heavy products, the last four putting language models into production for search, support and document workflows. She cares about the unglamorous parts — evaluation sets, failure taxonomies, latency and cost budgets — because that is where AI features succeed or quietly fail.",
      "At NODAL she leads AI engagements and pairs closely with backend and database engineers. She is happiest embedded in a client team, writing code and leaving behind documentation people actually read.",
    ],
    location: "Lagos, Nigeria", city: "Lagos", timezone: "UTC+1", utcOffset: 1, languages: ["English", "Yoruba", "French"],
    yearsExperience: "9 years · 4 in applied ML", engagement: "20–30 hrs/week · min. 2 months", responseTime: "Usually same day",
    availability: { label: "From 1 Feb 2027", tone: "soon", hoursPerWeek: 30 }, capacity: [0, 0, 0, 0, 30, 30, 30, 30, 40, 40],
    stackTags: ["Python", "RAG", "Evals"], featured: true,
    links: [{ label: "GitHub", href: "#" }, { label: "LinkedIn", href: "#" }, { label: "Personal site", href: "#" }, { label: "Writing", href: "#" }],
    bestAt: [
      { title: "Turning a demo into a product", text: "Retrieval, guardrails and fallbacks so the feature holds up with real users." },
      { title: "Proving it works", text: "Evaluation harnesses that make quality a number your team tracks weekly." },
      { title: "Keeping the bill sane", text: "Caching, routing and model choice against a per-request budget." },
    ],
    services: [
      { id: "s1", title: "LLM evaluation audit", format: "Fixed scope · 2 weeks", description: "Find out how good your AI feature really is — and what to fix first.", deliverables: ["Evaluation set from real traffic", "Failure taxonomy + scores", "Prioritised fix plan"], cta: "book", featured: true },
      { id: "s2", title: "RAG system build", format: "Project · 6–10 weeks", description: "Search and answers over your private data, with citations and access control.", deliverables: ["Retrieval pipeline + reranking", "Permission-aware results", "Eval suite + dashboards"], cta: "discuss" },
      { id: "s3", title: "Embedded AI engineer", format: "Ongoing · 20+ hrs/week", description: "Amara joins your team, rituals and repo to ship AI features with you.", deliverables: ["Weekly demos", "Code reviews & pairing", "Handover docs"], cta: "request" },
    ],
    portfolio: [
      { id: "p1", kind: "case", title: "Fieldnote", summary: "AI research assistant for distributed field teams", role: "Lead AI engineer", contribution: "Designed retrieval over 40k field reports, built the eval suite and moved hallucinated answers into a tracked, reviewed set.", stack: ["AI", "Backend", "Frontend"], caseSlug: "fieldnote" },
      { id: "p2", kind: "case", title: "Ledgerline", summary: "Exceptions triage with LLM suggestions", role: "AI engineer (embedded)", contribution: "Added suggested matches for the analyst exceptions queue, with confidence scores and a human-approval step.", stack: ["AI", "Backend", "Database"], caseSlug: "ledgerline" },
      { id: "p3", kind: "open_source", title: "eval-kit", summary: "A small library for regression-testing LLM prompts in CI.", stack: ["Python"] },
      { id: "p4", kind: "nda", title: "Support deflection assistant", summary: "Details shared on request — client under NDA.", stack: ["AI"] },
    ],
    experience: [
      { period: "2023 — now", title: "Lead AI Engineer", org: "NODAL", summary: "Leads AI engagements; built the internal eval toolkit." },
      { period: "2020 — 2023", title: "Senior ML Engineer", org: "Series B fintech (NDA)", summary: "Search and document classification in production." },
      { period: "2017 — 2020", title: "Backend Engineer", org: "Logistics scale-up", summary: "Data pipelines and APIs for fleet operations." },
      { period: "2015 — 2017", title: "Software Engineer", org: "Digital agency", summary: "Web platforms for retail clients." },
    ],
    stack: { Languages: ["Python", "TypeScript", "SQL"], "LLM & retrieval": ["OpenAI", "Anthropic", "Llama", "pgvector", "Elasticsearch"], Evaluation: ["Custom harnesses", "LLM-as-judge", "Human review"], Infra: ["AWS", "Bedrock", "Docker", "Terraform"] },
    writing: [
      { date: "Sep 2026", title: "Building eval sets from production traffic", kind: "Article" },
      { date: "May 2026", title: "Your RAG demo is lying to you", kind: "Talk · 25 min" },
      { date: "Jan 2026", title: "Cost budgets for LLM features", kind: "Article" },
    ],
    credentials: [
      { kind: "Certification", title: "AWS Certified Machine Learning — Specialty (sample)" },
      { kind: "Education", title: "BSc Computer Science (sample)" },
      { kind: "Community", title: "Mentor, local ML meetup (sample)" },
    ],
  },
  ...([
    ["farhan-kabir", "Farhan Kabir", "FK", "Database Engineer · Postgres, ClickHouse", "database", "UTC+6", 6, "Dhaka", ["Postgres", "ClickHouse", "dbt"], true, "Available now", "now"],
    ["priya-raman", "Priya Raman", "PR", "Frontend Engineer · design systems, a11y", "frontend", "UTC+5:30", 5.5, "Pune", ["React", "TypeScript", "a11y"], true, "Available now", "now"],
    ["diego-salgado", "Diego Salgado", "DS", "Cloud & DevOps · Kubernetes, Terraform", "cloud", "UTC−5", -5, "Bogotá", ["AWS", "Terraform", "K8s"], true, "Available now", "now"],
    ["tomasz-wielgus", "Tomasz Wielgus", "TW", "Backend Engineer · Go, event-driven systems", "backend", "UTC+1", 1, "Kraków", ["Go", "Kafka"], false, "From Jan 2027", "soon"],
    ["hana-sato", "Hana Sato", "HS", "Product Designer · research & design systems", "ui-ux-product-design", "UTC+8", 8, "Singapore", ["Figma", "Research"], false, "Available now", "now"],
    ["lukas-brandt", "Lukas Brandt", "LB", "QA Automation · Playwright, k6", "qa-automation", "UTC+1", 1, "Berlin", ["Playwright", "k6"], false, "Available now", "now"],
    ["noor-haddad", "Noor Haddad", "NH", "SEO & Web Performance · Core Web Vitals", "seo", "UTC+3", 3, "Amman", ["Technical SEO", "CWV"], false, "From Mar 2027", "soon"],
  ] as const).map(([slug, name, initials, role, discipline, timezone, utcOffset, city, tags, featured, avail, tone]) => ({
    ...base,
    slug, name, initials, role, discipline, timezone, utcOffset, city,
    headline: `${role.split(" · ")[0]} at NODAL.`,
    about: [`${name} is a sample specialist profile used to demonstrate the dynamic portfolio template.`],
    location: city, languages: ["English"], yearsExperience: "8+ years", engagement: "20–40 hrs/week",
    responseTime: "Within 1 business day",
    availability: { label: avail, tone: tone as "now" | "soon", hoursPerWeek: 30 },
    capacity: tone === "now" ? [30, 30, 30, 30, 30, 30, 30, 30, 30, 30] : [0, 0, 0, 10, 20, 30, 30, 30, 30, 30],
    stackTags: [...tags], featured,
    bestAt: [], services: [], portfolio: [], experience: [], stack: {}, writing: [], credentials: [],
  })),
];

export const caseStudies: CaseStudy[] = [
  {
    slug: "ledgerline", title: "Ledgerline", summary: "Reconciliation platform for a multi-entity finance team",
    industry: "Fintech · B2B SaaS", duration: "14 weeks + 4 weeks support", engagement: "Full team · pod of 5",
    disciplines: ["Backend", "Database", "Cloud", "UI/UX"], featured: true,
    context: "In this concept, a finance team of eight reconciles payouts from three banks and two payment processors across six legal entities — mostly in spreadsheets. Matching is manual, exceptions live in email threads, and there is no audit trail an external auditor would accept.",
    constraints: [
      { title: "Data residency", text: "EU-only processing and storage" },
      { title: "Auditability", text: "Every match and override must be explainable" },
      { title: "No big-bang", text: "Run in parallel with spreadsheets for one close" },
      { title: "Small team", text: "Two analysts own day-to-day operations" },
    ],
    approach: "Event-driven matching service in Go, Postgres with partitioned ledgers, an exceptions queue designed with the analysts, and an audit trail from day one.",
    metrics: [
      { name: "Month-end close", definition: "Days from period end to signed-off books" },
      { name: "Auto-match rate", definition: "Share of transactions matched without review" },
      { name: "Exception age", definition: "Median time an exception stays open" },
    ],
  },
  { slug: "fieldnote", title: "Fieldnote", summary: "AI research assistant for distributed field teams", industry: "Research tools · AI", duration: "10 weeks", engagement: "Full team · pod of 4", disciplines: ["AI", "Backend", "Frontend"], featured: true, context: "Concept project.", constraints: [], approach: "Retrieval over field reports with citations, an evaluation suite and human review.", metrics: [] },
  { slug: "tidewater", title: "Tidewater", summary: "Fleet telemetry pipeline and live operations dashboard", industry: "Logistics", duration: "16 weeks", engagement: "Full team · pod of 5", disciplines: ["DevOps", "Database", "Frontend"], featured: true, context: "Concept project.", constraints: [], approach: "Streaming ingestion, ClickHouse and a live operations UI.", metrics: [] },
  { slug: "atlas-commerce", title: "Atlas Commerce", summary: "Headless storefront rebuild with technical SEO", industry: "Retail", duration: "12 weeks", engagement: "Full team · pod of 4", disciplines: ["Frontend", "SEO", "UI/UX"], featured: true, context: "Concept project.", constraints: [], approach: "Next.js storefront with Core Web Vitals budgets and structured data.", metrics: [] },
];

export const solutions: Solution[] = [
  { slug: "slotwise", type: "product", name: "Slotwise", summary: "Embeddable scheduling & availability API for B2B SaaS.", stack: ["Go", "Postgres"], isNew: true, publishedAt: "2026-10-12", status: "published" },
  { slug: "launchpad", type: "product", name: "Launchpad", summary: "CI/CD, observability and security baseline for new products — day one.", stack: ["Terraform", "GitHub Actions"], publishedAt: "2026-09-02", status: "published" },
  { slug: "eval-kit", type: "open_source", name: "eval-kit", summary: "Regression tests for LLM prompts that run in your CI.", stack: ["Python", "Evals"], publishedAt: "2026-08-20", status: "published" },
  { slug: "payment-reconciliation", type: "solution", name: "Payment reconciliation", summary: "Event-driven matching engine with an analyst exceptions queue.", stack: ["Backend", "Database"], publishedAt: "2026-08-01", status: "published" },
  { slug: "answers-from-field-data", type: "solution", name: "Answers from field data", summary: "Retrieval over unstructured reports with citations and access control.", stack: ["AI", "Backend"], publishedAt: "2026-07-14", status: "published" },
  { slug: "headless-commerce-seo", type: "solution", name: "Headless commerce + SEO", summary: "Fast storefronts with Core Web Vitals and technical SEO built in.", stack: ["Frontend", "SEO"], publishedAt: "2026-06-30", status: "published" },
];

export const hosts: Host[] = [
  { id: "elif", name: "Elif Demir", initials: "ED", role: "Product Manager", timezone: "UTC+3", nextSlot: "Tue 13:00", years: 11 },
  { id: "sam", name: "Sam Whitfield", initials: "SW", role: "Product Engineer", timezone: "UTC−5", nextSlot: "Wed 19:30", years: 12 },
];

export const process: ProcessStage[] = [
  { index: "01", title: "Discover", text: "Workshops, technical audit, risks and a written plan.", duration: "1 week" },
  { index: "02", title: "Define", text: "Architecture, scope, milestones and a fixed weekly cadence.", duration: "1–2 weeks" },
  { index: "03", title: "Design", text: "Flows, UI and a working prototype, validated with your users.", duration: "2–3 weeks" },
  { index: "04", title: "Build", text: "Two-week cycles, a demo every Friday, CI from day one.", duration: "6–16 weeks" },
  { index: "05", title: "Launch", text: "Load tests, security review, staged rollout and monitoring.", duration: "1–2 weeks" },
  { index: "06", title: "Evolve", text: "Handover and runbooks — or keep a specialist on retainer.", duration: "Ongoing" },
];

export const homepageSections: HomepageSection[] = [
  { id: "hero", label: "01 Hero", dataSource: "Static copy + live counters", visible: true, order: 1 },
  { id: "two-ways", label: "02 Two ways to hire", dataSource: "Static copy", visible: true, order: 2 },
  { id: "consult", label: "03 Free consultation", dataSource: "Hosts with role PM / Product engineer", visible: true, order: 3 },
  { id: "capabilities", label: "04 Capabilities graph", dataSource: "services[] where showOnGraph", visible: true, order: 4 },
  { id: "work", label: "05 Selected work", dataSource: "caseStudies[] featured (max 4)", visible: true, order: 5 },
  { id: "solutions", label: "06 Products & solutions", dataSource: "solutions[] published, newest 6", visible: true, order: 6 },
  { id: "process", label: "07 How we work", dataSource: "Static copy", visible: true, order: 7 },
  { id: "principles", label: "08 Principles", dataSource: "Static copy", visible: true, order: 8 },
  { id: "team", label: "09 Team preview", dataSource: "specialists[] featured (4)", visible: true, order: 9 },
  { id: "cta", label: "10 Final CTA", dataSource: "Static copy", visible: true, order: 10 },
];

export const consultations: Consultation[] = [
  { id: "c1", company: "ferrolabs.dev", contact: "Maya L.", when: "Tue 27 Oct 07:00", host: "Elif Demir", topic: "Team or specialist?", freeUsed: 2, status: "scheduled" },
  { id: "c2", company: "orbit-health.io", contact: "J. Mensah", when: "Tue 27 Oct 15:30", host: "Sam Whitfield", topic: "Review existing build", freeUsed: 1, status: "scheduled" },
  { id: "c3", company: "tallyhq.com", contact: "P. Novak", when: "Wed 28 Oct 09:00", host: "Elif Demir", topic: "Scope a new product", freeUsed: 1, status: "scheduled" },
  { id: "c4", company: "kitebase.co", contact: "A. Rossi", when: "Mon 19 Oct", host: "Elif Demir", topic: "Team or specialist?", freeUsed: 1, status: "recommendation_due" },
  { id: "c5", company: "loomwise.app", contact: "S. Ito", when: "Fri 16 Oct", host: "Sam Whitfield", topic: "Plan 6 months", freeUsed: 2, status: "recommendation_sent" },
];
