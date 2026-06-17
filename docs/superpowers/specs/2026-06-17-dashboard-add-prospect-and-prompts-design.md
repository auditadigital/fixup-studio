# Dashboard: agregar prospecto + generar prompts de auditoría

Fecha: 2026-06-17

## Objetivo
Dos features en el dashboard interno:
1. Botón **`+ 프로스펙트 추가`** → form manual → crea prospecto (`estado='nuevo'`) en Supabase.
2. En la ficha (drawer), botones que **generan el prompt** (mini / completa / propuesta) para pegar
   en el engine (Claude Code). El dashboard NO corre la auditoría — solo arma el texto.

## Capa de datos (`@fixup/db`)
- `ProspectoStore.create(input)` + `SupabaseStore.create`: `input = { 업체명: string } & campos opcionales`
  (rubro, zona, instagram, naver_place, kakao, telefono, decisor). Deriva `id` (slug, sufijo si choca,
  vía `deriveId`), inserta `estado='nuevo'`, devuelve `Prospecto` (`mapRow`).

## API (dashboard)
- `POST /api/prospectos`: valida `zProspectoCreate` (zod; `업체명` requerido, resto opcional, strip de
  extras), `repo.create`, `revalidatePath('/')`, devuelve `{ prospecto }`. Detrás del Basic-auth.

## Prompts (puro, `lib/prompts.ts`)
- `buildPrompt(kind, p)` con `kind ∈ {'mini','completa','propuesta'}`. Trigger coreano
  (`미니 진단` / `완전 진단` / `제안서`) + datos del prospecto (업체명, id, 업종, 지역, 인스타/네이버/카카오);
  omite canales vacíos. Texto plano.

## UI (client, sin tocar el resto)
- `AddProspectoModal`: botón en el header del board → modal con el form → POST → agrega a la lista, cierra.
- `ProspectoDrawer`: sección `프롬프트 생성` con 3 botones → `navigator.clipboard.writeText(buildPrompt(...))`
  + toast "복사됨"; `<details>` para ver el texto.

## Tests
- `prompts.test.ts`: trigger + 업체명 + id + canales presentes; omite vacíos.
- `repo.test.ts`: `zProspectoCreate` (업체명 requerido / strip), `repo.create` (mock: deriva id + estado nuevo).

## Flujo
Dashboard genera texto → operador lo pega en el engine → engine corre la skill y persiste vía `db.mjs`
→ dashboard refleja al recargar.
