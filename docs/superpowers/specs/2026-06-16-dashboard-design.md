# apps/dashboard — Design

> Panel de control reactivo del pipeline de ventas de Fixup Studio. Interno (no client-facing).
> Lee/gestiona `data/prospectos.json`. No genera auditorías (eso es el engine).

## Decisions (confirmadas)

| Tema | Elección |
|------|----------|
| Pipeline UI | Kanban + drag entre estados |
| Auth | HTTP Basic via middleware (env creds) |
| Seed | ~9 prospectos coreanos realistas, todos los estados |
| Monorepo | Full Turborepo (npm workspaces + turbo.json) |

## Estructura del monorepo

```
fixup-studio/
  package.json          # workspaces: ["apps/*", "packages/*"]
  turbo.json            # pipeline build/dev/lint/typecheck
  tsconfig.base.json    # strict, paths a @fixup/*
  packages/types/       # @fixup/types
  packages/ui/          # @fixup/ui
  apps/dashboard/       # @fixup/dashboard (Next 15)
  data/prospectos.json  # fuente de datos versionada (seeded)
```

## packages/types — `@fixup/types`

Re-exporta todos los tipos del SPEC (`Estado`, `Rubro`, `Plan`, `Scores`, `Prospecto`, `Lead`) sin
cambios. Agrega glue del pipeline:

- `ESTADO_LABELS: Record<Estado, string>` — estado → etiqueta coreana.
- `PipelineColumn = { key, label, estados: Estado[], dropTarget: Estado }`.
- `PIPELINE_COLUMNS: PipelineColumn[]` — 7 columnas ordenadas:

  | col | label | estados que agrupa | dropTarget |
  |-----|-------|--------------------|-----------|
  | nuevo | 신규 | `nuevo` | `nuevo` |
  | contactado | 접촉 | `contactado` | `contactado` |
  | mini | 미니 | `mini-lista`, `mini-enviada` | `mini-enviada` |
  | propuesta | 제안 | `propuesta-enviada` | `propuesta-enviada` |
  | negociacion | 협의 | `negociacion` | `negociacion` |
  | cerrado | 계약 | `cerrado` | `cerrado` |
  | perdido | 종료 | `perdido` | `perdido` |

- `columnForEstado(e: Estado): PipelineColumn` — helper inverso.

Build: `tsc` → `dist/`. `exports` apunta a `dist/index.js` + types.

## packages/ui — `@fixup/ui`

Materializa el style guide (tema claro). Exporta:

- `tokens.css` — CSS custom properties (`--bg`, `--coral`, `--good`/`--warn`/`--urgent`, `--radius`…)
  tal cual el SPEC de ui.
- `tailwind-preset.ts` — preset Tailwind con `theme.extend.colors` mapeando a los tokens, `borderRadius`,
  y `fontFamily` (display=Jua, sans=Noto Sans KR, mono=Space Mono).
- Componentes (client-safe, sin estado de negocio):
  - `Button` — variantes `coral` (primario) / `secondary` / `ghost`.
  - `Card` — superficie con radius + line.
  - `Pill` — semáforo (`good`/`warn`/`urgent`/neutral), para estado y scores.
  - `Badge` — etiqueta chica (rubro, canal).
  - `ScoreRing` — anillo 0-100 coloreado por `scoreColor`.
  - `PlanCard` — muestra plan recomendado + precio.
  - `FunnelSteps` — Naver → Insta → Kakao con colores de canal.
- `scoreColor(n: number): "good" | "warn" | "urgent"` — umbrales del style guide.

Build: `tsc` → `dist/`. `tokens.css` se publica como asset y se importa en el dashboard.

## Capa de datos (la costura para Supabase)

```ts
export interface ProspectoRepo {
  list(): Promise<Prospecto[]>
  updateEstado(id: string, estado: Estado): Promise<Prospecto>
}
```

- `JsonProspectoRepo` (server-only) — lee/escribe `data/prospectos.json` con `fs/promises`.
  Resuelve la ruta del JSON relativa a la raíz del monorepo.
- `getProspectos(): Promise<Prospecto[]>` = `repo.list()`. Único punto que la UI consume.
- Migración futura: implementar `SupabaseProspectoRepo` con la misma interfaz; la UI no cambia.

**Vercel caveat (documentado, no oculto):** el filesystem serverless es read-only. En prod
`updateEstado` (write) lanza `EROFS`. La API route captura el error y responde 503 con
`{ persisted: false }`; la UI mantiene el cambio optimista y muestra un toast "Cambio aplicado en
vista — no persiste hasta migrar a Supabase". Las lecturas funcionan normal. En local el write
persiste de verdad.

## apps/dashboard (Next 15 App Router, TS strict)

### Auth
`middleware.ts` — HTTP Basic. Lee `DASHBOARD_USER` / `DASHBOARD_PASS` de env. Si faltan o no
matchean → `401` con `WWW-Authenticate: Basic`. Aplica a todo salvo `/_next`, assets y `/api/health`.

### Rutas
- `/` — Server Component. Llama `getProspectos()`, pasa data inicial a los client components.
- `GET /api/prospectos` — devuelve la lista fresca (para el botón Reload).
- `POST /api/prospectos/[id]/estado` — body `{ estado }`. Llama `repo.updateEstado`. Maneja `EROFS`.
- `GET /api/health` — para healthcheck/excluir de auth.

### Componentes
- `<Metrics>` (client, deriva de la lista) — contadores por etapa, ₩ cerrado (Σ `monto_cerrado`),
  tasa conversión mini→cliente (`cerrado` / prospectos que pasaron por mini).
- `<PipelineBoard>` (client) — recibe data inicial; mantiene estado en React.
  - Kanban: una columna por `PIPELINE_COLUMNS`. Cards = prospectos.
  - Drag & drop nativo (HTML5 dnd) entre columnas → optimistic update + `POST …/estado` con el
    `dropTarget` de la columna destino. Rollback si la API falla de forma dura (no-EROFS).
  - Filtros: rubro / zona / estado + búsqueda por texto (업체명, zona, instagram).
  - **Prefs de filtros en `localStorage`** (solo UI — permitido por las restricciones).
  - Botón **Reload** → `GET /api/prospectos`, reemplaza el estado.
- `<ProspectoDrawer>` (client) — panel lateral derecho al click en una card:
  - Datos (업체명, rubro, zona, teléfono), canales vía `FunnelSteps` + `Badge`.
  - Scores: mini (`scores_mini`) + 완전 진단 por categoría (`scores.naver/instagram/kakao/compra/global`)
    con `ScoreRing` + `Pill` semáforo.
  - Plan recomendado (`PlanCard`) + precio propuesto / monto cerrado.
  - Historial de estado (derivado de las fechas `fecha_*`).
  - Links a reportes/PDF (si el prospecto los tiene; placeholder si no).

### Styling
`tailwind.config.ts` extiende el preset de `@fixup/ui`. `app/globals.css` importa `@fixup/ui/tokens.css`
+ Tailwind. Fuentes via `next/font/google` (Jua, Noto Sans KR, Space Mono). Cero estilos hardcodeados
fuera del design system.

## Seed data (`data/prospectos.json`)

~9 prospectos PyME coreanos cubriendo todos los estados, con rubros variados
(에스테틱/피부과, 미용실, 카페, 식당, 필라테스/헬스장, 치과), zonas de Seúl, canales, `scores_mini`,
`scores` completos en los avanzados, planes/precios/montos en los cerrados, y fechas coherentes para
que Métricas, Kanban y Ficha rendericen con datos reales.

## No-objetivos (MVP)

- No genera auditorías (engine).
- Sin DB — JSON versionado. `localStorage` solo para prefs de UI, nunca datos de negocio.
- Drag-persistence en prod queda para la migración Supabase (read-only FS).

## Verificación

- `npm run typecheck` y `npm run build` (turbo) pasan en strict.
- Dashboard arranca en local, pide Basic auth, muestra métricas + kanban con seed, drag persiste al
  JSON local, drawer abre con scores semaforizados, filtros persisten tras reload.
