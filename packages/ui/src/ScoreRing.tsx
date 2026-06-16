import * as React from "react";
import { scoreColor } from "./scoreColor.js";

const ringColor: Record<string, string> = {
  good: "var(--good)", warn: "var(--warn)", urgent: "var(--urgent)",
};

export function ScoreRing({
  value, label, size = 56,
}: { value: number; label?: string; size?: number }) {
  const color = ringColor[scoreColor(value)];
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="grid place-items-center rounded-full font-mono text-sm font-bold text-ink"
        style={{
          width: size, height: size,
          background: `conic-gradient(${color} ${value * 3.6}deg, var(--line) 0deg)`,
        }}
      >
        <span
          className="grid place-items-center rounded-full bg-surface"
          style={{ width: size - 12, height: size - 12 }}
        >
          {value}
        </span>
      </div>
      {label ? <span className="text-xs text-ink-soft">{label}</span> : null}
    </div>
  );
}
