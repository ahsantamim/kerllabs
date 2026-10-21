import type { Role } from "@nodal/content";

const roles: readonly Role[] = ["admin", "editor", "pm", "specialist"];

/**
 * CMS role lives in app_metadata. The JWT's top-level `role` claim is only the
 * Postgres role (`authenticated`) and must not be used for authorization.
 * user_metadata is user-editable, so it is ignored here.
 */
export function roleFromClaims(claims: { app_metadata?: unknown } | null | undefined): Role | null {
  const metadata = claims?.app_metadata;
  const role = metadata && typeof metadata === "object" ? (metadata as { role?: unknown }).role : undefined;
  return typeof role === "string" && roles.includes(role as Role) ? (role as Role) : null;
}
