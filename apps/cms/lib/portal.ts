import { redirect } from "next/navigation";
import { getSession } from "./session";
import { store } from "./store";

/** Resolves the signed-in specialist's OWN record. Non-specialists without a profile are sent away. */
export async function ownProfile() {
  const session = await getSession();
  if (!session) redirect("/login");
  const slug = session.specialistSlug;
  const sp = slug ? store.specialists.find((s) => s.slug === slug) : undefined;
  if (!sp) redirect("/portal/forbidden");
  const pending = store.revisions.find((r) => r.slug === sp.slug && (r.status === "in_review" || r.status === "changes_requested"));
  return { session, sp, pending };
}
