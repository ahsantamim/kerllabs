"use server";

import { createPublicClient, hasSupabaseEnv } from "@nodal/supabase";

/**
 * Server actions for public forms. With Supabase configured, inquiries and
 * consultation bookings are stored under RLS. The anon key can insert, not read
 * other people's rows.
 */
const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

export type ActionResult = { ok: true; id: string } | { ok: false; errors: string[] };

function text(data: Record<string, string>, key: string, max: number) {
  return (data[key] ?? "").trim().slice(0, max);
}

export async function submitInquiry(kind: "team" | "specialist" | "contact", data: Record<string, string>): Promise<ActionResult> {
  const errors: string[] = [];
  const name = text(data, "name", 120);
  const email = text(data, "email", 254).toLowerCase();
  const message = text(data, "message", 4000);
  if (!name) errors.push("Full name — required");
  if (!emailOk(email)) errors.push("Work email — enter a full email address");
  if (kind === "contact" && message.length < 10) errors.push("Message — add a few words (min. 10 characters)");
  if (data.consent !== "yes") errors.push("Consent — please accept the privacy notice");
  if (errors.length) return { ok: false, errors };

  if (!hasSupabaseEnv()) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { ok: true, id: `inq_${Date.now().toString(36)}` };
  }

  const supabase = createPublicClient();
  const { error } = await supabase.from("inquiries").insert({ kind, name, email, payload: { ...data, name, email, message } });
  if (error) return { ok: false, errors: ["We could not save that message. Try again in a moment."] };
  return { ok: true, id: crypto.randomUUID() };
}

/** Free consultations are capped at 2 per company domain. */
const USED: Record<string, number> = { "ferrolabs.dev": 2, "orbit-health.io": 1 };

export async function freeSessionsUsed(email: string) {
  if (!hasSupabaseEnv()) {
    const domain = email.split("@")[1]?.toLowerCase() ?? "";
    return USED[domain] ?? 0;
  }
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("free_sessions_used", { target_email: email });
  if (error) throw new Error(error.message);
  return Number(data ?? 0);
}

export async function bookConsultation(data: Record<string, string>): Promise<ActionResult & { used?: number }> {
  const errors: string[] = [];
  const name = text(data, "name", 120);
  const email = text(data, "email", 254).toLowerCase();
  if (!name) errors.push("Full name — required");
  if (!emailOk(email)) errors.push("Work email — enter a full email address");
  if (data.consent !== "yes") errors.push("Consent — please accept the privacy notice");
  if (errors.length) return { ok: false, errors };

  const used = await freeSessionsUsed(email);
  if (used >= 2) return { ok: false, errors: ["limit"] };

  if (!hasSupabaseEnv()) return { ok: true, id: `cons_${Date.now().toString(36)}`, used: used + 1 };

  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  const supabase = createPublicClient();
  const { error } = await supabase.from("consultations").insert({
    company_domain: domain,
    contact_name: name,
    contact_email: email,
    host_name: text(data, "host", 120),
    topic: text(data, "topic", 200) || "Consultation",
    when_label: text(data, "when", 120),
    notes: text(data, "notes", 2000),
    free: true,
    status: "scheduled",
  });
  if (error) {
    if (error.message.toLowerCase().includes("free consultation limit")) return { ok: false, errors: ["limit"] };
    return { ok: false, errors: ["We could not book that session. Try again in a moment."] };
  }
  return { ok: true, id: crypto.randomUUID(), used: used + 1 };
}
