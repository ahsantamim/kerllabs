import { redirect } from "next/navigation";
import { hasSupabaseEnv, mapSpecialist, specialistSelect, type SpecialistRow } from "@nodal/supabase";
import { createClient } from "@nodal/supabase/server";
import { getSession } from "./session";
import { store, type Revision } from "./store";

/** Resolves the signed-in specialist's OWN record. Non-specialists without a profile are sent away. */
export async function ownProfile() {
  const session = await getSession();
  if (!session) redirect("/login");
  const slug = session.specialistSlug;
  if (!slug) redirect("/portal/forbidden");

  if (!hasSupabaseEnv()) {
    const sp = store.specialists.find((item) => item.slug === slug);
    if (!sp) redirect("/portal/forbidden");
    const pending = store.revisions.find((item) => item.slug === sp.slug && (item.status === "in_review" || item.status === "changes_requested"));
    return { session, sp, pending };
  }

  const supabase = await createClient();
  const result = await supabase.from("specialists").select(specialistSelect).eq("slug", slug).eq("owner_id", session.userId ?? "").maybeSingle();
  if (result.error) throw new Error(result.error.message);
  if (!result.data) redirect("/portal/forbidden");
  const row = result.data as SpecialistRow;
  const revisions = await supabase
    .from("profile_revisions")
    .select("status, changes, note, submitted_at")
    .eq("specialist_id", row.id)
    .in("status", ["in_review", "changes_requested"])
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (revisions.error) throw new Error(revisions.error.message);
  const pending: Revision | undefined = revisions.data
    ? {
        slug,
        submittedAt: revisions.data.submitted_at,
        status: revisions.data.status,
        note: revisions.data.note ?? undefined,
        changes: revisions.data.changes ?? [],
      }
    : undefined;
  return { session, sp: mapSpecialist(row), pending };
}
