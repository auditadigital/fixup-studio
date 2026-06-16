# apps/dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reactive Next.js 15 dashboard in a Turborepo that reads/manages the Fixup Studio sales pipeline from `data/prospectos.json` via an abstracted data layer.

**Architecture:** npm-workspaces Turborepo with `@fixup/types` (data shapes + pipeline maps), `@fixup/ui` (design-system tokens + components), and `apps/dashboard` (Next App Router). Server components read data through a `ProspectoRepo` interface (JSON impl now, Supabase later); client components handle kanban drag, filters, search, and the prospect drawer. HTTP Basic middleware guards the app.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript strict, Tailwind CSS, Turborepo, Vitest, npm workspaces.

---

## Conventions

- All paths are relative to the monorepo root `Korea/fixup-studio/`.
- Run all `npm` commands from the monorepo root unless stated otherwise.
- Package manager: **npm** (workspaces). Node ≥ 20.
- Commit after each task. Commit messages end with the Co-Authored-By trailer used in this repo.

## File Structure

```
package.json                          # root: workspaces + turbo scripts
turbo.json
tsconfig.base.json
.gitignore
vitest.config.ts                      # root vitest (packages)
packages/types/
  package.json  tsconfig.json  src/index.ts  src/pipeline.ts  src/pipeline.test.ts
packages/ui/
  package.json  tsconfig.json  tailwind-preset.ts  src/tokens.css
  src/index.ts  src/scoreColor.ts  src/scoreColor.test.ts
  src/Button.tsx src/Card.tsx src/Pill.tsx src/Badge.tsx
  src/ScoreRing.tsx src/PlanCard.tsx src/FunnelSteps.tsx
apps/dashboard/
  package.json  tsconfig.json  next.config.ts  tailwind.config.ts
  postcss.config.mjs  middleware.ts  vitest.config.ts
  src/app/layout.tsx  src/app/globals.css  src/app/page.tsx
  src/app/api/health/route.ts
  src/app/api/prospectos/route.ts
  src/app/api/prospectos/[id]/estado/route.ts
  src/lib/repo.ts            # ProspectoRepo interface + JsonProspectoRepo + getProspectos
  src/lib/metrics.ts         # computeMetrics
  src/lib/metrics.test.ts
  src/lib/useFilters.ts      # localStorage-backed filter prefs
  src/components/Metrics.tsx
  src/components/PipelineBoard.tsx
  src/components/ProspectoCard.tsx
  src/components/ProspectoDrawer.tsx
  src/components/Toolbar.tsx
data/prospectos.json         # seeded
```

---

## Task 1: Monorepo scaffold

**Files:**
- Create: `package.json`, `turbo.json`, `tsconfig.base.json`, `.gitignore`, `vitest.config.ts`

- [ ] **Step 1: Create root `package.json`**

```json
{
  "name": "fixup-studio",
  "private": true,
  "version": "0.0.0",
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "vitest run"
  },
  "devDependencies": {
    "turbo": "^2.1.0",
    "typescript": "^5.5.4",
    "vitest": "^2.0.5"
  },
  "packageManager": "npm@10.8.2"
}
```

- [ ] **Step 2: Create `turbo.json`**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**", "!.next/cache/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "typecheck": { "dependsOn": ["^build"] }
  }
}
```

- [ ] **Step 3: Create `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "jsx": "react-jsx"
  }
}
```

- [ ] **Step 4: Create `.gitignore`**

```
node_modules/
.next/
dist/
.turbo/
*.tsbuildinfo
.env*.local
.DS_Store
```

- [ ] **Step 5: Create root `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { include: ["packages/**/*.test.ts"], environment: "node" },
});
```

- [ ] **Step 6: Install and verify**

Run: `npm install`
Expected: completes, creates root `node_modules` and `package-lock.json`.

- [ ] **Step 7: Commit**

```bash
git add package.json turbo.json tsconfig.base.json .gitignore vitest.config.ts package-lock.json
git commit -m "chore: scaffold turborepo workspace"
```

---

## Task 2: packages/types — data shapes + pipeline maps

**Files:**
- Create: `packages/types/package.json`, `packages/types/tsconfig.json`, `packages/types/src/index.ts`, `packages/types/src/pipeline.ts`
- Test: `packages/types/src/pipeline.test.ts`

- [ ] **Step 1: Create `packages/types/package.json`**

```json
{
  "name": "@fixup/types",
  "version": "0.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": { ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" } },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "lint": "echo no-lint"
  },
  "devDependencies": { "typescript": "^5.5.4" }
}
```

- [ ] **Step 2: Create `packages/types/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.test.ts"]
}
```

- [ ] **Step 3: Create `packages/types/src/index.ts` (types from SPEC + re-export pipeline)**

```ts
export type Estado =
  | "nuevo" | "contactado" | "mini-lista" | "mini-enviada"
  | "propuesta-enviada" | "negociacion" | "cerrado" | "perdido";

export type Rubro =
  | "에스테틱/피부과" | "미용실" | "카페" | "식당"
  | "필라테스/헬스장" | "치과" | string;

export type Plan = "기본" | "성장" | "프리미엄";

export interface Scores {
  global?: number;
  naver?: number;
  instagram?: number;
  kakao?: number;
  compra?: number;
}

export interface Prospecto {
  id: string;
  업체명: string;
  rubro: Rubro;
  zona?: string;
  instagram?: string;
  naver_place?: string;
  kakao?: string;
  telefono?: string;
  estado: Estado;
  observacion?: string;
  scores_mini?: number;
  scores?: Scores;
  plan_recomendado?: Plan;
  precio_propuesto?: number;
  monto_cerrado?: number;
  fecha_contacto?: string;
  fecha_mini?: string;
  fecha_completa?: string;
  fecha_propuesta?: string;
  reportes?: { label: string; url: string }[];
}

export interface Lead {
  nombre: string;
  업체명: string;
  rubro: Rubro;
  telefono?: string;
  instagram?: string;
  naver_place?: string;
  mensaje?: string;
  creado: string;
}

export * from "./pipeline.js";
```

Note: `reportes` is added to `Prospecto` so the drawer can link to reports/PDFs (SPEC requirement); optional, so existing data stays valid.

- [ ] **Step 4: Write the failing test `packages/types/src/pipeline.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import {
  ESTADO_LABELS, PIPELINE_COLUMNS, columnForEstado,
} from "./pipeline.js";
import type { Estado } from "./index.js";

describe("pipeline maps", () => {
  it("labels every estado in korean", () => {
    const estados: Estado[] = [
      "nuevo","contactado","mini-lista","mini-enviada",
      "propuesta-enviada","negociacion","cerrado","perdido",
    ];
    for (const e of estados) expect(ESTADO_LABELS[e]).toBeTruthy();
  });

  it("has 7 ordered columns with the spec labels", () => {
    expect(PIPELINE_COLUMNS.map(c => c.label)).toEqual(
      ["신규","접촉","미니","제안","협의","계약","종료"],
    );
  });

  it("maps every estado to exactly one column", () => {
    const estados: Estado[] = [
      "nuevo","contactado","mini-lista","mini-enviada",
      "propuesta-enviada","negociacion","cerrado","perdido",
    ];
    for (const e of estados) {
      const hits = PIPELINE_COLUMNS.filter(c => c.estados.includes(e));
      expect(hits).toHaveLength(1);
      expect(columnForEstado(e)).toBe(hits[0]);
    }
  });

  it("groups both mini estados under 미니 with dropTarget mini-enviada", () => {
    const mini = PIPELINE_COLUMNS.find(c => c.label === "미니")!;
    expect(mini.estados).toEqual(["mini-lista","mini-enviada"]);
    expect(mini.dropTarget).toBe("mini-enviada");
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npx vitest run packages/types/src/pipeline.test.ts`
Expected: FAIL — cannot find module `./pipeline.js`.

- [ ] **Step 6: Create `packages/types/src/pipeline.ts`**

```ts
import type { Estado } from "./index.js";

export const ESTADO_LABELS: Record<Estado, string> = {
  "nuevo": "신규",
  "contactado": "접촉",
  "mini-lista": "미니 대기",
  "mini-enviada": "미니 발송",
  "propuesta-enviada": "제안 발송",
  "negociacion": "협의",
  "cerrado": "계약",
  "perdido": "종료",
};

export interface PipelineColumn {
  key: string;
  label: string;
  estados: Estado[];
  dropTarget: Estado;
}

export const PIPELINE_COLUMNS: PipelineColumn[] = [
  { key: "nuevo",       label: "신규", estados: ["nuevo"],                      dropTarget: "nuevo" },
  { key: "contactado",  label: "접촉", estados: ["contactado"],                 dropTarget: "contactado" },
  { key: "mini",        label: "미니", estados: ["mini-lista", "mini-enviada"], dropTarget: "mini-enviada" },
  { key: "propuesta",   label: "제안", estados: ["propuesta-enviada"],          dropTarget: "propuesta-enviada" },
  { key: "negociacion", label: "협의", estados: ["negociacion"],                dropTarget: "negociacion" },
  { key: "cerrado",     label: "계약", estados: ["cerrado"],                    dropTarget: "cerrado" },
  { key: "perdido",     label: "종료", estados: ["perdido"],                    dropTarget: "perdido" },
];

export function columnForEstado(estado: Estado): PipelineColumn {
  const col = PIPELINE_COLUMNS.find(c => c.estados.includes(estado));
  if (!col) throw new Error(`No pipeline column for estado: ${estado}`);
  return col;
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npx vitest run packages/types/src/pipeline.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 8: Build the package**

Run: `npm run build -w @fixup/types`
Expected: emits `packages/types/dist/`.

- [ ] **Step 9: Commit**

```bash
git add packages/types
git commit -m "feat(types): data shapes + pipeline column maps"
```

---

## Task 3: packages/ui — tokens, preset, scoreColor

**Files:**
- Create: `packages/ui/package.json`, `packages/ui/tsconfig.json`, `packages/ui/tailwind-preset.ts`, `packages/ui/src/tokens.css`, `packages/ui/src/scoreColor.ts`
- Test: `packages/ui/src/scoreColor.test.ts`

- [ ] **Step 1: Create `packages/ui/package.json`**

```json
{
  "name": "@fixup/ui",
  "version": "0.0.0",
  "type": "module",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
    "./tokens.css": "./src/tokens.css",
    "./tailwind-preset": "./tailwind-preset.ts"
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "lint": "echo no-lint"
  },
  "peerDependencies": { "react": "^19.0.0", "react-dom": "^19.0.0" },
  "dependencies": { "@fixup/types": "*" },
  "devDependencies": {
    "typescript": "^5.5.4",
    "@types/react": "^19.0.0",
    "react": "^19.0.0"
  }
}
```

- [ ] **Step 2: Create `packages/ui/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["src/**/*.test.ts", "src/**/*.test.tsx"]
}
```

- [ ] **Step 3: Create `packages/ui/src/tokens.css` (style-guide tokens, light theme)**

```css
:root {
  --bg: #FBF8F2;
  --bg-2: #F4EEE3;
  --surface: #FFFFFF;
  --cream: #F0E9DB;
  --sand: #E8DCC9;
  --ink: #2A2520;
  --ink-2: #5C544A;
  --ink-soft: #8C8175;
  --line: #EAE1D2;
  --line-2: #DFD4C0;
  --coral: #D85A40;
  --coral-600: #BE4733;
  --coral-press: #A53C2A;
  --coral-tint: #FBEAE4;
  --naver: #2E9E5B;
  --insta: #D24A8B;
  --kakao: #F4C20D;
  --good: #3E9E5B;
  --warn: #E0A52E;
  --urgent: #D8492F;
  --good-tint: #E6F3EA;
  --warn-tint: #F8EFD9;
  --urgent-tint: #FBE6E2;
  --radius: 18px;
  --radius-sm: 12px;
}
```

- [ ] **Step 4: Create `packages/ui/tailwind-preset.ts`**

```ts
import type { Config } from "tailwindcss";

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-2": "var(--bg-2)",
        surface: "var(--surface)",
        cream: "var(--cream)",
        sand: "var(--sand)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-soft": "var(--ink-soft)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        coral: "var(--coral)",
        "coral-600": "var(--coral-600)",
        "coral-press": "var(--coral-press)",
        "coral-tint": "var(--coral-tint)",
        naver: "var(--naver)",
        insta: "var(--insta)",
        kakao: "var(--kakao)",
        good: "var(--good)",
        warn: "var(--warn)",
        urgent: "var(--urgent)",
        "good-tint": "var(--good-tint)",
        "warn-tint": "var(--warn-tint)",
        "urgent-tint": "var(--urgent-tint)",
      },
      borderRadius: { DEFAULT: "var(--radius)", sm: "var(--radius-sm)" },
      fontFamily: {
        display: ["var(--font-jua)", "sans-serif"],
        sans: ["var(--font-noto-kr)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
    },
  },
};

export default preset;
```

- [ ] **Step 5: Write the failing test `packages/ui/src/scoreColor.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { scoreColor } from "./scoreColor.js";

describe("scoreColor", () => {
  it("urgent below 50", () => {
    expect(scoreColor(0)).toBe("urgent");
    expect(scoreColor(49)).toBe("urgent");
  });
  it("warn between 50 and 74", () => {
    expect(scoreColor(50)).toBe("warn");
    expect(scoreColor(74)).toBe("warn");
  });
  it("good 75 and above", () => {
    expect(scoreColor(75)).toBe("good");
    expect(scoreColor(100)).toBe("good");
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run packages/ui/src/scoreColor.test.ts`
Expected: FAIL — cannot find module `./scoreColor.js`.

- [ ] **Step 7: Create `packages/ui/src/scoreColor.ts`**

```ts
export type Semaforo = "good" | "warn" | "urgent";

export function scoreColor(n: number): Semaforo {
  if (n >= 75) return "good";
  if (n >= 50) return "warn";
  return "urgent";
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run packages/ui/src/scoreColor.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 9: Commit**

```bash
git add packages/ui
git commit -m "feat(ui): tokens, tailwind preset, scoreColor"
```

---

## Task 4: packages/ui — components

**Files:**
- Create: `packages/ui/src/Button.tsx`, `Card.tsx`, `Pill.tsx`, `Badge.tsx`, `ScoreRing.tsx`, `PlanCard.tsx`, `FunnelSteps.tsx`, `index.ts`

- [ ] **Step 1: Create `packages/ui/src/Button.tsx`**

```tsx
import * as React from "react";

type Variant = "coral" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  coral: "bg-coral text-white hover:bg-coral-600 active:bg-coral-press",
  secondary: "bg-surface text-ink border border-line-2 hover:bg-cream",
  ghost: "bg-transparent text-ink-2 hover:bg-cream",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "coral", className = "", ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
      {...rest}
    />
  );
}
```

- [ ] **Step 2: Create `packages/ui/src/Card.tsx`**

```tsx
import * as React from "react";

export function Card({ className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded bg-surface border border-line p-4 ${className}`}
      {...rest}
    />
  );
}
```

- [ ] **Step 3: Create `packages/ui/src/Pill.tsx`**

```tsx
import * as React from "react";
import type { Semaforo } from "./scoreColor.js";

type Tone = Semaforo | "neutral";

const tones: Record<Tone, string> = {
  good: "bg-good-tint text-good",
  warn: "bg-warn-tint text-warn",
  urgent: "bg-urgent-tint text-urgent",
  neutral: "bg-cream text-ink-2",
};

export function Pill({
  tone = "neutral", className = "", ...rest
}: { tone?: Tone } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
      {...rest}
    />
  );
}
```

- [ ] **Step 4: Create `packages/ui/src/Badge.tsx`**

```tsx
import * as React from "react";

export function Badge({ className = "", ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border border-line-2 bg-bg-2 px-2 py-0.5 text-xs text-ink-2 ${className}`}
      {...rest}
    />
  );
}
```

- [ ] **Step 5: Create `packages/ui/src/ScoreRing.tsx`**

```tsx
import * as React from "react";
import { scoreColor } from "./scoreColor.js";

const ringColor: Record<string, string> = {
  good: "var(--good)", warn: "var(--warn)", urgent: "var(--urgent)",
};

export function ScoreRing({
  value, label, size = 56,
}: { value: number; label?: string; size?: number }) {
  const color = ringColor[scoreColor(value)];
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="grid place-items-center rounded-full font-mono text-sm font-bold text-ink"
        style={{
          width: size, height: size,
          background: `conic-gradient(${color} ${value * 3.6}deg, var(--line) 0deg)`,
        }}
      >
        <span
          className="grid place-items-center rounded-full bg-surface"
          style={{ width: size - 12, height: size - 12 }}
        >
          {value}
        </span>
      </div>
      {label ? <span className="text-xs text-ink-soft">{label}</span> : null}
    </div>
  );
}
```

- [ ] **Step 6: Create `packages/ui/src/PlanCard.tsx`**

```tsx
import * as React from "react";
import type { Plan } from "@fixup/types";
import { Card } from "./Card.js";

export function PlanCard({ plan, precio }: { plan?: Plan; precio?: number }) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <div className="text-xs text-ink-soft">추천 플랜</div>
        <div className="font-display text-lg text-ink">{plan ?? "—"}</div>
      </div>
      <div className="text-right">
        <div className="text-xs text-ink-soft">가격</div>
        <div className="font-mono text-ink">
          {precio ? `₩${precio.toLocaleString("ko-KR")}` : "—"}
        </div>
      </div>
    </Card>
  );
}
```

- [ ] **Step 7: Create `packages/ui/src/FunnelSteps.tsx`**

```tsx
import * as React from "react";

interface Channel { naver?: string; instagram?: string; kakao?: string }

const steps: { key: keyof Channel; label: string; color: string }[] = [
  { key: "naver", label: "Naver", color: "text-naver" },
  { key: "instagram", label: "Insta", color: "text-insta" },
  { key: "kakao", label: "Kakao", color: "text-kakao" },
];

export function FunnelSteps({ channels }: { channels: Channel }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const on = Boolean(channels[s.key]);
        return (
          <React.Fragment key={s.key}>
            {i > 0 ? <span className="text-ink-soft">→</span> : null}
            <span
              className={`text-xs font-medium ${on ? s.color : "text-ink-soft opacity-40"}`}
            >
              {s.label}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 8: Create `packages/ui/src/index.ts`**

```ts
export { Button } from "./Button.js";
export { Card } from "./Card.js";
export { Pill } from "./Pill.js";
export { Badge } from "./Badge.js";
export { ScoreRing } from "./ScoreRing.js";
export { PlanCard } from "./PlanCard.js";
export { FunnelSteps } from "./FunnelSteps.js";
export { scoreColor } from "./scoreColor.js";
export type { Semaforo } from "./scoreColor.js";
```

- [ ] **Step 9: Build the package**

Run: `npm run build -w @fixup/ui`
Expected: emits `packages/ui/dist/index.js` + `.d.ts`. No type errors.

- [ ] **Step 10: Commit**

```bash
git add packages/ui
git commit -m "feat(ui): base components (Button, Card, Pill, Badge, ScoreRing, PlanCard, FunnelSteps)"
```

---

## Task 5: Seed data

**Files:**
- Modify: `data/prospectos.json`

- [ ] **Step 1: Replace `data/prospectos.json` with seed (9 prospectos, all estados)**

```json
{
  "prospectos": [
    {
      "id": "gangnam-skin-clinic",
      "업체명": "강남스킨클리닉",
      "rubro": "에스테틱/피부과",
      "zona": "서울 강남구",
      "instagram": "gangnam_skin",
      "naver_place": "https://map.naver.com/p/gangnam-skin",
      "kakao": "gangnamskin",
      "telefono": "02-555-1010",
      "estado": "nuevo",
      "observacion": "팔로워 많은데 예약 전환 약함",
      "fecha_contacto": "2026-06-10"
    },
    {
      "id": "hongdae-hair",
      "업체명": "홍대헤어살롱",
      "rubro": "미용실",
      "zona": "서울 마포구",
      "instagram": "hongdae_hair",
      "telefono": "02-333-2020",
      "estado": "contactado",
      "observacion": "DM 응답함, 미니 진단 대기",
      "fecha_contacto": "2026-06-08"
    },
    {
      "id": "seongsu-cafe",
      "업체명": "성수동로스터리",
      "rubro": "카페",
      "zona": "서울 성동구",
      "instagram": "seongsu_roastery",
      "naver_place": "https://map.naver.com/p/seongsu-roastery",
      "estado": "mini-lista",
      "observacion": "미니 진단 준비 완료",
      "scores_mini": 42,
      "fecha_contacto": "2026-06-05",
      "fecha_mini": "2026-06-12"
    },
    {
      "id": "itaewon-dining",
      "업체명": "이태원다이닝",
      "rubro": "식당",
      "zona": "서울 용산구",
      "instagram": "itaewon_dining",
      "naver_place": "https://map.naver.com/p/itaewon-dining",
      "kakao": "itaewondining",
      "telefono": "02-790-3030",
      "estado": "mini-enviada",
      "observacion": "미니 발송함, 반응 좋음",
      "scores_mini": 58,
      "fecha_contacto": "2026-06-01",
      "fecha_mini": "2026-06-09",
      "reportes": [{ "label": "미니 진단 PDF", "url": "https://example.com/itaewon-mini.pdf" }]
    },
    {
      "id": "apgujeong-pilates",
      "업체명": "압구정필라테스",
      "rubro": "필라테스/헬스장",
      "zona": "서울 강남구",
      "instagram": "apgujeong_pilates",
      "naver_place": "https://map.naver.com/p/apgujeong-pilates",
      "telefono": "02-548-4040",
      "estado": "propuesta-enviada",
      "observacion": "완전 진단 후 제안 발송",
      "scores_mini": 61,
      "scores": { "global": 64, "naver": 70, "instagram": 55, "kakao": 48, "compra": 60 },
      "plan_recomendado": "성장",
      "precio_propuesto": 1200000,
      "fecha_contacto": "2026-05-20",
      "fecha_mini": "2026-05-28",
      "fecha_completa": "2026-06-03",
      "fecha_propuesta": "2026-06-11",
      "reportes": [
        { "label": "완전 진단 PDF", "url": "https://example.com/apgujeong-full.pdf" },
        { "label": "제안서", "url": "https://example.com/apgujeong-proposal.pdf" }
      ]
    },
    {
      "id": "jamsil-dental",
      "업체명": "잠실치과",
      "rubro": "치과",
      "zona": "서울 송파구",
      "naver_place": "https://map.naver.com/p/jamsil-dental",
      "kakao": "jamsildental",
      "telefono": "02-422-5050",
      "estado": "negociacion",
      "observacion": "가격 협의 중",
      "scores_mini": 55,
      "scores": { "global": 58, "naver": 62, "instagram": 40, "kakao": 65, "compra": 52 },
      "plan_recomendado": "기본",
      "precio_propuesto": 800000,
      "fecha_contacto": "2026-05-15",
      "fecha_mini": "2026-05-22",
      "fecha_completa": "2026-05-30",
      "fecha_propuesta": "2026-06-05"
    },
    {
      "id": "yeonnam-cafe",
      "업체명": "연남동브런치",
      "rubro": "카페",
      "zona": "서울 마포구",
      "instagram": "yeonnam_brunch",
      "naver_place": "https://map.naver.com/p/yeonnam-brunch",
      "kakao": "yeonnambrunch",
      "telefono": "02-322-6060",
      "estado": "cerrado",
      "observacion": "프리미엄 플랜 계약 완료",
      "scores_mini": 67,
      "scores": { "global": 72, "naver": 78, "instagram": 80, "kakao": 60, "compra": 70 },
      "plan_recomendado": "프리미엄",
      "precio_propuesto": 1800000,
      "monto_cerrado": 1800000,
      "fecha_contacto": "2026-04-20",
      "fecha_mini": "2026-04-28",
      "fecha_completa": "2026-05-06",
      "fecha_propuesta": "2026-05-12"
    },
    {
      "id": "mapo-gym",
      "업체명": "마포피트니스",
      "rubro": "필라테스/헬스장",
      "zona": "서울 마포구",
      "instagram": "mapo_fitness",
      "telefono": "02-711-7070",
      "estado": "cerrado",
      "observacion": "성장 플랜 계약",
      "scores_mini": 70,
      "scores": { "global": 75, "naver": 80, "instagram": 72, "kakao": 68, "compra": 78 },
      "plan_recomendado": "성장",
      "precio_propuesto": 1200000,
      "monto_cerrado": 1100000,
      "fecha_contacto": "2026-04-10",
      "fecha_mini": "2026-04-18",
      "fecha_completa": "2026-04-25",
      "fecha_propuesta": "2026-05-01"
    },
    {
      "id": "gangbuk-salon",
      "업체명": "강북뷰티살롱",
      "rubro": "미용실",
      "zona": "서울 강북구",
      "instagram": "gangbuk_beauty",
      "telefono": "02-988-8080",
      "estado": "perdido",
      "observacion": "예산 부족으로 보류",
      "scores_mini": 38,
      "fecha_contacto": "2026-05-02",
      "fecha_mini": "2026-05-10"
    }
  ]
}
```

- [ ] **Step 2: Validate JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('data/prospectos.json','utf8')); console.log('ok')"`
Expected: prints `ok`.

- [ ] **Step 3: Commit**

```bash
git add data/prospectos.json
git commit -m "feat(data): seed 9 sample prospectos across all estados"
```

---

## Task 6: Dashboard scaffold (Next 15)

**Files:**
- Create: `apps/dashboard/package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx` (placeholder)

- [ ] **Step 1: Create `apps/dashboard/package.json`**

```json
{
  "name": "@fixup/dashboard",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@fixup/types": "*",
    "@fixup/ui": "*",
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.5.4",
    "vitest": "^2.0.5"
  }
}
```

- [ ] **Step 2: Create `apps/dashboard/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `apps/dashboard/next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@fixup/ui", "@fixup/types"],
  outputFileTracingIncludes: { "/**": ["../../data/prospectos.json"] },
};

export default nextConfig;
```

Note: `transpilePackages` lets Next compile the workspace TS packages from source; `outputFileTracingIncludes` bundles the JSON so reads work on Vercel.

- [ ] **Step 4: Create `apps/dashboard/postcss.config.mjs`**

```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

- [ ] **Step 5: Create `apps/dashboard/tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";
import preset from "@fixup/ui/tailwind-preset";

const config: Config = {
  presets: [preset as Config],
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
```

- [ ] **Step 6: Create `apps/dashboard/src/app/globals.css`**

```css
@import "@fixup/ui/tokens.css";
@tailwind base;
@tailwind components;
@tailwind utilities;

body { background: var(--bg); color: var(--ink); }
```

- [ ] **Step 7: Create `apps/dashboard/src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Jua, Noto_Sans_KR, Space_Mono } from "next/font/google";
import "./globals.css";

const jua = Jua({ weight: "400", subsets: ["latin"], variable: "--font-jua" });
const noto = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-noto-kr" });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });

export const metadata: Metadata = {
  title: "Fixup Studio — Pipeline",
  description: "Panel de control interno",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${jua.variable} ${noto.variable} ${mono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: Create placeholder `apps/dashboard/src/app/page.tsx`**

```tsx
export default function Page() {
  return <main className="p-6 font-display text-2xl">픽스업 스튜디오 대시보드</main>;
}
```

- [ ] **Step 9: Install workspace deps**

Run: `npm install`
Expected: links `@fixup/*` into dashboard, installs Next/React.

- [ ] **Step 10: Verify dev server boots**

Run: `npm run build -w @fixup/dashboard`
Expected: Next build succeeds, compiles the placeholder page with no type errors.

- [ ] **Step 11: Commit**

```bash
git add apps/dashboard package-lock.json
git commit -m "feat(dashboard): next 15 scaffold with ui preset + fonts"
```

---

## Task 7: Data layer (ProspectoRepo + getProspectos)

**Files:**
- Create: `apps/dashboard/src/lib/repo.ts`

- [ ] **Step 1: Create `apps/dashboard/src/lib/repo.ts`**

```ts
import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Estado, Prospecto } from "@fixup/types";

export interface ProspectoRepo {
  list(): Promise<Prospecto[]>;
  updateEstado(id: string, estado: Estado): Promise<Prospecto>;
}

const DATA_PATH = path.join(process.cwd(), "..", "..", "data", "prospectos.json");

class JsonProspectoRepo implements ProspectoRepo {
  async list(): Promise<Prospecto[]> {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw) as { prospectos: Prospecto[] };
    return parsed.prospectos;
  }

  async updateEstado(id: string, estado: Estado): Promise<Prospecto> {
    const all = await this.list();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Prospecto not found: ${id}`);
    const updated: Prospecto = { ...all[idx]!, estado };
    all[idx] = updated;
    await fs.writeFile(DATA_PATH, JSON.stringify({ prospectos: all }, null, 2) + "\n", "utf8");
    return updated;
  }
}

export const repo: ProspectoRepo = new JsonProspectoRepo();

export function getProspectos(): Promise<Prospecto[]> {
  return repo.list();
}
```

Note: `EROFS` (Vercel read-only FS) propagates from `writeFile`; the API route in Task 9 catches it.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck -w @fixup/dashboard`
Expected: PASS (no errors).

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/src/lib/repo.ts
git commit -m "feat(dashboard): ProspectoRepo interface + JSON impl + getProspectos"
```

---

## Task 8: Metrics computation (TDD)

**Files:**
- Create: `apps/dashboard/src/lib/metrics.ts`, `apps/dashboard/vitest.config.ts`
- Test: `apps/dashboard/src/lib/metrics.test.ts`

- [ ] **Step 1: Create `apps/dashboard/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { include: ["src/**/*.test.ts"], environment: "node" },
  resolve: { alias: { "@": new URL("./src", import.meta.url).pathname } },
});
```

- [ ] **Step 2: Write the failing test `apps/dashboard/src/lib/metrics.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { computeMetrics } from "./metrics.js";
import type { Prospecto } from "@fixup/types";

function p(over: Partial<Prospecto>): Prospecto {
  return { id: over.id ?? "x", "업체명": "n", rubro: "카페", estado: "nuevo", ...over } as Prospecto;
}

describe("computeMetrics", () => {
  const data: Prospecto[] = [
    p({ id: "a", estado: "nuevo" }),
    p({ id: "b", estado: "mini-enviada", scores_mini: 50 }),
    p({ id: "c", estado: "negociacion", scores_mini: 60 }),
    p({ id: "d", estado: "cerrado", scores_mini: 70, monto_cerrado: 1000000 }),
    p({ id: "e", estado: "cerrado", monto_cerrado: 500000 }),
    p({ id: "f", estado: "perdido", scores_mini: 30 }),
  ];

  it("counts per estado", () => {
    const m = computeMetrics(data);
    expect(m.byEstado.cerrado).toBe(2);
    expect(m.byEstado.nuevo).toBe(1);
    expect(m.byEstado["mini-enviada"]).toBe(1);
  });

  it("sums monto_cerrado", () => {
    expect(computeMetrics(data).wonAmount).toBe(1500000);
  });

  it("conversion = cerrado / reached-mini", () => {
    // reached-mini = has scores_mini OR estado past mini: b,c,d,f => 4; cerrado with mini path = d => but count all cerrado as converted
    const m = computeMetrics(data);
    // mini-reached set: b,c,d,f (4). cerrado: d,e (2). conversion uses cerrado that reached mini = d (1) / 4
    expect(m.miniToClient).toBeCloseTo(0.25, 5);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run apps/dashboard/src/lib/metrics.test.ts --config apps/dashboard/vitest.config.ts`
Expected: FAIL — cannot find module `./metrics.js`.

- [ ] **Step 4: Create `apps/dashboard/src/lib/metrics.ts`**

```ts
import type { Estado, Prospecto } from "@fixup/types";

export interface Metrics {
  total: number;
  byEstado: Record<Estado, number>;
  wonAmount: number;
  miniToClient: number;
}

const EMPTY: Record<Estado, number> = {
  "nuevo": 0, "contactado": 0, "mini-lista": 0, "mini-enviada": 0,
  "propuesta-enviada": 0, "negociacion": 0, "cerrado": 0, "perdido": 0,
};

const PAST_MINI: Estado[] = [
  "mini-lista", "mini-enviada", "propuesta-enviada", "negociacion", "cerrado", "perdido",
];

function reachedMini(p: Prospecto): boolean {
  return p.scores_mini != null || PAST_MINI.includes(p.estado);
}

export function computeMetrics(prospectos: Prospecto[]): Metrics {
  const byEstado: Record<Estado, number> = { ...EMPTY };
  let wonAmount = 0;
  let miniReached = 0;
  let convertedFromMini = 0;

  for (const p of prospectos) {
    byEstado[p.estado] = (byEstado[p.estado] ?? 0) + 1;
    if (p.estado === "cerrado") wonAmount += p.monto_cerrado ?? 0;
    if (reachedMini(p)) {
      miniReached += 1;
      if (p.estado === "cerrado") convertedFromMini += 1;
    }
  }

  return {
    total: prospectos.length,
    byEstado,
    wonAmount,
    miniToClient: miniReached === 0 ? 0 : convertedFromMini / miniReached,
  };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run apps/dashboard/src/lib/metrics.test.ts --config apps/dashboard/vitest.config.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add apps/dashboard/src/lib/metrics.ts apps/dashboard/src/lib/metrics.test.ts apps/dashboard/vitest.config.ts
git commit -m "feat(dashboard): metrics computation with tests"
```

---

## Task 9: API routes + auth middleware

**Files:**
- Create: `apps/dashboard/src/app/api/health/route.ts`, `apps/dashboard/src/app/api/prospectos/route.ts`, `apps/dashboard/src/app/api/prospectos/[id]/estado/route.ts`, `apps/dashboard/middleware.ts`

- [ ] **Step 1: Create `apps/dashboard/src/app/api/health/route.ts`**

```ts
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ ok: true });
}
```

- [ ] **Step 2: Create `apps/dashboard/src/app/api/prospectos/route.ts`**

```ts
import { getProspectos } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function GET() {
  const prospectos = await getProspectos();
  return Response.json({ prospectos });
}
```

- [ ] **Step 3: Create `apps/dashboard/src/app/api/prospectos/[id]/estado/route.ts`**

```ts
import { repo } from "@/lib/repo";
import type { Estado } from "@fixup/types";

export const dynamic = "force-dynamic";

const VALID: Estado[] = [
  "nuevo", "contactado", "mini-lista", "mini-enviada",
  "propuesta-enviada", "negociacion", "cerrado", "perdido",
];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await req.json()) as { estado?: string };
  if (!body.estado || !VALID.includes(body.estado as Estado)) {
    return Response.json({ error: "invalid estado" }, { status: 400 });
  }
  try {
    const updated = await repo.updateEstado(id, body.estado as Estado);
    return Response.json({ persisted: true, prospecto: updated });
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "EROFS" || code === "EACCES") {
      return Response.json(
        { persisted: false, message: "Read-only filesystem — no persiste hasta Supabase" },
        { status: 503 },
      );
    }
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
```

- [ ] **Step 4: Create `apps/dashboard/middleware.ts` (HTTP Basic)**

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const user = process.env.DASHBOARD_USER;
  const pass = process.env.DASHBOARD_PASS;

  // If creds are not configured, allow through (e.g. preview without secrets).
  if (!user || !pass) return NextResponse.next();

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const decoded = atob(auth.slice(6));
    const sep = decoded.indexOf(":");
    const u = decoded.slice(0, sep);
    const p = decoded.slice(sep + 1);
    if (u === user && p === pass) return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Fixup Dashboard"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/health).*)"],
};
```

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck -w @fixup/dashboard`
Expected: PASS.

- [ ] **Step 6: Manual verify auth + API**

Run: `DASHBOARD_USER=fixup DASHBOARD_PASS=studio npm run dev -w @fixup/dashboard` (in one shell), then in another:
- `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/` → Expected: `401`
- `curl -s -u fixup:studio http://localhost:3000/api/prospectos | head -c 60` → Expected: JSON with `prospectos`
- `curl -s http://localhost:3000/api/health` → Expected: `{"ok":true}` (no auth)

Stop the dev server after verifying.

- [ ] **Step 7: Commit**

```bash
git add apps/dashboard/src/app/api apps/dashboard/middleware.ts
git commit -m "feat(dashboard): api routes + basic-auth middleware"
```

---

## Task 10: useFilters hook (localStorage UI prefs)

**Files:**
- Create: `apps/dashboard/src/lib/useFilters.ts`

- [ ] **Step 1: Create `apps/dashboard/src/lib/useFilters.ts`**

```ts
"use client";
import { useEffect, useState } from "react";
import type { Estado } from "@fixup/types";

export interface Filters {
  rubro: string;   // "" = all
  zona: string;    // "" = all
  estado: Estado | "";
  query: string;
}

const KEY = "fixup.dashboard.filters";
const DEFAULTS: Filters = { rubro: "", zona: "", estado: "", query: "" };

export function useFilters() {
  const [filters, setFilters] = useState<Filters>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setFilters({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<Filters>) });
    } catch {
      /* ignore corrupt prefs */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(filters));
    } catch {
      /* storage unavailable */
    }
  }, [filters]);

  return { filters, setFilters };
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck -w @fixup/dashboard`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/src/lib/useFilters.ts
git commit -m "feat(dashboard): localStorage-backed filter prefs hook"
```

---

## Task 11: ProspectoCard + ProspectoDrawer

**Files:**
- Create: `apps/dashboard/src/components/ProspectoCard.tsx`, `apps/dashboard/src/components/ProspectoDrawer.tsx`

- [ ] **Step 1: Create `apps/dashboard/src/components/ProspectoCard.tsx`**

```tsx
"use client";
import type { Prospecto } from "@fixup/types";
import { Badge } from "@fixup/ui";

export function ProspectoCard({
  prospecto, onOpen, onDragStart,
}: {
  prospecto: Prospecto;
  onOpen: (p: Prospecto) => void;
  onDragStart: (id: string) => void;
}) {
  return (
    <article
      draggable
      onDragStart={() => onDragStart(prospecto.id)}
      onClick={() => onOpen(prospecto)}
      className="cursor-pointer rounded-sm border border-line bg-surface p-3 hover:border-line-2"
    >
      <div className="font-display text-sm text-ink">{prospecto["업체명"]}</div>
      <div className="mt-1 flex flex-wrap items-center gap-1">
        <Badge>{prospecto.rubro}</Badge>
        {prospecto.zona ? <Badge>{prospecto.zona}</Badge> : null}
      </div>
      {prospecto.scores_mini != null ? (
        <div className="mt-2 font-mono text-xs text-ink-soft">mini {prospecto.scores_mini}</div>
      ) : null}
    </article>
  );
}
```

- [ ] **Step 2: Create `apps/dashboard/src/components/ProspectoDrawer.tsx`**

```tsx
"use client";
import type { Prospecto, Scores } from "@fixup/types";
import { ESTADO_LABELS } from "@fixup/types";
import { Badge, Button, Card, FunnelSteps, PlanCard, Pill, ScoreRing, scoreColor } from "@fixup/ui";

const SCORE_LABELS: { key: keyof Scores; label: string }[] = [
  { key: "global", label: "종합" },
  { key: "naver", label: "Naver" },
  { key: "instagram", label: "Instagram" },
  { key: "kakao", label: "Kakao" },
  { key: "compra", label: "구매까지" },
];

function history(p: Prospecto): { label: string; date: string }[] {
  const rows: { label: string; date?: string }[] = [
    { label: "접촉", date: p.fecha_contacto },
    { label: "미니", date: p.fecha_mini },
    { label: "완전 진단", date: p.fecha_completa },
    { label: "제안", date: p.fecha_propuesta },
  ];
  return rows.filter((r): r is { label: string; date: string } => Boolean(r.date));
}

export function ProspectoDrawer({
  prospecto, onClose,
}: { prospecto: Prospecto | null; onClose: () => void }) {
  if (!prospecto) return null;
  const p = prospecto;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/20" onClick={onClose}>
      <aside
        className="h-full w-full max-w-md overflow-y-auto bg-bg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl text-ink">{p["업체명"]}</h2>
            <div className="mt-1 flex flex-wrap gap-1">
              <Badge>{p.rubro}</Badge>
              {p.zona ? <Badge>{p.zona}</Badge> : null}
              <Pill tone="neutral">{ESTADO_LABELS[p.estado]}</Pill>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>✕</Button>
        </div>

        <section className="mt-4 space-y-1 text-sm text-ink-2">
          {p.telefono ? <div>☎ {p.telefono}</div> : null}
          {p.instagram ? <div>IG @{p.instagram}</div> : null}
          {p.observacion ? <div className="text-ink-soft">{p.observacion}</div> : null}
        </section>

        <section className="mt-4">
          <FunnelSteps channels={{ naver: p.naver_place, instagram: p.instagram, kakao: p.kakao }} />
        </section>

        {p.scores_mini != null ? (
          <section className="mt-4">
            <Pill tone={scoreColor(p.scores_mini)}>mini {p.scores_mini}</Pill>
          </section>
        ) : null}

        {p.scores ? (
          <section className="mt-4 flex flex-wrap gap-3">
            {SCORE_LABELS.map(({ key, label }) =>
              p.scores?.[key] != null ? (
                <ScoreRing key={key} value={p.scores[key]!} label={label} />
              ) : null,
            )}
          </section>
        ) : null}

        <section className="mt-4">
          <PlanCard plan={p.plan_recomendado} precio={p.monto_cerrado ?? p.precio_propuesto} />
        </section>

        {history(p).length ? (
          <section className="mt-4">
            <h3 className="mb-2 text-xs font-medium text-ink-soft">상태 이력</h3>
            <Card className="space-y-1">
              {history(p).map((h) => (
                <div key={h.label} className="flex justify-between text-sm">
                  <span className="text-ink-2">{h.label}</span>
                  <span className="font-mono text-ink-soft">{h.date}</span>
                </div>
              ))}
            </Card>
          </section>
        ) : null}

        {p.reportes?.length ? (
          <section className="mt-4">
            <h3 className="mb-2 text-xs font-medium text-ink-soft">리포트</h3>
            <div className="flex flex-col gap-2">
              {p.reportes.map((r) => (
                <a key={r.url} href={r.url} target="_blank" rel="noreferrer"
                   className="text-sm text-coral underline">
                  {r.label}
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </aside>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck -w @fixup/dashboard`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/src/components/ProspectoCard.tsx apps/dashboard/src/components/ProspectoDrawer.tsx
git commit -m "feat(dashboard): prospecto card + detail drawer"
```

---

## Task 12: Toolbar (filters + search + reload)

**Files:**
- Create: `apps/dashboard/src/components/Toolbar.tsx`

- [ ] **Step 1: Create `apps/dashboard/src/components/Toolbar.tsx`**

```tsx
"use client";
import type { Estado, Prospecto } from "@fixup/types";
import { ESTADO_LABELS } from "@fixup/types";
import { Button } from "@fixup/ui";
import type { Filters } from "@/lib/useFilters";

function uniq(values: (string | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v)))].sort();
}

export function Toolbar({
  prospectos, filters, setFilters, onReload, reloading,
}: {
  prospectos: Prospecto[];
  filters: Filters;
  setFilters: (f: Filters) => void;
  onReload: () => void;
  reloading: boolean;
}) {
  const rubros = uniq(prospectos.map((p) => p.rubro));
  const zonas = uniq(prospectos.map((p) => p.zona));
  const estados = Object.keys(ESTADO_LABELS) as Estado[];

  const select = "rounded-sm border border-line-2 bg-surface px-2 py-1.5 text-sm text-ink";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        className={`${select} min-w-48`}
        placeholder="검색 (업체명/지역/IG)"
        value={filters.query}
        onChange={(e) => setFilters({ ...filters, query: e.target.value })}
      />
      <select className={select} value={filters.rubro}
              onChange={(e) => setFilters({ ...filters, rubro: e.target.value })}>
        <option value="">전체 업종</option>
        {rubros.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <select className={select} value={filters.zona}
              onChange={(e) => setFilters({ ...filters, zona: e.target.value })}>
        <option value="">전체 지역</option>
        {zonas.map((z) => <option key={z} value={z}>{z}</option>)}
      </select>
      <select className={select} value={filters.estado}
              onChange={(e) => setFilters({ ...filters, estado: e.target.value as Estado | "" })}>
        <option value="">전체 상태</option>
        {estados.map((s) => <option key={s} value={s}>{ESTADO_LABELS[s]}</option>)}
      </select>
      <Button variant="secondary" onClick={onReload} disabled={reloading}>
        {reloading ? "..." : "↻ 새로고침"}
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck -w @fixup/dashboard`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/src/components/Toolbar.tsx
git commit -m "feat(dashboard): toolbar with filters, search, reload"
```

---

## Task 13: Metrics component

**Files:**
- Create: `apps/dashboard/src/components/Metrics.tsx`

- [ ] **Step 1: Create `apps/dashboard/src/components/Metrics.tsx`**

```tsx
"use client";
import type { Prospecto } from "@fixup/types";
import { PIPELINE_COLUMNS, columnForEstado } from "@fixup/types";
import { Card } from "@fixup/ui";
import { computeMetrics } from "@/lib/metrics";

export function Metrics({ prospectos }: { prospectos: Prospecto[] }) {
  const m = computeMetrics(prospectos);
  const perColumn = PIPELINE_COLUMNS.map((c) => ({
    label: c.label,
    count: prospectos.filter((p) => columnForEstado(p.estado).key === c.key).length,
  }));

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Card>
        <div className="text-xs text-ink-soft">₩ 계약 완료</div>
        <div className="font-mono text-xl text-ink">₩{m.wonAmount.toLocaleString("ko-KR")}</div>
      </Card>
      <Card>
        <div className="text-xs text-ink-soft">미니 → 고객 전환</div>
        <div className="font-mono text-xl text-ink">{(m.miniToClient * 100).toFixed(0)}%</div>
      </Card>
      <Card>
        <div className="text-xs text-ink-soft">총 프로스펙트</div>
        <div className="font-mono text-xl text-ink">{m.total}</div>
      </Card>
      <Card>
        <div className="text-xs text-ink-soft">단계별</div>
        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 font-mono text-xs text-ink-2">
          {perColumn.map((c) => <span key={c.label}>{c.label} {c.count}</span>)}
        </div>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck -w @fixup/dashboard`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/src/components/Metrics.tsx
git commit -m "feat(dashboard): metrics summary cards"
```

---

## Task 14: PipelineBoard (kanban + drag + filtering)

**Files:**
- Create: `apps/dashboard/src/components/PipelineBoard.tsx`

- [ ] **Step 1: Create `apps/dashboard/src/components/PipelineBoard.tsx`**

```tsx
"use client";
import { useMemo, useState } from "react";
import type { Estado, Prospecto } from "@fixup/types";
import { PIPELINE_COLUMNS, columnForEstado } from "@fixup/types";
import { Metrics } from "./Metrics";
import { Toolbar } from "./Toolbar";
import { ProspectoCard } from "./ProspectoCard";
import { ProspectoDrawer } from "./ProspectoDrawer";
import { useFilters } from "@/lib/useFilters";

export function PipelineBoard({ initial }: { initial: Prospecto[] }) {
  const [prospectos, setProspectos] = useState<Prospecto[]>(initial);
  const [selected, setSelected] = useState<Prospecto | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [reloading, setReloading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { filters, setFilters } = useFilters();

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return prospectos.filter((p) => {
      if (filters.rubro && p.rubro !== filters.rubro) return false;
      if (filters.zona && p.zona !== filters.zona) return false;
      if (filters.estado && p.estado !== filters.estado) return false;
      if (q) {
        const hay = `${p["업체명"]} ${p.zona ?? ""} ${p.instagram ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [prospectos, filters]);

  async function reload() {
    setReloading(true);
    try {
      const res = await fetch("/api/prospectos", { cache: "no-store" });
      const data = (await res.json()) as { prospectos: Prospecto[] };
      setProspectos(data.prospectos);
    } finally {
      setReloading(false);
    }
  }

  async function moveTo(estado: Estado) {
    if (!dragId) return;
    const id = dragId;
    setDragId(null);
    const prev = prospectos;
    setProspectos((cur) => cur.map((p) => (p.id === id ? { ...p, estado } : p)));
    try {
      const res = await fetch(`/api/prospectos/${id}/estado`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      if (res.status === 503) {
        setToast("적용됨 (뷰) — Supabase 전 영구저장 안 됨");
      } else if (!res.ok) {
        setProspectos(prev); // hard failure → rollback
        setToast("변경 실패");
      }
    } catch {
      setProspectos(prev);
      setToast("변경 실패");
    }
  }

  return (
    <div className="space-y-4 p-6">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">픽스업 파이프라인</h1>
      </header>

      <Metrics prospectos={prospectos} />
      <Toolbar
        prospectos={prospectos}
        filters={filters}
        setFilters={setFilters}
        onReload={reload}
        reloading={reloading}
      />

      <div className="flex gap-3 overflow-x-auto pb-2">
        {PIPELINE_COLUMNS.map((col) => {
          const cards = filtered.filter((p) => columnForEstado(p.estado).key === col.key);
          return (
            <div
              key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => moveTo(col.dropTarget)}
              className="flex w-64 shrink-0 flex-col gap-2 rounded bg-bg-2 p-2"
            >
              <div className="flex items-center justify-between px-1">
                <span className="font-display text-sm text-ink">{col.label}</span>
                <span className="font-mono text-xs text-ink-soft">{cards.length}</span>
              </div>
              {cards.map((p) => (
                <ProspectoCard key={p.id} prospecto={p} onOpen={setSelected} onDragStart={setDragId} />
              ))}
            </div>
          );
        })}
      </div>

      <ProspectoDrawer prospecto={selected} onClose={() => setSelected(null)} />

      {toast ? (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-sm bg-ink px-4 py-2 text-sm text-white"
          onAnimationEnd={() => setToast(null)}
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
```

Note: toast auto-clear — simplest reliable approach is a click-to-dismiss; the `onAnimationEnd` is harmless if no animation. Acceptable for MVP; dismiss by next action.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck -w @fixup/dashboard`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/src/components/PipelineBoard.tsx
git commit -m "feat(dashboard): kanban pipeline board with drag, filters, reload"
```

---

## Task 15: Wire the page + final verification

**Files:**
- Modify: `apps/dashboard/src/app/page.tsx`
- Create: `apps/dashboard/.env.local.example`, `apps/dashboard/README.md`

- [ ] **Step 1: Replace `apps/dashboard/src/app/page.tsx`**

```tsx
import { getProspectos } from "@/lib/repo";
import { PipelineBoard } from "@/components/PipelineBoard";

export const dynamic = "force-dynamic";

export default async function Page() {
  const prospectos = await getProspectos();
  return <PipelineBoard initial={prospectos} />;
}
```

- [ ] **Step 2: Create `apps/dashboard/.env.local.example`**

```
DASHBOARD_USER=fixup
DASHBOARD_PASS=changeme
```

- [ ] **Step 3: Create `apps/dashboard/README.md`**

```md
# apps/dashboard

Panel interno del pipeline. Next 15 + `@fixup/ui` + `@fixup/types`.

## Dev
```bash
cp apps/dashboard/.env.local.example apps/dashboard/.env.local
npm install
npm run dev -w @fixup/dashboard
```
Auth: HTTP Basic (`DASHBOARD_USER` / `DASHBOARD_PASS`). Sin env vars, el acceso queda abierto.

## Datos
Lee/escribe `data/prospectos.json` vía `getProspectos()` / `ProspectoRepo`. En Vercel el FS es
read-only: el drag se aplica en la vista pero no persiste hasta migrar a Supabase
(`SupabaseProspectoRepo` con la misma interfaz).

## Deploy (Vercel)
Root del proyecto = `apps/dashboard`. Setear `DASHBOARD_USER` / `DASHBOARD_PASS`.
```

- [ ] **Step 4: Full typecheck across workspace**

Run: `npm run typecheck`
Expected: all packages PASS.

- [ ] **Step 5: Full test run**

Run: `npm test` (root packages) and `npx vitest run --config apps/dashboard/vitest.config.ts` (dashboard)
Expected: all tests PASS.

- [ ] **Step 6: Full build**

Run: `npm run build`
Expected: `@fixup/types`, `@fixup/ui` build; `@fixup/dashboard` Next build succeeds.

- [ ] **Step 7: Manual smoke test**

Run: `DASHBOARD_USER=fixup DASHBOARD_PASS=studio npm run dev -w @fixup/dashboard`, open `http://localhost:3000`, log in:
- Metrics cards show ₩ won, conversion %, totals.
- 7 kanban columns render with seeded cards in correct columns.
- Drag a card to another column → moves + persists to `data/prospectos.json` (check git diff).
- Click a card → drawer opens with scores/rings/history/report links.
- Set a filter, reload page → filter persists (localStorage).
- Reload button refetches.

Stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add apps/dashboard/src/app/page.tsx apps/dashboard/.env.local.example apps/dashboard/README.md data/prospectos.json
git commit -m "feat(dashboard): wire pipeline page + dev docs"
```

---

## Self-Review notes

- **Spec coverage:** pipeline kanban+colors (T14), metrics counters/₩/conversion (T8,T13), ficha with channels/scores/semáforo/history/report links (T11), filters+search+persist (T10,T12,T14), reactive + reload (T14), simple auth (T9), `getProspectos()` behind interface (T7), components from `@fixup/ui` only (T3,T4), seed (T5), Turborepo (T1). All covered.
- **Type consistency:** `ProspectoRepo.updateEstado`, `getProspectos`, `computeMetrics`, `PIPELINE_COLUMNS`/`columnForEstado`, `scoreColor`, `Filters` names used identically across tasks. `Prospecto.reportes` added in T2 and consumed in T11.
- **Vercel write caveat** handled in T9 (503 `persisted:false`) and surfaced in UI (T14 toast) + docs (T15).
