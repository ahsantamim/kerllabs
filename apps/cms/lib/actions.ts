"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { can, canEditSpecialist } from "@nodal/content";
import { sampleData } from "@nodal/content";
import { DEV_USERS, SESSION_COOKIE, getSession } from "./session";
import { createSessionToken } from "./session-token";
import { hashPassword, verifyPassword } from "./password";
import { newId, store, type MockUser } from "./store";

async function requireSession() {
  const s = await getSession();
  if (!s) redirect("/login");
  return s;
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || email.length > 254 || !password || password.length > 128) redirect("/login?error=credentials");
  const user = store.users.find((candidate) => candidate.email === email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) redirect("/login?error=credentials");
  const session = { name: user.name, email: user.email, role: user.role, specialistSlug: user.specialistSlug, userId: user.id };
  const token = await createSessionToken(session);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/portal/profile");
}

export async function registerSpecialist(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmPassword") ?? "");

  if (name.length < 2 || name.length > 80) redirect("/register?error=name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) redirect("/register?error=email");
  if (password.length < 12 || password.length > 128) redirect("/register?error=password");
  if (password !== confirmation) redirect("/register?error=match");
  if (DEV_USERS.some((user) => user.email === email) || store.users.some((user) => user.email === email)) {
    redirect("/register?error=exists");
  }

  const baseSlug = name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "specialist";
  let slug = `${baseSlug}-${newId()}`;
  while (store.specialists.some((specialist) => specialist.slug === slug)) slug = `${baseSlug}-${newId()}`;

  const user: MockUser = {
    id: newId(),
    name,
    email,
    passwordHash: await hashPassword(password),
    role: "specialist",
    specialistSlug: slug,
  };
  const profile = structuredClone(sampleData.specialists[0]!);
  Object.assign(profile, {
    slug,
    name,
    initials: name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    role: "Specialist",
    discipline: "",
    headline: "Complete your profile to introduce yourself to clients.",
    about: [],
    location: "",
    timezone: "",
    utcOffset: 0,
    city: "",
    languages: [],
    yearsExperience: "",
    engagement: "",
    responseTime: "",
    availability: { label: "Availability to be added", tone: "soon", hoursPerWeek: 0 },
    capacity: Array(10).fill(0),
    stackTags: [],
    featured: false,
    status: "draft",
    links: [],
    bestAt: [],
    services: [],
    portfolio: [],
    experience: [],
    stack: {},
    writing: [],
    credentials: [],
    updatedAt: new Date().toISOString().slice(0, 10),
  });

  store.users.push(user);
  store.specialists.push(profile);
  const session = { name: user.name, email: user.email, role: user.role, specialistSlug: slug, userId: user.id };
  const token = await createSessionToken(session);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/portal/profile");
}

export async function signInDemo(formData: FormData) {
  if (process.env.NODE_ENV === "production") redirect("/login");
  const user = DEV_USERS.find((candidate) => candidate.email === formData.get("email"));
  if (!user) redirect("/login?error=credentials");
  const token = await createSessionToken(user);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect(user.role === "specialist" ? "/portal/profile" : "/admin");
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}

/* ---------- Admin ---------- */
export async function reviewRevision(slug: string, decision: "approve" | "changes", note?: string) {
  const s = await requireSession();
  if (!can(s.role, "content.publish")) throw new Error("Forbidden");
  const rev = store.revisions.find((r) => r.slug === slug && r.status === "in_review");
  if (!rev) return;
  rev.status = decision === "approve" ? "published" : "changes_requested";
  rev.note = note;
  const sp = store.specialists.find((x) => x.slug === slug);
  if (sp && decision === "approve") sp.status = "published";
  store.activity.unshift(["now", `${s.name} ${decision === "approve" ? "approved" : "requested changes on"} ${sp?.name}’s profile`]);
  revalidatePath("/admin", "layout");
  redirect("/admin/specialists");
}

export async function toggleFlag(kind: "specialist.featured" | "service.showOnGraph" | "homepage.visible", id: string, value: boolean) {
  const s = await requireSession();
  if (!can(s.role, kind === "specialist.featured" ? "content.publish" : "site.edit")) throw new Error("Forbidden");
  if (kind === "specialist.featured") store.specialists.find((x) => x.slug === id)!.featured = value;
  if (kind === "service.showOnGraph") store.services.find((x) => x.slug === id)!.showOnGraph = value;
  if (kind === "homepage.visible") store.homepage.find((x) => x.id === id)!.visible = value;
  revalidatePath("/admin", "layout");
}

export async function saveSolution(formData: FormData) {
  const s = await requireSession();
  if (!can(s.role, "catalog.edit")) throw new Error("Forbidden");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  store.solutions.unshift({
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    type: (formData.get("type") as "product") ?? "product",
    name,
    summary: String(formData.get("summary") ?? ""),
    stack: String(formData.get("stack") ?? "").split(",").map((x) => x.trim()).filter(Boolean),
    isNew: formData.get("isNew") === "on",
    publishedAt: new Date().toISOString().slice(0, 10),
    status: formData.get("intent") === "publish" ? "published" : "draft",
  });
  revalidatePath("/admin/solutions");
  redirect("/admin/solutions");
}

/* ---------- Specialist portal (own record only) ---------- */
function ownRecord(sessionSlug: string | undefined, role: Parameters<typeof canEditSpecialist>[0]["role"], slug: string) {
  if (!canEditSpecialist({ role, specialistSlug: sessionSlug }, slug)) throw new Error("Forbidden: specialists can only edit their own profile");
  const sp = store.specialists.find((x) => x.slug === slug);
  if (!sp) throw new Error("Not found");
  return sp;
}

export async function saveProfile(formData: FormData) {
  const s = await requireSession();
  const slug = String(formData.get("slug"));
  const sp = ownRecord(s.specialistSlug, s.role, slug);
  const changes: { field: string; before: string; after: string }[] = [];
  for (const field of ["role", "headline", "location", "timezone"] as const) {
    const v = String(formData.get(field) ?? "");
    if (v && v !== sp[field]) {
      changes.push({ field, before: sp[field], after: v });
      sp[field] = v;
    }
  }
  const about = String(formData.get("about") ?? "");
  if (about && about !== sp.about.join("\n\n")) {
    changes.push({ field: "about", before: sp.about[0]?.slice(0, 60) + "…", after: about.slice(0, 60) + "…" });
    sp.about = about.split(/\n\s*\n/);
  }
  if (formData.get("intent") === "submit" && changes.length) {
    store.revisions.unshift({ slug, submittedAt: new Date().toISOString().slice(0, 10), status: "in_review", changes });
    sp.status = "in_review";
  }
  revalidatePath("/portal", "layout");
}

export async function addService(formData: FormData) {
  const s = await requireSession();
  const sp = ownRecord(s.specialistSlug, s.role, String(formData.get("slug")));
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  sp.services.push({
    id: newId(),
    title,
    format: String(formData.get("format") ?? ""),
    description: String(formData.get("description") ?? ""),
    deliverables: String(formData.get("deliverables") ?? "").split("\n").map((x) => x.trim()).filter(Boolean),
    cta: (formData.get("cta") as "book") ?? "book",
  });
  sp.status = "in_review";
  revalidatePath("/portal/services");
}

export async function removeService(slug: string, id: string) {
  const s = await requireSession();
  const sp = ownRecord(s.specialistSlug, s.role, slug);
  sp.services = sp.services.filter((x) => x.id !== id);
  revalidatePath("/portal/services");
}

export async function addPortfolio(formData: FormData) {
  const s = await requireSession();
  const sp = ownRecord(s.specialistSlug, s.role, String(formData.get("slug")));
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  sp.portfolio.push({
    id: newId(),
    kind: formData.get("nda") === "on" ? "nda" : (formData.get("kind") as "case") ?? "case",
    title,
    summary: String(formData.get("summary") ?? ""),
    role: String(formData.get("role") ?? "") || undefined,
    contribution: String(formData.get("contribution") ?? "") || undefined,
    stack: String(formData.get("stack") ?? "").split(",").map((x) => x.trim()).filter(Boolean),
  });
  sp.status = "in_review";
  revalidatePath("/portal/portfolio");
}
