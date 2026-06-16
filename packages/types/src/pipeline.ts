import type { Estado } from "./index.js";

export const ESTADO_LABELS: Record<Estado, string> = {
  "nuevo": "신규",
  "contactado": "접촉",
  "mini-lista": "미니 대기",
  "mini-enviada": "미니 발송",
  "propuesta-enviada": "제안 발송",
  "negociacion": "협의",
  "cerrado": "계약",
  "perdido": "종료",
};

export interface PipelineColumn {
  key: string;
  label: string;
  estados: Estado[];
  dropTarget: Estado;
}

export const PIPELINE_COLUMNS: PipelineColumn[] = [
  { key: "nuevo",       label: "신규", estados: ["nuevo"],                      dropTarget: "nuevo" },
  { key: "contactado",  label: "접촉", estados: ["contactado"],                 dropTarget: "contactado" },
  { key: "mini",        label: "미니", estados: ["mini-lista", "mini-enviada"], dropTarget: "mini-enviada" },
  { key: "propuesta",   label: "제안", estados: ["propuesta-enviada"],          dropTarget: "propuesta-enviada" },
  { key: "negociacion", label: "협의", estados: ["negociacion"],                dropTarget: "negociacion" },
  { key: "cerrado",     label: "계약", estados: ["cerrado"],                    dropTarget: "cerrado" },
  { key: "perdido",     label: "종료", estados: ["perdido"],                    dropTarget: "perdido" },
];

export function columnForEstado(estado: Estado): PipelineColumn {
  const col = PIPELINE_COLUMNS.find(c => c.estados.includes(estado));
  if (!col) throw new Error(`No pipeline column for estado: ${estado}`);
  return col;
}
