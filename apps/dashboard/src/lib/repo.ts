import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Estado, Prospecto } from "@fixup/types";

export interface ProspectoRepo {
  list(): Promise<Prospecto[]>;
  updateEstado(id: string, estado: Estado): Promise<Prospecto>;
}

const DATA_PATH = path.join(process.cwd(), "..", "..", "data", "prospectos.json");

class JsonProspectoRepo implements ProspectoRepo {
  async list(): Promise<Prospecto[]> {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw) as { prospectos: Prospecto[] };
    return parsed.prospectos;
  }

  async updateEstado(id: string, estado: Estado): Promise<Prospecto> {
    const all = await this.list();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Prospecto not found: ${id}`);
    const updated: Prospecto = { ...all[idx]!, estado };
    all[idx] = updated;
    await fs.writeFile(DATA_PATH, JSON.stringify({ prospectos: all }, null, 2) + "\n", "utf8");
    return updated;
  }
}

export const repo: ProspectoRepo = new JsonProspectoRepo();

export function getProspectos(): Promise<Prospecto[]> {
  return repo.list();
}
