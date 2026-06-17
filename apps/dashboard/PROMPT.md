# Prompt para Claude Code — apps/dashboard

> Pegá este prompt en Claude Code, en la raíz del monorepo `fixup-studio/`. Antes, construí `packages/ui` y `packages/types`.
> 📌 DATOS: el dashboard lee/gestiona desde **Supabase** (server-side, service_role) — seguí `docs/supabase/04-dashboard.md` (reemplaza la lectura de JSON/GitHub de abajo).

```text
<contexto>
Monorepo Turborepo de "Fixup Studio / 픽스업 스튜디오", agencia de marketing digital para PyMEs
coreanas. Construyo apps/dashboard: el panel de control reactivo que reemplaza un dashboard HTML
plano. Es interno (no client-facing). Leé apps/dashboard/SPEC.md, packages/ui/SPEC.md,
packages/types/SPEC.md y data/README.md.
</contexto>

<objetivo>
Un dashboard React reactivo, desplegable en Vercel, que lee data/prospectos.json y permite controlar
el pipeline de ventas en vivo.
</objetivo>

<stack>
- Next.js 15 App Router + TypeScript (strict) + Tailwind
- Design system de packages/ui (tokens del style guide). Tipos de packages/types.
- Fuente de datos: data/prospectos.json leído EN RUNTIME desde el repo (GitHub raw/Contents API) con revalidación, detrás de getProspectos() (ver docs/data-plane.md). Así refleja los pushes del engine y los leads sin redeploy. Migrable a Supabase sin tocar la UI.
</stack>

<requisitos>
1. Vista pipeline: tabla o kanban por estado (신규/접촉/미니/제안/협의/계약/종료) con los colores del design system.
2. Métricas: contadores por etapa, ₩ cerrado (suma de monto_cerrado), tasa de conversión mini→cliente.
3. Ficha de prospecto: datos + canales + scores (mini y 완전 진단 por categoría con semáforo) + historial + links a reportes/PDF.
4. Filtros (rubro, zona, estado) y búsqueda. Persistí los filtros del usuario.
5. Reactivo (client components donde haga falta) + botón de recargar datos.
6. Acceso protegido simple (es interno).
</requisitos>

<entregables>
- App Next.js en apps/dashboard lista para deploy en Vercel.
- getProspectos() con implementación JSON (data/prospectos.json) detrás de una interfaz.
- Componentes desde packages/ui; nada de estilos hardcodeados fuera del design system.
</entregables>

<restricciones>
- El dashboard NO genera auditorías (eso es el engine). Solo lee/gestiona el pipeline.
- Sin DB todavía. No uses localStorage para datos de negocio (sí para preferencias de UI).
</restricciones>
```
