import "server-only";
import { z } from "zod";
import type { Estado, Prospecto } from "@fixup/types";
import { createStore, type NewProspecto } from "@fixup/db";

// Capa de datos del dashboard. La fuente de la verdad es la tabla `prospectos`
// en Supabase (acceso server-side con service_role vía @fixup/db).
export interface ProspectoRepo {
  list(): Promise<Prospecto[]>;
  get(id: string): Promise<Prospecto | null>;
  create(input: NewProspecto): Promise<Prospecto>;
  updateEstado(id: string, estado: Estado): Promise<Prospecto>;
  update(id: string, patch: ProspectoPatch): Promise<Prospecto>;
  remove(id: string): Promise<void>;
}

const ESTADOS = [
  "nuevo", "contactado", "mini-lista", "mini-enviada",
  "propuesta-enviada", "negociacion", "cerrado", "perdido",
] as const;

const zScores = z.object({
  global: z.number().optional(),
  naver: z.number().optional(),
  instagram: z.number().optional(),
  kakao: z.number().optional(),
  compra: z.number().optional(),
});

// Campos editables del pipeline desde el dashboard. Claves desconocidas se descartan.
export const zProspectoPatch = z
  .object({
    estado: z.enum(ESTADOS),
    rubro: z.string(),
    zona: z.string(),
    instagram: z.string(),
    naver_place: z.string(),
    kakao: z.string(),
    telefono: z.string(),
    observacion: z.string(),
    scores_mini: z.number().int(),
    scores: zScores,
    plan_recomendado: z.enum(["기본", "성장", "프리미엄"]),
    precio_propuesto: z.number().int(),
    monto_cerrado: z.number().int(),
    fecha_contacto: z.string(),
    fecha_mini: z.string(),
    fecha_completa: z.string(),
    fecha_propuesta: z.string(),
    reportes: z.array(z.object({ label: z.string(), url: z.string() })),
  })
  .partial();

export type ProspectoPatch = z.infer<typeof zProspectoPatch>;

// Alta manual desde el dashboard: 업체명 requerido, resto opcional. Claves desconocidas se descartan.
export const zProspectoCreate = z.object({
  업체명: z.string().trim().min(1),
  rubro: z.string().trim().optional(),
  zona: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  naver_place: z.string().trim().optional(),
  kakao: z.string().trim().optional(),
  telefono: z.string().trim().optional(),
  decisor: z.string().trim().optional(),
  observacion: z.string().trim().optional(),
});

export type ProspectoCreate = z.infer<typeof zProspectoCreate>;

class SupabaseProspectoRepo implements ProspectoRepo {
  list(): Promise<Prospecto[]> {
    return createStore().getAll();
  }

  get(id: string): Promise<Prospecto | null> {
    return createStore().get(id);
  }

  create(input: NewProspecto): Promise<Prospecto> {
    return createStore().create(input);
  }

  async updateEstado(id: string, estado: Estado): Promise<Prospecto> {
    return this.update(id, { estado });
  }

  async update(id: string, patch: ProspectoPatch): Promise<Prospecto> {
    const store = createStore();
    await store.update(id, patch);
    const updated = await store.get(id);
    // update() sobre un id inexistente afecta 0 filas sin error → lo detectamos acá.
    if (!updated) throw new Error(`Prospecto not found: ${id}`);
    return updated;
  }

  remove(id: string): Promise<void> {
    return createStore().remove(id);
  }
}

export const repo: ProspectoRepo = new SupabaseProspectoRepo();

export function getProspectos(): Promise<Prospecto[]> {
  return repo.list();
}
