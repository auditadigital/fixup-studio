import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Lead, Prospecto } from "@fixup/types";
import { type LeadStore, ConsoleLeadStore, leadToProspecto } from "./leads.js";

const DEFAULT_PATH =
  process.env.PROSPECTOS_PATH ?? path.join(process.cwd(), "..", "..", "data", "prospectos.json");

export class FileLeadStore implements LeadStore {
  constructor(private readonly file: string = DEFAULT_PATH) {}
  async save(lead: Lead): Promise<{ id: string }> {
    const prospecto = leadToProspecto(lead);
    const raw = await fs.readFile(this.file, "utf8");
    const parsed = JSON.parse(raw) as { prospectos?: Prospecto[] };
    const all = Array.isArray(parsed.prospectos) ? parsed.prospectos : [];
    all.push(prospecto);
    await fs.writeFile(this.file, JSON.stringify({ prospectos: all }, null, 2) + "\n", "utf8");
    return { id: prospecto.id };
  }
}

export function getLeadStore(): LeadStore {
  return process.env.LEAD_STORE === "file" ? new FileLeadStore() : new ConsoleLeadStore();
}
