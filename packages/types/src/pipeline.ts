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

// Flujo hacia adelante del pipeline (excluye "perdido", salida lateral).
// El botón "avanzar" mueve a la siguiente columna usando su dropTarget.
const FORWARD_FLOW: Estado[] = [
  "nuevo", "contactado", "mini-enviada", "propuesta-enviada", "negociacion", "cerrado",
];

/** Siguiente estado al avanzar de columna, o null si ya está al final (cerrado) o es perdido. */
export function nextEstado(estado: Estado): Estado | null {
  if (estado === "perdido") return null;
  const target = columnForEstado(estado).dropTarget;
  const i = FORWARD_FLOW.indexOf(target);
  if (i === -1 || i >= FORWARD_FLOW.length - 1) return null;
  return FORWARD_FLOW[i + 1] ?? null;
}
