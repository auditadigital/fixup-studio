import { describe, it, expect } from "vitest";
import { zLead } from "./leads.js";

const valid = {
  nombre: "홍길동", 업체명: "강남스킨", rubro: "피부과·에스테틱",
  telefono: "010-1234-5678", instagram: "gangnam_skin", mensaje: "강남구",
};

describe("zLead", () => {
  it("accepts a valid lead", () => { expect(zLead.safeParse(valid).success).toBe(true); });
  it("rejects empty 업체명", () => { expect(zLead.safeParse({ ...valid, 업체명: "" }).success).toBe(false); });
  it("rejects empty nombre", () => { expect(zLead.safeParse({ ...valid, nombre: "" }).success).toBe(false); });
  it("rejects a too-short phone", () => { expect(zLead.safeParse({ ...valid, telefono: "123" }).success).toBe(false); });
  it("accepts without optional fields", () => {
    expect(zLead.safeParse({ nombre: "김", 업체명: "테스트", rubro: "카페", telefono: "010-1234-5678" }).success).toBe(true);
  });
});
