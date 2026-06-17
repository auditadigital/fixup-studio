# Plan técnico — Fixup Studio / 픽스업 스튜디오 (Corea)

> Qué construir, **qué reutilizar de AuditaDigital LATAM**, y cómo operar las auditorías en **Claude Code**.
> Stack del producto: Next.js (App Router) + TypeScript + Tailwind, backend Node/TS, deploy en Vercel.
> Motor de operación: Claude Code + skills (reusa el orquestador de LATAM).

---

## 0. Cambios respecto al plan original

1. **Marca:** Fixup Studio / 픽스업 스튜디오 (la versión coreana es la de cara al cliente).
2. **Las auditorías NO se construyen dentro de la app.** Las dos auditorías (mini + completa) se generan en **Claude Code con skills**, reutilizando el sistema de LATAM y adaptándolo a Corea. → Se elimina la antigua **Fase 1B** (generador de auditoría in-app).
3. **Input de auditoría coreano:** no se crawlea una web (la mayoría de PyMEs locales no tienen). Se trabaja desde **Naver Place + Instagram + Kakao + screenshots** que pasan Nacho/esposa. Es human-in-the-loop.
4. La app web se enfoca en lo que **escala y es client-facing**: captación, link-in-bio, mensajería 알림톡 y dashboard.

---

## 1. Dos motores, separados a propósito

**Motor de OPERACIÓN — Claude Code + skills (reusa LATAM).**
Auditorías (mini + completa), prospección, propuestas, contenido y reportes. No requiere construir software. Es lo que te deja **prospectar y vender ya**.

**Motor de PRODUCTO — web app Next.js.**
Activos client-facing que escalan: web de captación, link-in-bio multi-cliente, automatización 알림톡, dashboard mensual. Se construye módulo a módulo, **solo cuando un cliente lo justifica**.

> Regla de oro (sigue vigente): no construyas el módulo N hasta tener un cliente real que lo pida.

---

## 2. Qué se reutiliza de AuditaDigital LATAM

El proyecto `Latam/auditorias` es un orquestador en Claude Code (skills + agentes) que ya resuelve gran parte del flujo. Se reutiliza casi todo, cambiando las dimensiones y el idioma:

| Asset LATAM | ¿Reusar? | Qué adaptar para Corea |
|---|---|---|
| **Harness orquestador** (`.claude/agents` + `.claude/skills/00-orquestador`) | ✅ Sí | Cambiar las 4 dimensiones (SEO/Negocio/MetaAds/Competidores) por **Naver / Instagram / Kakao / 구매까지의 길**. Input por canales+screenshots, no crawl. |
| **`01-mini-auditoria`** (lead magnet teaser) | ✅ Sí | Factores coreanos, input por Naver/IG/Kakao, copy en coreano, branding Fixup Studio. |
| **`02-propuesta`** (propuesta comercial HTML) | ✅ Sí | Planes coreanos (진단/기본/성장/프리미엄), copy coreano, ₩. |
| **`03-dashboard-propuestas`** + `prospectos.json` (pipeline) | ✅ Sí | Estados igual; idioma; integrar rubros coreanos. |
| **`04-campana-csv` / `05-recall-campana`** | ⚠️ Parcial | Canal de outreach coreano ≠ Gmail (ver §5, decisión abierta). El motor de "procesar CSV → generar mensaje → taggear" se reusa. |
| **`prospect-research-ar`** (skill de Cowork) | ✅ Adaptar | Crear variante **KR**: rubros (에스테틱/카페/미용실…) y ciudades coreanas (서울/부산/대구…). |
| **Design system de reportes** (`auditadigital-reports-extracted` + `shared.css`) | ✅ Sí | Rebrand a Fixup Studio + **tipografía coreana** (Pretendard/Noto Sans KR). Depende del nuevo style guide. |
| **Scoring + semáforo** (≥80 verde / 50–79 amarillo / <50 rojo) | ✅ Sí | Ya replicado en la plantilla `픽스업스튜디오_진단_템플릿.xlsx`. Reusar pesos. |

---

## 3. Las dos auditorías (operadas en Claude Code)

### 3A. Mini-auditoría — lead magnet (gratis)

**Objetivo:** captar. Un teaser que muestra hallazgos **reales** y deja lo premium bloqueado para crear deseo por la completa.

- **Input (Corea):** URL del Naver Place, handle de Instagram, canal de Kakao, + screenshots que pasa Nacho/esposa. **No** se crawlea una web.
- **Factores (~8, versión coreana)** evaluados ok/partial/bad:
  - Naver: foto principal, info/keywords actualizadas, reseñas.
  - Instagram: bio + CTA, consistencia de posteo, calidad visual.
  - Kakao: ¿canal creado?
  - Camino a la compra: ¿queda claro cómo reservar/comprar?
- **Score:** ok=1 / partial=0.5 / bad=0 → `score = round(suma/8*100)`. Mismo semáforo.
- **Output:** HTML teaser **en coreano**, branded Fixup Studio, con las secciones de la auditoría completa (las 4 categorías a fondo + plan de acción) **bloqueadas**.
- **Cierre:** actualiza el pipeline (`prospectos.json`, estado `mini-lista`) y genera el **mensaje listo para enviar** al prospecto.
- **Regla:** datos reales, nunca inventar scores ni hallazgos.

### 3B. Auditoría completa = el producto 진단 (₩99.000)

**Objetivo:** el producto cuña pago, entrega 48–72h, descontable si contratan plan mensual.

- **Estructura:** las **4 categorías** (네이버 / 인스타그램 / 카카오톡 / 구매까지의 길), **15 ítems** puntuables 0–5, score ponderado por categoría + global con semáforo + **plan de acción priorizado**. → Ya está en `Korea/Plantillas/픽스업스튜디오_진단_템플릿.xlsx`.
- **Input:** screenshots + observaciones que carga tu esposa (human-in-the-loop; Naver Place y Kakao no tienen API/crawl confiable para terceros).
- **Output:** reporte **en coreano**, branded Fixup Studio, exportable a **PDF** para entregar. Reusa el patrón "master dashboard" de LATAM, con las dimensiones coreanas.
- **Conexión:** un prospecto con mini-auditoría → upsell a 진단 completa → upsell a plan mensual.

---

## 4. La web app (producto) — módulos y orden

Sin el generador de auditoría (vive en Claude Code). El módulo de captación alimenta el mismo pipeline (`prospectos.json` o DB).

| # | Módulo | Para qué sirve | Desbloquea |
|---|--------|----------------|------------|
| 0 | **Base del proyecto** | Monorepo, deploy, i18n ko/es, multi-tenant (`client_id`) | Todo lo demás |
| 1 | **Web de captación** | Landing coreana + form de "auditoría gratis" → lead | **Vender** |
| 2 | **Link-in-bio multi-cliente** | Primer "fix" pago, reutilizable | **Entregar valor** |
| 3 | **Automatización 알림톡 (Solapi)** | Recordatorios, reseñas, cupones por Kakao | Plan **성장/프리미엄** |
| 4 | **Dashboard de resultados** | Reporte mensual al cliente | **Retención** |
| 5 | **Mini-CRM** | Pipeline prospecto → cliente (arrancar en Notion/Airtable) | **Escala** |

### Decisiones técnicas que siguen vigentes
- **Kakao 알림톡 → vía Solapi** (canal verificado → PFID → plantillas aprobadas 1×1 → API/SDK Node; ~8₩/alimtalk, fallback SMS).
- **Naver Place → sin API pública de stats.** El dashboard arranca con **carga manual** (la métrica la copia tu esposa del Smart Place).
- **Instagram → Graph API de Meta** si el cliente conecta su cuenta business.
- **Multi-tenant desde el día 1** (`client_id` en todo).

> Los prompts listos para pegar de cada módulo (Base, Captación, Link-in-bio, 알림톡, Dashboard, CRM) son los del plan original — válidos cambiando la marca a **Fixup Studio** y quitando la Fase 1B. Se mantienen como referencia.

---

## 5. Skills a crear/adaptar para Corea (Claude Code)

Espejo del set de LATAM, con prefijo `fixup-`:

| Skill | Origen LATAM | Estado |
|---|---|---|
| `fixup-mini-auditoria` | `01-mini-auditoria` | Adaptar (canales coreanos, copy ko) |
| `fixup-auditoria` (완전 진단) | `00-orquestador` + plantilla 진단 | Adaptar (4 categorías coreanas) |
| `fixup-propuesta` | `02-propuesta` | Adaptar (planes ₩, copy ko) |
| `fixup-pipeline` | `03-dashboard-propuestas` | Reusar casi tal cual |
| `fixup-outreach` | `04-campana-csv` | Adaptar: genera **DM de Instagram** personalizado (no Gmail) + guión Naver/tel |
| `prospect-research-kr` | `prospect-research-ar` | Variante coreana (rubros/ciudades) |
| `fixup-contenido` | — (nuevo) | Blog/IG en coreano por tono de cliente |

**Canal de outreach — DECIDIDO.** Primario: **Instagram DM personalizado** (manual, uno a uno); secundario: **Naver / teléfono / visita**. La **mini-auditoría gratis** es la introducción. NO se hace email/SMS/Kakao masivo en frío (lo prohíbe el 정보통신망법 y es bandera roja cultural). Detalle completo, base legal y plantillas de mensaje en coreano: **`Korea/captacion-canales-corea.md`**.

---

## 6. Orden recomendado para arrancar

1. **Adaptar las skills de auditoría (mini + completa) a Corea.** Esto te deja prospectar y vender **sin construir app**. Prioridad máxima.
2. **Rebrand del design system de reportes a Fixup Studio** (depende del style guide nuevo — ver `Korea/brand/prompt-styleguide-fixup-studio.md`).
3. **3 mini-auditorías reales** a negocios de estética → tus primeros casos.
4. Convertir ≥1 en cliente pago (진단 → plan mensual).
5. **Fase 0 + Módulo 1** de la app (base + captación) cuando el volumen lo justifique.
6. **Link-in-bio** al primer cliente pago · **알림톡** al primer 성장 · **Dashboard/CRM** cuando el volumen lo pida.

> No construyas de más. Cada módulo de la app debe estar justificado por un cliente real. El motor de Claude Code te lleva de 0 a primeros clientes sin escribir una línea de la app.
