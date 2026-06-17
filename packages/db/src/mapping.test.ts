import { describe, it, expect } from "vitest";
import { mapRow, toRow, slugify, deriveId } from "./mapping.js";
import type { Prospecto } from "@fixup/types";
import type { ProspectoRow } from "./row-types.js";

const fullProspecto: Prospecto = {
  id: "seongsu-cafe",
  업체명: "성수동로스터리",
  rubro: "카페",
  zona: "서울 성동구",
  instagram: "seongsu_roastery",
  naver_place: "https://map.naver.com/p/seongsu",
  kakao: "seongsu",
  telefono: "02-111-2222",
  estado: "mini-lista",
  observacion: "미니 준비",
  scores_mini: 42,
  scores: { global: 70, naver: 75, instagram: 80, kakao: 60, compra: 65 },
  plan_recomendado: "성장",
  precio_propuesto: 1200000,
  monto_cerrado: 1100000,
  fecha_contacto: "2026-06-05",
  fecha_mini: "2026-06-12",
  fecha_completa: "2026-06-20",
  fecha_propuesta: "2026-06-25",
  reportes: [{ label: "미니 진단", url: "https://x/mini.pdf" }],
};

describe("mapRow/toRow", () => {
  it("round-trips Prospecto → row → Prospecto", () => {
    // toRow produce un parcial; lo completamos con columnas solo-DB para simular una fila.
    const row = {
      ...toRow(fullProspecto),
      decisor: null,
      created_at: "2026-06-05T00:00:00Z",
      updated_at: "2026-06-05T00:00:00Z",
    } as unknown as ProspectoRow;

    expect(mapRow(row)).toEqual(fullProspecto);
  });

  it("renames nombre_negocio↔업체명 and score_mini↔scores_mini", () => {
    const row = toRow(fullProspecto);
    expect(row.nombre_negocio).toBe("성수동로스터리");
    expect(row.score_mini).toBe(42);
    expect("업체명" in row).toBe(false);
    expect("scores_mini" in row).toBe(false);
  });

  it("toRow only emits defined keys (apto para update parcial)", () => {
    const row = toRow({ estado: "contactado", scores_mini: 50 });
    expect(row).toEqual({ estado: "contactado", score_mini: 50 });
  });

  it("mapRow omits null optionals", () => {
    const row = {
      id: "x",
      nombre_negocio: "N",
      rubro: null,
      zona: null,
      instagram: null,
      naver_place: null,
      kakao: null,
      telefono: null,
      decisor: null,
      estado: "nuevo",
      observacion: null,
      score_mini: null,
      scores: null,
      plan_recomendado: null,
      precio_propuesto: null,
      monto_cerrado: null,
      reportes: [],
      fecha_contacto: null,
      fecha_mini: null,
      fecha_completa: null,
      fecha_propuesta: null,
      created_at: "t",
      updated_at: "t",
    } as ProspectoRow;
    expect(mapRow(row)).toEqual({ id: "x", 업체명: "N", rubro: "", estado: "nuevo", reportes: [] });
  });
});

describe("slugify / deriveId", () => {
  it("slugifies latin and keeps hangul", () => {
    expect(slugify("Gangnam Skin Clinic")).toBe("gangnam-skin-clinic");
    expect(slugify("성수동 로스터리")).toBe("성수동-로스터리");
  });

  it("derives base id when free", () => {
    expect(deriveId("Hongdae Hair", [])).toBe("hongdae-hair");
  });

  it("adds numeric suffix on collision", () => {
    expect(deriveId("Gangnam", ["gangnam"])).toBe("gangnam-2");
    expect(deriveId("Gangnam", ["gangnam", "gangnam-2", "gangnam-3"])).toBe("gangnam-4");
  });
});
