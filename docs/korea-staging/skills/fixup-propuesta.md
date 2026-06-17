---
name: fixup-propuesta
description: "Genera la propuesta de PLAN MENSUAL (기본/성장/프리미엄) para un cliente que ya recibió el 진단, en coreano y branded Fixup Studio. Lee la auditoría completa para sacar los problemas y recomendar un tier, con el 진단 descontado. Guarda propuesta-[id].html (+ PDF) y actualiza prospectos.json a propuesta-enviada. Triggers: 'propuesta para', 'generá la propuesta de', '제안서 만들어', 'plan mensual para'."
---

# Propuesta de Plan Mensual — 월 운영 제안서 (Fixup Studio / 픽스업 스튜디오)

Adaptación del `propuesta` de LATAM. En Corea **NO vende la auditoría** (esa es la cuña ₩99.000 ya entregada): vende el **plan mensual recurrente** (la plata real), apoyándose en los hallazgos del 진단.

**Resultado SIEMPRE:** HTML coreano + PDF. **Datos reales:** los problemas salen del 진단, no se inventan.
**Idioma:** instrucciones en español; todo lo visible al cliente en **coreano**.

> Dependencia: `fixup-reports/propuesta.html` + `assets/shared.css`.

---

## Paso 0 — Leer el 진단 del cliente

```bash
ls clientes/[id]/        # carpeta de fecha más reciente
ls clientes/[id]/[fecha]/
```
Leé `auditoria-[id].html` (o los `scores` de `prospectos.json`). Extraé:
- **score_global** y **scores por categoría** (네이버/인스타/카카오/구매).
- Los **3 ítems de peor puntaje** del plan de acción priorizado.

Transformá esos hallazgos a **lenguaje de negocio/매출** (no técnico). Si no hay 진단, pedí los problemas al operador.

---

## Paso 1 — Recomendar el plan (tier)

Elegí el plan recomendado según el 진단 (guía, no regla rígida):
- **기본 ₩350.000/월** — si lo urgente es existir bien: Naver + Kakao básicos. (Score bajo solo en 네이버/카카오.)
- **성장 ₩650.000/월** (추천 por defecto) — si necesita el embudo completo: varias categorías flojas, falta contenido (blog/IG) y campañas Kakao. **El más elegido.**
- **프리미엄 ₩1.200.000+/월** — si quiere escalar: + web/landing, automatizaciones y pauta.

Definí `plan_recomendado` y una `reco-razon` de 1 frase en coreano ("진단 결과 OO·OO 영역이 약해 성장 플랜을 추천드립니다").

---

## Paso 2 — Variables

- **id**, **업체명**, **contacto** (사장님/nombre), **fecha_larga** (`2026년 6월 16일`)
- **output_path** — `clientes/[id]/[fecha]/propuesta-[id].html`
```bash
mkdir -p clientes/[id]/[fecha]
cp fixup-reports/assets/shared.css clientes/[id]/[fecha]/assets/shared.css
```

---

## Paso 3 — Generar el HTML

`Read: fixup-reports/propuesta.html` y reemplazá los `data-field`:

| data-field | Valor |
|---|---|
| `업체명` | nombre del negocio |
| `contacto` | nombre del contacto |
| `fecha` | fecha larga coreana |
| `resumen-venta` | 2–3 frases (매출 관점) |
| `problema-[1..3]-title` / `-detail` | 3 problemas en lenguaje de negocio |
| `reco-razon` | por qué ese plan |
| `cta-title` | título del cierre |

**Marcar el plan recomendado:** al `<div class="plan" id="plan-[recomendado]">` agregale la clase `rec` y dentro un `<div class="badge">추천</div>`. (Los precios/features de los 3 planes ya están en el template.)

**CTA:** reemplazá `{{CONTACT_URL}}` por el contacto de Fixup Studio (Kakao/Instagram).

Guardá con Write en `[output_path]` y exportá a PDF:
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --print-to-pdf="clientes/[id]/[fecha]/propuesta-[id].pdf" \
  "[output_path]"
open [output_path]
```

---

## Paso 4 — Texto de envío (coreano, por Kakao/DM acordado)

No es email frío: el cliente ya pagó el 진단, hay relación. Generá el mensaje y mostralo para copiar:

```
[업체명] 사장님, 진단 결과 바탕으로 월 운영 제안서 보내드려요 📄
[plan_recomendado] 플랜을 추천드리는데, 이유랑 다른 옵션도 정리해뒀어요.
진단비는 첫 달에서 할인 적용됩니다. 보시고 편하게 말씀 주세요!
```

---

## Paso 5 — Actualizar prospectos.json

Buscá el `id`: `estado` → `"propuesta-enviada"`, `fecha_propuesta` → hoy, `plan_recomendado`, `precio_propuesto` (precio del plan). Agregá a `reportes[]`: `{ "label": "제안서", "url": "[output_path-pdf]" }` (ruta local; sin hosting — ver `docs/data-plane.md`).
Estados válidos: `nuevo` · `contactado` · `mini-lista` · `mini-enviada` · `propuesta-enviada` · `negociacion` · `cerrado` · `perdido`.

---

## Paso 6 — Confirmar

> "월 운영 제안서 generado para **[업체명]**
> - Plan recomendado: **[plan_recomendado]** ([precio]/월)
> - HTML: `[output_path]` · PDF: `propuesta-[id].pdf`
> - prospectos.json → estado: propuesta-enviada
>
> Cuando haya novedades, decime: **'Actualizá [업체명] a negociacion / cerrado'**"
