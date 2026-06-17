"use client";
import { useEffect, useState } from "react";
import type { Prospecto, Scores } from "@fixup/types";
import { ESTADO_LABELS } from "@fixup/types";
import { Badge, Button, Card, FunnelSteps, PlanCard, Pill, ScoreRing, scoreColor } from "@fixup/ui";
import { buildPrompt, PROMPT_LABELS, type PromptKind } from "@/lib/prompts";

const PROMPT_KINDS: PromptKind[] = ["mini", "completa", "propuesta"];

function safeHref(url: string): string {
  return /^https?:\/\//i.test(url) ? url : "#";
}

const SCORE_LABELS: { key: keyof Scores; label: string }[] = [
  { key: "global", label: "종합" },
  { key: "naver", label: "Naver" },
  { key: "instagram", label: "Instagram" },
  { key: "kakao", label: "Kakao" },
  { key: "compra", label: "구매까지" },
];

function history(p: Prospecto): { label: string; date: string }[] {
  const rows: { label: string; date?: string }[] = [
    { label: "접촉", date: p.fecha_contacto },
    { label: "미니", date: p.fecha_mini },
    { label: "완전 진단", date: p.fecha_completa },
    { label: "제안", date: p.fecha_propuesta },
  ];
  return rows.filter((r): r is { label: string; date: string } => Boolean(r.date));
}

export function ProspectoDrawer({
  prospecto, onClose, onDelete,
}: { prospecto: Prospecto | null; onClose: () => void; onDelete: (p: Prospecto) => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const [copied, setCopied] = useState<PromptKind | null>(null);

  if (!prospecto) return null;
  const p = prospecto;
  const hist = history(p);

  async function copyPrompt(kind: PromptKind) {
    const text = buildPrompt(kind, p);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // clipboard no disponible (contexto no seguro): el <details> permite copiar a mano
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <aside
        className="h-full w-full max-w-md overflow-y-auto border-l border-line bg-bg p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl text-ink">{p["업체명"]}</h2>
            <div className="mt-1 flex flex-wrap gap-1">
              <Badge>{p.rubro}</Badge>
              {p.zona ? <Badge>{p.zona}</Badge> : null}
              <Pill tone="neutral">{ESTADO_LABELS[p.estado]}</Pill>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>✕</Button>
        </div>

        <section className="mt-4 space-y-1 text-sm text-ink-2">
          {p.telefono ? <div>☎ {p.telefono}</div> : null}
          {p.instagram ? <div>IG @{p.instagram}</div> : null}
          {p.observacion ? <div className="text-ink-soft">{p.observacion}</div> : null}
        </section>

        <section className="mt-4">
          <FunnelSteps channels={{ naver: p.naver_place, instagram: p.instagram, kakao: p.kakao }} />
        </section>

        {p.scores_mini != null ? (
          <section className="mt-4">
            <Pill tone={scoreColor(p.scores_mini)}>mini {p.scores_mini}</Pill>
          </section>
        ) : null}

        {p.scores ? (
          <section className="mt-4 flex flex-wrap gap-3">
            {SCORE_LABELS.map(({ key, label }) =>
              p.scores?.[key] != null ? (
                <ScoreRing key={key} value={p.scores[key]!} label={label} />
              ) : null,
            )}
          </section>
        ) : null}

        <section className="mt-4">
          <PlanCard plan={p.plan_recomendado} precio={p.monto_cerrado ?? p.precio_propuesto} />
        </section>

        {hist.length ? (
          <section className="mt-4">
            <h3 className="mb-2 text-xs font-medium text-ink-soft">상태 이력</h3>
            <Card className="space-y-1">
              {hist.map((h) => (
                <div key={h.label} className="flex justify-between text-sm">
                  <span className="text-ink-2">{h.label}</span>
                  <span className="font-mono text-ink-soft">{h.date}</span>
                </div>
              ))}
            </Card>
          </section>
        ) : null}

        {p.reportes?.length ? (
          <section className="mt-4">
            <h3 className="mb-2 text-xs font-medium text-ink-soft">리포트</h3>
            <div className="flex flex-col gap-2">
              {p.reportes.map((r, i) => (
                <a key={`${r.label}::${r.url}::${i}`} href={safeHref(r.url)} target="_blank" rel="noopener noreferrer"
                   className="text-sm text-coral underline">
                  {r.label}
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-6">
          <h3 className="mb-2 text-xs font-medium text-ink-soft">프롬프트 생성 (엔진에 붙여넣기)</h3>
          <div className="flex flex-wrap gap-2">
            {PROMPT_KINDS.map((k) => (
              <Button key={k} variant="secondary" onClick={() => copyPrompt(k)}>
                {copied === k ? "복사됨 ✓" : PROMPT_LABELS[k]}
              </Button>
            ))}
          </div>
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-ink-soft">미리보기 (미니 진단)</summary>
            <pre className="mt-1 whitespace-pre-wrap rounded-sm bg-bg-2 p-2 font-mono text-xs text-ink-2">
{buildPrompt("mini", p)}
            </pre>
          </details>
        </section>

        <section className="mt-6 border-t border-line pt-4">
          <button
            type="button"
            onClick={() => onDelete(p)}
            className="rounded-sm border border-urgent px-3 py-1.5 text-sm font-medium text-urgent hover:bg-urgent-tint"
          >
            🗑 삭제
          </button>
        </section>
      </aside>
    </div>
  );
}
