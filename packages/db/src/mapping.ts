// Mapeo fila DB ↔ tipo de dominio (packages/types). Puro, sin acceso a red.
//
// Diferencias de nombre clave:
//   nombre_negocio ↔ 업체명
//   score_mini     ↔ scores_mini
// `scores` y `reportes` viajan como jsonb ↔ objetos. El resto, snake_case directo.
// La fila tiene columnas que el tipo Prospecto no expone (decisor, created_at,
// updated_at): mapRow las ignora; toRow no las escribe (decisor se setea aparte
// en appendLead).

import type { Plan, Prospecto, Scores } from "@fixup/types";
import type { Json } from "./database.types.js";
import type { ProspectoRow, ProspectoUpdate } from "./row-types.js";

/** Fila DB → Prospecto. Los `null` de columnas opcionales se omiten. */
export function mapRow(row: ProspectoRow): Prospecto {
  const p: Prospecto = {
    id: row.id,
    업체명: row.nombre_negocio,
    rubro: row.rubro ?? "",
    estado: row.estado,
  };
  if (row.zona != null) p.zona = row.zona;
  if (row.instagram != null) p.instagram = row.instagram;
  if (row.naver_place != null) p.naver_place = row.naver_place;
  if (row.kakao != null) p.kakao = row.kakao;
  if (row.telefono != null) p.telefono = row.telefono;
  if (row.observacion != null) p.observacion = row.observacion;
  if (row.score_mini != null) p.scores_mini = row.score_mini;
  if (row.scores != null) p.scores = row.scores as Scores;
  if (row.plan_recomendado != null) p.plan_recomendado = row.plan_recomendado as Plan;
  if (row.precio_propuesto != null) p.precio_propuesto = row.precio_propuesto;
  if (row.monto_cerrado != null) p.monto_cerrado = row.monto_cerrado;
  if (row.fecha_contacto != null) p.fecha_contacto = row.fecha_contacto;
  if (row.fecha_mini != null) p.fecha_mini = row.fecha_mini;
  if (row.fecha_completa != null) p.fecha_completa = row.fecha_completa;
  if (row.fecha_propuesta != null) p.fecha_propuesta = row.fecha_propuesta;
  if (row.reportes != null) p.reportes = row.reportes as Prospecto["reportes"];
  return p;
}

/** Prospecto (parcial) → fila DB. Solo emite claves definidas (apto para update). */
export function toRow(p: Partial<Prospecto>): ProspectoUpdate {
  const r: ProspectoUpdate = {};
  if (p.id !== undefined) r.id = p.id;
  if (p["업체명"] !== undefined) r.nombre_negocio = p["업체명"];
  if (p.rubro !== undefined) r.rubro = p.rubro;
  if (p.zona !== undefined) r.zona = p.zona;
  if (p.instagram !== undefined) r.instagram = p.instagram;
  if (p.naver_place !== undefined) r.naver_place = p.naver_place;
  if (p.kakao !== undefined) r.kakao = p.kakao;
  if (p.telefono !== undefined) r.telefono = p.telefono;
  if (p.estado !== undefined) r.estado = p.estado;
  if (p.observacion !== undefined) r.observacion = p.observacion;
  if (p.scores_mini !== undefined) r.score_mini = p.scores_mini;
  if (p.scores !== undefined) r.scores = p.scores as Json;
  if (p.plan_recomendado !== undefined) r.plan_recomendado = p.plan_recomendado;
  if (p.precio_propuesto !== undefined) r.precio_propuesto = p.precio_propuesto;
  if (p.monto_cerrado !== undefined) r.monto_cerrado = p.monto_cerrado;
  if (p.reportes !== undefined) r.reportes = p.reportes as Json;
  if (p.fecha_contacto !== undefined) r.fecha_contacto = p.fecha_contacto;
  if (p.fecha_mini !== undefined) r.fecha_mini = p.fecha_mini;
  if (p.fecha_completa !== undefined) r.fecha_completa = p.fecha_completa;
  if (p.fecha_propuesta !== undefined) r.fecha_propuesta = p.fecha_propuesta;
  return r;
}

/** slug a partir del nombre del negocio. Conserva letras Unicode (Hangul incluido). */
export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

/** Deriva un id único desde el nombre; si choca con `existing`, agrega sufijo -2, -3… */
export function deriveId(name: string, existing: readonly string[]): string {
  const base = slugify(name) || "prospecto";
  const taken = new Set(existing);
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
