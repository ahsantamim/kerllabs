import { cookies } from "next/headers";
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
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(raw);
  if (!session?.userId) return session;
  const user = store.users.find((candidate) => candidate.id === session.userId);
  if (!user) return null;
  return { name: user.name, email: user.email, role: user.role, specialistSlug: user.specialistSlug, userId: user.id };
}
