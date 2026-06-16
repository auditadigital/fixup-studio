import { describe, it, expect } from "vitest";
import { computeMetrics } from "./metrics.js";
import type { Prospecto } from "@fixup/types";

function p(over: Partial<Prospecto>): Prospecto {
  return { id: over.id ?? "x", "업체명": "n", rubro: "카페", estado: "nuevo", ...over } as Prospecto;
}

describe("computeMetrics", () => {
  const data: Prospecto[] = [
    p({ id: "a", estado: "nuevo" }),
    p({ id: "b", estado: "mini-enviada", scores_mini: 50 }),
    p({ id: "c", estado: "negociacion", scores_mini: 60 }),
    p({ id: "d", estado: "cerrado", scores_mini: 70, monto_cerrado: 1000000 }),
    p({ id: "e", estado: "cerrado", monto_cerrado: 500000 }),
    p({ id: "f", estado: "perdido", scores_mini: 30 }),
  ];

  it("counts per estado", () => {
    const m = computeMetrics(data);
    expect(m.byEstado.cerrado).toBe(2);
    expect(m.byEstado.nuevo).toBe(1);
    expect(m.byEstado["mini-enviada"]).toBe(1);
  });

  it("sums monto_cerrado", () => {
    expect(computeMetrics(data).wonAmount).toBe(1500000);
  });

  it("conversion = cerrado / reached-mini", () => {
    // Prospecto e is cerrado but has no scores_mini, and cerrado is excluded from
    // PAST_MINI, so e does NOT count toward reached-mini.
    // reached-mini = {b,c,d,f} = 4, converted = {d} = 1 => 0.25.
    const m = computeMetrics(data);
    expect(m.miniToClient).toBeCloseTo(0.25, 5);
  });
});
