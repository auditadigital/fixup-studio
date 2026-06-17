# engine — Motor de auditorías (proyecto Claude Code)

NO es una app web ni se deploya. Es el **proyecto de Claude Code** que opera todo el flujo: research → outreach → mini → 완전 진단 → propuesta → pipeline. Human-in-the-loop (screenshots de Naver/IG/Kakao).

## Contenido (ya poblado)
```
engine/
├── .claude/skills/      ← skills fixup-* + prospect-research-kr (+ README)
├── scripts/db.mjs       ← CLI sobre la tabla `prospectos` (Supabase); lo usan las skills
├── .env.example         ← copiá a engine/.env (SUPABASE_URL + SERVICE_ROLE_KEY)
└── fixup-reports/       ← templates de reportes (HTML + shared.css)
```

## Capa de datos — `scripts/db.mjs`
CLI Node sobre Supabase (lee `engine/.env`). Subcomandos:
```
node scripts/db.mjs list [--estado X] [--rubro Y]   # JSON de prospectos
node scripts/db.mjs get <id|업체명>
node scripts/db.mjs add-lead '<json>'               # inserta estado 'nuevo' (id slug)
node scripts/db.mjs upsert '<json>'                 # insert/update por id
node scripts/db.mjs set-estado <id|업체명> <estado> [--monto N]
node scripts/db.mjs patch <id|업체명> '<json>'       # merge de campos (scores se mergea)
node scripts/db.mjs add-report <id|업체명> <label> <path>
node scripts/db.mjs dump > ../data/prospectos.json  # backup/seed (opcional)
```
Mapeo: `업체명`↔`nombre_negocio`, `scores_mini`↔`score_mini`; `scores`/`reportes` son jsonb. Exit: 0 ok · 1 uso · 2 env · 3 DB · 4 no encontrado.

## Uso
1. Abrí `engine/` en Claude Code.
2. Las skills se disparan por lenguaje natural (ver `.claude/skills/README.md`):
   - `mini-auditoría de [업체명]` · `auditoría completa de [업체명]` · `propuesta para [업체명]` · `파이프라인 보기` · `buscar prospectos` · `preparar DMs`.
3. Escribe/lee datos en **Supabase** (tabla `prospectos`) vía `scripts/db.mjs` (lee `engine/.env`). `../data/prospectos.json` ya NO es la fuente — queda como backup vía `node scripts/db.mjs dump > ../data/prospectos.json`.

## Relación con el resto del monorepo
- Comparte la **fuente de datos** (tabla `prospectos` en Supabase) con la landing y el dashboard. El acceso del engine es server-side con `service_role` (en `engine/.env`, gitignored) vía `scripts/db.mjs`.
- El **dashboard reactivo** reemplaza al `fixup-reports/dashboard.html` plano para visualizar el pipeline; las skills siguen generando los **reportes de auditoría** (mini/완전) en HTML/PDF, que son entregables al cliente.

> Las skills aquí son una **copia** de `Korea/skills` y `Korea/fixup-reports` (que eran el staging). Esta es la ubicación canónica dentro del monorepo. Si querés single-source, borrá las de `Korea/` y dejá solo estas.
