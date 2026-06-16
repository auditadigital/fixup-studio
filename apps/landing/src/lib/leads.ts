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

function slug(name: string, creado: string): string {
  const base = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9가-힣\-]/g, "");
  const t = Date.parse(creado);
  const suffix = Number.isNaN(t) ? "0000" : (t % 100000).toString(36);
  return `${base || "lead"}-${suffix}`;
}

export function leadToProspecto(lead: Lead): Prospecto {
  const fecha = lead.creado.slice(0, 10);
  // Prospecto has no contact-person field, so fold the owner name (and any message)
  // into observacion — otherwise the file store loses who to contact by name.
  const observacion = [`담당자: ${lead.nombre}`, lead.mensaje].filter(Boolean).join(" · ");
  return {
    id: slug(lead.업체명, lead.creado),
    업체명: lead.업체명,
    rubro: lead.rubro,
    instagram: lead.instagram,
    naver_place: lead.naver_place,
    telefono: lead.telefono,
    estado: "nuevo",
    observacion,
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
