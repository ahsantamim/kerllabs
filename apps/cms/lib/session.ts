import { cookies } from "next/headers";
import type { Role } from "@nodal/content";

/**
 * DEV SESSION — a signed-in user is stored in a cookie so the role model can be exercised locally.
 * Replace with Auth.js (email magic link / Google Workspace SSO) before production; keep the
 * `Session` shape so permission checks in lib/actions.ts don't change.
 */
export interface Session {
  name: string;
  email: string;
  role: Role;
  specialistSlug?: string;
}

export const SESSION_COOKIE = "nodal_session";

export const DEV_USERS: Session[] = [
  { name: "Mira Alvarez", email: "admin@kerllabs.example", role: "admin" },
  { name: "Jon Okeke", email: "editor@kerllabs.example", role: "editor" },
  { name: "Elif Demir", email: "elif@kerllabs.example", role: "pm" },
  { name: "Amara Okafor", email: "amara-okafor@kerllabs.example", role: "specialist", specialistSlug: "amara-okafor" },
];

export async function getSession(): Promise<Session | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString()) as Session;
  } catch {
    return null;
  }
}

export const encodeSession = (s: Session) => Buffer.from(JSON.stringify(s)).toString("base64url");
