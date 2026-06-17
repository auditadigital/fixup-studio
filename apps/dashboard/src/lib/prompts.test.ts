import { describe, it, expect } from "vitest";
import type { Prospecto } from "@fixup/types";
import { buildPrompt } from "./prompts.js";

const full: Prospecto = {
  id: "gangnam-skin-clinic",
  업체명: "강남스킨클리닉",
  rubro: "에스테틱/피부과",
  zona: "서울 강남구",
  instagram: "gangnam_skin",
  naver_place: "https://map.naver.com/p/gangnam-skin",
  kakao: "gangnamskin",
  telefono: "02-555-1010",
  estado: "nuevo",
};

describe("buildPrompt", () => {
  it("mini: incluye trigger, 업체명, id y canales", () => {
    const out = buildPrompt("mini", full);
    expect(out).toContain("미니 진단: 강남스킨클리닉");
    expect(out).toContain("- id: gangnam-skin-clinic");
    expect(out).toContain("- 인스타그램: @gangnam_skin");
    expect(out).toContain("- 네이버 플레이스: https://map.naver.com/p/gangnam-skin");
    expect(out).toContain("(스크린샷은 첨부 예정)");
  });

  it("completa usa el trigger 완전 진단", () => {
    expect(buildPrompt("completa", full)).toContain("완전 진단: 강남스킨클리닉");
  });

  it("propuesta usa 제안서 y pide la propuesta de plan", () => {
    const out = buildPrompt("propuesta", full);
    expect(out).toContain("제안서: 강남스킨클리닉");
    expect(out).toContain("월 운영 플랜 제안서");
  });

  it("omite canales vacíos y no duplica @ en instagram", () => {
    const out = buildPrompt("mini", { id: "x", 업체명: "N", rubro: "카페", estado: "nuevo", instagram: "@handle" });
    expect(out).toContain("- 인스타그램: @handle");
    expect(out).not.toContain("@@");
    expect(out).not.toContain("네이버");
    expect(out).not.toContain("카카오");
  });
});
