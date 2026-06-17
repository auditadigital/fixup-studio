# Prompt Claude Code — 03 · Landing → Supabase

> Pegá en Claude Code. Requiere packages/db (prompt 02).

```text
<contexto>
Monorepo "Fixup Studio", apps/landing (Next.js). Hoy /api/leads escribía el lead vía GitHub API a un
JSON. Migramos: ahora el lead va a Supabase mediante packages/db. Leé apps/landing/SPEC.md y
docs/data-plane.md (sección actualizada de Supabase).
</contexto>

<objetivo>
Que /api/leads valide el lead y lo inserte en la tabla `prospectos` (estado 'nuevo') vía packages/db,
y notifique a la operadora.
</objetivo>

<requisitos>
1. /api/leads: valida con zod (campos de Lead: nombre, 업체명, rubro, telefono?, instagram?, naver_place?, mensaje?).
2. Inserta vía store.appendLead(lead) de packages/db (createStore con service_role, server-side).
3. Notifica (email y/o Kakao webhook) — si la notificación falla, NO falles la request (el lead ya quedó guardado).
   Si el insert falla, devolvé error y, como red de seguridad, mandá igual la notificación con el lead.
4. Sacá TODO el código viejo de GitHub API / commit del JSON.
5. Consentimiento: el form debe tener checkbox de consentimiento + link a /privacy (정보통신망법).
6. Env en Vercel (server): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NOTIFY_EMAIL, KAKAO_WEBHOOK_URL.
</requisitos>

<restricciones>
- service_role solo server-side (route handler). Nunca en el cliente.
- No romper el resto de la landing; solo cambia la persistencia del lead.
</restricciones>
```
