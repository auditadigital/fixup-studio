---
name: fixup-pipeline
description: "Genera el dashboard HTML del pipeline de ventas de Fixup Studio leyendo la base (Supabase vía scripts/db.mjs list). Muestra contadores por etapa, lista de prospectos con estados coreanos y colores, scores y monto cerrado en ₩. OPCIONAL: el dashboard React (Vercel) ya lee Supabase directo en vivo; esta skill es para un snapshot HTML local. Triggers: 'abrí el pipeline', 'ver prospectos', 'dashboard de ventas', '파이프라인 보기'."
---

# Dashboard de Pipeline — 파이프라인 (Fixup Studio / 픽스업 스튜디오)

Adaptación de `dashboard-propuestas` de LATAM. Genera `dashboard.html` reflejando el estado real de la base (Supabase). **Resultado SIEMPRE:** un HTML fresco. Idioma de cara al cliente: coreano (este dashboard es interno, pero usa labels coreanos).

> **Opcional.** El dashboard React en Vercel (`apps/dashboard`) ya lee Supabase en vivo y es la vista principal del pipeline. Usá esta skill solo si querés un snapshot HTML local/offline.

> Dependencia: `fixup-reports/dashboard.html` + `assets/shared.css`.

---

## Paso 1 — Leer los prospectos (Supabase vía `db.mjs`)

Desde `engine/`, traé todo en JSON:
```bash
node scripts/db.mjs list
```
(`list` devuelve `[{...prospecto}]`. Filtros opcionales: `--estado X`, `--rubro Y`.)

Contadores:
- **N_NUEVO** — estado `nuevo`
- **N_CONTACTO_MINI** — estado `contactado` | `mini-lista` | `mini-enviada`
- **N_PROPUESTA** — estado `propuesta-enviada`
- **N_NEGOCIACION** — estado `negociacion`
- **MONTO_CERRADO** — suma de `monto_cerrado` (o `precio_propuesto`) donde estado `cerrado`, formateado `₩X,XXX,XXX` (o `₩X.XM` si grande)

---

## Paso 2 — Estados → label + color (coreano)

| estado | label | color |
|---|---|---|
| `nuevo` | 신규 | `#8C8175` |
| `contactado` | 접촉 | `#E0A52E` |
| `mini-lista` | 미니 준비 | `#E0A52E` |
| `mini-enviada` | 미니 발송 | `#D85A40` |
| `propuesta-enviada` | 제안 발송 | `#D85A40` |
| `negociacion` | 협의 중 | `#8A4FBF` |
| `cerrado` | 계약 완료 | `#3E9E5B` |
| `perdido` | 종료 | `#D8492F` |

---

## Paso 3 — Generar el HTML

`Read: fixup-reports/dashboard.html` y reemplazá:
- `[FECHA]` — hoy (`2026년 6월 16일`)
- `[N_NUEVO]`, `[N_CONTACTO_MINI]`, `[N_PROPUESTA]`, `[N_NEGOCIACION]`, `[MONTO_CERRADO]`
- `[FILAS_PROSPECTOS]` — una `<tr>` por prospecto:

```html
<tr>
  <td><span class="pname">[업체명]</span></td>
  <td class="psub">[rubro] · [zona]</td>
  <td><span class="st" style="background:[COLOR]22;color:[COLOR]">[LABEL]</span></td>
  <td>[SCORE_TAGS]</td>
  <td>[PLAN_PRECIO]</td>
  <td class="psub">[FECHA_RELATIVA]</td>
</tr>
```

- **SCORE_TAGS:** si `scores.global` (o `scores_mini`) existe →
  `<span class="sc-tag [sc-red si <50 · sc-amber 50-79 · sc-green ≥80]">[SCORE]</span>`
- **PLAN_PRECIO:** si tiene `plan_recomendado`/`precio_propuesto` → `성장 · ₩650,000`; si no `—`.
- **FECHA_RELATIVA:** "N일 전" desde la última fecha (`fecha_mini`/`fecha_propuesta`/`fecha_contacto`).

Guardá con Write en `dashboard.html` (en la raíz del proyecto, con `assets/shared.css` accesible) y abrí:
```bash
cp fixup-reports/assets/shared.css assets/shared.css 2>/dev/null || true
open dashboard.html
```

---

## Paso 4 — Confirmar

> "파이프라인 actualizado — [N total] prospectos.
> 신규 [n] · 접촉·미니 [n] · 제안 [n] · 협의 [n] · 계약 ₩[monto]
> Archivo: `dashboard.html`"

---

## Actualizar estados (lenguaje natural)

El operador cambia estados hablando: "Actualizá [업체명] a mini-enviada" / "Actualizá [업체명] a cerrado, monto 650000". Aplicalo en la base con `set-estado` (acepta `id` o `업체명`), desde `engine/`:
```bash
node scripts/db.mjs set-estado "[id|업체명]" mini-enviada
node scripts/db.mjs set-estado "[id|업체명]" cerrado --monto 650000
```
Regenerá el dashboard HTML si lo piden (el React de Vercel ya refleja el cambio en vivo).
