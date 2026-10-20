import type { Role } from "./types";

export const capabilities = [
  "site.edit",
  "catalog.edit",
  "content.publish",
  "users.manage",
  "consultations.manage",
  "recommendations.write",
  "profile.edit_own",
  "profile.edit_any",
  "availability.edit_own",
] as const;
export type Capability = (typeof capabilities)[number];

export const capabilityLabels: Record<Capability, string> = {
  "site.edit": "Edit site copy & homepage",
  "catalog.edit": "Services, products & case studies",
  "content.publish": "Publish / approve changes",
  "users.manage": "Invite & remove users",
  "consultations.manage": "Manage consultations & hosts",
  "recommendations.write": "Write recommendations",
  "profile.edit_own": "Edit OWN profile, services, portfolio",
  "profile.edit_any": "Edit OTHER specialists’ profiles",
  "availability.edit_own": "Set own availability",
};

export const rolePermissions: Record<Role, Capability[]> = {
  admin: [...capabilities],
  editor: ["site.edit", "catalog.edit", "content.publish"],
  pm: ["consultations.manage", "recommendations.write", "profile.edit_own", "availability.edit_own"],
  specialist: ["profile.edit_own", "availability.edit_own"],
};

export function can(role: Role, capability: Capability) {
  return rolePermissions[role].includes(capability);
}

/** A specialist may only mutate the record they own. Admins may edit any record. */
export function canEditSpecialist(user: { role: Role; specialistSlug?: string }, slug: string) {
  if (can(user.role, "profile.edit_any")) return true;
  return can(user.role, "profile.edit_own") && user.specialistSlug === slug;
}

/** Free consultations are capped per company domain. */
export const FREE_CONSULTATIONS_PER_COMPANY = 2;
export function remainingFreeSessions(used: number) {
  return Math.max(0, FREE_CONSULTATIONS_PER_COMPANY - used);
}
