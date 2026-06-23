"use client";
import type { Prospecto } from "@fixup/types";
import { PIPELINE_COLUMNS, columnForEstado } from "@fixup/types";
import { Card } from "@fixup/ui";
import { computeMetrics } from "@/lib/metrics";

export function Metrics({ prospectos }: { prospectos: Prospecto[] }) {
  const m = computeMetrics(prospectos);
  const perColumn = PIPELINE_COLUMNS.map((c) => ({
    label: c.label,
    count: prospectos.filter((p) => columnForEstado(p.estado).key === c.key).length,
  }));

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Card>
        <div className="text-xs text-ink-soft">₩ Closed</div>
        <div className="font-mono text-xl text-ink">₩{m.wonAmount.toLocaleString("ko-KR")}</div>
      </Card>
      <Card>
        <div className="text-xs text-ink-soft">Mini → client conv.</div>
        <div className="font-mono text-xl text-ink">{(m.miniToClient * 100).toFixed(0)}%</div>
      </Card>
      <Card>
        <div className="text-xs text-ink-soft">Total prospects</div>
        <div className="font-mono text-xl text-ink">{m.total}</div>
      </Card>
      <Card>
        <div className="text-xs text-ink-soft">By stage</div>
        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 font-mono text-xs text-ink-2">
          {perColumn.map((c) => <span key={c.label}>{c.label} {c.count}</span>)}
        </div>
      </Card>
    </div>
  );
}
