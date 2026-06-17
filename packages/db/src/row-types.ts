// Alias de conveniencia derivados de los tipos generados (database.types.ts).
// Viven aparte para que `npm run gen:types` (que sobrescribe database.types.ts)
// no los borre.
import type { Tables, TablesInsert, TablesUpdate, Enums } from "./database.types.js";

export type ProspectoRow = Tables<"prospectos">;
export type ProspectoInsert = TablesInsert<"prospectos">;
export type ProspectoUpdate = TablesUpdate<"prospectos">;
export type EstadoProspecto = Enums<"estado_prospecto">;
