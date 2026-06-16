import { describe, it, expect } from "vitest";
import { POST } from "./route.js";
// ConsoleLeadStore is the default (LEAD_STORE unset) — it just logs, safe for tests.

describe("POST /api/leads", () => {
  it("returns 200 + id for a valid lead", async () => {
    const req = new Request("http://localhost/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nombre: "김", 업체명: "테스트", rubro: "카페", telefono: "010-1234-5678" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(typeof json.id).toBe("string");
  });

  it("returns 400 for an invalid lead (missing nombre)", async () => {
    const req = new Request("http://localhost/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ 업체명: "테스트" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid json", async () => {
    const req = new Request("http://localhost/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "not json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
