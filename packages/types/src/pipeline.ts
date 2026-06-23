import type { Estado } from "./index.js";

export const ESTADO_LABELS: Record<Estado, string> = {
  "nuevo": "New",
  "contactado": "Contacted",
  "mini-lista": "Mini queued",
  "mini-enviada": "Mini sent",
  "propuesta-enviada": "Proposal sent",
  "negociacion": "Negotiation",
  "cerrado": "Closed",
  "perdido": "Lost",
};

export interface PipelineColumn {
  key: string;
  label: string;
  estados: Estado[];
  dropTarget: Estado;
}

export const PIPELINE_COLUMNS: PipelineColumn[] = [
  { key: "nuevo",       label: "New",         estados: ["nuevo"],                      dropTarget: "nuevo" },
  { key: "contactado",  label: "Contacted",   estados: ["contactado"],                 dropTarget: "contactado" },
  { key: "mini",        label: "Mini",        estados: ["mini-lista", "mini-enviada"], dropTarget: "mini-enviada" },
  { key: "propuesta",   label: "Proposal",    estados: ["propuesta-enviada"],          dropTarget: "propuesta-enviada" },
  { key: "negociacion", label: "Negotiation", estados: ["negociacion"],                dropTarget: "negociacion" },
  { key: "cerrado",     label: "Closed",      estados: ["cerrado"],                    dropTarget: "cerrado" },
  { key: "perdido",     label: "Lost",        estados: ["perdido"],                    dropTarget: "perdido" },
];

export function columnForEstado(estado: Estado): PipelineColumn {
  const col = PIPELINE_COLUMNS.find(c => c.estados.includes(estado));
  if (!col) throw new Error(`No pipeline column for estado: ${estado}`);
  return col;
}
