import type { Estado, Prospecto } from "@fixup/types";

export interface Metrics {
  total: number;
  byEstado: Record<Estado, number>;
  wonAmount: number;
  miniToClient: number;
}

const EMPTY: Record<Estado, number> = {
  "nuevo": 0, "contactado": 0, "mini-lista": 0, "mini-enviada": 0,
  "propuesta-enviada": 0, "negociacion": 0, "cerrado": 0, "perdido": 0,
};

// Estados strictly past the mini stage that still imply a mini was reached.
// Terminal states (cerrado / perdido) only count as reached-mini when a
// scores_mini value is actually recorded — see reachedMini below.
const PAST_MINI: Estado[] = [
  "mini-lista", "mini-enviada", "propuesta-enviada", "negociacion",
];

function reachedMini(p: Prospecto): boolean {
  return p.scores_mini != null || PAST_MINI.includes(p.estado);
}

export function computeMetrics(prospectos: Prospecto[]): Metrics {
  const byEstado: Record<Estado, number> = { ...EMPTY };
  let wonAmount = 0;
  let miniReached = 0;
  let convertedFromMini = 0;

  for (const p of prospectos) {
    byEstado[p.estado] = (byEstado[p.estado] ?? 0) + 1;
    if (p.estado === "cerrado") wonAmount += p.monto_cerrado ?? 0;
    if (reachedMini(p)) {
      miniReached += 1;
      if (p.estado === "cerrado") convertedFromMini += 1;
    }
  }

  return {
    total: prospectos.length,
    byEstado,
    wonAmount,
    miniToClient: miniReached === 0 ? 0 : convertedFromMini / miniReached,
  };
}
