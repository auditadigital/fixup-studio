# apps/landing — Web pública de captación

**Objetivo único:** que un dueño de negocio coreano pida la **auditoría gratis** (lead).

## Stack
Next.js (App Router) + TS + Tailwind. Design system de `packages/ui`. Deploy en Vercel. Mobile-first. Todo el copy visible en **coreano**.

> **Diseño:** la fuente de verdad visual es el handoff de Claude Design en `design_handoff_landing/` (README + styles.css + sections*.jsx + Style Guide). Reproducir con alta fidelidad; NO portar el panel de tweaks ni el React-en-browser. Detalle en `PROMPT.md`.

## Páginas
- `/` — landing.
- `/privacy`, `/terms` — legales (coreano).

## Secciones de `/`
1. **Hero** — el negocio tiene que verse bien en Naver, Instagram y Kakao a la vez. CTA: 무료 진단 받기.
2. **El embudo** — Naver (찾게) → Instagram (기억하게) → Kakao (다시 오게). Componente `FunnelSteps`.
3. **Diferencial** — tercero neutral y honesto, no reviews falsas; persona coreana real. (가짜 리뷰가 아니라 …)
4. **Planes** — `PlanCard` ×4: 진단 ₩99.000 · 기본 ₩350.000/월 · 성장 ₩650.000/월 (추천) · 프리미엄 ₩1.200.000+/월.
5. **CTA final** — formulario de lead.

## Formulario de lead
Campos: 이름(nombre), 업체명, 업종(rubro), 연락처(telefono), Instagram/Naver link, mensaje opcional.
Al enviar → crea un `Lead` (ver `packages/types`) y lo agrega a `data/prospectos.json` como `Prospecto` estado `nuevo`.
- MVP sin DB: route handler `/api/leads` que appendea a `data/prospectos.json` (o, si Vercel es read-only en runtime, manda el lead por Kakao/email + lo registra para commit). Dejar la escritura abstraída (`LeadStore`).

## SEO / performance
metadata + Open Graph + structured data (LocalBusiness/Service), `sitemap.xml`, `robots.txt`, keywords coreanas locales. Lighthouse mobile > 90. `next/image`.

## Restricciones
- Sin testimonios ni logos falsos (secciones marcadas `TODO: casos reales`).
- Marca: Fixup Studio / 픽스업 스튜디오 (Jua + Noto Sans KR).
