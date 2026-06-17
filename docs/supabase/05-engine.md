# Prompt Claude Code — 05 · Engine → Supabase

> Pegá en Claude Code, abierto en `engine/`. Requiere el schema aplicado (prompt 01) y `engine/.env`
> con SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (gitignored).

```text
<contexto>
Soy el motor de auditorías de "Fixup Studio" (proyecto Claude Code, carpeta engine/). Las skills fixup-*
hoy leen/escriben prospectos.json. Migramos la fuente de la verdad a Supabase (tabla `prospectos`).
Quiero un pequeño CLI para que las skills hablen con Supabase, y actualizar las skills para usarlo.
</contexto>

<objetivo>
1) Crear engine/scripts/db.mjs (Node + @supabase/supabase-js) como CLI sobre la tabla `prospectos`.
2) Actualizar las skills de .claude/skills/ para usar db.mjs en vez de editar prospectos.json.
</objetivo>

<requisitos>
1. engine/scripts/db.mjs lee SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY de engine/.env. Subcomandos:
   - list [--estado X] [--rubro Y]            → imprime JSON de prospectos
   - get <id>
   - add-lead '<json>'                        → inserta estado 'nuevo' (deriva id slug)
   - upsert '<json>'                          → insert/update por id
   - set-estado <id> <estado> [--monto N]     → cambia estado (y monto_cerrado si aplica)
   - patch <id> '<json>'                      → merge de campos (scores, fechas, plan, precio, observacion)
   - add-report <id> <label> <path>           → push a reportes[]
   - dump > ../data/prospectos.json           → snapshot opcional (backup/seed)
   Mapeo: nombre_negocio↔업체명; scores/reportes jsonb. Errores claros y exit codes.

2. Actualizar estas skills (en .claude/skills/) para reemplazar los pasos de "leer/escribir prospectos.json"
   por llamadas a `node scripts/db.mjs ...`:
   - fixup-mini-auditoria: en vez de editar el JSON → `db.mjs upsert` (scores_mini, fecha_mini, estado mini-lista)
     y `db.mjs add-report <id> "미니 진단" <png_path>`.
   - fixup-auditoria: `db.mjs patch <id>` (scores, fecha_completa, estado) + `db.mjs add-report <id> "완전 진단" <pdf>`.
   - fixup-propuesta: `db.mjs patch <id>` (estado propuesta-enviada, fecha_propuesta, plan_recomendado, precio_propuesto)
     + `db.mjs add-report <id> "제안서" <pdf>`.
   - fixup-pipeline: leer con `db.mjs list` (en vez del JSON) para generar el dashboard.html local
     — o marcar esta skill como opcional, ya que el dashboard React (Vercel) lee Supabase directo.
   - Flujos de "Actualizá [업체명] a [estado]" → `db.mjs set-estado`.
   Mantené el resto de cada skill igual (inputs, scoring, reportes, copy coreano).

3. .env de ejemplo (engine/.env.example) con SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY. .env en .gitignore.
</requisitos>

<restricciones>
- service_role solo local en el engine (.env gitignored). Nunca commitearla.
- No cambiar la lógica de auditoría/copy de las skills; solo la capa de persistencia (JSON → db.mjs).
- data/prospectos.json deja de ser la fuente; queda como backup vía `db.mjs dump`.
</restricciones>
```
