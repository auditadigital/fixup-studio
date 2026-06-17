# supabase/ — migraciones + tipos

Migración de la tabla única `prospectos` (fuente de la verdad). Schema en
`migrations/20260616233628_init_prospectos.sql`.

## Estado

- [x] Migración SQL creada (enum, tabla, índices, RLS, trigger).
- [x] `database.types.ts` en `packages/db` (hecho a mano; **regenerar** con el CLI tras linkear).
- [x] `scripts/import-json.mjs` listo (mapea `업체명→nombre_negocio`, `scores_mini→score_mini`).
- [ ] **Aplicar al proyecto** — requiere link/credenciales (ver abajo). No corrido todavía:
      no hay `SUPABASE_*` en el entorno ni Docker local.

## Aplicar la migración

Necesitás el `PROJECT_REF` (dashboard Supabase → Project Settings) y el password de la DB.

```bash
# 1. login (abre browser, una vez)
npx supabase login

# 2. linkear el repo al proyecto existente
npx supabase link --project-ref <PROJECT_REF>

# 3. empujar la migración
npx supabase db push
```

Alternativa sin link, con connection string directa:

```bash
npx supabase db push --db-url "postgresql://postgres:<PASS>@db.<REF>.supabase.co:5432/postgres"
```

## Generar los tipos (tras aplicar)

```bash
npx supabase gen types typescript --linked > packages/db/database.types.ts
# o:  --project-id <PROJECT_REF>
```

## Importar data/prospectos.json (9 filas hoy)

```bash
# probar el mapeo sin escribir:
node scripts/import-json.mjs --dry

# importar (upsert idempotente por id):
node --env-file=engine/.env scripts/import-json.mjs
#   engine/.env debe tener SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
```

> `data/prospectos.json` NO se borra: queda como seed/fallback hasta validar la migración.
> `service_role` SOLO en server/engine — nunca en el cliente.
