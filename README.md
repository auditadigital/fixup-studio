# Fixup Studio — Monorepo

Monorepo (Turborepo) de **Fixup Studio / 픽스업 스튜디오**. Reúne los 3 proyectos y lo que comparten.

> Entrega de esta carpeta: **estructura + specs + prompts** para Claude Code. El código de las apps se construye en Claude Code (ver cada `PROMPT.md`). El motor de auditorías ya viene poblado con las skills.

## Layout

```
fixup-studio/
├── apps/
│   ├── landing/      ← Web pública de captación (Next.js → Vercel)   [SPEC + PROMPT]
│   └── dashboard/    ← Panel de control reactivo (Next.js → Vercel)  [SPEC + PROMPT]
├── packages/
│   ├── ui/           ← Design system compartido (tokens del style guide) [SPEC]
│   └── types/        ← Tipos TS compartidos (Lead, Prospecto, Audit…)     [SPEC]
├── data/
│   └── prospectos.json  ← Fuente de datos VERSIONADA (la lee el dashboard)
└── engine/           ← Motor de auditorías = proyecto Claude Code
    ├── .claude/skills/  (skills fixup-* — ya copiadas)
    └── fixup-reports/   (templates de reportes — ya copiados)
```

## Cómo se relacionan los 3 proyectos

1. **landing** capta un lead (form de auditoría gratis) → escribe en `data/prospectos.json` (estado `nuevo`).
2. **engine** (Claude Code) corre research, mini, 진단, propuesta → actualiza `data/prospectos.json` y genera reportes/PDF.
3. **dashboard** lee `data/prospectos.json` y muestra el pipeline en vivo (reactivo), reemplazando el `dashboard.html` plano.

```
landing  ──(lead)──▶  data/prospectos.json  ◀──(scores/estado)──  engine (Claude Code)
                              │
                              ▼
                          dashboard  (lee y visualiza)
```

## Decisiones de arquitectura
- **Monorepo Turborepo**: apps comparten `packages/ui` (design system) y `packages/types`.
- **Datos = JSON versionado** (`data/prospectos.json`). Sin DB por ahora. El engine escribe ahí; el dashboard lo importa en build/runtime. Sync por commit/push.
- **Deploys en Vercel**: `apps/landing` y `apps/dashboard` (dos proyectos Vercel apuntando a sus carpetas). El `engine` NO se deploya (corre en Claude Code).
- **Stack**: Next.js (App Router) + TypeScript + Tailwind. Design tokens del style guide (Jua / Noto Sans KR / Space Mono, paleta crema/coral).

## Fuente de la verdad visual
`packages/ui` materializa el `Fixup Studio - Style Guide`. Tokens en `packages/ui/SPEC.md`.

## Próximos pasos
Abrí cada `PROMPT.md` y pegalo en Claude Code (uno por app). Orden sugerido: `packages/ui` y `packages/types` primero (base compartida), después `apps/landing`, después `apps/dashboard`.
