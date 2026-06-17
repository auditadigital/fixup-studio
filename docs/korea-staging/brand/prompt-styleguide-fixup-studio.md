# Prompt para Claude design — Style guide de Fixup Studio / 픽스업 스튜디오

> Pegá el bloque de abajo en Claude design. Está pensado para que genere un **style guide interactivo en HTML** (una sola página, self-contained) para una **identidad nueva**, creada desde cero para el mercado coreano. No reutiliza la paleta ni las tipografías de la marca madre: evolucionamos todo.

---

## ▼ PROMPT (copiar desde acá)

Sos un director de arte y diseñador de sistemas de marca. Quiero que crees, **desde cero**, la identidad visual de una marca nueva y la documentes en un **style guide interactivo, en una sola página HTML autocontenida** (HTML + CSS + JS inline, sin dependencias externas salvo Google Fonts). Entregá un documento navegable, prolijo y presentable, que sirva como fuente de verdad visual del proyecto.

Es una **identidad nueva**: definí vos la paleta, las tipografías y el lenguaje visual. No partas de ninguna marca preexistente.

### 1. La marca
- **Nombre:** Fixup Studio — en coreano **픽스업 스튜디오** (la forma coreana es la de cara al cliente).
- **Qué es:** un estudio de marketing digital para PyMEs locales coreanas (clínicas estéticas/피부과, cafés, restaurantes, peluquerías). Arma la presencia digital completa del negocio.
- **Posicionamiento:** un **tercero neutral y honesto** que primero **diagnostica** (진단) y después **ejecuta**. NO es una agencia de reviews falsas. El diferencial humano es que una **persona coreana real** atiende al cliente.
- **El producto / embudo:** Naver (que te encuentren) → Instagram (que te recuerden) → Kakao (que vuelvan). Tres plataformas conectadas en un solo camino de compra.
- **El nombre "Fixup Studio":** "fix up" = poner a punto, arreglar, dejar lindo el negocio del cliente; "Studio" = el lado creativo y con criterio estético. La identidad tiene que respirar ambas cosas.

### 2. Audiencia
Dueños de pequeños negocios locales en Corea del Sur, no técnicos. Empezamos por **estética / 피부과** (alto valor por cliente). Tienen que entender y confiar en 30 segundos. Leen en coreano.

### 3. Personalidad y tono
**Cálida, cercana y humana** — refuerza el diferencial de "una persona real que te atiende", no una agencia sin rostro. **Con un toque creativo de "studio"**: criterio estético, contemporáneo, con carácter. El equilibrio buscado: confiable y amable + creativo y con buen gusto. Honesto, claro, nada de jerga ni promesas infladas. Que un dueño de café sienta "esta gente es de fiar y además tiene onda".

Palabras guía para el mood: cálido · honesto · humano · cuidado · contemporáneo · cercano.

### 4. Dirección visual (identidad nueva — vos la definís)
Creá un sistema **fresco**, pensado para el mercado coreano y esta personalidad. Algunas guías (no reglas rígidas):
- **Paleta cálida y confiable**, no fría ni corporativa. Anclá en neutros cálidos (cremas, arenas, off-white, marrón suave o tinta cálida) y elegí **un acento de marca con carácter** que sea amable pero memorable (el guiño creativo de "studio"). Evitá clichés de agencia (azul corporativo genérico).
- Pensá en **light theme cálido como base** (los clientes coreanos locales responden a lo limpio, claro y acogedor), con un dark theme opcional.
- Documentá cada decisión de color con una línea de razón y su uso (primario, neutros, fondos, texto, estados).

**Sistema de color de plataforma** (importante, es parte del producto): definí accents para los 3 canales del embudo, armonizados con tu paleta nueva —
- Naver → verde
- Instagram → magenta/rosa (o gradiente)
- Kakao → amarillo
Mostralos como un set coherente, para usar en reportes, badges y el embudo. Pueden ajustarse de tono para convivir con la identidad.

**Semáforo de auditoría:** definí también los colores de 🟢 좋음 / 🟡 개선 필요 / 🔴 시급, integrados a la paleta.

### 5. Tipografía (REQUISITO: coreano primero)
La marca es de cara al cliente coreano, así que la tipografía coreana es el centro del sistema:
- **Primaria coreana:** elegí una de primer nivel — **Pretendard** (recomendada) o **Noto Sans KR**. Para todo el copy de cara al cliente.
- **Display con carácter** para el lado "studio"/creativo (títulos, marca): proponé una tipografía expresiva pero cálida, que combine bien con el coreano. Puede ser una display que tenga buen soporte multilingüe o convivir con la coreana.
- Definí cómo conviven **coreano + latín + números** en una misma jerarquía (tamaños, interlineado, pesos, tracking). El coreano tiene métricas distintas al latín: cuidá interlineado y peso para que se lea cómodo.
- Mostrá specimens **reales en coreano**, no lorem ipsum.

### 6. Qué debe incluir el style guide
1. **Portada** con el nombre Fixup Studio / 픽스업 스튜디오, tagline coreano y una frase de posicionamiento.
2. **Logo / wordmark:** propuesta de wordmark "픽스업 스튜디오" + "Fixup Studio" (y, si encaja, un símbolo/monograma nuevo). Zona de protección, tamaños mínimos, usos correctos/incorrectos, versión sobre claro/oscuro/color.
3. **Paleta de color:** swatches con hex, nombre y uso recomendado (primario, neutros cálidos, plataforma, semáforo). Incluí ratios de contraste / accesibilidad.
4. **Tipografía:** escala completa (display, headings, body, caption) con specimens en **coreano y español/inglés**.
5. **Componentes UI:** botones (primario/secundario/ghost), cards, **pricing cards** (planes 진단 ₩99.000 / 기본 ₩350.000 / 성장 ₩650.000 / 프리미엄 ₩1.200.000+), badges de estado, **estilo del reporte de auditoría** (portada + semáforo + plan de acción), formularios.
6. **Iconografía y embudo:** estilo de íconos; representación visual del embudo Naver→Instagram→Kakao.
7. **Fotografía / imágenes:** dirección de arte (cálida, real, negocios locales coreanos; nada de stock genérico ni reviews/testimonios falsos).
8. **Voz y tono (en coreano):** principios + ejemplos de copy ✅/❌. Honesto, cálido, claro.
9. **Do's & Don'ts** y **accesibilidad** (contraste mínimo AA, tamaños legibles).

### 7. Copy coreano para anclar el tono (usalo en los specimens)
- Tagline / hero: **우리 가게, 온라인에서 제대로 보이고 있나요?**
- Sub: **네이버 · 인스타그램 · 카카오톡 통합 마케팅. 광고대행사가 아니라, 솔직하게 진단하고 직접 실행하는 파트너.**
- Diferencial: **가짜 리뷰가 아니라, 실제로 응대하는 한국인 담당자가 직접 운영합니다.**

### 8. Entregable y restricciones
- **Formato:** una sola página HTML interactiva, responsive (mobile-first), self-contained, con los swatches y specimens en vivo. Fácil de abrir en el navegador y de exportar.
- Todo el copy de **cara al cliente en coreano**; las notas/anotaciones del style guide pueden ir en español o inglés.
- **Ética de marca:** la identidad debe respirar honestidad — nada que sugiera reviews falsas, testimonios inventados ni promesas de resultados garantizados.
- Documentá las decisiones de diseño con una línea de razón cada una.

### 9. Pedido extra
Antes de fijar, mostrame **2–3 variantes de dirección** (por ejemplo: una más cálida-terrosa, una más fresca-clara, una más audaz-creativa) con su paleta y display, para elegir una y profundizarla.

## ▲ FIN DEL PROMPT

---

### Notas para Nacho (no pegar)
- Esta versión evoluciona **todo** (paleta + tipografía + lenguaje): identidad nueva, no atada a AuditaDigital. Si más adelante querés un hilo de continuidad con la marca madre, se puede reincorporar el símbolo en `/brand`.
- Pedí las 2–3 variantes y elegí una antes de aplicarla a las plantillas (auditoría, reportes, calendario) para que todo quede consistente.
- Pasale el resultado a tu esposa para validar que el coreano (tono del copy y naturalidad de "픽스업 스튜디오") suene bien a oído nativo.
