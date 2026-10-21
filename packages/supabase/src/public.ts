import { createClient } from "@supabase/supabase-js";
import { requireSupabaseEnv } from "./env";

/** Cookie-less client for public, RLS-scoped reads and form inserts. */
export function createPublicClient() {
  const { url, key } = requireSupabaseEnv();
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: (input, init) => {
        const method = (init?.method ?? "GET").toUpperCase();
        if (method === "GET" || method === "HEAD") {
          return fetch(input, { ...init, next: { revalidate: 300 } } as RequestInit);
        }
        return fetch(input, { ...init, cache: "no-store" });
      },
    },
  });
}
