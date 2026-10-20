import type { Role } from "@nodal/content";

export interface Session {
  name: string;
  email: string;
  role: Role;
  specialistSlug?: string;
  userId?: string;
}

interface SessionToken extends Session {
  expiresAt: number;
}

const DEV_SECRET = "local-development-session-secret-change-before-deploy";

function secret() {
  const configured = process.env.CMS_SESSION_SECRET;
  if (process.env.NODE_ENV !== "production") return configured && configured.length >= 32 ? configured : DEV_SECRET;
  const value = configured ?? "";
  if (value.length < 32 || value.startsWith("replace-with-")) {
    throw new Error("Set CMS_SESSION_SECRET to a unique random value of at least 32 characters.");
  }
  return value;
}

async function signingKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

const roles: Role[] = ["admin", "editor", "pm", "specialist"];

export async function createSessionToken(session: Session) {
  const payload: SessionToken = { ...session, expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 };
  const encoded = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign("HMAC", await signingKey(), new TextEncoder().encode(encoded));
  return `${encoded}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(value: string | undefined): Promise<Session | null> {
  if (!value || value.length > 4096) return null;
  const [encoded, signature, ...extra] = value.split(".");
  if (!encoded || !signature || extra.length) return null;

  const key = await signingKey();
  let payload: SessionToken;
  try {
    const valid = await crypto.subtle.verify("HMAC", key, fromBase64Url(signature), new TextEncoder().encode(encoded));
    if (!valid) return null;
    payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encoded))) as SessionToken;
  } catch {
    return null;
  }

  if (
    typeof payload.name !== "string" ||
    !payload.name ||
    typeof payload.email !== "string" ||
    !payload.email ||
    !roles.includes(payload.role) ||
    !Number.isInteger(payload.expiresAt) ||
    payload.expiresAt <= Math.floor(Date.now() / 1000) ||
    (payload.specialistSlug !== undefined && typeof payload.specialistSlug !== "string") ||
    (payload.userId !== undefined && typeof payload.userId !== "string")
  ) return null;

  return {
    name: payload.name,
    email: payload.email,
    role: payload.role,
    specialistSlug: payload.specialistSlug,
    userId: payload.userId,
  };
}
