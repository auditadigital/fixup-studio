import * as React from "react";

interface Channel { naver?: string; instagram?: string; kakao?: string }

const steps: { key: keyof Channel; label: string; color: string }[] = [
  { key: "naver", label: "Naver", color: "text-naver" },
  { key: "instagram", label: "Insta", color: "text-insta" },
  { key: "kakao", label: "Kakao", color: "text-kakao" },
];

export function FunnelSteps({ channels }: { channels: Channel }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const on = Boolean(channels[s.key]);
        return (
          <React.Fragment key={s.key}>
            {i > 0 ? <span className="text-ink-soft">→</span> : null}
            <span
              className={`text-xs font-medium ${on ? s.color : "text-ink-soft opacity-40"}`}
            >
              {s.label}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}
