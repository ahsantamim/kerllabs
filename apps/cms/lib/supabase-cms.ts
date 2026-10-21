import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { can, canEditSpecialist, type Role } from "@nodal/content";
import { createClient } from "@nodal/supabase/server";
import { roleFromClaims } from "@nodal/supabase";
import type { Session } from "./session-token";

const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function db() {
  return createClient();
}

async function revalidateContent() {
  revalidatePath("/admin", "layout");
  revalidatePath("/portal", "layout");
  const secret = process.env.REVALIDATE_SECRET;
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!secret || !site) return;
  try {
    await fetch(new URL("/api/revalidate", site), {
      method: "POST",
      headers: { authorization: `Bearer ${secret}` },
      cache: "no-store",
    });
  } catch {
    // The public site still refreshes on its own interval.
  }
}

async function activity(label: string) {
  const supabase = await db();
  const { error } = await supabase.from("activity_log").insert({ label: label.slice(0, 500) });
  if (error) throw new Error(error.message);
}

async function uploadImage(file: FormDataEntryValue | null, folder: "solutions" | "specialists") {
  if (!(file instanceof File) || file.size === 0) return null;
  if (!IMAGE_TYPES.has(file.type) || file.size > 8 * 1024 * 1024) {
    throw new Error("Use a PNG, JPG, WebP, or GIF under 8 MB.");
  }
  const supabase = await db();
  const { data } = await supabase.auth.getClaims();
  const uid = data?.claims?.sub;
  if (!uid) throw new Error("Forbidden");
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80) || "image";
  const path = folder === "specialists" ? `specialists/${uid}/${crypto.randomUUID()}-${safe}` : `solutions/${uid}/${crypto.randomUUID()}-${safe}`;
  const { error } = await supabase.storage.from("media").upload(path, new Uint8Array(await file.arrayBuffer()), {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

async function specialistBySlug(slug: string) {
  const supabase = await db();
  const { data, error } = await supabase.from("specialists").select("id, slug, name, owner_id").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Not found");
  return data;
}

export async function signInWithSupabase(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || email.length > 254 || !password || password.length > 128) redirect("/login?error=credentials");
  const supabase = await db();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=${error.message.toLowerCase().includes("confirm") ? "confirm" : "credentials"}`);
  }
  const { data } = await supabase.auth.getClaims();
  const role = roleFromClaims(data?.claims ?? null);
  redirect(role && role !== "specialist" ? "/admin" : "/portal/profile");
}

export async function signUpSpecialist(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmPassword") ?? "");
  if (name.length < 2 || name.length > 80) redirect("/register?error=name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) redirect("/register?error=email");
  if (password.length < 12 || password.length > 128) redirect("/register?error=password");
  if (password !== confirmation) redirect("/register?error=match");

  const supabase = await db();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("already") || message.includes("registered")) redirect("/register?error=exists");
    if (message.includes("password")) redirect("/register?error=password");
    redirect("/register?error=email");
  }
  if (!data.session) redirect("/login?error=confirm");
  redirect("/portal/profile");
}

export async function signOutSupabase() {
  const supabase = await db();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function persistProfile(session: Session, formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  if (!canEditSpecialist(session, slug)) throw new Error("Forbidden");
  const supabase = await db();
  const { data: current, error } = await supabase
    .from("specialists")
    .select("id, role_line, headline, location, timezone, about")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!current) throw new Error("Not found");

  const changes: { field: string; before: string; after: string }[] = [];
  const patch: Record<string, unknown> = {};
  const fields = [
    ["role", "role_line"],
    ["headline", "headline"],
    ["location", "location"],
    ["timezone", "timezone"],
  ] as const;
  for (const [field, column] of fields) {
    const value = String(formData.get(field) ?? "");
    const before = String(current[column] ?? "");
    if (value && value !== before) {
      changes.push({ field, before, after: value });
      patch[column] = value;
    }
  }
  const about = String(formData.get("about") ?? "");
  const previous = Array.isArray(current.about) ? current.about.join("\n\n") : "";
  if (about && about !== previous) {
    changes.push({ field: "about", before: previous.slice(0, 60), after: about.slice(0, 60) });
    patch.about = about.split(/\n\s*\n/);
  }
  if (formData.get("intent") === "submit" && changes.length) patch.status = "in_review";
  if (Object.keys(patch).length) {
    const { error: updateError } = await supabase.from("specialists").update(patch).eq("id", current.id);
    if (updateError) throw new Error(updateError.message);
  }
  if (formData.get("intent") === "submit" && changes.length) {
    const { error: revisionError } = await supabase.from("profile_revisions").insert({
      specialist_id: current.id,
      status: "in_review",
      changes,
      submitted_at: new Date().toISOString().slice(0, 10),
    });
    if (revisionError) throw new Error(revisionError.message);
  }
  revalidatePath("/portal", "layout");
  revalidatePath("/admin", "layout");
}

export async function addServiceRow(session: Session, formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  if (!canEditSpecialist(session, slug)) throw new Error("Forbidden");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  const specialist = await specialistBySlug(slug);
  const supabase = await db();
  const { error } = await supabase.from("specialist_services").insert({
    specialist_id: specialist.id,
    title,
    format: String(formData.get("format") ?? ""),
    description: String(formData.get("description") ?? ""),
    deliverables: String(formData.get("deliverables") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    cta: String(formData.get("cta") ?? "book"),
  });
  if (error) throw new Error(error.message);
  const { error: statusError } = await supabase.from("specialists").update({ status: "in_review" }).eq("id", specialist.id);
  if (statusError) throw new Error(statusError.message);
  revalidatePath("/portal/services");
}

export async function removeServiceRow(session: Session, slug: string, id: string) {
  if (!canEditSpecialist(session, slug)) throw new Error("Forbidden");
  const specialist = await specialistBySlug(slug);
  const supabase = await db();
  const { error } = await supabase.from("specialist_services").delete().eq("id", id).eq("specialist_id", specialist.id);
  if (error) throw new Error(error.message);
  revalidatePath("/portal/services");
}

export async function addPortfolioRow(session: Session, formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  if (!canEditSpecialist(session, slug)) throw new Error("Forbidden");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  const specialist = await specialistBySlug(slug);
  const imageUrl = await uploadImage(formData.get("image"), "specialists");
  const nda = formData.get("nda") === "on";
  const supabase = await db();
  const { error } = await supabase.from("portfolio_items").insert({
    specialist_id: specialist.id,
    kind: nda ? "nda" : String(formData.get("kind") ?? "case"),
    title,
    summary: String(formData.get("summary") ?? ""),
    role_line: String(formData.get("role") ?? "") || null,
    contribution: String(formData.get("contribution") ?? "") || null,
    stack: String(formData.get("stack") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    images: imageUrl ? [imageUrl] : [],
    nda,
  });
  if (error) throw new Error(error.message);
  const { error: statusError } = await supabase.from("specialists").update({ status: "in_review" }).eq("id", specialist.id);
  if (statusError) throw new Error(statusError.message);
  revalidatePath("/portal/portfolio");
}

export async function reviewRevisionRow(session: Session, slug: string, decision: "approve" | "changes", note?: string) {
  if (!can(session.role, "content.publish")) throw new Error("Forbidden");
  const specialist = await specialistBySlug(slug);
  const supabase = await db();
  const { data: revision, error } = await supabase
    .from("profile_revisions")
    .select("id")
    .eq("specialist_id", specialist.id)
    .eq("status", "in_review")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!revision) return;
  const status = decision === "approve" ? "published" : "changes_requested";
  const { error: revisionError } = await supabase
    .from("profile_revisions")
    .update({ status, note: note || null, reviewed_at: new Date().toISOString() })
    .eq("id", revision.id);
  if (revisionError) throw new Error(revisionError.message);
  if (decision === "approve") {
    const { error: publishError } = await supabase.from("specialists").update({ status: "published" }).eq("id", specialist.id);
    if (publishError) throw new Error(publishError.message);
  }
  await activity(`${session.name} ${decision === "approve" ? "approved" : "requested changes on"} ${specialist.name}'s profile`);
  await revalidateContent();
  redirect("/admin/specialists");
}

export async function toggleFlagRow(session: Session, kind: "specialist.featured" | "service.showOnGraph" | "homepage.visible", id: string, value: boolean) {
  const capability = kind === "specialist.featured" ? "content.publish" : "site.edit";
  if (!can(session.role, capability)) throw new Error("Forbidden");
  const supabase = await db();
  const update =
    kind === "specialist.featured"
      ? supabase.from("specialists").update({ featured: value }).eq("slug", id)
      : kind === "service.showOnGraph"
        ? supabase.from("services").update({ show_on_graph: value }).eq("slug", id)
        : supabase.from("homepage_sections").update({ visible: value }).eq("id", id);
  const { error } = await update;
  if (error) throw new Error(error.message);
  await revalidateContent();
}

function solutionPayload(formData: FormData, coverUrl: string | null) {
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "product");
  return {
    name,
    type: type === "solution" || type === "open_source" ? type : "product",
    summary: String(formData.get("summary") ?? "").slice(0, 140),
    stack: String(formData.get("stack") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    cover_url: coverUrl,
    is_new: formData.get("isNew") === "on",
    published_at: new Date().toISOString().slice(0, 10),
    status: formData.get("intent") === "publish" ? "published" : "draft",
  };
}

export async function persistSolution(session: Session, formData: FormData) {
  if (!can(session.role, "catalog.edit")) throw new Error("Forbidden");
  const payload = solutionPayload(formData, await uploadImage(formData.get("image"), "solutions"));
  if (!payload.name) return;
  const supabase = await db();
  let slug = slugify(payload.name) || "solution";
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { error } = await supabase.from("solutions").insert({ slug, ...payload });
    if (!error) {
      await activity(`${session.name} saved “${payload.name}”`);
      await revalidateContent();
      redirect("/admin/solutions");
    }
    if (error.code !== "23505") throw new Error(error.message);
    slug = `${slugify(payload.name) || "solution"}-${crypto.randomUUID().slice(0, 4)}`;
  }
  throw new Error("Could not save that product.");
}

export async function updateSolutionRow(session: Session, formData: FormData) {
  if (!can(session.role, "catalog.edit")) throw new Error("Forbidden");
  const slug = String(formData.get("slug") ?? "");
  if (!slug) throw new Error("Not found");
  const payload = solutionPayload(formData, await uploadImage(formData.get("image"), "solutions"));
  if (!payload.name) return;
  const supabase = await db();
  const { cover_url, ...rest } = payload;
  const { error } = await supabase.from("solutions").update(cover_url ? payload : rest).eq("slug", slug);
  if (error) throw new Error(error.message);
  await activity(`${session.name} updated “${payload.name}”`);
  await revalidateContent();
  redirect("/admin/solutions");
}

export async function deleteSolutionRow(session: Session, slug: string) {
  if (!can(session.role, "catalog.edit")) throw new Error("Forbidden");
  const supabase = await db();
  const { error } = await supabase.from("solutions").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  await activity(`${session.name} deleted solution ${slug}`);
  await revalidateContent();
}

export async function persistService(session: Session, formData: FormData) {
  if (!can(session.role, "catalog.edit")) throw new Error("Forbidden");
  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim().toUpperCase().slice(0, 2);
  const tier = String(formData.get("tier") ?? "experience");
  if (!name || code.length < 1) return;
  const supabase = await db();
  const { error } = await supabase.from("services").insert({
    slug: slugify(name) || code.toLowerCase(),
    code,
    name,
    tier: tier === "product_logic" || tier === "infrastructure" ? tier : "experience",
    summary: String(formData.get("summary") ?? ""),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    sort_order: Number(formData.get("order") ?? 0) || 0,
    show_on_graph: formData.get("showOnGraph") === "on",
    connects: [],
    status: formData.get("intent") === "publish" ? "published" : "draft",
  });
  if (error) throw new Error(error.message);
  await activity(`${session.name} added service “${name}”`);
  await revalidateContent();
  redirect("/admin/services");
}

export async function deleteServiceRow(session: Session, slug: string) {
  if (!can(session.role, "catalog.edit")) throw new Error("Forbidden");
  const supabase = await db();
  const { error } = await supabase.from("services").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  await activity(`${session.name} deleted service ${slug}`);
  await revalidateContent();
}

export type { Role };
