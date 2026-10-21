import { cookies } from "next/headers";
import { hasSupabaseEnv, roleFromClaims } from "@nodal/supabase";
import { createClient } from "@nodal/supabase/server";
import { store } from "./store";
import { verifySessionToken, type Session } from "./session-token";
export type { Session } from "./session-token";

export const SESSION_COOKIE = "nodal_session";

export const DEV_USERS: Session[] = [
  { name: "Mira Alvarez", email: "admin@kerllabs.example", role: "admin" },
  { name: "Jon Okeke", email: "editor@kerllabs.example", role: "editor" },
  { name: "Elif Demir", email: "elif@kerllabs.example", role: "pm" },
  { name: "Amara Okafor", email: "amara-okafor@kerllabs.example", role: "specialist", specialistSlug: "amara-okafor" },
];

export async function getSession(): Promise<Session | null> {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims?.sub) return null;
    const role = roleFromClaims(data.claims);
    if (!role) return null;
    const profile = await supabase.from("profiles").select("name, email").eq("id", data.claims.sub).maybeSingle();
    if (profile.error) throw new Error(profile.error.message);
    const specialist = await supabase.from("specialists").select("slug").eq("owner_id", data.claims.sub).maybeSingle();
    if (specialist.error) throw new Error(specialist.error.message);
    return {
      name: profile.data?.name || data.claims.email || "Signed in",
      email: profile.data?.email || data.claims.email || "",
      role,
      specialistSlug: specialist.data?.slug ?? undefined,
      userId: data.claims.sub,
    };
  }
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(raw);
  if (!session?.userId) return session;
  const user = store.users.find((candidate) => candidate.id === session.userId);
  if (!user) return null;
  return { name: user.name, email: user.email, role: user.role, specialistSlug: user.specialistSlug, userId: user.id };
}
