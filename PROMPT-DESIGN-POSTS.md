# Prompt para Claude (diseño) — Posts de Instagram Fixup Studio

> Pegá el **PROMPT MAESTRO** una vez. Después pedí cada post con su bloque de la tabla.
> Formato: feed de Instagram, **1080×1350 px (4:5)**, mobile-first, texto en coreano.

---

## PROMPT MAESTRO (pegar primero)

```
Sos diseñador/a de marca. Vas a generar plantillas de posts de Instagram para "Fixup Studio / 픽스업 스튜디오", un estudio de marketing digital para PyMEs locales coreanas (peluquerías, estética/dermato, cafés/restaurantes, pilates, odontología).

POSICIONAMIENTO: tercero neutral y honesto. Nada de promesas exageradas ni estética de "agencia de reviews falsas". Tono cercano, confiable, prolijo. El público son dueños de negocio de barrio en Corea.

ENTREGABLE: cada post como artifact HTML de 1080×1350 px (4:5), listo para captura/export a PNG. Mobile-first. Si te pido carrusel, generá cada slide como su propio frame de 1080×1350.

SISTEMA VISUAL (style guide de la marca):
- Tipografías: títulos en "Jua" (display coreana, redonda y amigable); cuerpo en "Noto Sans KR"; números/datos/acentos en "Space Mono". Importá las tres de Google Fonts.
- Paleta: base CREMA cálido de fondo; CORAL como color de acento/CTA; texto en gris-carbón oscuro para legibilidad. Usá un "semáforo" (verde/ámbar/rojo) SOLO para indicar estado bueno/regular/malo en posts de diagnóstico.
- Estilo: limpio, mucho aire, bordes redondeados suaves, sombras sutiles. Iconografía simple de línea. Nada recargado.
- Coreano siempre en tipografía coreana correcta, sin cortes de línea raros. Jerarquía clara: gancho grande arriba, apoyo abajo.

ELEMENTOS FIJOS DE MARCA en cada post:
- Logo/wordmark "픽스업 스튜디오" discreto (esquina o pie).
- @fixup_studio visible y chico.
- Coherencia total de paleta y tipografías entre todos los posts (es una serie).

REGLAS:
- No inventes reviews, ratings falsos ni números sin fundamento.
- En posts de "caso real": anonimizá el negocio (ej. "○○ 미용실").
- Texto coreano natural y conciso. Si lo dudás, dejá el copy que te paso tal cual.

Cuando esté listo, te paso post por post: tipo, gancho (코piá literal el coreano), y contenido de apoyo. Confirmá que entendés el sistema y arrancamos por el post 1.
```

---

## Bloques por post (pasá uno por uno tras el prompt maestro)

Formato de pedido: *"Generá el post N. Tipo: ___. Gancho (título): ___. Apoyo: ___."*

| # | Tipo | Gancho / título (coreano) | Apoyo / contenido |
|---|---|---|---|
| 1 | Presentación | `안녕하세요, 픽스업 스튜디오입니다` | Subtítulo: "동네 사장님들의 온라인을 솔직하게 진단합니다". Tu foto/área para foto del founder. CTA suave: DM. |
| 2 | Autoridad | `손님이 검색해도 안 나오는 이유 3가지` | Carrusel 3 slides: 1 razón por slide (정보 누락 / 사진 / 리뷰 관리). Slide final: "무료 진단 받기 📩". |
| 3 | Caso real | `○○ 미용실 네이버, 이렇게 바꿨습니다` | Layout antes/después (2 columnas o 2 slides). Semáforo: antes rojo/ámbar → después verde. Nota "실제 미니진단". |
| 4 | Autoridad | `가짜 리뷰, 사장님께 독이 되는 이유` | 2–3 puntos. Tono de advertencia honesta. Refuerza diferencial "가짜 리뷰 X". |
| 5 | Tip | `네이버 대표사진, 이거 하나만 바꿔도 달라져요` | Comparación visual de foto de portada buena vs mala. 1 consejo accionable. |
| 6 | Caso real | `카페 인스타, 팔로워보다 중요한 것` | Diagnóstico de IG de un café (anonimizado). Foco: conversión > vanidad de followers. |
| 7 | Autoridad | `손님이 다시 오게 만드는 3단계` | Embudo visual: 찾게 → 기억하게 → 다시 오게 (Naver→IG→Kakao). Diagrama de 3 pasos. |
| 8 | Tip | `단골 만드는 카카오 채널 활용법` | 2–3 usos del Kakao 채널 para fidelizar. |
| 9 | Oferta | `무료 미니진단, 이렇게 받으실 수 있어요 📩` | Explica el mini-diagnóstico gratis en 3 pasos. CTA coral fuerte: "DM 주세요". Sin compromiso. |
| 10 | Caso real | `에스테틱 검색 노출, 2주 만에` | Antes/después de estética/dermato (anonimizado). Semáforo. |
| 11 | Persona/filosofía | `왜 저희는 솔직하게만 말씀드릴까요` | Texto editorial corto sobre el porqué del enfoque honesto. Tono humano, primera persona. |
| 12 | Tip / lead magnet | `오늘 바로 점검하세요 — 무료 체크리스트 5` | Checklist de 5 ítems en pantalla. CTA: pedir el checklist completo por DM. |

---

## Notas de uso

- Pedí los posts de **caso real (3, 6, 10)** reutilizando las imágenes que ya genera tu skill `fixup-mini-auditoria` — pasale ese .png como referencia de datos para que el diseño sea consistente.
- Mantené **una sola paleta y set tipográfico** en los 12 → tu grilla de perfil se ve como serie profesional, eso es parte de la validación.
- Para los carruseles (post 2 y 7), pedí explícitamente "cada slide como frame separado de 1080×1350".
- Si querés versión Stories, pedí el mismo contenido en **1080×1920 (9:16)**.
```
