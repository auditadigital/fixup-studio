-- Migración inicial: tabla única `prospectos` (fuente de la verdad).
-- Migra data/prospectos.json → Supabase. Tipos en packages/types/SPEC.md.
-- Acceso server-side con service_role; RLS activado SIN políticas públicas.

-- Estado del prospecto (pipeline: lead → research → propuesta → cierre)
create type estado_prospecto as enum (
  'nuevo',
  'contactado',
  'mini-lista',
  'mini-enviada',
  'propuesta-enviada',
  'negociacion',
  'cerrado',
  'perdido'
);

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

create index prospectos_estado_idx  on prospectos(estado);
create index prospectos_rubro_idx   on prospectos(rubro);
create index prospectos_created_idx on prospectos(created_at desc);
create unique index prospectos_instagram_uniq
  on prospectos(lower(instagram)) where instagram is not null;

-- trigger updated_at
create function set_updated_at() returns trigger language plpgsql as $$
  begin new.updated_at = now(); return new; end $$;

create trigger prospectos_updated before update on prospectos
  for each row execute function set_updated_at();

-- RLS: activado, SIN políticas públicas → solo service_role (server) accede
alter table prospectos enable row level security;
