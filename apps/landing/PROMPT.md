# Prompt para Claude Code — apps/landing

> Pegá este prompt en Claude Code, abierto en la raíz del monorepo `fixup-studio/`. Antes, construí `packages/ui` y `packages/types`.
> 📌 DATOS: la persistencia del lead va por **Supabase** — seguí `docs/supabase/03-landing.md` (reemplaza el requisito 4 de abajo, que era GitHub/JSON).

```text
<contexto>
Monorepo Turborepo de "Fixup Studio / 픽스업 스튜디오", una agencia de marketing digital para PyMEs
locales coreanas. Estoy construyendo apps/landing: la web pública de captación. Objetivo ÚNICO:
que un dueño de negocio coreano pida una auditoría gratis (lead). Leé apps/landing/SPEC.md y los
packages/ui/SPEC.md y packages/types/SPEC.md.
</contexto>

<design>
HAY UN DESIGN HANDOFF de Claude Design en apps/landing/design_handoff_landing/ — es la FUENTE DE VERDAD
del diseño. Leelo ANTES de codear, en este orden:
1. design_handoff_landing/README.md — instrucciones completas: tokens, las 9 secciones con su copy coreano,
   interacciones, responsive, accesibilidad. (Empezá por acá.)
2. design_handoff_landing/landing/styles.css — todos los estilos + design tokens (fuente de verdad visual).
3. design_handoff_landing/landing/sections1.jsx y sections2.jsx — look, copy y comportamiento de cada sección.
4. design_handoff_landing/Fixup Studio - Style Guide.html — sistema de marca completo (referencia).

Reglas del handoff:
- Es un PROTOTIPO (React 18 + Babel en el browser) para previsualizar — NO lo copies tal cual.
  Recrealo en Next.js con build real, portando el modelo de tokens al design system de packages/ui.
- NO portes tweaks-panel.jsx ni la lógica de tweaks/theme del app.jsx (son herramientas de autoría).
  Usá los valores DEFAULT: hero variante "pregunta", acento Coral, densidad regular, tema claro.
- Reproducí colores, tipografía (Jua/Noto Sans KR/Space Mono), spacing e interacciones con alta fidelidad.
- Reveal on scroll con IntersectionObserver (no el hack del prototipo), respetando prefers-reduced-motion.
- Imágenes = placeholders con brief: dejalas como placeholders marcados (fotos reales después).
- Reemplazá el form hardcodeado por el endpoint real /api/leads (ver requisitos).
</design>

<objetivo>
Una landing en coreano, mobile-first, que explique el servicio y capture leads. Deploy en Vercel.
</objetivo>

<stack>
- Next.js 15 App Router + TypeScript (strict) + Tailwind
- Usa el design system de packages/ui (tokens del style guide: Jua / Noto Sans KR / Space Mono, paleta crema/coral)
- Tipos de packages/types
</stack>

<requisitos>
1. Páginas: / (landing), /privacy, /terms. Todo el copy visible en COREANO (dejá placeholders que reviso).
2. Secciones de / : seguí EXACTAMENTE el orden y copy del handoff (Header sticky → Hero → Problem →
   Funnel → Differentiator → Audit Report → Pricing → Honesty → FAQ → Final CTA+Form → Footer).
   Planes: 진단 99.000 / 기본 350.000 / 성장 650.000 (featured "가장 인기") / 프리미엄 1.200.000+.
3. LeadForm: 이름, 업체명, 업종, 연락처, Instagram/Naver, mensaje. Valida con zod. Route handler /api/leads.
4. LeadStore abstraído (ver docs/data-plane.md): /api/leads (a) appendea el lead como Prospecto estado "nuevo"
   en data/prospectos.json vía la GitHub Contents API (commit), y (b) notifica por email/Kakao. Vercel es
   read-only en runtime, así que NO escribas el archivo directo. Implementá GithubJsonStore detrás de la
   interfaz LeadStore. Manejá 409 (sha) con reintento; si el commit falla, igual mandá la notificación.
   Env: GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH, DATA_PATH, NOTIFY_EMAIL, KAKAO_WEBHOOK_URL.
   (Fallback alternativo documentado: notify-only + carga manual.)
5. SEO técnico: metadata, Open Graph, structured data (LocalBusiness/Service), sitemap.xml, robots.txt.
6. Performance: Lighthouse mobile > 90, next/image.
</requisitos>

<entregables>
- Páginas /, /privacy, /terms. Endpoint /api/leads (zod). Componentes reutilizables desde packages/ui.
- Configurado para deploy en Vercel (apuntando a apps/landing).
</entregables>

<restricciones>
- No inventes testimonios ni logos de clientes. Marcá "TODO: casos reales".
- Marca: Fixup Studio / 픽스업 스튜디오.
</restricciones>
```
