# Migración a Supabase — prompts para Claude Code

Migra la capa de datos de `data/prospectos.json` a **Supabase** (Postgres). Pegá cada prompt en Claude Code, en orden.

## Decisiones
- Proyecto Supabase **ya existe** (tenés URL + keys).
- **Tabla única `prospectos`** como fuente de la verdad (lead → research → pipeline). `scores` y `reportes` como `jsonb`.
- Acceso **server-side con `service_role`** (sin auth de usuarios; el dashboard ya tiene su password interno). RLS activado sin políticas públicas → solo el server (service_role) entra.
- Reemplaza el data plane anterior (JSON-en-repo + GitHub API). El JSON queda como cache/seed opcional.

## Variables de entorno
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=      # SOLO server / engine — nunca en el cliente
# SUPABASE_ANON_KEY=            # opcional, para uso client-side futuro
```
Cargalas en: Vercel (landing y dashboard, como server env) y en `engine/.env` (gitignored).

## Orden de los prompts
1. **01-schema.md** — crea la tabla `prospectos`, enum, índices, RLS, trigger; genera los tipos.
2. **02-data-layer.md** — `packages/db`: `SupabaseStore` que implementa `ProspectoStore`.
3. **03-landing.md** — `/api/leads` escribe el lead en Supabase.
4. **04-dashboard.md** — el dashboard lee/gestiona desde Supabase (server-side).
5. **05-engine.md** — `engine/scripts/db.mjs` + actualizar las skills para usarlo en vez de `prospectos.json`.

> Tipos: `packages/types/SPEC.md` define `Prospecto` y `Lead`. El mapeo DB↔tipo (snake_case ↔ campos, `nombre_negocio`↔`업체명`) vive en `packages/db`.
