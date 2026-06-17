---
name: fixup-contenido
description: "Redacta contenido en coreano (blog SEO para Naver + posts de Instagram) en el tono de cada cliente activo de Fixup Studio, a partir de notas/temas. Alineado al calendario de contenido (plan 성장: blog 4 + IG 8 / mes) y a los pilares de contenido. Guarda en la carpeta del cliente. Triggers: 'redactá contenido para', 'blog para', '인스타 글 써줘', 'contenido de [cliente]', 'escribí posts de'."
---

# Redacción de contenido — 콘텐츠 (Fixup Studio / 픽스업 스튜디오)

Para clientes **activos** (planes 기본/성장/프리미엄). Redacta en coreano en el **tono del cliente**.

**Regla fundamental: datos reales.** No inventes precios, servicios, resultados ni testimonios. Si falta un dato del negocio, pedíselo al operador.
**Idioma:** instrucciones en español; TODO el contenido en **coreano** (el cliente y su audiencia son coreanos). Por defecto **존댓말**, salvo que la ficha del cliente indique otra cosa.
**Ética:** nada de reseñas falsas ni promesas garantizadas (마케팅 정직 원칙).

---

## Paso 1 — Cargar contexto del cliente

1. Leé la ficha: `clientes/[id]/00_info/ficha-cliente.md` → **tono de voz** (estilo, 존댓말/반말, hacer/evitar, referencias), **rubro**, **zona**, canales, objetivos.
2. Leé el calendario del mes: `clientes/[id]/02_contenido/calendario/` → qué piezas faltan (estado ≠ 게시완료) y de qué tipo.
3. Si no hay ficha o calendario, pedí lo mínimo: tono y qué hay que comunicar este mes.

---

## Paso 2 — Definir el brief de cada pieza

Para cada pieza a redactar, definí:
- **tipo**: `blog` (Naver, SEO) · `instagram` (feed / reel / story)
- **pilar de contenido** (mezclar a lo largo del mes): 교육·정보 · 후기·신뢰 · 비포·애프터 · 이벤트·프로모션 · 브랜드·사람 · 예약 유도. (Ver hoja "콘텐츠 기둥" del calendario.)
- **tema** (de las notas del operador; si no hay, proponé desde el pilar y el rubro)
- **keyword(s) SEO** para blog: coreanas y **locales** (rubro + zona, ej: `강남 피부관리`, `해운대 카페 추천`). Sin keyword stuffing.
- **CTA**: 예약/문의/방문 (네이버 예약 링크, 카카오 채널, DM, 전화).

---

## Paso 3 — Redactar (coreano, tono del cliente)

### Blog SEO (Naver) — plan 성장: 4/mes
- **제목**: incluye la keyword principal, natural y atractivo.
- **구조**: intro (hook + para quién) → cuerpo con 소제목 (2–4 secciones) → cierre con CTA.
- **길이**: ~800–1,200자. Keyword en título, primer párrafo y 1–2 소제목, de forma natural.
- **형식**: párrafos cortos, listas donde ayude, tono del cliente. Sugerí dónde van fotos (`[사진: …]`).
- Naver-friendly: información útil real (no relleno), 지역+업종 context.

### Instagram — plan 성장: 8/mes
- **feed**: hook (primera línea) → cuerpo (valor/historia) → CTA → **해시태그** (mezcla de locales `#강남피부과` + de rubro + de marca). Sugerí el visual/carrusel (`[비주얼 제안: …]`).
- **reel**: guion corto (hook 3초 → 흐름 → CTA) + caption + hashtags.
- **story**: secuencia breve (3–5 컷) con texto por cuadro + sticker de CTA (예약/링크).

---

## Paso 4 — Guardar y registrar

- Blog → `clientes/[id]/02_contenido/blog/[YYYY-MM-DD]-[slug].md`
- Instagram → `clientes/[id]/02_contenido/instagram/[YYYY-MM-DD]-[slug].md`
  (incluí en el archivo: tipo, pilar, keyword/hashtags, CTA, y notas de visual.)
- Actualizá el calendario del mes: estado de esa pieza → `작성중`/`검토`.

---

## Paso 5 — Presentar para revisión

Mostrá cada pieza para que **la esposa revise el coreano** antes de publicar:
> "[업체명] · [tipo] · 펄러 [pilar]
> 제목/후크: …
> (texto completo)
> CTA: … · 해시태그: …
> 저장: `clientes/[id]/02_contenido/…`
>
> 검토 후 수정사항 있으면 알려주세요. 게시되면: '캘린더에서 [pieza] 게시완료로 바꿔줘'."

---

## Reglas de calidad
- El **tono del cliente manda** (leé la ficha; no apliques un estilo genérico).
- Coreano natural, no traducido literal. `word-break` mental: frases que cortan bien.
- SEO sin stuffing; keywords locales reales.
- No inventar datos del negocio. Si el tema requiere un precio/servicio/dato que no tenés, **preguntá**.
- Variar pilares en el mes; no repetir el mismo ángulo.
