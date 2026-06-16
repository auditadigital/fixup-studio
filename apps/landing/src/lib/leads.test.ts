import { describe, it, expect, vi } from "vitest";
import { zLead, leadToProspecto, ConsoleLeadStore } from "./leads.js";

const valid = {
  nombre: "홍길동", 업체명: "강남스킨", rubro: "피부과·에스테틱",
  telefono: "010-1234-5678", instagram: "gangnam_skin", mensaje: "강남구",
};

describe("zLead", () => {
  it("accepts a valid lead", () => { expect(zLead.safeParse(valid).success).toBe(true); });
  it("rejects empty 업체명", () => { expect(zLead.safeParse({ ...valid, 업체명: "" }).success).toBe(false); });
  it("rejects empty nombre", () => { expect(zLead.safeParse({ ...valid, nombre: "" }).success).toBe(false); });
  it("rejects a too-short phone", () => { expect(zLead.safeParse({ ...valid, telefono: "123" }).success).toBe(false); });
});

describe("leadToProspecto", () => {
  it("maps to estado nuevo with a slug id and contact date", () => {
    const p = leadToProspecto({ ...valid, creado: "2026-06-16T00:00:00.000Z" });
    expect(p.estado).toBe("nuevo");
    expect(p.업체명).toBe("강남스킨");
    expect(p.id.length).toBeGreaterThan(0);
    expect(p.fecha_contacto).toBe("2026-06-16");
    expect(p.instagram).toBe("gangnam_skin");
    expect(p.observacion).toContain("홍길동");
  });
});

describe("ConsoleLeadStore", () => {
  it("logs structured json and returns the id", async () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const res = await new ConsoleLeadStore().save({ ...valid, creado: "2026-06-16T00:00:00.000Z" });
    expect(res.id.length).toBeGreaterThan(0);
    const logged = JSON.parse(spy.mock.calls[0]![0] as string);
    expect(logged.kind).toBe("lead");
    expect(logged.prospecto.estado).toBe("nuevo");
    spy.mockRestore();
  });
});
