// Importa data/prospectos.json → tabla `prospectos` en Supabase.
//
// Uso (las claves son SOLO server / service_role):
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/import-json.mjs
//   # o cargando un .env (Node 20+):
//   node --env-file=engine/.env scripts/import-json.mjs
//
// Flags:
//   --dry    no escribe; solo muestra qué insertaría
//
// Es idempotente: hace upsert por `id`. Hoy el JSON puede estar vacío — el script
// igual corre sin error. NO borra data/prospectos.json (queda como seed/fallback).

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

// Node < 22 no trae WebSocket global; supabase-js (realtime) lo exige al crear el cliente.
if (!globalThis.WebSocket) {
  globalThis.WebSocket = (await import("ws")).default;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const JSON_PATH = join(__dirname, "..", "data", "prospectos.json");
const DRY = process.argv.includes("--dry");

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

// Mapeo JSON (tipo Prospecto, packages/types) → fila DB (snake_case).
// Claves notables: 업체명 → nombre_negocio, scores_mini → score_mini.
function toRow(p) {
  return {
    id: p.id,
    nombre_negocio: p["업체명"] ?? p.nombre_negocio,
    rubro: p.rubro ?? null,
    zona: p.zona ?? null,
    instagram: p.instagram ?? null,
    naver_place: p.naver_place ?? null,
    kakao: p.kakao ?? null,
    telefono: p.telefono ?? null,
    decisor: p.decisor ?? null,
    estado: p.estado ?? "nuevo",
    observacion: p.observacion ?? null,
    score_mini: p.scores_mini ?? p.score_mini ?? null,
    scores: p.scores ?? null,
    plan_recomendado: p.plan_recomendado ?? null,
    precio_propuesto: p.precio_propuesto ?? null,
    monto_cerrado: p.monto_cerrado ?? null,
    reportes: p.reportes ?? [],
    fecha_contacto: p.fecha_contacto ?? null,
    fecha_mini: p.fecha_mini ?? null,
    fecha_completa: p.fecha_completa ?? null,
    fecha_propuesta: p.fecha_propuesta ?? null,
  };
}

async function main() {
  const raw = await readFile(JSON_PATH, "utf8");
  const parsed = JSON.parse(raw);
  const list = Array.isArray(parsed) ? parsed : parsed.prospectos ?? [];

  if (list.length === 0) {
    console.log("data/prospectos.json sin filas — nada que importar.");
    return;
  }

  const rows = list.map(toRow);

  // Validación mínima: id y nombre_negocio obligatorios.
  const bad = rows.filter((r) => !r.id || !r.nombre_negocio);
  if (bad.length) {
    console.error(`${bad.length} fila(s) sin id o nombre_negocio:`, bad);
    process.exit(1);
  }

  if (DRY) {
    console.log(`[dry] importaría ${rows.length} fila(s):`);
    for (const r of rows) console.log(`  - ${r.id}  ${r.nombre_negocio}  [${r.estado}]`);
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error(
      "Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en el entorno.\n" +
        "Probá:  node --env-file=engine/.env scripts/import-json.mjs",
    );
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("prospectos")
    .upsert(rows, { onConflict: "id" })
    .select("id");

  if (error) {
    console.error("Error al importar:", error.message);
    process.exit(1);
  }

  console.log(`Importadas ${data?.length ?? rows.length} fila(s) en prospectos.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
