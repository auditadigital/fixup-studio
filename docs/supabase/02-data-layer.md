# Prompt Claude Code — 02 · Data layer (packages/db)

> Pegá en Claude Code en la raíz del monorepo. Requiere el schema aplicado (prompt 01).

```text
<contexto>
Monorepo "Fixup Studio". La fuente de la verdad es la tabla `prospectos` en Supabase. Necesito una
capa de datos compartida que usen landing, dashboard y (vía CLI) el engine. Tipos en packages/types.
</contexto>

<objetivo>
Crear packages/db con un SupabaseStore que implemente la interfaz ProspectoStore, encapsulando todo
el acceso a Supabase y el mapeo DB↔tipos.
</objetivo>

<requisitos>
1. Nuevo paquete packages/db (TS). Dependencia: @supabase/supabase-js.
2. Cliente server-side con service_role:
   createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false }})
3. Interfaz (reusar la de docs/data-plane.md):
   interface ProspectoStore {
     getAll(): Promise<Prospecto[]>;
     get(id: string): Promise<Prospecto | null>;
     appendLead(lead: Lead): Promise<Prospecto>;   // inserta estado 'nuevo'
     update(id: string, patch: Partial<Prospecto>): Promise<void>;
   }
4. Implementá SupabaseStore con esa interfaz. Incluí el MAPEO fila↔tipo:
   - nombre_negocio ↔ 업체명
   - scores/reportes como jsonb ↔ objetos
   - el resto, snake_case ↔ camel/igual.
   Exportá un mapRow(row): Prospecto y toRow(p): Row.
5. appendLead: deriva un id (slug del 업체명; si choca, sufijo). estado='nuevo'. created_at por default.
6. Exportá createStore(): ProspectoStore (singleton).
7. Tests con vitest: mapRow/toRow ida y vuelta; appendLead genera id; update aplica patch.
</requisitos>

<restricciones>
- Solo server-side (service_role). Nada de este paquete debe importarse en componentes client.
- No cambiar los tipos de packages/types (solo consumirlos). Mantener la interfaz para migrar/extender sin romper UI.
</restricciones>
```
