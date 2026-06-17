# Skills de Fixup Studio (Claude Code)

Skills operativas para el negocio coreano, adaptadas del orquestador de AuditaDigital LATAM. Se ejecutan en **Claude Code**, no acá.

## Cómo instalarlas
1. En el proyecto de Claude Code de Corea, copiá el `.md` a `.claude/skills/`.
2. Asegurá las dependencias del template de reportes (ver abajo).
3. Invocá por trigger (ej: "mini-auditoría de [업체명]").

## Dependencias compartidas
- **`fixup-reports/`** — design system de reportes (HTML templates + `shared.css`). ✅ **Alineado al style guide final** (Jua + Noto Sans KR + Space Mono, paleta crema/coral). Archivos en `Korea/fixup-reports/`: `assets/shared.css`, `mini-auditoria.html`, `index.html`, `propuesta.html`, `dashboard.html`. Para correr las skills, copiá `Korea/fixup-reports/` a la raíz del proyecto de Claude Code.
- **Supabase** (tabla `prospectos`) — pipeline de prospectos (mismos estados que LATAM + `contactado`), accedido vía `scripts/db.mjs`. `data/prospectos.json` quedó como backup (`db.mjs dump`).

## Set de skills (roadmap)
| Skill | Estado | Origen LATAM |
|---|---|---|
| `fixup-mini-auditoria` | ✅ escrita | `01-mini-auditoria` |
| `fixup-auditoria` (완전 진단) | ✅ escrita | `00-orquestador` + plantilla 진단 xlsx |
| `fixup-propuesta` | ✅ escrita | `02-propuesta` |
| `fixup-pipeline` | ✅ escrita | `03-dashboard-propuestas` |
| `fixup-outreach` | ✅ escrita | `04-campana-csv` (→ Instagram DM) |
| `prospect-research-kr` | ✅ escrita | `prospect-research-ar` |
| `fixup-contenido` | ✅ escrita | nuevo (blog/IG coreano por tono) |

## Orden sugerido
1. `fixup-mini-auditoria` (ya) → necesita el template `fixup-reports` rebrandeado.
2. `fixup-auditoria` (la completa paga).
3. `fixup-propuesta` + `fixup-pipeline`.
4. `prospect-research-kr` + `fixup-outreach`.
5. `fixup-contenido` (para clientes ya activos).
