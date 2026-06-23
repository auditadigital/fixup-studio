import type { Prospecto } from "@fixup/types";

// Genera el texto del prompt para pegar en el engine (Claude Code). El dashboard
// NO corre la auditoría: arma el trigger coreano + los datos del prospecto.
export type PromptKind = "mini" | "completa" | "propuesta";

const TRIGGER: Record<PromptKind, string> = {
  mini: "미니 진단",
  completa: "완전 진단",
  propuesta: "제안서",
};

export const PROMPT_LABELS: Record<PromptKind, string> = {
  mini: "📋 Mini audit",
  completa: "📋 Full audit",
  propuesta: "📋 Proposal",
};

export function buildPrompt(kind: PromptKind, p: Prospecto): string {
  const lines: string[] = [`${TRIGGER[kind]}: ${p["업체명"]}`, `- id: ${p.id}`];
  if (p.rubro) lines.push(`- 업종: ${p.rubro}`);
  if (p.zona) lines.push(`- 지역: ${p.zona}`);
  if (p.instagram) lines.push(`- 인스타그램: @${p.instagram.replace(/^@/, "")}`);
  if (p.naver_place) lines.push(`- 네이버 플레이스: ${p.naver_place}`);
  if (p.kakao) lines.push(`- 카카오: ${p.kakao}`);
  if (p.telefono) lines.push(`- 연락처: ${p.telefono}`);
  lines.push(
    kind === "propuesta"
      ? "→ 완전 진단 결과를 바탕으로 월 운영 플랜 제안서를 만들어줘."
      : "(스크린샷은 첨부 예정)",
  );
  return lines.join("\n");
}
