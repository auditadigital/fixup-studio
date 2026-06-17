#!/usr/bin/env node
// CLI del engine sobre la tabla `prospectos` (Supabase). Fuente de la verdad.
// Las skills fixup-* lo invocan en vez de editar prospectos.json.
//
// Lee SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY de engine/.env (gitignored).
//
// Subcomandos:
//   list [--estado X] [--rubro Y]          imprime JSON de prospectos
//   get <id|업체명>                         imprime un prospecto
//   add-lead '<json>'                      inserta estado 'nuevo' (deriva id slug)
//   upsert '<json>'                        insert/update por id
//   set-estado <id|업체명> <estado> [--monto N]
//   patch <id|업체명> '<json>'              merge de campos (scores, fechas, plan…)
//   add-report <id|업체명> <label> <path>   push a reportes[]
//   delete <id|업체명>                      borra un prospecto
//   dump                                   snapshot {prospectos:[…]} a stdout
//
// Exit codes: 0 ok · 1 uso · 2 env faltante · 3 error DB · 4 no encontrado.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

// Node < 22 no trae WebSocket global; supabase-js lo exige al crear el cliente.
if (!globalThis.WebSocket) globalThis.WebSocket = (await import("ws")).default;

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENGINE_DIR = resolve(__dirname, "..");

const ESTADOS = [
  "nuevo", "contactado", "mini-lista", "mini-enviada",
  "propuesta-enviada", "negociacion", "cerrado", "perdido",
];

function die(code, msg) {
  process.stderr.write(`db.mjs: ${msg}\n`);
  process.exit(code);
}

// ── env ───────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = join(ENGINE_DIR, ".env");
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i === -1) continue;
      const k = t.slice(0, i).trim();
      const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      if (process.env[k] === undefined) process.env[k] = v;
    }
  }
  const url = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    die(2, "faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY (engine/.env)");
  }
  return { url, key };
}

// ── mapeo fila DB ↔ objeto de dominio (prospectos.json) ──────────────────
function mapRow(row) {
  const p = { id: row.id, 업체명: row.nombre_negocio, estado: row.estado };
  if (row.rubro != null) p.rubro = row.rubro;
  if (row.zona != null) p.zona = row.zona;
  if (row.instagram != null) p.instagram = row.instagram;
  if (row.naver_place != null) p.naver_place = row.naver_place;
  if (row.kakao != null) p.kakao = row.kakao;
  if (row.telefono != null) p.telefono = row.telefono;
  if (row.decisor != null) p.decisor = row.decisor;
  if (row.observacion != null) p.observacion = row.observacion;
  if (row.score_mini != null) p.scores_mini = row.score_mini;
  if (row.scores != null) p.scores = row.scores;
  if (row.plan_recomendado != null) p.plan_recomendado = row.plan_recomendado;
  if (row.precio_propuesto != null) p.precio_propuesto = row.precio_propuesto;
  if (row.monto_cerrado != null) p.monto_cerrado = row.monto_cerrado;
  if (row.fecha_contacto != null) p.fecha_contacto = row.fecha_contacto;
  if (row.fecha_mini != null) p.fecha_mini = row.fecha_mini;
  if (row.fecha_completa != null) p.fecha_completa = row.fecha_completa;
  if (row.fecha_propuesta != null) p.fecha_propuesta = row.fecha_propuesta;
  if (row.reportes != null) p.reportes = row.reportes;
  return p;
}

function toRow(p) {
  const r = {};
  const set = (col, val) => { if (val !== undefined) r[col] = val; };
  // Campos con alias: respetar `null` explícito (limpia la columna) preferiendo
  // la clave de dominio si está presente, si no la snake_case.
  const alias = (col, domainKey, dbKey) => {
    if (domainKey in p) set(col, p[domainKey]);
    else if (dbKey in p) set(col, p[dbKey]);
  };
  set("id", p.id);
  alias("nombre_negocio", "업체명", "nombre_negocio");
  set("rubro", p.rubro);
  set("zona", p.zona);
  set("instagram", p.instagram);
  set("naver_place", p.naver_place);
  set("kakao", p.kakao);
  set("telefono", p.telefono);
  set("decisor", p.decisor);
  set("estado", p.estado);
  set("observacion", p.observacion);
  alias("score_mini", "scores_mini", "score_mini");
  set("scores", p.scores);
  set("plan_recomendado", p.plan_recomendado);
  set("precio_propuesto", p.precio_propuesto);
  set("monto_cerrado", p.monto_cerrado);
  set("reportes", p.reportes);
  set("fecha_contacto", p.fecha_contacto);
  set("fecha_mini", p.fecha_mini);
  set("fecha_completa", p.fecha_completa);
  set("fecha_propuesta", p.fecha_propuesta);
  return r;
}

function slugify(name) {
  return String(name)
    .trim().toLowerCase().normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "").normalize("NFC")
    .replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
}

// ── helpers ─────────────────────────────────────────────────────────────
function parseJsonArg(arg, label) {
  if (!arg) die(1, `falta el argumento JSON de ${label}`);
  try { return JSON.parse(arg); } catch (e) { die(1, `JSON inválido en ${label}: ${e.message}`); }
}

function flag(args, name) {
  const i = args.indexOf(name);
  return i !== -1 && i + 1 < args.length ? args[i + 1] : undefined;
}

function out(obj) { process.stdout.write(JSON.stringify(obj, null, 2) + "\n"); }

async function deriveId(sb, name) {
  const base = slugify(name) || "prospecto";
  const { data, error } = await sb.from("prospectos").select("id").like("id", `${base}%`);
  if (error) die(3, error.message);
  const taken = new Set((data ?? []).map((r) => r.id));
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

// Resuelve un id por id exacto o, si no existe, por 업체명 (nombre_negocio) exacto.
async function resolveId(sb, ref) {
  let { data, error } = await sb.from("prospectos").select("id").eq("id", ref).maybeSingle();
  if (error) die(3, error.message);
  if (data) return data.id;
  ({ data, error } = await sb.from("prospectos").select("id,nombre_negocio").eq("nombre_negocio", ref));
  if (error) die(3, error.message);
  if (!data || data.length === 0) die(4, `no encontrado: ${ref}`);
  if (data.length > 1) die(4, `ambiguo (${data.length} con ese 업체명): ${ref} — usá el id`);
  return data[0].id;
}

async function fetchRow(sb, id) {
  const { data, error } = await sb.from("prospectos").select("*").eq("id", id).maybeSingle();
  if (error) die(3, error.message);
  if (!data) die(4, `no encontrado: ${id}`);
  return data;
}

// ── main ────────────────────────────────────────────────────────────────
const { url, key } = loadEnv();
const { createClient } = await import("@supabase/supabase-js");
const sb = createClient(url, key, { auth: { persistSession: false } });

const [cmd, ...args] = process.argv.slice(2);

switch (cmd) {
  case "list": {
    let q = sb.from("prospectos").select("*").order("created_at", { ascending: false });
    const estado = flag(args, "--estado");
    const rubro = flag(args, "--rubro");
    if (estado) q = q.eq("estado", estado);
    if (rubro) q = q.eq("rubro", rubro);
    const { data, error } = await q;
    if (error) die(3, error.message);
    out((data ?? []).map(mapRow));
    break;
  }

  case "get": {
    if (!args[0]) die(1, "uso: get <id|업체명>");
    const id = await resolveId(sb, args[0]);
    out(mapRow(await fetchRow(sb, id)));
    break;
  }

  case "add-lead": {
    const lead = parseJsonArg(args[0], "add-lead");
    const nombre = lead["업체명"] ?? lead.nombre_negocio;
    if (!nombre) die(1, "add-lead: falta 업체명");
    const id = await deriveId(sb, nombre);
    const row = toRow({ ...lead, id, estado: "nuevo" });
    if (lead.nombre && row.decisor === undefined) row.decisor = lead.nombre;
    if (lead.mensaje && row.observacion === undefined) row.observacion = lead.mensaje;
    const { data, error } = await sb.from("prospectos").insert(row).select("*").single();
    if (error) die(3, error.message);
    out(mapRow(data));
    break;
  }

  case "upsert": {
    const obj = parseJsonArg(args[0], "upsert");
    if (!obj.id) {
      const nombre = obj["업체명"] ?? obj.nombre_negocio;
      if (!nombre) die(1, "upsert: falta id o 업체명");
      obj.id = await deriveId(sb, nombre);
    }
    const row = toRow(obj);
    const { data, error } = await sb.from("prospectos").upsert(row, { onConflict: "id" }).select("*").single();
    if (error) die(3, error.message);
    out(mapRow(data));
    break;
  }

  case "set-estado": {
    const [ref, estado] = args;
    if (!ref || !estado) die(1, "uso: set-estado <id|업체명> <estado> [--monto N]");
    if (!ESTADOS.includes(estado)) die(1, `estado inválido: ${estado} (válidos: ${ESTADOS.join(", ")})`);
    const id = await resolveId(sb, ref);
    const patch = { estado };
    const monto = flag(args, "--monto");
    if (monto !== undefined) {
      const n = Number(monto);
      if (!Number.isFinite(n)) die(1, `--monto inválido: ${monto}`);
      patch.monto_cerrado = Math.trunc(n);
    }
    const { error } = await sb.from("prospectos").update(patch).eq("id", id);
    if (error) die(3, error.message);
    out(mapRow(await fetchRow(sb, id)));
    break;
  }

  case "patch": {
    const ref = args[0];
    if (!ref) die(1, "uso: patch <id|업체명> '<json>'");
    const obj = parseJsonArg(args[1], "patch");
    const id = await resolveId(sb, ref);
    const current = await fetchRow(sb, id);
    const row = toRow(obj);
    delete row.id; // no reescribir la PK
    // scores: merge superficial con lo existente (permite actualizaciones parciales)
    if (row.scores && current.scores) row.scores = { ...current.scores, ...row.scores };
    if (Object.keys(row).length === 0) die(1, "patch: sin campos para actualizar");
    const { error } = await sb.from("prospectos").update(row).eq("id", id);
    if (error) die(3, error.message);
    out(mapRow(await fetchRow(sb, id)));
    break;
  }

  case "add-report": {
    const [ref, label, path] = args;
    if (!ref || !label || !path) die(1, "uso: add-report <id|업체명> <label> <path>");
    const id = await resolveId(sb, ref);
    const current = await fetchRow(sb, id);
    const reportes = Array.isArray(current.reportes) ? current.reportes : [];
    reportes.push({ label, url: path });
    const { error } = await sb.from("prospectos").update({ reportes }).eq("id", id);
    if (error) die(3, error.message);
    out(mapRow(await fetchRow(sb, id)));
    break;
  }

  case "delete": {
    if (!args[0]) die(1, "uso: delete <id|업체명>");
    const id = await resolveId(sb, args[0]);
    const { error } = await sb.from("prospectos").delete().eq("id", id);
    if (error) die(3, error.message);
    out({ deleted: id });
    break;
  }

  case "dump": {
    const { data, error } = await sb.from("prospectos").select("*").order("created_at", { ascending: false });
    if (error) die(3, error.message);
    out({ prospectos: (data ?? []).map(mapRow) });
    break;
  }

  default:
    die(1, `comando desconocido: ${cmd ?? "(ninguno)"}. Ver el encabezado de db.mjs.`);
}
