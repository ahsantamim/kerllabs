"use server";

/**
 * Server actions for public forms. In production these persist via @nodal/db (Inquiry / Consultation)
 * and notify the team. Validation mirrors the client rules so the API is safe on its own.
 */
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

export type ActionResult = { ok: true; id: string } | { ok: false; errors: string[] };

export async function submitInquiry(kind: "team" | "specialist" | "contact", data: Record<string, string>): Promise<ActionResult> {
  const errors: string[] = [];
  if (!data.name?.trim()) errors.push("Full name — required");
  if (!emailOk(data.email ?? "")) errors.push("Work email — enter a full email address");
  if (kind === "contact" && (data.message ?? "").trim().length < 10) errors.push("Message — add a few words (min. 10 characters)");
  if (data.consent !== "yes") errors.push("Consent — please accept the privacy notice");
  if (errors.length) return { ok: false, errors };
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true, id: `inq_${Date.now().toString(36)}` };
}

/** Free consultations are capped at 2 per company domain (sample usage below). */
const USED: Record<string, number> = { "ferrolabs.dev": 2, "orbit-health.io": 1 };
export async function freeSessionsUsed(email: string) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return USED[domain] ?? 0;
}

export async function bookConsultation(data: Record<string, string>): Promise<ActionResult & { used?: number }> {
  const errors: string[] = [];
  if (!data.name?.trim()) errors.push("Full name — required");
  if (!emailOk(data.email ?? "")) errors.push("Work email — enter a full email address");
  if (data.consent !== "yes") errors.push("Consent — please accept the privacy notice");
  if (errors.length) return { ok: false, errors };
  const used = await freeSessionsUsed(data.email!);
  if (used >= 2) return { ok: false, errors: ["limit"] };
  return { ok: true, id: `cons_${Date.now().toString(36)}`, used: used + 1 };
}
