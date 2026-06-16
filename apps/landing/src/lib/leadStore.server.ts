import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Lead, Prospecto } from "@fixup/types";
import { type LeadStore, ConsoleLeadStore, leadToProspecto } from "./leads";

const DEFAULT_PATH =
  process.env.PROSPECTOS_PATH ?? path.join(process.cwd(), "..", "..", "data", "prospectos.json");

// Module-level promise mutex — serialises concurrent read-modify-write operations
let _chain: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = _chain.then(fn, fn);
  _chain = run.then(() => undefined, () => undefined);
  return run;
}

export class FileLeadStore implements LeadStore {
  constructor(private readonly file: string = DEFAULT_PATH) {}
  async save(lead: Lead): Promise<{ id: string }> {
    return withLock(async () => {
      const prospecto = leadToProspecto(lead);
      // Fix 3: treat a missing file as an empty store instead of throwing
      const raw = await fs.readFile(this.file, "utf8").catch((e) => {
        if ((e as NodeJS.ErrnoException).code === "ENOENT") return '{"prospectos":[]}';
        throw e;
      });
      const parsed = JSON.parse(raw) as { prospectos?: Prospecto[] };
      const all = Array.isArray(parsed.prospectos) ? parsed.prospectos : [];
      all.push(prospecto);
      await fs.writeFile(this.file, JSON.stringify({ prospectos: all }, null, 2) + "\n", "utf8");
      return { id: prospecto.id };
    });
  }
}

// Singleton — makes the module-level mutex effective across all callers
let _store: LeadStore | undefined;
export function getLeadStore(): LeadStore {
  if (!_store) _store = process.env.LEAD_STORE === "file" ? new FileLeadStore() : new ConsoleLeadStore();
  return _store;
}
