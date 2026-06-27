import type { Prospecto, Rubro } from "@fixup/types";

// Mensajes de DM de Instagram listos para copiar y pegar (coreano nativo).
// Basados en PLAN-INSTAGRAM-OUTREACH.md §4. El dashboard NO envía nada: arma el
// texto con [업체명] ya reemplazado y el operador lo pega en Instagram.
export type DmKind = "primer" | "segundo" | "followup" | "mini" | "miniFollowup" | "bridge";

// Nombre del founder que firma el primer DM. Editá esto con tu nombre real.
const FOUNDER = "호르헤";

export const DM_LABELS: Record<DmKind, string> = {
  primer: "💬 1st contact",
  segundo: "💬 Reply: yes",
  followup: "💬 Follow-up",
  mini: "💬 Send mini",
  miniFollowup: "💬 Mini follow-up",
  bridge: "💬 Full-audit bridge",
};

// Gancho específico por rubro (§4.3): cambia solo la línea del "por qué le escribo".
const RUBRO_HOOK: Record<string, string> = {
  미용실: "네이버 사진이랑 예약 링크 쪽에서 손님 놓치는 포인트가 보여서요",
  "에스테틱/피부과":
    "검색했을 때 경쟁 업체보다 아래에 나오는 이유가 몇 개 보이더라고요",
  카페: "인스타는 좋은데 네이버 플레이스에서 정보가 살짝 비어 있어서요",
  식당: "인스타는 좋은데 네이버 플레이스에서 정보가 살짝 비어 있어서요",
  "필라테스/헬스장": "첫 방문 손님이 찾기엔 정보 동선이 살짝 아쉬워서요",
  치과: "신뢰가 중요한 업종인데 리뷰·정보 정리만 해도 효과 클 것 같아서요",
};
const DEFAULT_HOOK =
  "살짝만 손봐도 검색에서 더 잘 보일 부분이 2~3개 있더라고요";

function hookFor(rubro?: Rubro): string {
  if (rubro && RUBRO_HOOK[rubro]) return RUBRO_HOOK[rubro];
  return DEFAULT_HOOK;
}

export function buildDm(kind: DmKind, p: Prospecto): string {
  const nombre = p["업체명"];
  switch (kind) {
    case "primer":
      return [
        "안녕하세요 사장님 😊",
        `${nombre} 네이버랑 인스타 우연히 보다가 메시지 드려요.`,
        "",
        `저는 픽스업 스튜디오 ${FOUNDER}이라고 하고,`,
        "동네 가게들 온라인 노출을 솔직하게 진단해드리고 있어요.",
        "",
        `${nombre} 보니까 ${hookFor(p.rubro)}.`,
        "무료로 미니진단 정리해서 보내드려도 될까요? 부담 전혀 없으세요 🙏",
      ].join("\n");
    case "segundo":
      return [
        "감사합니다 🙏",
        `그럼 ${nombre} 네이버·인스타·카카오 기준으로`,
        "간단히 8가지 항목 봐서 1~2일 안에 정리해 보내드릴게요.",
        "",
        "혹시 카카오톡 채널이나 이메일 중에 어디로 받는 게 편하세요?",
      ].join("\n");
    case "followup":
      return [
        "사장님 혹시 지난 메시지 보셨을까요? 😊",
        "부담 없이 무료로 정리해서 보내드리는 거라, 필요하시면 편하게 말씀 주세요!",
      ].join("\n");
    case "mini":
      return [
        "사장님, 기다려주셔서 감사합니다 🙏",
        `${nombre} 미니진단 정리해서 보내드려요. (이미지 첨부)`,
        "",
        "네이버·인스타·카카오 기준 8가지 항목을 봤고,",
        "점수랑 지금 바로 손볼 수 있는 핵심 3가지를 표시해뒀어요.",
        "",
        "솔직하게만 봤어요 — 좋은 부분도, 아쉬운 부분도 그대로요.",
        "보시고 궁금한 점 있으면 편하게 말씀 주세요 😊",
      ].join("\n");
    case "miniFollowup":
      return [
        `사장님, 며칠 전에 보내드린 ${nombre} 미니진단 혹시 보셨을까요? 😊`,
        "표시해둔 핵심 3가지 중에 궁금한 부분 있으면 편하게 여쭤보세요.",
        "부담 전혀 없으시고, 천천히 보셔도 괜찮아요 🙏",
      ].join("\n");
    case "bridge":
      return [
        "이건 맛보기 미니진단이에요 😊",
        "원하시면 전체 채널을 깊게 본 완전 진단 리포트도 있어요 —",
        "15개 항목 + 우선순위 액션플랜까지요. (₩99,000)",
        "",
        "지금은 전혀 부담 안 가지셔도 돼요.",
        "미니진단에서 표시한 3가지만 먼저 손봐도 검색 노출 달라질 거예요 🙏",
      ].join("\n");
  }
}
