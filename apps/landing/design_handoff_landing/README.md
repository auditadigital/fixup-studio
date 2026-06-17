# Handoff: Fixup Studio — Landing Page (픽스업 스튜디오)

## Overview
Landing page for **Fixup Studio / 픽스업 스튜디오**, a digital-marketing studio for local Korean SMBs (피부과/esthetics, cafés, restaurants, salons). It connects three channels into one purchase journey — **Naver (get found) → Instagram (be remembered) → Kakao (come back)** — and sells the human differentiator: a *real Korean account manager*, honest diagnosis first, no fake reviews.

The page's single conversion goal is the **무료 진단 (free diagnosis)** request, with secondary KakaoTalk and phone CTAs.

All **customer-facing copy is in Korean**. Code comments / this doc are in ES/EN.

---

## About the Design Files
The files in this bundle are **design references created in HTML/CSS/JSX** — a working prototype showing the intended look, copy, and behavior. **They are not production code to ship directly.**

Your task: **recreate this design in the target codebase's existing environment** (Next.js/React, Vue, Astro, SvelteKit, plain HTML, etc.), using its established patterns, component library, and conventions. If no environment exists yet, pick the most appropriate framework (a static-friendly stack like **Next.js or Astro** suits a marketing landing well) and implement there.

The prototype uses React 18 + Babel-in-browser purely so it runs from a single HTML file with no build step — **do not replicate that approach in production.** Use a real build pipeline.

---

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions are all intentional and should be reproduced faithfully. Match the design tokens below exactly. The only placeholders are **images** (striped boxes labeled in monospace with the photo brief) — swap these for real photography.

---

## Tech in the prototype (and what to replace)
| Prototype | Production guidance |
|---|---|
| React 18 UMD + Babel standalone (in-browser) | Real React/Vue/etc. with a bundler |
| `tweaks-panel.jsx` (in-design tweak panel) | **Drop entirely** — it is an authoring/preview tool, not a site feature. See "Tweaks" note below. |
| CSS custom properties in `landing/styles.css` | Keep the token model; port to your styling system (CSS Modules, Tailwind config, styled-components theme, etc.) |
| Google Fonts via `<link>` | Self-host or use your font pipeline (`next/font`, etc.) |
| Inline SVG icons (`I` object in `sections1.jsx`) | Replace with your icon library (lucide, heroicons) — names map 1:1 |
| Hardcoded form (no backend) | Wire to your real lead endpoint / CRM / Kakao channel |

> **Tweaks panel:** The prototype ships a floating "Tweaks" panel (theme/accent/hero-copy/density/funnel-layout). That is a *design-exploration* control, **not** part of the website. For production, pick the chosen values (defaults below) and ship those. A **light/dark theme toggle** in the real site is optional and up to product — the dark palette is fully specified if you want it.

---

## Design Tokens

### Color — neutrals (warm, light theme)
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#FBF8F2` | Page background (warm off-white, never pure white) |
| `--bg-2` | `#F4EEE3` | Alternating section background |
| `--surface` | `#FFFFFF` | Cards |
| `--surface-2` | `#FBF8F2` | Nested surfaces, input fields |
| `--cream` | `#F0E9DB` | Soft fills, hovers |
| `--sand` | `#E8DCC9` | Strong borders, placeholders |
| `--ink` | `#2A2520` | Primary text / headings (warm near-black) |
| `--ink-2` | `#5C544A` | Secondary text / body |
| `--ink-soft` | `#8C8175` | Tertiary text, captions, labels (large sizes only) |
| `--line` | `#EAE1D2` | Hairlines |
| `--line-2` | `#DFD4C0` | Stronger borders / input outlines |

### Color — brand accent (default = Coral)
| Token | Hex | Use |
|---|---|---|
| `--accent` | `#D85A40` | Brand accent, large display fills, highlights (`.hl`) |
| `--accent-600` | `#BE4733` | **Interactive** — buttons, links, text on light (AA-safe, ~5.1:1 on white) |
| `--accent-press` | `#A53C2A` | Pressed/hover-darker |
| `--accent-tint` | `color-mix(in srgb, var(--accent) 14%, var(--bg))` | Soft accent wash (chips, eyebrows, focus ring) |
| `--on-accent` | `#FFFFFF` | Text/icon on accent fills |

Rule of thumb: **fills/large display** use `--accent`; **buttons & body-size links** use `--accent-600`. Never put `--accent` (500) behind small white text.

### Color — platform system (part of the product; use in funnel, badges, reports)
| Channel | Hex | Notes |
|---|---|---|
| Naver | `#2E9E5B` | green · "Find" |
| Instagram | `#D24A8B` | magenta; gradient `linear-gradient(135deg,#F7A04A 0%,#D24A8B 52%,#8A4FBF 100%)` · "Recall" |
| Kakao | `#F4C20D` | yellow; ink-on-yellow `#3A2D00` · "Return" |

### Color — audit semáforo (status)
| Status | Color | Tint (light) | Label |
|---|---|---|---|
| Good | `--good #3E9E5B` | `#E7F1E9` | 🟢 좋음 |
| Needs work | `--warn #E0A52E` | `#F8EFD8` | 🟡 개선 필요 |
| Urgent | `--urgent #D8492F` | `#FBE6E1` | 🔴 시급 |
> Never communicate status by color alone — always pair the icon + Korean label (color-blind safe).

### Color — dark theme (optional)
`--bg #1E1A15` · `--bg-2 #181410` · `--surface #2A251F` · `--surface-2 #221E18` · `--cream #322B22` · `--sand #3A3228` · `--ink #F3ECDD` · `--ink-2 #CBC1B0` · `--ink-soft #998E7C` · `--line #39312A` · `--line-2 #473D33` · `--accent #EE6E52` (brighter for contrast on dark). Semáforo tints darken to `#1F2E23 / #332A18 / #33201B`.

### Alternate accents (explored; Coral is the chosen default)
Each is `[500, 600(button), press]`: Terracota `["#C8503A","#A83C2C","#8E2F22"]` · Ámbar `["#E0A52E","#946312","#7A5210"]` · Salvia `["#5B9E73","#3F7D5A","#356B4C"]`. Ship **Coral** unless product decides otherwise.

### Typography
- **Display / headings:** **Jua** (Google Fonts, single weight 400). Warm, rounded. Used for the wordmark, all section titles, plan names, big numbers. Never for body.
- **Body / UI:** **Noto Sans KR** (weights 300/400/500/700/900). All paragraphs, labels, buttons, form text. Excellent Korean metrics. *(Pretendard is an acceptable swap if your stack already uses it.)*
- **Mono / data:** **Space Mono** (400/700). Eyebrows, kickers, metric labels, code-like notes, platform tags. Gives the "honest/diagnostic" texture.

Type scale (mobile-first; headings use `clamp()`):
| Role | Font | Size | Line-height | Notes |
|---|---|---|---|---|
| Hero H1 | Jua | `clamp(31px,8.4vw,58px)` | 1.14 | tracking `-.015em`; `.hl` span = `--accent` |
| Section title `.h-sec` | Jua | `clamp(26px,6.4vw,40px)` | 1.16 | tracking `-.01em` |
| Card/plan title | Jua | 18–22px | 1.2 | — |
| Lead paragraph `.lead` | Noto Sans KR 400 | `clamp(15px,3.8vw,17px)` | 1.7 | `--ink-2`; `<b>` → `--ink` 700 |
| Body | Noto Sans KR 400 | 13–14.5px | 1.5–1.7 | `--ink-2` |
| Eyebrow / kicker | Space Mono 700 | 11px | — | `.16em` tracking, uppercase |
- Set `word-break: keep-all` on Korean text blocks for clean line breaks.

### Spacing / radius / shadow
- Section vertical padding `--sec-pad`: **64px** (regular). Density variants: compact 48px, comfy 84px. A global `--sp` multiplier (0.82 / 1 / 1.2) scales internal gaps — in production just bake in the **regular** values.
- Container: `max-width: 1180px`, side padding 20px (mobile) → 32px (≥760px).
- Radius: `--r 18px` (cards), `--r-sm 12px` (small), `--r-lg 26px` (report/form/hero panels), buttons `12–14px`, pills/badges `999px`.
- Shadows (light): card `0 1px 0 rgba(255,255,255,.6) inset, 0 10px 24px -18px rgba(60,45,30,.5)`; elevated `…0 22px 48px -32px rgba(60,45,30,.55)`; hero/report `…0 40px 80px -40px rgba(60,45,30,.6)`.

---

## Logo / Wordmark
- **Symbol:** rounded-square ("squircle", `rx≈9/34`) in `--accent` with a white check mark — see SVG in `sections1.jsx` `<Logo>` (path `M10.5 17.5l4 4 9-10.5`, stroke width 3.2). The check = "fix up / done".
- **Wordmark:** `픽스업 스튜디오` in **Jua**, with Latin `Fixup Studio` in Space Mono (uppercase, wide tracking) as the lockup subtitle.
- On dark: symbol fill `#EE6E52`, check stroke `#1E1A15`. On accent: symbol fill `#FFF7F0`, check `--accent`.
- Full usage rules (clear space = check height ×1, min sizes, do/don'ts) are documented in **`Fixup Studio - Style Guide.html`** (included).

---

## Screens / Views
Single long-scroll page. Sticky header + 9 sections + footer, in this order:

### 0. Header (sticky)
- **Layout:** full-width sticky bar, `backdrop-filter: blur(14px)` over translucent `--bg`, 1px bottom `--line`. Inner: brand (logo + wordmark) left; nav links (≥900px only) + primary button right.
- **Nav links:** 서비스 `#how` · 진단 리포트 `#report` · 요금제 `#pricing` · 자주 묻는 질문 `#faq`.
- **CTA button:** "무료 진단 받기" → `#contact`, `.btn-primary` (accent-600 fill, white text).

### 1. Hero `#top`
- **Layout:** 1 column on mobile; 2 columns (`1.05fr .95fr`) at ≥960px — copy left, visual right. Radial coral glow top-right.
- **Copy (default "pregunta" variant):**
  - Eyebrow (Space Mono + spark icon): `동네 가게를 위한 디지털 마케팅`
  - H1 (Jua): `우리 가게,` / `온라인에서 [제대로]` / `보이고 있나요?` — `제대로` wrapped in `.hl` (accent).
  - Sub: `네이버·인스타그램·카카오톡 통합 마케팅. [광고대행사가 아니라, 솔직하게 진단하고 직접 실행하는 파트너]입니다.` (bracketed = `<b>` ink-700)
  - **CTA row (3):** `무료 진단 받기 →` (primary) · `카카오톡 상담` (`.btn-kakao`, fill `#FEE500` ink `#3A2D00`, chat icon) · `전화하기` (`.btn-secondary`, phone icon, `href="tel:…"`). Stack vertically <560px, row ≥560px.
  - **Trust line:** three items with green dots — `광고대행사 아님` · `가짜 리뷰 없음` · `한국인 담당자 직접 운영`.
  - Two alternate hero copy variants exist in code (`directo`, `beneficio`) — ship **pregunta** unless told otherwise.
- **Hero visual:** placeholder image (4/5 aspect) = warm real photo of a shop owner; three floating cards overlaid — Naver "플레이스 1위", a score badge "87점" (Jua, accent), Kakao "채널 +312". These demonstrate the product; rebuild as absolutely-positioned cards.
- **Logos strip:** "이런 동네 가게와 함께합니다" + 5 pills (피부과·에스테틱 / 카페·디저트 / 음식점 / 미용실·헤어 / 필라테스·헬스).

### 2. Problem `#problem`
- Centered head: kicker `이런 적, 없으세요?`, title `가게는 좋은데, 온라인에서만 손님을 놓치고 있다면.`, lead.
- 3 cards (1 col → 3 col at ≥640px). Each: accent-tint icon chip, Jua title, body, Space Mono `// …` note. Content: (검색해도 안 나와요) / (인스타는 방치 상태) / (한 번 오고 안 와요). Full copy in `sections1.jsx` `PROBS`.

### 3. How it works — Funnel `#how` (`.sec-alt` bg)
- Centered head: `How it works · 작동 방식` / `세 채널, 하나의 구매 여정.`
- 3 stages with connectors (down-arrow vertical / right-arrow horizontal at ≥860px — prototype default **vertical**). Each stage: platform-colored icon chip (Naver green / Instagram gradient / Kakao yellow), step label (`01 · Find` etc.), Jua name + Korean role (`찾게/기억하게/다시 오게 만들기`), description.
- Note line: `한 채널만 잘해도 부족합니다. [세 개가 연결될 때] 손님이 단골이 됩니다.`

### 4. Differentiator `#who`
- 2 columns at ≥880px (`.9fr 1.1fr`): square placeholder portrait (manager) with a floating "한국인 담당자 · 직접 응대" tag (green dot) on left; copy right.
- Title `봇이 아니라, 진짜 사람이 응대합니다.` + paragraph.
- **Compare block** (2 cols ≥520px): `흔한 대행사` (muted, ✕ items) vs `픽스업 스튜디오` (green tint, ✓ items). Items in `sections2.jsx`.

### 5. Audit Report `#report` (`.sec-alt` bg)
- Centered head: `진단부터 · Diagnose first` / `실행 전에, 솔직한 진단부터.`
- **Report card** (max 860px, `--r-lg`, big shadow):
  - Cover: accent→press gradient, white text. Left: `온라인 presence 진단 리포트 · 샘플`, Jua `○○ 에스테틱 · 강남점`, subtitle. Right: score badge `58/100` "개선 여지 큼" in a translucent rounded box.
  - Body: 3 score cards (Naver good / Instagram warn / Kakao urgent) each with colored LED dot + 2 metric rows; then "이번 달 실행 플랜" with 3 numbered steps. Data in `sections2.jsx` `RITEMS`/`RSTEPS`.
- CTA below: `내 가게 무료로 진단받기 →` (primary).

### 6. Pricing `#pricing`
- Centered head: `요금제 · Pricing` / `진단으로 시작해서, 필요한 만큼만.`
- 4 plan cards (1 → 2 → 4 cols at 560/1040px). The **성장** plan is featured (`.feat`: accent border ring + "가장 인기" pop badge). Each: Jua name, description (min-height 36px for alignment), price (Jua), `/ 월|회`, Space Mono one-liner, check-list (accent check icons), button (featured = primary, others = secondary).
  - 진단 `₩99,000 / 1회` — 단발 진단
  - 기본 `₩350,000 / 월` — 가장 가벼운 시작
  - **성장 `₩650,000 / 월` — 가장 인기 (featured)**
  - 프리미엄 `₩1,200,000~ / 월` — 맞춤 견적
- Note: `// 모든 금액은 VAT 별도 · 약정 없음 · 진단 후 진행 시 진단비 100% 환급`

### 7. Honesty `#honesty` (`.sec-alt` bg)
- Dark inset panel (`--ink` bg, `--r-lg`, coral radial glow). Kicker `우리의 원칙` + spark icon. Title `신뢰는, 하지 않는 것에서 시작됩니다.` + subtitle.
- 4 "don't" items (2 cols ≥680px), each = urgent-tint ✕ chip + bold title + description. Content in `sections2.jsx` `DONTS` (no fake reviews / no inflated guarantees / no lock-in contracts / no black-box work).

### 8. FAQ `#faq`
- Centered head + accordion (max 760px). Each row: question (Noto 700) + circular `+` icon that rotates 45° → `×` and turns accent when open. Single-open behavior (`useState`, default first open). Answer animates `max-height`. 5 Q&As in `sections2.jsx` `FAQS`.

### 9. Final CTA + Form `#contact` (`.sec-alt` bg)
- 2 cols at ≥900px. Left: kicker `무료 진단 신청`, title `오늘, 우리 가게 [온라인 점수]부터 확인해 보세요.`, paragraph, and 3 "ways" rows (Kakao `@fixupstudio` / phone `02-1234-5678` / email `hello@fixup.studio`) each with icon chip.
- Right: **form card** (`--r-lg`, big shadow): title + subtitle, fields — 성함\* (text), 연락처\* (tel), 업종 (chip radios: 피부과·에스테틱 / 카페·디저트 / 음식점 / 미용실·헤어 / 기타), 가게 주소/네이버 플레이스 (textarea, optional), submit `무료 진단 받기 →` (primary, full width), fine print. On submit → success state (green check, `신청이 접수됐어요!`).

### Footer
- 3 columns ≥760px: brand + blurb · 서비스 links · 문의 links. Bottom bar: `© 2026 Fixup Studio · 픽스업 스튜디오. 정직한 마케팅.` + platform icon links.

---

## Interactions & Behavior
- **Smooth anchor scroll:** `html { scroll-behavior: smooth; scroll-padding-top: 72px }`. All CTAs are in-page anchors to `#contact` (except phone `tel:`); wire real Kakao/phone/lead endpoints in production.
- **Reveal on scroll:** elements with `.rv` fade+rise in (`opacity 0→1`, `translateY(18px)→0`, 0.6s). In the prototype this is JS via `getBoundingClientRect` on scroll (IntersectionObserver was unreliable in the preview sandbox) with a safety reveal-all after 1.8s, gated behind an `html.js-rv` class so content is visible if JS fails. **In production, use IntersectionObserver** (it works fine in real browsers) and keep the no-JS fallback (visible by default). Respect `prefers-reduced-motion` (disable) and print (force visible).
- **FAQ accordion:** single-open, animated `max-height`, `+`→`×` icon rotation.
- **Form validation:** name required (non-empty); phone required (regex `/^[0-9\-\s]{8,}$/`). On fail: mark field `.err` (urgent border + inline message) and toast `입력을 확인해 주세요`. On success: swap form for success panel.
- **Buttons:** hover lifts `translateY(-1~2px)`; primary darkens to `--accent-press`; secondary borders/colors to accent; transitions ~0.18s.
- **Header:** sticky with backdrop blur; nav links hidden <900px (consider a mobile menu in production — the prototype relies on the always-visible CTA button + scroll).
- **Theme transition:** if you implement a theme toggle, transition **`background-color`** (not the `background` shorthand — the shorthand does not animate reliably and leaves the bg stuck). Lesson learned here.

## State Management
- `heroVariant` (pregunta default), `funnel layout`, `density`, `dark`, `accent` — these are **prototype tweak knobs only**; bake in chosen values for production.
- Real state needed: FAQ open index; contact form fields + errors + submitted flag; (optional) theme.
- Data fetching: contact form submit → your lead endpoint / CRM / Kakao channel webhook. None in the prototype.

## Responsive Behavior
Mobile-first. Key breakpoints: **520 / 560 / 640 / 760 / 860 / 880 / 900 / 960 / 1040 / 1180px** (see `styles.css` media queries per component). Hero & differentiator go 2-col at ~960/880px; pricing 1→2→4; problem 1→3 at 640; funnel switches arrow direction at 860.

## Assets
- **Icons:** inline stroke SVGs in the `I` object (`sections1.jsx`) — search, pin, insta, chat, eye, heart, repeat, check, x, plus, arrow, phone, mail, spark, user, alert, ghost. Map 1:1 to lucide/heroicons.
- **Logo:** `<Logo>` SVG in `sections1.jsx` (squircle + check). Reproduce as an SVG asset/component.
- **Photography:** all images are **placeholders** (diagonal-striped boxes with a monospace brief). Art direction: **warm, real, local Korean businesses & people — natural light, genuine spaces. No generic stock, no fake reviews/testimonials.** Briefs are written on each placeholder (hero shop owner; manager portrait).
- **Fonts:** Jua, Noto Sans KR, Space Mono (Google Fonts) — self-host in production.

## Files (in this bundle)
- `Fixup Studio - Landing.html` — entry; loads React/Babel + the four files below.
- `landing/styles.css` — **all styling + design tokens** (the source of truth for visuals; ~600 lines, heavily commented).
- `landing/sections1.jsx` — icons, `<Logo>`, Header, Hero (+ `HERO_COPY` variants), Problem, Funnel.
- `landing/sections2.jsx` — Differentiator, Report, Pricing, Honesty, FAQ, FinalCTA (form), Footer + their content data.
- `landing/app.jsx` — composition + reveal/toast logic + (prototype-only) tweak wiring. **Ignore the tweak/theme-apply code for production; mine it for the section order and defaults.**
- `tweaks-panel.jsx` — **prototype authoring tool, not a site feature. Do not port.**
- `Fixup Studio - Style Guide.html` — the full brand system (logo rules, color with contrast ratios, type scale, components, voice & tone, accessibility). Reference for anything not covered here.

## Accessibility
- Body text contrast meets WCAG AA (ink `14.6:1`, ink-2 `7.2:1` on `--bg`). Use `--accent-600` (not 500) for any text/UI needing AA on light.
- Status never by color alone (icon + Korean label).
- Hit targets ≥44px; honor `prefers-reduced-motion`; keep visible focus rings (prototype uses `box-shadow: 0 0 0 4px var(--accent-tint)` on inputs — extend to all focusable elements).
