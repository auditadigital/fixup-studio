import { describe, it, expect, beforeEach } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { FileLeadStore } from "./leadStore.server.js";

const tmp = path.join(os.tmpdir(), "prospectos.test.json");
beforeEach(async () => {
  await fs.writeFile(tmp, JSON.stringify({ prospectos: [{ id: "x", 업체명: "기존", rubro: "카페", estado: "nuevo" }] }), "utf8");
});
describe("FileLeadStore", () => {
  it("appends preserving existing prospectos", async () => {
    await new FileLeadStore(tmp).save({ nombre: "김", 업체명: "신규", rubro: "카페", telefono: "010-1111-2222", creado: "2026-06-16T00:00:00.000Z" });
    const parsed = JSON.parse(await fs.readFile(tmp, "utf8"));
    expect(parsed.prospectos).toHaveLength(2);
    expect(parsed.prospectos[1].estado).toBe("nuevo");
    expect(parsed.prospectos[1].업체명).toBe("신규");
  });
});
