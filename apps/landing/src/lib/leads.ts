import { z } from "zod";

// Validación del lead del formulario. La persistencia (slug, mapeo a Prospecto,
// insert) la hace @fixup/db (SupabaseStore.appendLead) desde el route handler.
export const zLead = z.object({
  nombre: z.string().trim().min(1),
  업체명: z.string().trim().min(1),
  rubro: z.string().trim().min(1),
  telefono: z.string().trim().regex(/^[0-9\-\s]{8,}$/),
  instagram: z.string().trim().optional(),
  naver_place: z.string().trim().optional(),
  mensaje: z.string().trim().optional(),
});
export type LeadInput = z.infer<typeof zLead>;
