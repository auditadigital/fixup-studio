import * as React from "react";
import type { Plan } from "@fixup/types";
import { Card } from "./Card.js";

export function PlanCard({ plan, precio }: { plan?: Plan; precio?: number }) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <div className="text-xs text-ink-soft">추천 플랜</div>
        <div className="font-display text-lg text-ink">{plan ?? "—"}</div>
      </div>
      <div className="text-right">
        <div className="text-xs text-ink-soft">가격</div>
        <div className="font-mono text-ink">
          {precio ? `₩${precio.toLocaleString("ko-KR")}` : "—"}
        </div>
      </div>
    </Card>
  );
}
