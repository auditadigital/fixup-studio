import { describe, it, expect } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Lead } from "@fixup/types";
import { SupabaseStore } from "./store.js";
import type { Database } from "./database.types.js";

// Fake mínimo del query builder de supabase-js: cada método encadenable
// devuelve el mismo builder; `then` resuelve con lo que devuelva `resolver(ctx)`.
type Ctx = {
  table: string;
  op: "select" | "insert" | "update";
  payload?: unknown;
  filters: Array<[string, string, string]>;
  single: boolean;
};

function fakeClient(resolver: (ctx: Ctx) => { data?: unknown; error: unknown }) {
  const seen: Ctx[] = [];
  const client = {
    from(table: string) {
      const ctx: Ctx = { table, op: "select", payload: undefined, filters: [], single: false };
      seen.push(ctx);
      const b: Record<string, unknown> = {
        select: () => b,
        order: () => b,
        insert: (p: unknown) => ((ctx.op = "insert"), (ctx.payload = p), b),
        update: (p: unknown) => ((ctx.op = "update"), (ctx.payload = p), b),
        like: (c: string, v: string) => (ctx.filters.push(["like", c, v]), b),
        eq: (c: string, v: string) => (ctx.filters.push(["eq", c, v]), b),
        single: () => ((ctx.single = true), b),
        maybeSingle: () => ((ctx.single = true), b),
        then: (res: (v: unknown) => unknown, rej: (e: unknown) => unknown) =>
          Promise.resolve(resolver(ctx)).then(res, rej),
      };
      return b;
    },
  };
  return { client: client as unknown as SupabaseClient<Database>, seen };
}

const lead: Lead = {
  nombre: "김대표",
  업체명: "Gangnam Skin",
  rubro: "에스테틱/피부과",
  telefono: "02-555-1010",
  instagram: "gangnam_skin",
  mensaje: "진단 요청",
  creado: "2026-06-17T00:00:00Z",
};

describe("SupabaseStore.appendLead", () => {
  it("genera id desde 업체명, estado 'nuevo', mapea decisor/observacion", async () => {
    const { client, seen } = fakeClient((ctx) => {
      if (ctx.op === "select") return { data: [], error: null }; // sin colisiones
      // insert: devolvemos la fila tal cual + columnas DB
      const p = ctx.payload as Record<string, unknown>;
      return { data: { ...p, scores: null, reportes: [], created_at: "t", updated_at: "t" }, error: null };
    });
    const store = new SupabaseStore(client);

    const out = await store.appendLead(lead);

    const insertCtx = seen.find((c) => c.op === "insert")!;
    const payload = insertCtx.payload as Record<string, unknown>;
    expect(payload.id).toBe("gangnam-skin");
    expect(payload.estado).toBe("nuevo");
    expect(payload.nombre_negocio).toBe("Gangnam Skin");
    expect(payload.decisor).toBe("김대표");
    expect(payload.observacion).toBe("진단 요청");

    expect(out.id).toBe("gangnam-skin");
    expect(out["업체명"]).toBe("Gangnam Skin");
    expect(out.estado).toBe("nuevo");
  });

  it("agrega sufijo cuando el id ya existe", async () => {
    const { client, seen } = fakeClient((ctx) => {
      if (ctx.op === "select") return { data: [{ id: "gangnam-skin" }], error: null };
      return { data: { ...(ctx.payload as object), created_at: "t", updated_at: "t" }, error: null };
    });
    const store = new SupabaseStore(client);
    const out = await store.appendLead(lead);
    expect(out.id).toBe("gangnam-skin-2");
    const insertCtx = seen.find((c) => c.op === "insert")!;
    expect((insertCtx.payload as { id: string }).id).toBe("gangnam-skin-2");
  });
});

describe("SupabaseStore.update", () => {
  it("aplica el patch mapeado y filtra por id", async () => {
    const { client, seen } = fakeClient(() => ({ error: null }));
    const store = new SupabaseStore(client);

    await store.update("seongsu-cafe", { estado: "contactado", scores_mini: 55 });

    const ctx = seen.find((c) => c.op === "update")!;
    expect(ctx.payload).toEqual({ estado: "contactado", score_mini: 55 });
    expect(ctx.filters).toContainEqual(["eq", "id", "seongsu-cafe"]);
  });

  it("propaga el error de Supabase", async () => {
    const { client } = fakeClient(() => ({ error: { message: "boom" } }));
    const store = new SupabaseStore(client);
    await expect(store.update("x", { estado: "perdido" })).rejects.toThrow("boom");
  });
});
