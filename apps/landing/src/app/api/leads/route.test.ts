import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.hoisted: estas vars se necesitan dentro de las factories de vi.mock (hoisteadas).
const { appendLead, notifyOperator } = vi.hoisted(() => ({
  appendLead: vi.fn(),
  notifyOperator: vi.fn(),
}));

// Mock de la capa de datos: appendLead no toca Supabase en los tests.
vi.mock("@fixup/db", () => ({ createStore: () => ({ appendLead }) }));
// Mock del aviso a la operadora: capturamos llamadas.
vi.mock("@/lib/notify.server", () => ({ notifyOperator }));

import { POST } from "./route.js";

function post(body: unknown) {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const validBody = { nombre: "김", 업체명: "테스트", rubro: "카페", telefono: "010-1234-5678" };

beforeEach(() => {
  appendLead.mockReset();
  notifyOperator.mockReset();
  notifyOperator.mockResolvedValue(undefined);
});

describe("POST /api/leads", () => {
  it("inserts via store, notifies, returns 200 + id", async () => {
    appendLead.mockResolvedValue({ id: "test-1", 업체명: "테스트", estado: "nuevo" });
    const res = await POST(post(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true, id: "test-1" });
    expect(appendLead).toHaveBeenCalledOnce();
    expect(notifyOperator).toHaveBeenCalledOnce();
    // success path → no failed flag
    expect(notifyOperator).toHaveBeenCalledWith(expect.objectContaining({ "업체명": "테스트" }));
  });

  it("returns 400 for an invalid lead (missing nombre)", async () => {
    const res = await POST(post({ 업체명: "테스트" }));
    expect(res.status).toBe(400);
    expect(appendLead).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid json", async () => {
    const res = await POST(post("not json"));
    expect(res.status).toBe(400);
    expect(appendLead).not.toHaveBeenCalled();
  });

  it("on insert failure → 500 and notifies as a safety net", async () => {
    appendLead.mockRejectedValue(new Error("db down"));
    const res = await POST(post(validBody));
    expect(res.status).toBe(500);
    expect(notifyOperator).toHaveBeenCalledWith(expect.objectContaining({ "업체명": "테스트" }), { failed: true });
  });

  it("notify failure does NOT fail the request (lead already saved)", async () => {
    appendLead.mockResolvedValue({ id: "test-2", 업체명: "테스트", estado: "nuevo" });
    notifyOperator.mockRejectedValue(new Error("kakao down"));
    const res = await POST(post(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBe("test-2");
  });
});
