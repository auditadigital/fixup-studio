# data/ — Fuente de datos versionada

`prospectos.json` es la única fuente de la verdad compartida (sin DB). 

- **engine** (Claude Code) la escribe (research, mini, 진단, propuesta, cambios de estado).
- **dashboard** la lee y la visualiza.
- **landing** appendea leads nuevos (estado `nuevo`) — vía un commit/push o un pequeño endpoint que escribe el archivo.

## Forma
```json
{ "prospectos": [ /* Prospecto[] — ver packages/types/SPEC.md */ ] }
```

## Sync
Flujo completo definido en **`docs/data-plane.md`**. Resumen:
- **engine** (local) escribe el archivo y hace `git push`.
- **landing** escribe leads nuevos vía **GitHub API (commit)** + notifica (no puede escribir el archivo en runtime de Vercel).
- **dashboard** lo lee **en runtime desde el repo** (siempre fresco) detrás de `getProspectos()`.
Migración futura a Supabase sin cambiar los tipos.

> Nota: las skills del engine escriben `prospectos.json`. En el monorepo, apuntá ese archivo a `../data/prospectos.json` (symlink) para que engine y dashboard compartan el mismo.
