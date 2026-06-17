import type { SupabaseClient } from "@supabase/supabase-js";
import type { Lead, Prospecto } from "@fixup/types";
import type { Database } from "./database.types.js";
import { getClient } from "./client.js";
import { deriveId, mapRow, slugify, toRow } from "./mapping.js";

/** Datos para crear un prospecto a mano (dashboard). `업체명` requerido; resto opcional. */
export type NewProspecto = { "업체명": string } & Partial<Omit<Prospecto, "업체명" | "id">>;

/** Capa de datos abstracta (ver docs/data-plane.md). La UI depende de esto, no de Supabase. */
export interface ProspectoStore {
  getAll(): Promise<Prospecto[]>;
  get(id: string): Promise<Prospecto | null>;
  appendLead(lead: Lead): Promise<Prospecto>; // inserta estado 'nuevo'
  create(input: NewProspecto): Promise<Prospecto>; // alta manual, estado 'nuevo'
  update(id: string, patch: Partial<Prospecto>): Promise<void>;
  remove(id: string): Promise<void>;
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

  // Deriva un id único desde el 업체명 (slug + sufijo si choca).
  private async nextId(nombre: string): Promise<string> {
    const base = slugify(nombre) || "prospecto";
    const { data, error } = await this.db.from(TABLE).select("id").like("id", `${base}%`);
    if (error) throw new Error(error.message);
    return deriveId(nombre, (data ?? []).map((r) => r.id));
  }

  async appendLead(lead: Lead): Promise<Prospecto> {
    const id = await this.nextId(lead["업체명"]);

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

  async create(input: NewProspecto): Promise<Prospecto> {
    const id = await this.nextId(input["업체명"]);
    const row = {
      ...toRow(input),
      id,
      nombre_negocio: input["업체명"],
      estado: input.estado ?? ("nuevo" as const),
    };
    const { data, error } = await this.db.from(TABLE).insert(row).select("*").single();
    if (error) throw new Error(error.message);
    return mapRow(data);
  }

  async update(id: string, patch: Partial<Prospecto>): Promise<void> {
    const row = toRow(patch);
    const { error } = await this.db.from(TABLE).update(row).eq("id", id);
    if (error) throw new Error(error.message);
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.db.from(TABLE).delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}

let _store: ProspectoStore | undefined;

/** Singleton server-side. Construye el cliente (service_role) la primera vez. */
export function createStore(): ProspectoStore {
  if (!_store) _store = new SupabaseStore(getClient());
  return _store;
}
