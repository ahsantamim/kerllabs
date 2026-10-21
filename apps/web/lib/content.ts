import { getRepository, setRepository } from "@nodal/content";
import { hasSupabaseEnv, supabaseRepository } from "@nodal/supabase";

let configured = false;

/** Published content. Uses Supabase when the public env vars are set, otherwise the bundled sample data. */
export function content() {
  if (!configured && hasSupabaseEnv()) {
    setRepository(supabaseRepository);
    configured = true;
  }
  return getRepository();
}
