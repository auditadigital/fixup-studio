# apps/landing — Design Spec

**Date:** 2026-06-16
**Branch:** feat/dashboard (landing work)
**Goal (single):** A Korean, mobile-first landing for **Fixup Studio / 픽스업 스튜디오** whose only conversion is the **무료 진단 (free diagnosis)** lead. Deploy on Vercel.

Source of truth: visual = `apps/landing/design_handoff_landing/` (README + styles.css + sections1/2.jsx + Style Guide); data shapes = `packages/types`; brand tokens = `packages/ui`. Pattern reference = `apps/dashboard` (working Next 15 app in this monorepo).

---

## 1. Decisions (locked with user)

1. **LeadStore fallback:** `FileLeadStore` (dev, appends to `../../data/prospectos.json`) + `ConsoleLeadStore` (prod, structured-JSON `console.info`). No external deps. CRM/DB wired later behind the same interface. Selected via `process.env.LEAD_STORE`.
2. **UI scope:** Landing sections live **local** in `apps/landing/src/components`. Only shared primitives (`Button`, `Card`, `Pill`, `Badge`) are enriched in `packages/ui` to match the handoff's `.btn-*`/card styling. Dashboard usage must not break.
3. **Copy:** Handoff Korean copy used **verbatim** (it is complete and is the source of truth). Only genuinely-missing real data is marked `TODO` and centralized in `lib/site.ts` — phone `02-1234-5678`, email `hello@fixup.studio`, Kakao `@fixupstudio`, and any "casos reales".
4. **next/image:** No real photos exist. Ship a CSS `Placeholder` (striped box + monospace brief, zero network) marked `TODO: fotos reales`; structure so swap to `next/image` is trivial when assets land. Requirement noted; deferral approved.

---

## 2. Stack & config

Mirror `apps/dashboard`:
- Next 15 App Router, React 19, TypeScript strict, Tailwind 3.4 + `@fixup/ui/tailwind-preset`.
- `next/font/google`: Jua (400), Noto Sans KR, Space Mono (400/700) → CSS vars `--font-jua / --font-noto-kr / --font-space-mono` on `<html lang="ko">`.
- `next.config.ts`: `transpilePackages: ["@fixup/ui","@fixup/types"]`; `outputFileTracingIncludes` for `../../data/prospectos.json` (so `FileLeadStore` can resolve it when present).
- `package.json` scripts: `dev/build/start/lint/typecheck/test` (vitest) — same as dashboard. Deps: `@fixup/types`, `@fixup/ui`, `next`, `react`, `react-dom`, `zod`. Dev: types, tailwind, postcss, autoprefixer, vitest.
- Vercel: project root = `apps/landing`; build = `next build` (turbo `^build` builds packages first).

---

## 3. File structure

```
apps/landing/
  next.config.ts · tailwind.config.ts · tsconfig.json · postcss.config.* · package.json
  public/                         # favicon, og image (TODO real), self-host fonts optional
  src/
    app/
      layout.tsx                  # fonts, <html lang=ko>, metadata + OpenGraph base
      page.tsx                    # / — composes Header + 9 sections + Footer + JSON-LD
      globals.css                 # import @fixup/ui tokens + ported handoff base/utilities
      privacy/page.tsx            # /privacy   (Korean, copy = TODO placeholder, reviewed by user)
      terms/page.tsx              # /terms     (idem)
      sitemap.ts                  # sitemap.xml  (/, /privacy, /terms)
      robots.ts                   # robots.txt
      api/leads/route.ts          # POST → zod re-validate → LeadStore.save
    components/
      Header.tsx Hero.tsx Problem.tsx Funnel.tsx Differentiator.tsx
      AuditReport.tsx Pricing.tsx Honesty.tsx Faq.tsx FinalCta.tsx Footer.tsx
      LeadForm.tsx                # 'use client' — fields, client-side zod, POST, success state
      Faq.tsx                     # 'use client' — single-open accordion
      Reveal.tsx                  # 'use client' — IntersectionObserver, prefers-reduced-motion, no-JS fallback visible
      Placeholder.tsx             # CSS striped box + brief
      Logo.tsx                    # squircle + check SVG (from handoff <Logo>)
      icons.tsx                   # stroke-SVG icon set (handoff I object, 1:1)
    lib/
      site.ts                     # central config: brand, nav, contacto (TODO), legal dates
      content.ts                  # Korean copy data arrays (PROBS, STAGES, RITEMS, RSTEPS, PLANS, DONTS, FAQS, BIZ, HERO)
      leads.ts                    # zLead schema, Lead→Prospecto mapping, LeadStore interface + impls
  __tests__/  (or *.test.ts colocated)  # vitest
```

Sections are server components by default. Client components: `LeadForm`, `Faq`, `Reveal` only.

---

## 4. Sections (order + exact copy)

Header (sticky) → Hero `#top` → Problem `#problem` → Funnel `#how` (`.sec-alt`) → Differentiator `#who` → Audit Report `#report` (`.sec-alt`) → Pricing `#pricing` → Honesty `#honesty` (`.sec-alt`) → FAQ `#faq` → Final CTA+Form `#contact` (`.sec-alt`) → Footer.

Copy is taken verbatim from `sections1.jsx` / `sections2.jsx`, moved into `lib/content.ts`. Key data:
- **Hero**: variant `pregunta` only. Eyebrow `동네 가게를 위한 디지털 마케팅`; H1 `우리 가게, / 온라인에서 [제대로] / 보이고 있나요?` (`제대로`=`.hl`); sub bracketed `<b>`; CTA row 3 (primary `무료 진단 받기 →`, `카카오톡 상담`, `전화하기` tel); trust line 3; floating cards (네이버 플레이스 1위 / 87점 / 카카오 채널 +312); logos strip 5 chips.
- **Problem**: `PROBS` ×3 (검색해도 안 나와요 / 인스타는 방치 상태 / 한 번 오고 안 와요) with `// …` mono notes.
- **Funnel**: `STAGES` ×3 Naver→Insta→Kakao with platform colors, vertical connectors (arrow), note line.
- **Differentiator**: portrait placeholder + 한국인 담당자 tag; compare block 흔한 대행사 (✕×3) vs 픽스업 스튜디오 (✓×3).
- **Audit Report**: sample report card — cover (○○ 에스테틱 · 강남점, 58/100 개선 여지 큼), 3 score cards (`RITEMS`, good/warn/urgent LED), 이번 달 실행 플랜 (`RSTEPS` ×3), CTA below.
- **Pricing**: `PLANS` ×4 — 진단 ₩99,000/1회 · 기본 ₩350,000/월 · **성장 ₩650,000/월 (feat "가장 인기")** · 프리미엄 ₩1,200,000~/월. Note line VAT 별도·약정 없음·진단비 100% 환급.
- **Honesty**: dark inset panel, `DONTS` ×4.
- **FAQ**: `FAQS` ×5 accordion, single-open, default first open.
- **Final CTA + Form**: left = kicker/title/paragraph + 3 ways (Kakao/phone/email from `site.ts`); right = LeadForm.

---

## 5. LeadForm + /api/leads

**Form fields** (handoff + SPEC union): 이름/성함\* (text), 업체명\* (text), 업종 (chip radios: 피부과·에스테틱 / 카페·디저트 / 음식점 / 미용실·헤어 / 기타), 연락처\* (tel), Instagram/Naver link (optional), 가게 주소/메시지 (textarea, optional).
> Handoff form omits 업체명 and Instagram/Naver; SPEC requires them. Reconciliation: **add 업체명 (required) and Instagram/Naver (optional)** to the form, keep handoff layout/styling. This satisfies `Lead` type (`업체명` required) and SPEC requisito 3.

**Client validation** (`LeadForm.tsx`): zod (`zLead`), mirrors handoff rules — name non-empty, 업체명 non-empty, phone `/^[0-9\-\s]{8,}$/`. On fail: mark `.err` + inline message + toast `입력을 확인해 주세요`. On 200: swap to success panel (`신청이 접수됐어요!`).

**`zLead`** (`lib/leads.ts`, shared client+server):
```ts
nombre: string min 1
업체명: string min 1
rubro: Rubro (one of BIZ, free string fallback)
telefono: string regex /^[0-9\-\s]{8,}$/
instagram?: string
naver_place?: string
mensaje?: string
```
`creado` is set server-side (ISO). Server re-validates (never trust client).

**Lead → Prospecto mapping** (`lib/leads.ts`): estado `"nuevo"`; `id` = slug(업체명) (+ short suffix to avoid collisions); copy fields across; `fecha_contacto` = today.

**LeadStore interface:**
```ts
interface LeadStore { save(lead: Lead): Promise<{ id: string }> }
```
- `FileLeadStore`: read-modify-write `../../data/prospectos.json` (`{prospectos: Prospecto[]}`), append. Resolves path like dashboard `repo.ts` (`PROSPECTOS_PATH` env or `cwd/../../data`). Dev only.
- `ConsoleLeadStore`: `console.info(JSON.stringify({ kind:"lead", lead, prospecto }))`. Prod fallback (Vercel filesystem read-only).
- Factory: `process.env.LEAD_STORE === "file"` → File, else Console. (Local dev sets `LEAD_STORE=file`.)

**Route** `app/api/leads/route.ts`: `POST` only; parse JSON; `zLead.safeParse`; 400 `{error, issues}` on fail; build Prospecto; `store.save`; 200 `{ok:true,id}`. `import "server-only"` in leads server code; `runtime = "nodejs"` (fs).

---

## 6. packages/ui enrichment

Enrich existing primitives to handoff fidelity WITHOUT breaking dashboard:
- `Button`: variants `primary` (accent-600 fill, white, hover→press, lift) / `secondary` (outline→accent) / `ghost` / `kakao` (`#FEE500` bg, ink `#3A2D00`); sizes `md`/`lg`/`block`; renders `<a>` or `<button>`. Additive props with safe defaults.
- `Card`, `Pill`, `Badge`: align radii/shadow/borders to tokens; keep current API.
- Add any new tokens to `tokens.css` if missing (`--insta-grad`, `--kakao-ink`, `--radius-lg 26px`, semáforo tints) and to `tailwind-preset.ts`.

Landing-only composite UI (Hero floating cards, report card, plan card, funnel stage, accordion) stays **local** — too page-specific to share.

---

## 7. Styling port

Port `design_handoff_landing/landing/styles.css` token model into `globals.css` + Tailwind:
- Bake **regular** density (`--sec-pad: 64px`), light theme, Coral accent. Drop `--sp`/density/theme knobs.
- Container `max-width:1180px`, side pad 20→32px. Radii 18/12/26, pills 999px. Shadows per README.
- `word-break: keep-all` on Korean text. `html { scroll-behavior:smooth; scroll-padding-top:72px }`.
- `.sec-alt` = `--bg-2`. `.hl` = accent. Eyebrow/kicker = Space Mono 700 uppercase tracking. Focus ring `0 0 0 4px var(--accent-tint)` on all focusables.

---

## 8. Interactions

- **Reveal**: `Reveal.tsx` IntersectionObserver, fade+rise (opacity 0→1, translateY 18→0, 0.6s). Visible by default (no-JS / SSR fallback); disabled under `prefers-reduced-motion` and print.
- **FAQ**: single-open accordion, animated max-height, `+`→`×` rotate, accent when open. Default index 0 open.
- **Header**: sticky, backdrop blur, bottom hairline; nav links hidden <900px (always-visible CTA covers mobile — no mobile menu in MVP, matches handoff).
- **Buttons**: hover lift, primary→press, ~0.18s.
- Anchor CTAs scroll to `#contact`; phone `tel:`; Kakao link from `site.ts`.

---

## 9. SEO / performance

- `layout.tsx` `metadata`: Korean title/description, keywords (네이버·인스타그램·카카오톡 마케팅, 동네 가게 마케팅, 무료 진단 …), OpenGraph (title/description/locale `ko_KR`/og image TODO), `metadataBase`.
- `page.tsx`: JSON-LD `<script type="application/ld+json">` with `LocalBusiness` + `Service` (name 픽스업 스튜디오, areaServed Seoul, offers = plans). Contact data from `site.ts`.
- `sitemap.ts` (/, /privacy, /terms), `robots.ts` (allow all, sitemap ref).
- Perf: static server components, CSS placeholders (no network), self-hostable fonts via `next/font`, minimal client JS → Lighthouse mobile > 90.

---

## 10. Testing (vitest, already wired at root)

- `zLead`: accepts valid lead; rejects empty 이름/업체명, bad phone.
- Lead→Prospecto mapping: estado `nuevo`, slug id, fields copied, `fecha_contacto` set.
- `ConsoleLeadStore.save`: returns id, logs structured JSON (spy `console.info`).
- `FileLeadStore.save`: appends to a temp JSON fixture, preserves existing, correct shape.
- (Reuse `@fixup/ui` `scoreColor` test pattern.)

---

## 11. Out of scope (MVP)

Real photography, real testimonials/cases (marked `TODO: casos reales`), dark theme toggle, mobile hamburger menu, real CRM/DB (interface ready), i18n beyond Korean, A/B hero variants.
