// @fixup/db — capa de datos sobre Supabase (server-side, service_role).
// La UI consume `ProspectoStore` / `createStore()`, nunca Supabase directo.
export { createStore, SupabaseStore } from "./store.js";
export type { ProspectoStore, NewProspecto } from "./store.js";
export { mapRow, toRow, slugify, deriveId } from "./mapping.js";
export { getClient } from "./client.js";
export type { Database, Json } from "./database.types.js";
export type {
  ProspectoRow,
  ProspectoInsert,
  ProspectoUpdate,
  EstadoProspecto,
} from "./row-types.js";
