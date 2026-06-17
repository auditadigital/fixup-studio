# Data plane — cómo se conectan landing ↔ engine ↔ dashboard

> ⚠️ **ACTUALIZADO:** la fuente de la verdad migra a **Supabase** (tabla `prospectos`). Ver `docs/supabase/` (prompts de migración). Lo de abajo (JSON-en-repo + GitHub API) queda como **referencia histórica / fallback local**; los contratos (`ProspectoStore`) y los tipos no cambian — solo cambia la implementación (de `GithubJsonStore` a `SupabaseStore`).

Cómo fluyen los datos en el monorepo. **Fuente de la verdad: la tabla `prospectos` en Supabase** (antes: `data/prospectos.json`).

## Diagrama

```
                         ┌─────────────────────────────┐
                         │  data/prospectos.json (repo) │  ◀── fuente de la verdad
                         └─────────────────────────────┘
            escribe (commit)        ▲           ▲        lee (runtime)
        ┌───────────────────────────┘           └───────────────────────────┐
        │                                                                    │
   ┌─────────┐   GitHub API commit (estado "nuevo")                    ┌───────────┐
   │ landing │ ───────────────────────────────────────────────▶       │ dashboard │
   │ /api/   │ + notifica (email/Kakao) a la operadora                 │ (lee y    │
   │ leads   │                                                         │  gestiona)│
   └─────────┘                                                         └───────────┘
        ▲                                                                    
        │ lead del formulario                                               
                                                                            
   ┌──────────────────────────────┐
   │ engine (Claude Code, local)  │ ── lee/escribe el archivo directo → git commit && push
   │ skills fixup-* + research     │    (research, mini, 진단, propuesta, cambios de estado)
   └──────────────────────────────┘
```

## Reglas de cada actor

### engine (Claude Code, local) — escritor principal
- Lee/escribe `data/prospectos.json` directamente en el filesystem local.
- Tras cambios, `git commit && git push`. Eso actualiza la fuente para el dashboard.
- Las skills ya usan `prospectos.json`; en el monorepo **apuntá esa ruta a `data/prospectos.json`** (symlink desde `engine/prospectos.json` → `../data/prospectos.json`, o configurá la ruta en la skill).

### landing (Vercel) — captura de leads
- Vercel tiene **filesystem read-only** en runtime → NO puede escribir el archivo.
- `/api/leads` hace 2 cosas:
  1. **Commit vía GitHub API** (Contents API): lee `data/prospectos.json`, appendea el lead como `Prospecto` con `estado: "nuevo"`, y commitea. Esto lo deja en la fuente de la verdad y dispara el redeploy.
  2. **Notifica** a la operadora (email y/o Kakao) para reacción rápida.
- Toda la lógica detrás de una interfaz `LeadStore` para poder cambiar el backend sin tocar la UI.

### dashboard (Vercel) — lectura/gestión
- Lee `data/prospectos.json` **en runtime desde el repo** (GitHub raw o Contents API) con revalidación (`revalidate: 60` o on-demand), así refleja tanto los pushes del engine como los leads sin esperar un redeploy manual.
- Detrás de `getProspectos()` para migrar a Supabase después sin tocar la UI.
- Cambios de estado desde el dashboard (opcional MVP) → mismo patrón de commit vía GitHub API.

## Contratos (capa de datos abstraída)

```ts
// packages/types ya define Prospecto y Lead
interface ProspectoStore {
  getAll(): Promise<Prospecto[]>;                 // dashboard (runtime fetch)
  appendLead(lead: Lead): Promise<Prospecto>;     // landing → estado "nuevo"
  update(id: string, patch: Partial<Prospecto>): Promise<void>; // opcional (dashboard)
}
```
- Implementación MVP: `GithubJsonStore` (Contents API sobre `data/prospectos.json`).
- Implementación futura: `SupabaseStore` (mismos métodos) — swap sin cambiar páginas.

## Variables de entorno (Vercel)
```
GITHUB_TOKEN=         # PAT con permiso "contents:write" SOLO sobre este repo (fine-grained)
GITHUB_REPO=          # owner/repo
GITHUB_BRANCH=main
DATA_PATH=data/prospectos.json
NOTIFY_EMAIL=         # destino de aviso de lead nuevo
KAKAO_WEBHOOK_URL=    # opcional: aviso por Kakao
```
> El token va SOLO en variables de entorno de Vercel (landing y, si gestiona estados, dashboard). Nunca en el repo.

## Concurrencia y robustez
- Volumen bajo, pero el commit a un mismo archivo se serializa por `sha`. Si la GitHub API devuelve `409` (sha desactualizado): re-leer el archivo, re-aplicar el append, reintentar (2–3 veces).
- Validar el lead con zod antes de commitear. Si el commit falla, **igual** mandar la notificación (no perder el lead) y loguear para reintento.
- `id` del prospecto: slug único; si colisiona, sufijo numérico.

## Seguridad / privacidad
- Datos personales mínimos (nombre, contacto). El repo debería ser **privado**.
- Cumplimiento coreano (정보통신망법): la landing capta con consentimiento explícito del propio dueño (él pide el diagnóstico) — distinto del outbound. Igual, dejar un checkbox de consentimiento + link a /privacy.

## Fallback simple (si no querés manejar un GitHub token)
- `/api/leads` hace **solo la notificación** (email/Kakao). El lead se agrega a `data/prospectos.json` a mano vía el engine (o un botón "agregar lead" en el dashboard que commitea).
- Más manual, cero secretos. Encaja con la operación human-in-the-loop, pero el lead no queda en la fuente de la verdad hasta que alguien lo cargue.

## Reportes / entregables (decisión: entrega directa, sin hosting)

El engine genera reportes (mini `.html`+`.png`, 완전 진단 `.html`+`.pdf`, propuesta `.pdf`) en `clientes/[id]/[fecha]/`. **Por ahora NO se hostean.**

- **Entrega al cliente:** como adjunto — la mini por **Instagram DM (PNG)**, el 진단 y la propuesta por **Kakao/email (PDF)**. No hace falta URL web.
- **Dashboard:** cada skill registra el reporte en `prospecto.reportes[]` como `{ label, url }`, donde `url` es la **ruta local** del archivo (no es clickeable desde el deploy; es referencia para el operador, que trabaja local).
- **Upgrade futuro (sin cambiar la forma del campo):** cuando quieras links reales, el engine sube el reporte a **Vercel Blob** y guarda la URL (pública o firmada) en `reportes[].url`. La UI del dashboard no cambia.

## Migración futura (sin reescribir UI)
Cuando el volumen lo pida, reemplazar `GithubJsonStore` por `SupabaseStore` (Postgres). Los tipos de `packages/types` y los contratos `ProspectoStore` no cambian. El engine pasaría a leer/escribir vía API en vez del archivo.

## Decisión a confirmar
**Recomendado:** commit vía GitHub API + notificación (automático, una sola fuente de verdad, dashboard siempre fresco). Requiere un PAT fine-grained en Vercel.
**Alternativa:** notify-only + carga manual (cero secretos, más manual).
→ Elegí una antes de implementar `/api/leads`.
