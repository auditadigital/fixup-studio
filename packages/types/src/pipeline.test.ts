import { describe, it, expect } from "vitest";
import {
  ESTADO_LABELS, PIPELINE_COLUMNS, columnForEstado,
} from "./pipeline.js";
import type { Estado } from "./index.js";

describe("pipeline maps", () => {
  it("labels every estado", () => {
    const estados: Estado[] = [
      "nuevo","contactado","mini-lista","mini-enviada",
      "propuesta-enviada","negociacion","cerrado","perdido",
    ];
    for (const e of estados) expect(ESTADO_LABELS[e]).toBeTruthy();
  });

  it("has 7 ordered columns with the spec labels", () => {
    expect(PIPELINE_COLUMNS.map(c => c.label)).toEqual(
      ["New","Contacted","Mini","Proposal","Negotiation","Closed","Lost"],
    );
  });

  it("maps every estado to exactly one column", () => {
    const estados: Estado[] = [
      "nuevo","contactado","mini-lista","mini-enviada",
      "propuesta-enviada","negociacion","cerrado","perdido",
    ];
    for (const e of estados) {
      const hits = PIPELINE_COLUMNS.filter(c => c.estados.includes(e));
      expect(hits).toHaveLength(1);
      expect(columnForEstado(e)).toBe(hits[0]);
    }
  });

  it("groups both mini estados under Mini with dropTarget mini-enviada", () => {
    const mini = PIPELINE_COLUMNS.find(c => c.label === "Mini")!;
    expect(mini.estados).toEqual(["mini-lista","mini-enviada"]);
    expect(mini.dropTarget).toBe("mini-enviada");
  });
});
