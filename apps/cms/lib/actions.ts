"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { can, canEditSpecialist, sampleData } from "@nodal/content";
import { hasSupabaseEnv } from "@nodal/supabase";
import { DEV_USERS, SESSION_COOKIE, getSession } from "./session";
import { createSessionToken } from "./session-token";
import { hashPassword, verifyPassword } from "./password";
import { newId, store, type MockUser } from "./store";
import {
  addPortfolioRow,
  addServiceRow,
  deleteServiceRow,
  deleteSolutionRow,
  persistProfile,
  persistService,
  persistSolution,
  removeServiceRow,
  reviewRevisionRow,
  signInWithSupabase,
  signOutSupabase,
  signUpSpecialist,
  toggleFlagRow,
  updateSolutionRow,
} from "./supabase-cms";

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function signIn(formData: FormData) {
  if (hasSupabaseEnv()) return signInWithSupabase(formData);
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
  if (hasSupabaseEnv()) return signUpSpecialist(formData);
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
  if (process.env.NODE_ENV === "production" || hasSupabaseEnv()) redirect("/login");
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
  if (hasSupabaseEnv()) return signOutSupabase();
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}

export async function reviewRevision(slug: string, decision: "approve" | "changes", note?: string) {
  const session = await requireSession();
  if (hasSupabaseEnv()) return reviewRevisionRow(session, slug, decision, note);
  if (!can(session.role, "content.publish")) throw new Error("Forbidden");
  const rev = store.revisions.find((item) => item.slug === slug && item.status === "in_review");
  if (!rev) return;
  rev.status = decision === "approve" ? "published" : "changes_requested";
  rev.note = note;
  const specialist = store.specialists.find((item) => item.slug === slug);
  if (specialist && decision === "approve") specialist.status = "published";
  store.activity.unshift(["now", `${session.name} ${decision === "approve" ? "approved" : "requested changes on"} ${specialist?.name}’s profile`]);
  revalidatePath("/admin", "layout");
  redirect("/admin/specialists");
}

export async function toggleFlag(kind: "specialist.featured" | "service.showOnGraph" | "homepage.visible", id: string, value: boolean) {
  const session = await requireSession();
  if (hasSupabaseEnv()) return toggleFlagRow(session, kind, id, value);
  if (!can(session.role, kind === "specialist.featured" ? "content.publish" : "site.edit")) throw new Error("Forbidden");
  if (kind === "specialist.featured") store.specialists.find((item) => item.slug === id)!.featured = value;
  if (kind === "service.showOnGraph") store.services.find((item) => item.slug === id)!.showOnGraph = value;
  if (kind === "homepage.visible") store.homepage.find((item) => item.id === id)!.visible = value;
  revalidatePath("/admin", "layout");
}

export async function saveSolution(formData: FormData) {
  const session = await requireSession();
  if (hasSupabaseEnv()) return persistSolution(session, formData);
  if (!can(session.role, "catalog.edit")) throw new Error("Forbidden");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  store.solutions.unshift({
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    type: (formData.get("type") as "product") ?? "product",
    name,
    summary: String(formData.get("summary") ?? ""),
    stack: String(formData.get("stack") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
    isNew: formData.get("isNew") === "on",
    publishedAt: new Date().toISOString().slice(0, 10),
    status: formData.get("intent") === "publish" ? "published" : "draft",
  });
  revalidatePath("/admin/solutions");
  redirect("/admin/solutions");
}

export async function updateSolution(formData: FormData) {
  const session = await requireSession();
  if (hasSupabaseEnv()) return updateSolutionRow(session, formData);
  if (!can(session.role, "catalog.edit")) throw new Error("Forbidden");
  const slug = String(formData.get("slug") ?? "");
  const solution = store.solutions.find((item) => item.slug === slug);
  if (!solution) return;
  solution.name = String(formData.get("name") ?? solution.name);
  solution.summary = String(formData.get("summary") ?? solution.summary);
  solution.type = (formData.get("type") as "product") ?? solution.type;
  solution.stack = String(formData.get("stack") ?? "").split(",").map((item) => item.trim()).filter(Boolean);
  solution.isNew = formData.get("isNew") === "on";
  solution.status = formData.get("intent") === "publish" ? "published" : "draft";
  revalidatePath("/admin/solutions");
  redirect("/admin/solutions");
}

export async function deleteSolution(slug: string) {
  const session = await requireSession();
  if (!hasSupabaseEnv()) {
    if (!can(session.role, "catalog.edit")) throw new Error("Forbidden");
    store.solutions.splice(0, store.solutions.length, ...store.solutions.filter((item) => item.slug !== slug));
    revalidatePath("/admin/solutions");
    return;
  }
  return deleteSolutionRow(session, slug);
}

export async function saveService(formData: FormData) {
  const session = await requireSession();
  if (hasSupabaseEnv()) return persistService(session, formData);
  if (!can(session.role, "catalog.edit")) throw new Error("Forbidden");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const tier = String(formData.get("tier") ?? "experience");
  store.services.push({
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    code: String(formData.get("code") ?? "XX").trim().toUpperCase().slice(0, 2),
    name,
    tier: tier === "product_logic" || tier === "infrastructure" ? tier : "experience",
    summary: String(formData.get("summary") ?? ""),
    tags: String(formData.get("tags") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
    order: Number(formData.get("order") ?? store.services.length + 1) || store.services.length + 1,
    showOnGraph: formData.get("showOnGraph") === "on",
    connects: [],
    status: formData.get("intent") === "publish" ? "published" : "draft",
  });
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteService(slug: string) {
  const session = await requireSession();
  if (hasSupabaseEnv()) return deleteServiceRow(session, slug);
  if (!can(session.role, "catalog.edit")) throw new Error("Forbidden");
  const remaining = store.services.filter((item) => item.slug !== slug);
  store.services.splice(0, store.services.length, ...remaining);
  revalidatePath("/admin/services");
}

function ownRecord(sessionSlug: string | undefined, role: Parameters<typeof canEditSpecialist>[0]["role"], slug: string) {
  if (!canEditSpecialist({ role, specialistSlug: sessionSlug }, slug)) throw new Error("Forbidden: specialists can only edit their own profile");
  const specialist = store.specialists.find((item) => item.slug === slug);
  if (!specialist) throw new Error("Not found");
  return specialist;
}

export async function saveProfile(formData: FormData) {
  const session = await requireSession();
  if (hasSupabaseEnv()) return persistProfile(session, formData);
  const slug = String(formData.get("slug"));
  const specialist = ownRecord(session.specialistSlug, session.role, slug);
  const changes: { field: string; before: string; after: string }[] = [];
  for (const field of ["role", "headline", "location", "timezone"] as const) {
    const value = String(formData.get(field) ?? "");
    if (value && value !== specialist[field]) {
      changes.push({ field, before: specialist[field], after: value });
      specialist[field] = value;
    }
  }
  const about = String(formData.get("about") ?? "");
  if (about && about !== specialist.about.join("\n\n")) {
    changes.push({ field: "about", before: specialist.about[0]?.slice(0, 60) + "…", after: about.slice(0, 60) + "…" });
    specialist.about = about.split(/\n\s*\n/);
  }
  if (formData.get("intent") === "submit" && changes.length) {
    store.revisions.unshift({ slug, submittedAt: new Date().toISOString().slice(0, 10), status: "in_review", changes });
    specialist.status = "in_review";
  }
  revalidatePath("/portal", "layout");
}

export async function addService(formData: FormData) {
  const session = await requireSession();
  if (hasSupabaseEnv()) return addServiceRow(session, formData);
  const specialist = ownRecord(session.specialistSlug, session.role, String(formData.get("slug")));
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  specialist.services.push({
    id: newId(),
    title,
    format: String(formData.get("format") ?? ""),
    description: String(formData.get("description") ?? ""),
    deliverables: String(formData.get("deliverables") ?? "").split("\n").map((item) => item.trim()).filter(Boolean),
    cta: (formData.get("cta") as "book") ?? "book",
  });
  specialist.status = "in_review";
  revalidatePath("/portal/services");
}

export async function removeService(slug: string, id: string) {
  const session = await requireSession();
  if (hasSupabaseEnv()) return removeServiceRow(session, slug, id);
  const specialist = ownRecord(session.specialistSlug, session.role, slug);
  specialist.services = specialist.services.filter((item) => item.id !== id);
  revalidatePath("/portal/services");
}

export async function addPortfolio(formData: FormData) {
  const session = await requireSession();
  if (hasSupabaseEnv()) return addPortfolioRow(session, formData);
  const specialist = ownRecord(session.specialistSlug, session.role, String(formData.get("slug")));
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  specialist.portfolio.push({
    id: newId(),
    kind: formData.get("nda") === "on" ? "nda" : (formData.get("kind") as "case") ?? "case",
    title,
    summary: String(formData.get("summary") ?? ""),
    role: String(formData.get("role") ?? "") || undefined,
    contribution: String(formData.get("contribution") ?? "") || undefined,
    stack: String(formData.get("stack") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
  });
  specialist.status = "in_review";
  revalidatePath("/portal/portfolio");
}
