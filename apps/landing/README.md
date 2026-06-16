# 픽스업 스튜디오 — Landing App (`@fixup/landing`)

Public Korean lead-capture landing page for **Fixup Studio / 픽스업 스튜디오**. Built with Next.js 15 (App Router), Tailwind CSS, and the shared `@fixup/ui` + `@fixup/types` packages from this monorepo.

---

## Development

Install dependencies at the monorepo root (workspaces are wired via npm):

```bash
# from monorepo root
npm install
```

Start the dev server with the file-based lead store (writes to `data/prospectos.json`):

```bash
# from apps/landing
LEAD_STORE=file npm run dev
```

Without `LEAD_STORE=file`, leads are handled by `ConsoleLeadStore`, which logs the `Prospecto` JSON to stdout and does not write to disk. This is the safe production fallback for read-only filesystems (Vercel).

To redirect the data file in dev:

```bash
LEAD_STORE=file PROSPECTOS_PATH=/path/to/prospectos.json npm run dev
```

---

## Environment Variables

| Variable           | Values                      | Default                                      | Notes                                              |
|--------------------|-----------------------------|----------------------------------------------|----------------------------------------------------|
| `LEAD_STORE`       | `file` or unset             | unset (ConsoleLeadStore)                     | Set to `file` in local dev to persist leads to disk |
| `PROSPECTOS_PATH`  | absolute path to JSON file  | `../../data/prospectos.json` (from app root) | Override to point at the shared data file          |

---

## Lead Flow

```
LeadForm (client) → POST /api/leads (zod validated)
                  → LeadStore.save(lead)
                     ├─ LEAD_STORE=file  → FileLeadStore  → data/prospectos.json
                     └─ (unset)          → ConsoleLeadStore → stdout JSON log
```

A `Lead` (raw form data + timestamp + id) is converted to a `Prospecto` with `estado: "nuevo"` via `leadToProspecto()`. The `LeadStore` interface and `ConsoleLeadStore` live in `src/lib/leads.ts`; `FileLeadStore` and the `getLeadStore()` factory live in `src/lib/leadStore.server.ts` (server-only).

To wire a real CRM, database, email service, or webhook: implement the `LeadStore` interface and swap the return value in `getLeadStore()`.

---

## Deploy on Vercel

Vercel settings for the Vercel project (configured in the Vercel dashboard, not via a file):

| Setting              | Value                                              |
|----------------------|----------------------------------------------------|
| **Root Directory**   | `apps/landing`                                     |
| **Framework Preset** | Next.js (auto-detected)                            |
| **Build Command**    | _(leave default — Vercel auto-detects turbo)_      |
| **Install Command**  | _(leave default)_                                  |

Vercel detects `turbo.json` at the repo root and runs `turbo run build --filter=@fixup/landing` automatically, which builds `@fixup/types` and `@fixup/ui` first. No `vercel.json` is needed for a standard monorepo setup; adding one with a custom `buildCommand` can conflict with the root-directory setting, so it is intentionally omitted here.

**Production env vars**: leave `LEAD_STORE` unset (read-only FS) until a persistent store is wired. `PROSPECTOS_PATH` is unused in production with `ConsoleLeadStore`.

---

## SEO

- Metadata and Open Graph tags: `src/app/layout.tsx`
- JSON-LD `LocalBusiness` schema: `src/app/page.tsx`
- Sitemap: `src/app/sitemap.ts` (auto-generates `/sitemap.xml`)
- Robots: `src/app/robots.ts` (auto-generates `/robots.txt`)
- `/privacy` and `/terms` are set to `noindex` until legal-reviewed

---

## Performance Notes

The app is built for fast mobile load with these decisions:

- All 11 landing sections are **React Server Components** — zero client JS per section.
- The only client components are `LeadForm` (form state + fetch), `Faq` (accordion toggle), and `Reveal` (scroll animation). All are code-split automatically by Next.js.
- Fonts loaded via `next/font/google` (Jua, Noto Sans KR, Space Mono) with `display: swap`.
- CSS-only placeholder blocks (no image network requests in the placeholder state).
- Minimal third-party JS — only Google Fonts (via next/font, no render-blocking request).

**Build output (from `npm run build`):**

```
Route (app)                              Size  First Load JS
┌ ○ /                                 18.1 kB         124 kB
├ ○ /_not-found                         985 B         103 kB
├ ƒ /api/leads                          130 B         103 kB
├ ○ /privacy                            163 B         106 kB
├ ○ /robots.txt                         130 B         103 kB
├ ○ /sitemap.xml                        130 B         103 kB
└ ○ /terms                              163 B         106 kB
+ First Load JS shared by all          102 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

A Lighthouse mobile audit should be run post-deploy targeting >90 on Performance, Accessibility, Best Practices, and SEO. **Known caveat**: real images must use `next/image` with explicit `width`/`height` to avoid layout shift — this is the main perf risk once `<Placeholder>` components are replaced.

---

## Design Reference

- Design handoff: `design_handoff_landing/` (HTML mockups + style guide)
- Spec: `docs/superpowers/specs/2026-06-16-landing-design.md`
- Site config (brand, contact, nav): `src/lib/site.ts`
- Content copy: `src/lib/content.ts`

---

## TODO — Human Remaining Work

- [ ] **Real photography**: replace all `<Placeholder>` blocks (search `TODO: fotos reales` in components). Switch to `next/image` with real `width`/`height` to avoid CLS.
- [ ] **Real contact data** in `src/lib/site.ts`: phone, email, Kakao channel handle + URL (currently placeholder values).
- [ ] **Legal copy review**: `/privacy` and `/terms` are noindex placeholder drafts. Replace with lawyer-reviewed text, then remove `robots: { index: false }` from their metadata.
- [ ] **Real OG image**: add `/public/og.png` (1200×630) and uncomment the `images` entry in `layout.tsx` metadata.
- [ ] **Real testimonials / case studies**: search `TODO: casos reales` in section components.
- [ ] **Confirm production domain** in `src/lib/site.ts` → `site.url` (currently `https://fixup.studio`).
- [ ] **Wire a persistent LeadStore**: implement `LeadStore` in `src/lib/leads.ts` backed by a DB, email, or webhook, and update `getLeadStore()` in `leadStore.server.ts`.
- [ ] **Run Lighthouse mobile** post-deploy and address any issues, especially once real images are added.
- [ ] Migrate from deprecated `next lint` CLI to ESLint CLI (`npx @next/codemod@canary next-lint-to-eslint-cli .`) before Next.js 16.
