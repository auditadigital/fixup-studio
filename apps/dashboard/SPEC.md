# apps/dashboard — Panel de control reactivo

Reemplaza el `fixup-reports/dashboard.html` plano por una **app React reactiva** desplegada en Vercel. Control central del negocio.

## Stack
Next.js (App Router) + TS + Tailwind + design system `packages/ui`. Tipos `packages/types`. Deploy en Vercel. Lee `data/prospectos.json`.

## Datos
Fuente: `data/prospectos.json` (ver `data/README.md`). MVP: importarlo en build / leerlo en runtime desde el repo. Capa de datos abstraída (`getProspectos()`) para migrar a Supabase sin tocar la UI. Interno (puede ir en español/coreano); el dashboard NO es client-facing.

## Vistas
1. **Pipeline (kanban o tabla)** — columnas por estado (신규 / 접촉 / 미니 / 제안 / 협의 / 계약 / 종료). Drag entre estados (opcional MVP).
2. **Métricas arriba** — contadores por etapa + ₩ cerrado + tasa de conversión mini→cliente.
3. **Ficha de prospecto** — datos, canales (Naver/IG/Kakao), scores (mini + 완전 진단 por categoría), historial de estado, links a sus reportes/PDF.
4. **Filtros** — por rubro, zona, estado; búsqueda.
5. **Clientes activos** — vista de los `cerrado` con su plan y tareas del mes (futuro: reporte mensual).

## Reactivo / UX
- Componentes client-side, estado en React (sin localStorage en artifacts; acá sí podés persistir filtros).
- Colores de estado y semáforo del design system (mismos que el style guide).
- Botón Reload / revalidación de datos.

## Deploy
Proyecto Vercel apuntando a `apps/dashboard`. Acceso protegido (password simple o auth básica — es interno).

## No-objetivos (MVP)
- No genera auditorías (eso lo hace el engine). El dashboard solo **lee y gestiona** el pipeline.
- Sin DB todavía (JSON versionado).
