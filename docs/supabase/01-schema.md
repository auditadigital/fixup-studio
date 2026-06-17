# Prompt Claude Code — 01 · Schema Supabase

> Pegá en Claude Code en la raíz del monorepo. Requiere `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en env.

```text
<contexto>
Monorepo de "Fixup Studio". Migro la capa de datos de data/prospectos.json a Supabase (Postgres).
El proyecto Supabase YA existe; las claves están en env (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).
La fuente de la verdad pasa a ser UNA tabla `prospectos`. Tipos en packages/types/SPEC.md.
</contexto>

<objetivo>
Crear la migración SQL de la tabla `prospectos` (+ enum, índices, RLS, trigger) y aplicarla, y generar
los tipos TS de Supabase.
</objetivo>

<requisitos>
1. Usá Supabase CLI (supabase/migrations). Creá una migración con este schema:

   create type estado_prospecto as enum
     ('nuevo','contactado','mini-lista','mini-enviada','propuesta-enviada','negociacion','cerrado','perdido');

   create table prospectos (
     id                text primary key,                 -- slug
     nombre_negocio    text not null,                    -- ↔ 업체명
     rubro             text,
     zona              text,
     instagram         text,
     naver_place       text,
     kakao             text,
     telefono          text,
     decisor           text,
     estado            estado_prospecto not null default 'nuevo',
     observacion       text,
     score_mini        int,
     scores            jsonb,                             -- {global,naver,instagram,kakao,compra}
     plan_recomendado  text,
     precio_propuesto  bigint,                            -- ₩
     monto_cerrado     bigint,                            -- ₩
     reportes          jsonb not null default '[]',       -- [{label,url}]
     fecha_contacto    date,
     fecha_mini        date,
     fecha_completa    date,
     fecha_propuesta   date,
     created_at        timestamptz not null default now(),
     updated_at        timestamptz not null default now()
   );

   create index prospectos_estado_idx on prospectos(estado);
   create index prospectos_rubro_idx  on prospectos(rubro);
   create index prospectos_created_idx on prospectos(created_at desc);
   create unique index prospectos_instagram_uniq on prospectos(lower(instagram)) where instagram is not null;

   -- trigger updated_at
   create function set_updated_at() returns trigger language plpgsql as $$
     begin new.updated_at = now(); return new; end $$;
   create trigger prospectos_updated before update on prospectos
     for each row execute function set_updated_at();

   -- RLS: activado, SIN políticas públicas → solo service_role (server) accede
   alter table prospectos enable row level security;

2. Aplicá la migración al proyecto (supabase db push o equivalente).
3. Generá los tipos: `supabase gen types typescript` → guardalos en packages/db (o packages/types) como database.types.ts.
4. Si data/prospectos.json tiene filas, escribí un script de import (scripts/import-json.mjs) que las inserte
   (mapeando 업체명→nombre_negocio). Hoy puede estar vacío — dejá el script listo igual.
</requisitos>

<restricciones>
- service_role SOLO en server/engine. No exponer en el cliente.
- No borrar data/prospectos.json todavía (queda como seed/fallback hasta validar la migración).
</restricciones>
```
