---
name: fixup-mini-auditoria
description: "Mini-auditoría rápida (lead magnet) de un negocio local coreano para Fixup Studio. Evalúa 8 factores de Naver/Instagram/Kakao/구매까지의 길 a partir de los perfiles públicos + screenshots que pasa el operador. Genera mini-auditoria-[id].html en coreano, lo exporta a imagen/PDF para enviar por Instagram DM, y actualiza la base (Supabase vía scripts/db.mjs). Triggers: 'mini-auditoría de', 'mini para', 'lead magnet para', '미니 진단'."
---

# Mini-Auditoría — Lead Magnet (Fixup Studio / 픽스업 스튜디오)

Versión coreana de la mini-auditoría. Es la **introducción de valor** con la que captamos: no se vende, se regala un diagnóstico honesto. Adaptación de la skill `mini-auditoria` de AuditaDigital LATAM.

**Regla fundamental: datos reales.** No inventes scores, reseñas ni hallazgos. Si te falta info de un canal, pedila; no la asumas.
**Regla de formato:** el resultado SIEMPRE es un archivo HTML en coreano + su exportación a imagen/PDF para Instagram DM.
**Idioma:** instrucciones en español (operativo); TODO lo visible al cliente, en **coreano**.

> Dependencia: el template HTML rebrandeado (`fixup-reports/mini-auditoria.html`) y el `shared.css` de Fixup Studio se crean a partir del nuevo style guide (`docs/korea-staging/brand/prompt-styleguide-fixup-studio.md`). Hasta entonces, podés usar como base estructural el template de LATAM (`Latam/auditorias/auditadigital-reports-extracted/mini-auditoria.html`) reemplazando marca, idioma y factores.

---

## Paso 1 — Discovery (sin crawl de web)

Los negocios locales coreanos viven en Naver/Instagram/Kakao, no en una web. El input es:
- **Naver Place URL** (si tiene)
- **Instagram** (@handle / URL)
- **Kakao Channel** (si tiene)
- **Screenshots** que pasa el operador (Nacho/esposa) de lo que no es fetchable

Recolección — **automatizá todo lo posible primero, pedí capturas solo para lo bloqueado.**

**1. Auto-fetch con browser (skill `agent-browser`).** Antes de pedir nada al operador, sacá vos lo público:
   ```bash
   # Búsqueda Naver = la mina de oro (sin login, sin bot-block). Saca nombre, dirección,
   # teléfono, horarios, menú/precios, fama (TV/YouTube), y reseñas vía blogs.
   agent-browser open "https://search.naver.com/search.naver?query=[nombre]+[zona]"
   agent-browser get text body   # leé direccion/telefono/horario/menu/estado
   # versión móvil trae más reseñas de blog (contexto de sentimiento):
   agent-browser open "https://m.search.naver.com/search.naver?query=[nombre]+[zona]&where=m"
   agent-browser get text body
   ```
   Buscá señales de **estado del negocio** (폐업·영업종료·재개발·이전·휴업) — es go/no-go: si está por cerrar, **preguntá al operador antes de seguir** (puede saber por ser local).

**2. Lo que el browser NO puede (bloqueos conocidos, junio 2026) → mostrá la URL al operador para que capture a mano:**
   - **네이버 플레이스** (평점·리뷰수·대표사진·정보): el panel/iframe da error anti-bot. `https://map.naver.com/p/search/[nombre]` no rinde headless. **Pedí captura** (app o web): 상단 (대표사진+평점+카테고리) y 리뷰 탭 (방문자/블로그 리뷰 수 + si responde el dueño).
   - **Instagram** (bio·link·#seguidores·grid): login-wall inmediato. El `<title>` confirma que el perfil existe, nada más. **Pedí captura** logueado: 프로필 상단 + 그리드 (9-12 fotos).
   - **카카오 채널**: `https://pf.kakao.com/` o búsqueda en app. Preguntá existe/no.

**3. Al pedir capturas, SIEMPRE mostrá las URLs exactas** (Naver Place, IG, Kakao, búsqueda Naver) en un bloque copiable, así el operador abre y captura directo. No le hagas adivinar la query.

**4. Para lo no fetchable ni capturado** (reseñas internas Naver, calidad visual IG, uso de Kakao, claridad de reserva): **usá las capturas provistas**. Si falta un canal, preguntá antes de puntuarlo. **No inventes.**

Variables a definir:
- **업체명 / nombre del negocio**
- **id** — slug romanizado en kebab-case (ej: `cafe-seoul`, `mizi-skin`)
- **rubro** (에스테틱 / 카페 / 식당 / 미용실 / 치과 …)
- **fecha** — hoy en coreano largo (`2026년 6월 16일`)
- **fecha-corta** — `YY-MM-DD`
- **output_dir** — `clientes/[id]/[fecha-corta]`

```bash
mkdir -p clientes/[id]/[fecha-corta]/assets
cp fixup-reports/assets/shared.css clientes/[id]/[fecha-corta]/assets/shared.css
```

---

## Paso 2 — Evaluar los 8 factores

Evaluá cada factor como `ok`, `partial` o `bad`. (Mini = teaser; la versión profunda de 15 ítems es la auditoría completa paga 진단.)

| # | Factor | ok | partial | bad |
|---|--------|-----|---------|-----|
| 1 | **네이버 대표 사진** | 고품질 대표 사진, 공간/메뉴/시술이 잘 보임 | 사진 있으나 저화질·어두움 | 대표 사진 없음/부적절 |
| 2 | **네이버 정보·키워드** | 영업시간·주소·메뉴·키워드 정확하고 최신 | 일부 누락/오래됨 | 정보 부족/오류 |
| 3 | **네이버 리뷰** | 리뷰 다수 + 사장님 응답 있음 | 리뷰 적거나 응답 없음 | 리뷰 거의 없음 |
| 4 | **인스타 프로필·바이오·CTA** | 명확한 소개 + 예약/링크 CTA | 바이오 있으나 CTA 약함 | 바이오/링크 부실 |
| 5 | **인스타 게시 일관성** | 최근 꾸준히 게시 | 띄엄띄엄 게시 | 오래 방치됨 |
| 6 | **인스타 비주얼 퀄리티** | 일관된 톤 + 고퀄리티 | 들쭉날쭉 | 저품질 |
| 7 | **카카오톡 채널** | 채널 운영 중 | 채널 있으나 미활용 | 채널 없음 |
| 8 | **구매까지의 길** | 예약/구매 경로 명확 (예약 링크·전화·DM 안내) | 경로 모호 | 어떻게 사는지 불명확 |

**Score:**
- ok = 1 · partial = 0.5 · bad = 0
- `score_mini = round((suma / 8) × 100)`
- Label (coreano): `시급` (0–39) · `개선 필요` (40–69) · `양호` (70–84) · `우수` (85–100)
- Clase CSS score-box: `crit` (0–39) · `warn` (40–84) · `ok` (85+)

Conteos: `cant_ok`, `cant_partial`, `cant_bad`.
Para cada factor escribí un `detail` de 1 frase **en coreano**, con el hallazgo específico (no genérico).

---

## Paso 3 — Elegir top 3 acciones

De los factores `bad` y `partial`, elegí las 3 de mayor impacto. Para cada una (en coreano):
- `title`: acción concreta (5–10 palabras)
- `detail`: por qué importa + esfuerzo estimado (1–2 frases)
- chip: `높음` para factores `bad` · `보통` para `partial`

---

## Paso 4 — Generar HTML (coreano, branded Fixup Studio)

Leé el template: `Read: fixup-reports/mini-auditoria.html`
Generá el HTML con todos los reemplazos y guardalo en `[output_dir]/mini-auditoria-[id].html`.

### Reemplazos `data-field`
| data-field | Valor |
|---|---|
| `fecha` | fecha larga coreana (`2026년 6월 16일`) |
| `업체명` / `nombre` | nombre del negocio |
| `rubro` | rubro coreano |
| `score-mini` | número calculado |
| `score-mini-label` | 시급 / 개선 필요 / 양호 / 우수 |
| `cant-ok` / `cant-partial` / `cant-bad` | conteos reales |
| `factor-[1..8]-detail` | hallazgo coreano de cada factor |
| `action-[1..3]-title` / `action-[1..3]-detail` | top 3 acciones |

### Estado visual de cada factor
Para cada `<div class="factor [estado]">`: clase `ok`/`partial`/`bad`; `.mark` = `✓`/`!`/`✕`; `.verdict` = `OK` / `부분` / `미흡`.

### Color del score-box
`num ok` (≥85) · `num warn` (40–84) · `num crit` (0–39).

### Secciones bloqueadas (el teaser)
Dejá bloqueadas/borrosas las secciones que sí trae la **auditoría completa 진단**: análisis profundo de las 4 categorías (15 ítems), score ponderado y **plan de acción priorizado**. Eso crea el deseo por la paga.

### CTA de upgrade
Botón `완전 진단 받아보기 →` apuntando al contacto de Fixup Studio (canal de Kakao o Instagram de la agencia — `{{CONTACT_URL}}`). La completa es **진단 ₩99.000**, descontable si contratan plan mensual.

---

## Paso 5 — Guardar, abrir y EXPORTAR para Instagram DM

Guardá con Write y abrí:
```bash
open clientes/[id]/[fecha-corta]/mini-auditoria-[id].html
```

**Importante (Corea):** el reporte se envía por **Instagram DM**, donde no se puede pegar HTML. Exportá a imagen/PDF para adjuntar:
```bash
# opción A — PDF (Chrome headless)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --print-to-pdf="clientes/[id]/[fecha-corta]/mini-auditoria-[id].pdf" \
  "clientes/[id]/[fecha-corta]/mini-auditoria-[id].html"

# opción B — PNG (captura de pantalla larga)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --screenshot="clientes/[id]/[fecha-corta]/mini-auditoria-[id].png" \
  --window-size=1080,1920 "clientes/[id]/[fecha-corta]/mini-auditoria-[id].html"
```
Recomendado: PNG (más natural en DM). Confirmá que el coreano renderice bien (fuente Pretendard/Noto Sans KR embebida en el template).

---

## Paso 5b — Generar el texto del DM (coreano)

No es email: es el mensaje de Instagram DM que acompaña la imagen. Usá la plantilla de `docs/korea-staging/captacion-canales-corea.md` y personalizá:

```
[업체명] 사장님, 약속드린 무료 진단 보내드려요 📋
지금 잘 되고 있는 점과, 매출로 이어질 수 있는데 놓치고 있는 부분 몇 가지를 정리했어요.
([cant_bad]개 시급 / [cant_partial]개 개선 / [cant_ok]개 양호)
보시고 궁금한 점 있으시면 편하게 물어보세요. 도움이 되었으면 좋겠습니다!
```

Mostralo en el chat listo para copiar.

---

## Paso 6 — Actualizar la base (Supabase vía `db.mjs`)

> Fuente de la verdad: tabla `prospectos` en Supabase. **NO edites `prospectos.json`** (queda solo como backup vía `db.mjs dump`). Corré los comandos desde `engine/`.

1. **Upsert** del prospecto por `id` (crea si no existe, actualiza si existe; mapea `업체명`→`nombre_negocio`). Incluí solo las claves que tengas:
   ```bash
   node scripts/db.mjs upsert '{"id":"[id]","업체명":"[업체명]","rubro":"[rubro]","zona":"[zona]","instagram":"[instagram]","naver_place":"[naver_place]","kakao":"[kakao]","scores_mini":[score_mini],"fecha_mini":"[YYYY-MM-DD]","estado":"mini-lista"}'
   ```
   (Las claves que no mandes se preservan en la fila existente.)
2. **Adjuntá el reporte** (push a `reportes[]`):
   ```bash
   node scripts/db.mjs add-report "[id]" "미니 진단" "[output_dir]/mini-auditoria-[id].png"
   ```

Estados válidos: `nuevo` · `contactado` · `mini-lista` · `mini-enviada` · `propuesta-enviada` · `negociacion` · `cerrado` · `perdido`.

---

## Paso 7 — Instrucciones de envío (Instagram DM)

Mostrá en el chat:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📩 LISTO PARA ENVIAR POR INSTAGRAM DM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Adjuntá la imagen: mini-auditoria-[id].png
2. Pegá el texto del DM (Paso 5b)
3. Envío MANUAL, uno a uno (no automatizar)
4. Respetá horario (no 21–08h) y cualquier negativa
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

> Recordatorio legal/marca: es una introducción personalizada de valor, no publicidad masiva. Nada de blasting, bots ni (광고) electrónico masivo (정보통신망법). Ver `docs/korea-staging/captacion-canales-corea.md`.

---

## Confirmación final

> "미니 진단 generada para **[업체명]**
> - Score: [score_mini]/100 ([label])
> - [cant_ok] 양호 · [cant_partial] 개선 · [cant_bad] 시급
> - HTML: `[output_dir]/mini-auditoria-[id].html`
> - PNG para DM: `[output_dir]/mini-auditoria-[id].png`
> - Supabase → estado: mini-lista
>
> Cuando lo envíes, decime: **'Actualizá [업체명] a mini-enviada'**"
