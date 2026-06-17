import type { SupabaseClient } from "@supabase/supabase-js";
import type { Lead, Prospecto } from "@fixup/types";
import type { Database } from "./database.types.js";
import { getClient } from "./client.js";
import { deriveId, mapRow, slugify, toRow } from "./mapping.js";

/** Capa de datos abstracta (ver docs/data-plane.md). La UI depende de esto, no de Supabase. */
export interface ProspectoStore {
  getAll(): Promise<Prospecto[]>;
  get(id: string): Promise<Prospecto | null>;
  appendLead(lead: Lead): Promise<Prospecto>; // inserta estado 'nuevo'
  update(id: string, patch: Partial<Prospecto>): Promise<void>;
}

type Db = SupabaseClient<Database>;

const TABLE = "prospectos";

export class SupabaseStore implements ProspectoStore {
  constructor(private readonly db: Db) {}

  async getAll(): Promise<Prospecto[]> {
    const { data, error } = await this.db
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapRow);
  }

  async get(id: string): Promise<Prospecto | null> {
    const { data, error } = await this.db
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapRow(data) : null;
  }

  async appendLead(lead: Lead): Promise<Prospecto> {
    // ids existentes con el mismo prefijo, para resolver colisiones.
    const base = slugify(lead["업체명"]) || "prospecto";
    const { data: existing, error: e1 } = await this.db
      .from(TABLE)
      .select("id")
      .like("id", `${base}%`);
    if (e1) throw new Error(e1.message);

    const id = deriveId(lead["업체명"], (existing ?? []).map((r) => r.id));

    const insert = {
      id,
      nombre_negocio: lead["업체명"],
      rubro: lead.rubro ?? null,
      instagram: lead.instagram ?? null,
      naver_place: lead.naver_place ?? null,
      telefono: lead.telefono ?? null,
      decisor: lead.nombre ?? null, // persona que dejó el lead
      observacion: lead.mensaje ?? null,
      estado: "nuevo" as const,
      // created_at por default en la DB
    };

    const { data, error } = await this.db
      .from(TABLE)
      .insert(insert)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapRow(data);
  }

  async update(id: string, patch: Partial<Prospecto>): Promise<void> {
    const row = toRow(patch);
    const { error } = await this.db.from(TABLE).update(row).eq("id", id);
    if (error) throw new Error(error.message);
  }
}

let _store: ProspectoStore | undefined;

/** Singleton server-side. Construye el cliente (service_role) la primera vez. */
export function createStore(): ProspectoStore {
  if (!_store) _store = new SupabaseStore(getClient());
  return _store;
}
