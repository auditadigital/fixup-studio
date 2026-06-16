import { describe, it, expect, beforeEach } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { FileLeadStore } from "./leadStore.server.js";

const tmp = path.join(os.tmpdir(), "prospectos.test.json");
const tmpNew = path.join(os.tmpdir(), "prospectos.new.test.json");

beforeEach(async () => {
  await fs.writeFile(tmp, JSON.stringify({ prospectos: [{ id: "x", 업체명: "기존", rubro: "카페", estado: "nuevo" }] }), "utf8");
  // Ensure the new-file test always starts with no file
  await fs.unlink(tmpNew).catch(() => undefined);
});

describe("FileLeadStore", () => {
  it("appends preserving existing prospectos", async () => {
    await new FileLeadStore(tmp).save({ nombre: "김", 업체명: "신규", rubro: "카페", telefono: "010-1111-2222", creado: "2026-06-16T00:00:00.000Z" });
    const parsed = JSON.parse(await fs.readFile(tmp, "utf8"));
    expect(parsed.prospectos).toHaveLength(2);
    expect(parsed.prospectos[1].estado).toBe("nuevo");
    expect(parsed.prospectos[1].업체명).toBe("신규");
  });

  it("creates the file when it does not exist (ENOENT-safe)", async () => {
    await new FileLeadStore(tmpNew).save({ nombre: "이", 업체명: "신생", rubro: "카페", telefono: "010-9999-0000", creado: "2026-06-16T00:00:00.000Z" });
    const parsed = JSON.parse(await fs.readFile(tmpNew, "utf8"));
    expect(parsed.prospectos).toHaveLength(1);
    expect(parsed.prospectos[0].업체명).toBe("신생");
  });
});
