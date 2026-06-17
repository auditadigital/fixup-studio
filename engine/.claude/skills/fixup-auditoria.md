---
name: fixup-auditoria
description: "Auditoría completa (완전 진단) de un negocio local coreano para Fixup Studio = el producto pago 진단 (₩99.000). Evalúa 4 categorías / 15 ítems (Naver, Instagram, Kakao, 구매까지의 길) puntuados 0–5 a partir de screenshots + observaciones del operador, calcula score ponderado + semáforo + plan de acción priorizado, y genera un reporte coreano branded (HTML + PDF). Actualiza la base (Supabase vía scripts/db.mjs). Triggers: 'auditoría completa de', 'completa para', '완전 진단', 'genera el 진단 de'."
---

# Auditoría Completa — 완전 진단 (Fixup Studio / 픽스업 스튜디오)

El producto cuña pago (**진단 ₩99.000**, entrega 48–72h, descontable si contratan plan mensual). Adaptación del `orquestador` de AuditaDigital LATAM: en vez de 4 agentes que crawlean una web, evalúa **4 categorías / 15 ítems** de los canales coreanos, human-in-the-loop.

**Regla fundamental: datos reales.** No inventes scores, reseñas ni hallazgos. Si falta evidencia de un ítem, pedila; no la asumas.
**Regla de formato:** el resultado SIEMPRE es HTML coreano + exportación a **PDF** (el entregable pago).
**Idioma:** instrucciones en español (operativo); TODO lo visible al cliente, en **coreano**.

> Dependencia: el template `fixup-reports/index.html` + `shared.css` (tipografía coreana) salen del rebrand del style guide (`Korea/brand/prompt-styleguide-fixup-studio.md`). Base estructural mientras tanto: `Latam/auditorias/auditadigital-reports-extracted/index.html`.
> Plantilla de scoring de referencia (pesos/semáforo): `Korea/Plantillas/픽스업스튜디오_진단_템플릿.xlsx`.

---

## Paso 1 — Identidad + recolección de evidencia

Definí:
- **업체명**, **id** (slug kebab-case), **rubro**, **zona**
- Canales: **Naver Place URL**, **Instagram**, **Kakao Channel**
- **fecha** (`2026년 6월 16일`), **fecha-corta** (`YY-MM-DD`)
- **output_dir** — `clientes/[id]/[fecha-corta]`

```bash
mkdir -p clientes/[id]/[fecha-corta]/assets
cp fixup-reports/assets/shared.css clientes/[id]/[fecha-corta]/assets/shared.css
```

Recolectá la evidencia por ítem (de los screenshots/observaciones del operador + WebFetch de lo público que se pueda). Si ya hay un Excel de scoring cargado por la esposa (`clientes/[id]/.../진단.xlsx`), leelo y usá esos puntajes como input.

---

## Paso 2 — Puntuar los 15 ítems (0–5)

Puntuá cada ítem de 0 (없음/심각) a 5 (완벽). Para cada uno, escribí una `nota` en coreano con el hallazgo específico.

**네이버 (Naver)** — 5 ítems
1. 대표 사진 품질 (첫인상)
2. 키워드·업종 최적화
3. 정보 최신화 (영업시간·주소·메뉴)
4. 리뷰 수·응답 관리
5. 블로그 활동 (포스팅 빈도)

**인스타그램 (Instagram)** — 5 ítems
6. 프로필·바이오·CTA
7. 링크인바이오 활용도
8. 게시 일관성 (꾸준함)
9. 비주얼 퀄리티
10. 하이라이트 정리

**카카오톡 (Kakao)** — 3 ítems
11. 채널 개설·운영
12. 알림톡 설정
13. 고객·단골 확보 (DB)

**구매까지의 길 (camino a la compra)** — 2 ítems
14. 구매·예약 경로의 명확성
15. DM·문의 응답 속도

### Opción paralela (patrón LATAM, anti-teléfono)
Si querés acelerar, despachá **4 subagentes en un solo mensaje**, uno por categoría (`agent-naver`, `agent-instagram`, `agent-kakao`, `agent-compra`), cada uno evalúa sus ítems desde la evidencia y escribe `result-[categoria].json` con `{item, score, nota}`. Luego los leés con Read (no circulan por el chat). Los agent files se crean una vez en `.claude/agents/`. Sin ellos, puntuás los 15 ítems vos mismo en este paso.

---

## Paso 3 — Cálculo (idéntico a la plantilla Excel)

**Score por categoría (0–100):** `promedio(ítems de la categoría) / 5 × 100`

**Score global (ponderado):**
```
global = naver×0.30 + instagram×0.25 + kakao×0.25 + compra×0.20
```
(Pesos configurables — mismos que la hoja `설정` del Excel.)

**Semáforo (mismo que el Excel):**
- ≥ 80 → 🟢 `좋음` (clase `ok`)
- 50–79 → 🟡 `개선 필요` (clase `warn`)
- < 50 → 🔴 `시급` (clase `crit`)

---

## Paso 4 — Plan de acción priorizado

Ordená los 15 ítems por **prioridad = (5 − score)** descendente (peor puntaje = primero). Para los de mayor prioridad, redactá en coreano:
- `accion`: qué hacer concreto
- `por_que`: impacto en ventas (lenguaje de negocio, no técnico)
- `nivel`: `높음` (score ≤ 2) · `보통` (score 3) · `낮음` (score ≥ 4)

Este es el corazón del valor del 진단: priorizado, accionable, honesto.

---

## Paso 4.5 — Conciliación con la mini-auditoría

Leé el prospecto con `node scripts/db.mjs get "[id|업체명]"` (desde `engine/`). Si tiene `scores_mini`:
- Si el global completo difiere ≥ 10 puntos del mini, incluí una nota en coreano:
> "간이 진단은 기본 8개 항목을 봤고(점수 [score_mini]), 이번 완전 진단은 15개 항목을 깊이 분석했습니다. [score_global]점은 [1-2개 핵심 차이]를 반영합니다. 두 리포트는 같은 현실을 다른 깊이로 설명합니다."

Los `scores` del full audit se persisten en el Paso 7.

---

## Paso 5 — Generar reporte maestro (HTML coreano branded)

`Read: fixup-reports/index.html` y reemplazá:

| data-field | Valor |
|---|---|
| `업체명` | nombre del negocio |
| `rubro` / `zona` | rubro y zona |
| `fecha` | fecha larga coreana |
| `score-global` | número |
| `score-global-label` | 좋음 / 개선 필요 / 시급 |
| `score-naver` / `score-instagram` / `score-kakao` / `score-compra` | scores por categoría (0–100) |
| `[cat]-label` | semáforo por categoría |
| `item-[1..15]-score` / `item-[1..15]-nota` | puntaje y nota de cada ítem |
| `accion-[n]-*` | plan de acción priorizado |

Estructura del reporte (en coreano):
1. **Portada branded** Fixup Studio + 업체명 + fecha.
2. **Resumen ejecutivo** (2–3 frases): el problema principal, la categoría más fuerte, la oportunidad más clara.
3. **Score global + semáforo** y scores por categoría.
4. **Detalle por categoría** (los 15 ítems con puntaje y nota).
5. **Plan de acción priorizado** (Paso 4, peor-primero).
6. **CTA**: contratar plan mensual (기본/성장/프리미엄) con el 진단 descontado.

Clases de color `.num`/`.pill`: `ok` / `warn` / `crit`.

Guardá: `[output_dir]/auditoria-[id].html` y abrí con `open`.

---

## Paso 6 — Exportar a PDF (el entregable pago)

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --print-to-pdf="clientes/[id]/[fecha-corta]/auditoria-[id].pdf" \
  "clientes/[id]/[fecha-corta]/auditoria-[id].html"
```
Verificá que el coreano renderice perfecto (Pretendard/Noto Sans KR embebida). El PDF es lo que se entrega al cliente (vía Kakao/email **acordado con el cliente** — ya es relación pagada, no frío).

---

## Paso 7 — Actualizar la base (Supabase vía `db.mjs`)

> Fuente de la verdad: tabla `prospectos` en Supabase. NO edites `prospectos.json`. Corré desde `engine/`.

1. **Patch** del prospecto (merge de campos; `scores` se mergea con lo existente):
   ```bash
   node scripts/db.mjs patch "[id|업체명]" '{"scores":{"global":[g],"naver":[n],"instagram":[i],"kakao":[k],"compra":[c]},"fecha_completa":"[YYYY-MM-DD]","estado":"propuesta-enviada"}'
   ```
   `estado` → según corresponda (`propuesta-enviada` si seguís con la propuesta de plan mensual, o el que indique el operador).
2. **Adjuntá el reporte**:
   ```bash
   node scripts/db.mjs add-report "[id|업체명]" "완전 진단" "[output_dir]/auditoria-[id].pdf"
   ```

Estados válidos: `nuevo` · `contactado` · `mini-lista` · `mini-enviada` · `propuesta-enviada` · `negociacion` · `cerrado` · `perdido`.

---

## Paso 8 — Presentar y proponer siguiente paso

> "완전 진단 generado para **[업체명]**
> - Score global: [score_global]/100 ([semáforo])
> - 네이버 [n] · 인스타 [n] · 카카오 [n] · 구매까지의 길 [n]
> - Top 3 acciones priorizadas: [...]
> - HTML: `[output_dir]/auditoria-[id].html`
> - PDF (entregable): `[output_dir]/auditoria-[id].pdf`
>
> Siguiente: ¿genero la **propuesta de plan mensual** (`fixup-propuesta`) con el 진단 descontado?"
