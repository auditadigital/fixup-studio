import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock de la capa de datos: el repo no toca Supabase en los tests.
const { getAll, get, update, create, remove } = vi.hoisted(() => ({
  getAll: vi.fn(),
  get: vi.fn(),
  update: vi.fn(),
  create: vi.fn(),
  remove: vi.fn(),
}));
vi.mock("@fixup/db", () => ({ createStore: () => ({ getAll, get, update, create, remove }) }));

import { repo, zProspectoPatch, zProspectoCreate } from "./repo.js";

beforeEach(() => {
  getAll.mockReset();
  get.mockReset();
  update.mockReset();
  create.mockReset();
  remove.mockReset();
});

describe("zProspectoPatch", () => {
  it("accepts a partial patch", () => {
    const r = zProspectoPatch.safeParse({ estado: "contactado", scores_mini: 50 });
    expect(r.success).toBe(true);
  });

  it("strips unknown keys", () => {
    const r = zProspectoPatch.safeParse({ estado: "cerrado", id: "hack", created_at: "x" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toEqual({ estado: "cerrado" });
  });

  it("rejects an invalid estado", () => {
    expect(zProspectoPatch.safeParse({ estado: "bogus" }).success).toBe(false);
  });

  it("rejects a non-numeric score", () => {
    expect(zProspectoPatch.safeParse({ scores_mini: "high" }).success).toBe(false);
  });

  it("accepts an empty object (handler rejects empty separately)", () => {
    const r = zProspectoPatch.safeParse({});
    expect(r.success).toBe(true);
    if (r.success) expect(Object.keys(r.data)).toHaveLength(0);
  });
});

describe("zProspectoCreate", () => {
  it("requiere 업체명", () => {
    expect(zProspectoCreate.safeParse({ rubro: "카페" }).success).toBe(false);
    expect(zProspectoCreate.safeParse({ 업체명: "  " }).success).toBe(false);
  });
  it("acepta 업체명 + opcionales y descarta extras", () => {
    const r = zProspectoCreate.safeParse({ 업체명: "New", rubro: "카페", id: "hack", estado: "cerrado" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toEqual({ 업체명: "New", rubro: "카페" });
  });
});

describe("repo.create", () => {
  it("delega en store.create y devuelve el prospecto", async () => {
    create.mockResolvedValue({ id: "new", 업체명: "New", rubro: "카페", estado: "nuevo" });
    const out = await repo.create({ 업체명: "New", rubro: "카페" });
    expect(create).toHaveBeenCalledWith({ 업체명: "New", rubro: "카페" });
    expect(out.estado).toBe("nuevo");
  });
});

describe("repo.remove", () => {
  it("delega en store.remove", async () => {
    remove.mockResolvedValue(undefined);
    await repo.remove("seongsu-cafe");
    expect(remove).toHaveBeenCalledWith("seongsu-cafe");
  });
});

describe("repo.list", () => {
  it("delegates to store.getAll", async () => {
    getAll.mockResolvedValue([{ id: "a" }]);
    expect(await repo.list()).toEqual([{ id: "a" }]);
    expect(getAll).toHaveBeenCalledOnce();
  });
});

describe("repo.updateEstado", () => {
  it("updates estado then returns the fresh prospecto", async () => {
    update.mockResolvedValue(undefined);
    get.mockResolvedValue({ id: "x", 업체명: "N", rubro: "카페", estado: "contactado" });
    const out = await repo.updateEstado("x", "contactado");
    expect(update).toHaveBeenCalledWith("x", { estado: "contactado" });
    expect(out.estado).toBe("contactado");
  });

  it("throws not_found when the row vanished", async () => {
    update.mockResolvedValue(undefined);
    get.mockResolvedValue(null);
    await expect(repo.updateEstado("ghost", "perdido")).rejects.toThrow("Prospecto not found");
  });
});

describe("repo.update", () => {
  it("applies an arbitrary field patch", async () => {
    update.mockResolvedValue(undefined);
    get.mockResolvedValue({ id: "x", 업체명: "N", rubro: "카페", estado: "negociacion", precio_propuesto: 990000 });
    const out = await repo.update("x", { precio_propuesto: 990000, estado: "negociacion" });
    expect(update).toHaveBeenCalledWith("x", { precio_propuesto: 990000, estado: "negociacion" });
    expect(out.precio_propuesto).toBe(990000);
  });
});
