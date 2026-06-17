// Cliente Supabase server-side (service_role). NUNCA importar en componentes client:
// `server-only` rompe el build si este módulo entra a un bundle de browser.
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types.js";

let _client: SupabaseClient<Database> | undefined;

export function getClient(): SupabaseClient<Database> {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY (server env). " +
        "service_role va SOLO en el server/engine, nunca en el cliente.",
    );
  }
  _client = createClient<Database>(url, key, { auth: { persistSession: false } });
  return _client;
}
