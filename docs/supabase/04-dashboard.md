# Prompt Claude Code — 04 · Dashboard → Supabase

> Pegá en Claude Code. Requiere packages/db (prompt 02).

```text
<contexto>
Monorepo "Fixup Studio", apps/dashboard (Next.js, interno). Hoy leía data/prospectos.json en runtime.
Migramos: ahora lee/gestiona la tabla `prospectos` de Supabase vía packages/db, server-side con
service_role. Leé apps/dashboard/SPEC.md y docs/data-plane.md (sección Supabase).
</contexto>

<objetivo>
Que el dashboard obtenga los prospectos desde Supabase (server-side) y permita cambiar estado y editar
campos del pipeline, persistiendo en Supabase.
</objetivo>

<requisitos>
1. getProspectos() ahora usa store.getAll() de packages/db (Server Component / route handler con service_role).
   Quitar la lectura del JSON / GitHub.
2. Acciones server (Server Actions o route handlers) para: cambiar estado (store.update), editar campos del pipeline.
   El dashboard ya tiene su password interno → esas acciones quedan detrás de esa protección.
3. Revalidación: revalidatePath/revalidateTag tras cada mutación para reflejar cambios al instante.
   (Opcional: Supabase Realtime para auto-refresh; si lo agregás, server-side o canal protegido.)
4. La UI (pipeline, métricas, ficha, filtros) no cambia; solo cambia la fuente de datos.
5. Env en Vercel (server): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
</requisitos>

<restricciones>
- service_role SOLO server-side. No exponerla en componentes cliente ni en el bundle.
- Sin auth de usuarios (queda el password interno). RLS está activado sin políticas públicas: todo acceso es server con service_role.
</restricciones>
```
