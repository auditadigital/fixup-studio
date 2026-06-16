import { z } from "zod";
import type { Lead, Prospecto } from "@fixup/types";

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

function slug(s: string): string {
  const base = s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9가-힣\-]/g, "");
  const sum = Array.from(s).reduce((a, c) => a + (c.codePointAt(0) ?? 0), 0);
  return `${base || "lead"}-${(sum % 9000) + 1000}`;
}

export function leadToProspecto(lead: Lead): Prospecto {
  const fecha = lead.creado.slice(0, 10);
  return {
    id: slug(lead.업체명),
    업체명: lead.업체명,
    rubro: lead.rubro,
    instagram: lead.instagram,
    naver_place: lead.naver_place,
    telefono: lead.telefono,
    estado: "nuevo",
    observacion: lead.mensaje,
    fecha_contacto: fecha,
  };
}

export interface LeadStore {
  save(lead: Lead): Promise<{ id: string }>;
}

export class ConsoleLeadStore implements LeadStore {
  async save(lead: Lead): Promise<{ id: string }> {
    const prospecto = leadToProspecto(lead);
    console.info(JSON.stringify({ kind: "lead", lead, prospecto }));
    return { id: prospecto.id };
  }
}
