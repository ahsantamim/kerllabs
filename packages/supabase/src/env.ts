/** Public project URL. Safe to expose to the browser. */
export function supabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

/**
 * Prefer the publishable key. The legacy anon JWT is only a fallback for
 * clients that cannot send a publishable key. Both are public; neither is the
 * service role key.
 */
export function supabasePublishableKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
}

export function hasSupabaseEnv() {
  return Boolean(supabaseUrl() && supabasePublishableKey());
}

export function requireSupabaseEnv() {
  const url = supabaseUrl();
  const key = supabasePublishableKey();
  if (!url || !key) {
    throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }
  return { url, key };
}
