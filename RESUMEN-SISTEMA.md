# Fixup Studio — Resumen del sistema

**Fixup Studio / 픽스업 스튜디오.** Estudio de marketing digital para PyMEs locales coreanas (에스테틱/피부과, 미용실, 카페/식당, 필라테스, 치과). Vende diagnósticos + planes mensuales que ordenan la presencia del negocio en **Naver → Instagram → Kakao** (찾게 → 기억하게 → 다시 오게).

Monorepo Turborepo. **3 piezas:** dos apps web (Vercel) + un motor de operación (Claude Code local). Datos compartidos en **Supabase** (tabla `prospectos`, fuente de la verdad).

```
landing ──(lead, estado "nuevo")──▶  Supabase: prospectos  ◀──(research/scores/estado)── engine (Claude Code)
                                          │
                                          ▼
                                      dashboard (lee + gestiona pipeline)
```

---

## 1. apps/landing — captación pública

- **Qué hace:** web pública mobile-first. Único objetivo: que un dueño pida la **auditoría gratis** (lead).
- **Stack:** Next.js (App Router) + TS + Tailwind, design system `packages/ui`. Copy 100% coreano. Deploy Vercel.
- **Páginas:** `/` (hero, embudo Naver/IG/Kakao, diferencial "tercero neutral honesto, no reviews falsas", planes, CTA-form), `/privacy`, `/terms`.
- **Planes mostrados:** 진단 ₩99.000 · 기본 ₩350k/mes · 성장 ₩650k/mes (추천) · 프리미엄 ₩1.2M+/mes.
- **Form de lead:** 이름/업체명/업종/연락처/IG-Naver/mensaje → `/api/leads` crea un `Lead` y lo inserta como `Prospecto` estado `nuevo`. Escritura abstraída (`LeadStore`), notifica a la operadora (email/Kakao).
- **SEO:** OpenGraph + structured data (LocalBusiness/Service), sitemap, robots, Lighthouse mobile >90.

## 2. apps/dashboard — panel de control interno

- **Qué hace:** app React reactiva, control central del negocio. Reemplaza al `dashboard.html` plano. **Solo lee y gestiona** el pipeline; NO genera auditorías.
- **Stack:** Next.js + TS + Tailwind, `packages/ui` + `packages/types`. Lee Supabase en vivo. Deploy Vercel.
- **Vistas:** pipeline kanban/tabla por estado (신규/접촉/미니/제안/협의/계약/종료), métricas (contadores, ₩ cerrado, conversión mini→cliente), ficha de prospecto (canales, scores mini + 진단, historial, links a reportes), filtros, clientes activos.
- **API:** `GET/POST /api/prospectos`, `/api/prospectos/[id]/estado`, patch/delete, `/api/health`.
- **Auth (`middleware.ts`):** Basic auth (`DASHBOARD_USER`/`PASS`), **fail-closed** en prod. Bypass acotado por **Bearer `INGEST_TOKEN`** solo en `POST /api/prospectos` (para que el routine cloud de research inyecte prospectos). Compare en tiempo constante.

## 3. engine — motor de operación (proyecto Claude Code)

NO es app web, NO se deploya. Es el proyecto de **Claude Code** que corre todo el flujo human-in-the-loop (screenshots de Naver/IG/Kakao). Skills disparadas por lenguaje natural.

### Skills (`engine/.claude/skills/`)
| Skill | Trigger | Qué hace |
|---|---|---|
| `prospect-research-kr` | "buscar prospectos" | Investiga PyMEs coreanas → CSV maestro, con 관찰메모 real por prospecto. Dedup. |
| `fixup-mini-auditoria` | "mini-auditoría de [업체명]" | **Lead magnet.** 8 factores Naver/IG/Kakao/구매경로 → `mini-auditoria-[id].html` + imagen/PDF para **Instagram DM**. Honesto, gratis. |
| `fixup-outreach` | "preparar DMs", "procesar CSV" | Por prospecto: corre la mini + arma DM coreano personalizado + imagen. **NO auto-envía** (manual, 정보통신망법). |
| `fixup-auditoria` | "auditoría completa de", "완전 진단" | **Producto pago ₩99.000.** 4 categorías / 15 ítems puntuados 0–5 → score ponderado + semáforo + plan priorizado → HTML coreano + **PDF**. |
| `fixup-propuesta` | "propuesta para", "제안서" | Lee el 진단 → recomienda tier mensual (기본/성장/프리미엄) con el 진단 descontado → HTML + PDF → estado `propuesta-enviada`. |
| `fixup-pipeline` | "파이프라인 보기" | Snapshot HTML local del pipeline (opcional; el dashboard React ya cubre esto en vivo). |
| `fixup-contenido` | "blog para", "인스타 글 써줘" | Para clientes activos: blog SEO Naver + posts IG en el tono del cliente (plan 성장: 4 blog + 8 IG/mes). |

### Capa de datos — `engine/scripts/db.mjs`
CLI Node sobre Supabase (lee `engine/.env` con `service_role`). Las skills lo invocan en vez de tocar el JSON.
```
db.mjs list [--estado X] [--rubro Y] | get <id|업체명> | add-lead '<json>'
       upsert '<json>' | set-estado <id> <estado> [--monto N] | patch <id> '<json>'
       add-report <id> <label> <path> | delete <id> | dump
```
Mapeo: `업체명`↔`nombre_negocio`, `scores_mini`↔`score_mini`; `scores`/`reportes` jsonb. Exit: 0 ok·1 uso·2 env·3 DB·4 no-encontrado.
> Nota: cambios de estado usan `set-estado`, NO `upsert` (upsert rompe en columnas NOT NULL).

### Reportes / entregables (`engine/clientes/[id]/[fecha]/`)
Mini (`.html`+`.png` → IG DM), 진단 (`.html`+`.pdf` → Kakao/email), propuesta (`.pdf`). **No se hostean**; entrega directa como adjunto. Cada reporte se registra en `prospecto.reportes[]` como `{label, url}` (ruta local; futuro: Vercel Blob sin cambiar el campo).

---

## Compartido

- **`packages/types`** — `Prospecto`, `Lead`, `Estado` (8 estados), `Rubro`, `Plan`, `Scores`; mapas de pipeline (`ESTADO_LABELS`, `PIPELINE_COLUMNS` → 7 columnas coreanas, `columnForEstado`). Tests vitest.
- **`packages/ui`** — design system del style guide: Jua + Noto Sans KR + Space Mono, paleta crema/coral, semáforo de estados. `tailwind-preset.ts`.
- **`packages/db`** — cliente DB compartido.
- **`supabase/migrations/`** — `init_prospectos.sql`: tabla `prospectos` (id slug PK, canales, estado enum, scores jsonb, montos ₩ bigint, reportes jsonb, fechas, trigger `updated_at`). **RLS ON sin políticas públicas** → solo `service_role` server-side. Índices por estado/rubro/created; unique en `lower(instagram)`.

## Pipeline de negocio (estados)
`nuevo` → `contactado` → `mini-lista` → `mini-enviada` → `propuesta-enviada` → `negociacion` → `cerrado` / `perdido`
Columnas dashboard: 신규 · 접촉 · 미니 · 제안 · 협의 · 계약 · 종료.

## Flujo end-to-end
1. **landing** capta lead → `prospectos` estado `nuevo` + aviso a operadora.
2. **engine** corre `research` → `mini` → outreach IG DM → `완전 진단` (pago) → `propuesta` (plan mensual = la plata real). Escribe scores/estado/reportes vía `db.mjs`.
3. **dashboard** lee Supabase en vivo, muestra pipeline + métricas + fichas, gestiona estados.

## Arquitectura — decisiones
- Monorepo Turborepo; apps comparten `ui` + `types`.
- Fuente de la verdad: **Supabase** (antes JSON versionado en repo; `data/prospectos.json` queda como backup vía `db.mjs dump`).
- Deploys: solo `landing` y `dashboard` en Vercel. `engine` corre local en Claude Code, acceso server-side con `service_role`.
- Stack: Next.js App Router + TS + Tailwind. Negocio coreano, human-in-the-loop, ética de marketing honesto (sin reviews/testimonios falsos).
