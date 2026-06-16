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
Root del proyecto = `apps/dashboard`.

- **Build Command:** `cd ../.. && npm run build -w @fixup/dashboard`
- **Output Directory:** `apps/dashboard/.next`
- **Env vars:** setear `DASHBOARD_USER` / `DASHBOARD_PASS` (y opcionalmente `PROSPECTOS_PATH`).
