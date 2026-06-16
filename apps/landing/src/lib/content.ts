// Korean copy data, verbatim from design handoff (sections1.jsx + sections2.jsx).
// Icon names reference the icon map to be built in a later task.
// No HTML injection — structured parts allow renderers to apply spans/bold without dangerouslySetInnerHTML.

type IconName =
  | "search"
  | "ghost"
  | "repeat"
  | "pin"
  | "insta"
  | "chat"
  | "check"
  | "x"
  | "plus"
  | "arrow"
  | "phone"
  | "mail"
  | "spark"
  | "user"
  | "alert"
  | "eye"
  | "heart";

/* ── Hero ───────────────────────────────────────────────────── */
// Variant "pregunta" only (source: sections1.jsx lines 56-128)
export const HERO = {
  eyebrow: "동네 가게를 위한 디지털 마케팅",
  h1: {
    line1: "우리 가게,",
    line2Before: "온라인에서 ",
    line2Hl: "제대로",
    line3: "보이고 있나요?",
  },
  sub: {
    before: "네이버·인스타그램·카카오톡 통합 마케팅. ",
    bold: "광고대행사가 아니라, 솔직하게 진단하고 직접 실행하는 파트너",
    after: "입니다.",
  },
  ctaPrimary: "무료 진단 받기",
  ctaKakao: "카카오톡 상담",
  ctaPhone: "전화하기",
  trust: ["광고대행사 아님", "가짜 리뷰 없음", "한국인 담당자 직접 운영"],
  hero_photo: {
    label: "Foto · Hero",
    brief: "동네 가게 사장님이 가게 앞에서 웃는 따뜻한 실사. 자연광, 진짜 공간 — 스톡 사진 금지.",
  },
  floats: {
    naver: { title: "네이버 플레이스 1위", sub: "지역 검색 노출" },
    score: { label: "온라인 점수", big: "87점" },
    kakao: { title: "카카오 채널 +312", sub: "단골 재방문" },
  },
  logosLabel: "이런 동네 가게와 함께합니다",
  logos: [
    { emoji: "🧴", label: "피부과 · 에스테틱" },
    { emoji: "☕", label: "카페 · 디저트" },
    { emoji: "🍽️", label: "음식점" },
    { emoji: "💈", label: "미용실 · 헤어" },
    { emoji: "💪", label: "필라테스 · 헬스" },
  ],
} as const;

/* ── Problem items ──────────────────────────────────────────── */
// Source: sections1.jsx lines 135-139
export const PROBS: ReadonlyArray<{
  icon: IconName;
  h: string;
  p: string;
  q: string;
}> = [
  {
    icon: "search",
    h: "검색해도 안 나와요",
    p: "손님이 동네 이름으로 검색해도 우리 가게가 안 보입니다. 네이버 플레이스 정보가 비어 있거나 오래됐어요.",
    q: "// 잠재 손님을 경쟁 가게에 뺏기는 중",
  },
  {
    icon: "ghost",
    h: "인스타는 방치 상태",
    p: "계정은 만들었지만 마지막 게시물이 반 년 전. 손님이 보고 '아직 하나?' 싶어 발길을 돌립니다.",
    q: "// 기억에 남지 않는 가게",
  },
  {
    icon: "repeat",
    h: "한 번 오고 안 와요",
    p: "어렵게 온 첫 손님과 다시 연결될 방법이 없습니다. 카카오 채널도, 재방문 유도도 없어요.",
    q: "// 단골이 쌓이지 않는 구조",
  },
] as const;

/* ── Funnel stages ──────────────────────────────────────────── */
// Source: sections1.jsx lines 166-170
export const STAGES: ReadonlyArray<{
  step: string;
  name: string;
  role: string;
  color: string;
  grad?: string;
  inkColor?: string;
  icon: IconName;
  desc: string;
}> = [
  {
    step: "01 · Find",
    name: "네이버",
    role: "찾게 만들기",
    color: "var(--naver)",
    icon: "search",
    desc: "플레이스 최적화, 지역 검색 노출, 진짜 정보 정리로 '검색되는 가게'를 만듭니다.",
  },
  {
    step: "02 · Recall",
    name: "인스타그램",
    role: "기억하게 만들기",
    color: "var(--insta)",
    grad: "var(--insta-grad)",
    icon: "insta",
    desc: "가게의 분위기와 메뉴를 꾸준히 보여줘 손님 머릿속에 남는 브랜드를 만듭니다.",
  },
  {
    step: "03 · Return",
    name: "카카오톡",
    role: "다시 오게 만들기",
    color: "var(--kakao)",
    inkColor: "var(--kakao-ink)",
    icon: "chat",
    desc: "채널 메시지, 쿠폰, 예약으로 한 번 온 손님을 단골로 연결합니다.",
  },
] as const;

/* ── Differentiator compare ─────────────────────────────────── */
// Source: sections2.jsx lines 24-39
export const COMPARE = {
  bad: {
    title: "흔한 대행사",
    items: ["담당자가 자주 바뀜", "자동 봇·매크로 응대", "무슨 작업을 했는지 깜깜"],
  },
  good: {
    title: "픽스업 스튜디오",
    items: ["전담 한국인 담당자 고정", "사람이 직접 응대", "매달 솔직한 리포트 공유"],
  },
} as const;

/* ── Report card items ──────────────────────────────────────── */
// Source: sections2.jsx lines 49-53
export const RITEMS: ReadonlyArray<{
  led: string;
  name: string;
  rows: ReadonlyArray<[string, string]>;
}> = [
  {
    led: "var(--good)",
    name: "네이버",
    rows: [
      ["플레이스 등록", "정상"],
      ["최근 리뷰", "12건"],
    ],
  },
  {
    led: "var(--warn)",
    name: "인스타그램",
    rows: [
      ["최근 게시물", "2개월 전"],
      ["프로필 정보", "미흡"],
    ],
  },
  {
    led: "var(--urgent)",
    name: "카카오톡",
    rows: [
      ["채널 개설", "없음"],
      ["재방문 유도", "없음"],
    ],
  },
] as const;

/* ── Report action steps ────────────────────────────────────── */
// Source: sections2.jsx lines 54-58
export const RSTEPS: ReadonlyArray<{ t: string; s: string }> = [
  {
    t: "인스타그램 주 2회 콘텐츠 복구",
    s: "메뉴·분위기 중심으로 '살아있는 계정'으로.",
  },
  {
    t: "카카오 채널 개설 + 첫 쿠폰 발송",
    s: "첫 방문 손님을 단골로 연결하는 고리 만들기.",
  },
  {
    t: "네이버 리뷰 응대 루틴 세팅",
    s: "진짜 리뷰에 정성껏 답하기 — 조작 없이.",
  },
] as const;

/* ── Report cover strings ───────────────────────────────────── */
// Source: sections2.jsx lines 70-104
export const REPORT = {
  kicker: "온라인 presence 진단 리포트 · 샘플",
  title: "○○ 에스테틱 · 강남점",
  subtitle: "네이버 · 인스타그램 · 카카오톡 통합 점검 결과",
  score: "58",
  scoreDen: "/100",
  scoreLabel: "개선 여지 큼",
  planTitle: "이번 달 실행 플랜",
  cta: "내 가게 무료로 진단받기",
} as const;

/* ── Pricing plans ──────────────────────────────────────────── */
// Source: sections2.jsx lines 112-121
export const PLANS: ReadonlyArray<{
  n: string;
  d: string;
  w: string;
  per: string;
  one: string;
  feat: boolean;
  items: ReadonlyArray<string>;
}> = [
  {
    n: "진단",
    d: "먼저 상태부터 정확히 파악하고 싶다면.",
    w: "₩99,000",
    per: "1회",
    one: "단발 진단",
    feat: false,
    items: [
      "3채널 온라인 정밀 진단",
      "신호등 리포트 + 실행 플랜",
      "담당자 1:1 설명 (30분)",
      "진행 시 진단비 환급",
    ],
  },
  {
    n: "기본",
    d: "핵심 채널을 안정적으로 운영하고 싶다면.",
    w: "₩350,000",
    per: "월",
    one: "가장 가벼운 시작",
    feat: false,
    items: [
      "네이버 플레이스 관리",
      "인스타그램 주 2회 운영",
      "월간 리포트",
      "카카오톡 상담 응대",
    ],
  },
  {
    n: "성장",
    d: "검색·콘텐츠·재방문을 본격적으로.",
    w: "₩650,000",
    per: "월",
    one: "가장 인기",
    feat: true,
    items: [
      "기본 플랜 전체 포함",
      "인스타 주 3~4회 + 릴스",
      "카카오 채널 + 쿠폰 운영",
      "네이버 리뷰 관리",
      "월 2회 전략 미팅",
    ],
  },
  {
    n: "프리미엄",
    d: "여러 매장·브랜드를 통합 관리.",
    w: "₩1,200,000~",
    per: "월",
    one: "맞춤 견적",
    feat: false,
    items: [
      "성장 플랜 전체 포함",
      "멀티 매장 통합 운영",
      "촬영·디자인 제작 지원",
      "우선 응대 + 전담 매니저",
      "맞춤 캠페인 설계",
    ],
  },
] as const;

// Source: sections2.jsx line 149
export const PRICE_NOTE =
  "// 모든 금액은 VAT 별도 · 약정 없음 · 진단 후 진행 시 진단비 100% 환급";

/* ── Honesty don'ts ─────────────────────────────────────────── */
// Source: sections2.jsx lines 156-161
export const DONTS: ReadonlyArray<{ b: string; s: string }> = [
  {
    b: "가짜 리뷰를 쓰지 않습니다",
    s: "조작된 후기는 신뢰를 무너뜨리고, 결국 손님을 잃게 합니다.",
  },
  {
    b: "보장 문구로 속이지 않습니다",
    s: "'1위 보장' 같은 과장 대신, 가능한 것과 어려운 것을 솔직히 말합니다.",
  },
  {
    b: "묶음 약정으로 가두지 않습니다",
    s: "효과가 없으면 떠날 수 있어야 합니다. 그래서 약정이 없어요.",
  },
  {
    b: "깜깜이로 일하지 않습니다",
    s: "무슨 작업을 왜 했는지, 매달 리포트로 투명하게 공유합니다.",
  },
] as const;

/* ── FAQ ────────────────────────────────────────────────────── */
// Source: sections2.jsx lines 189-195
export const FAQS: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: "광고대행사랑 뭐가 다른가요?",
    a: "광고비를 태우는 곳이 아니라, 먼저 진단하고 직접 실행하는 파트너입니다. 한국인 담당자가 가게마다 고정으로 붙어 카카오톡으로 직접 소통하고, 매달 솔직한 리포트를 드립니다.",
  },
  {
    q: "정말 가짜 리뷰는 안 만드나요?",
    a: "네. 조작 리뷰는 단기적으로도 위험하고 신뢰를 무너뜨립니다. 저희는 진짜 손님의 후기를 잘 받고 정성껏 응대하는 방식만 사용합니다.",
  },
  {
    q: "우리 같은 작은 가게도 가능한가요?",
    a: "카페, 음식점, 미용실, 피부과 등 동네 단위 매장을 위해 만든 서비스입니다. 비전문가도 30초면 이해할 수 있게 모든 과정을 쉽게 설명해 드려요.",
  },
  {
    q: "진단은 정말 무료인가요?",
    a: "네, 3채널 기본 진단과 신호등 리포트, 담당자 설명까지 무료입니다. 더 깊은 정밀 진단(₩99,000)은 이후 정식 진행 시 100% 환급됩니다.",
  },
  {
    q: "약정이 있나요?",
    a: "없습니다. 효과가 없다면 언제든 멈출 수 있어야 한다고 믿습니다. 묶음 약정이나 위약금 없이 월 단위로 운영합니다.",
  },
] as const;

/* ── Business categories (Final CTA form) ───────────────────── */
// Source: sections2.jsx line 223
export const BIZ = [
  "피부과·에스테틱",
  "카페·디저트",
  "음식점",
  "미용실·헤어",
  "기타",
] as const;

/* ── Section head copy ──────────────────────────────────────── */
// Verbatim from the JSX section heads; bold parts modelled as structured {before,bold,after}.
export const HEADS = {
  problem: {
    kicker: "이런 적, 없으세요?",
    title: "가게는 좋은데,\n온라인에서만 손님을 놓치고 있다면.",
    lead: {
      before: "대부분의 동네 가게가 같은 곳에서 막힙니다. 광고를 더 쓰기 전에, ",
      bold: "어디가 새는지부터 정확히 봐야",
      after: " 합니다.",
    },
  },
  funnel: {
    kicker: "How it works · 작동 방식",
    title: "세 채널, 하나의 구매 여정.",
    lead: {
      before: "네이버에서 찾고, 인스타그램으로 기억하고, 카카오톡으로 다시 옵니다. ",
      bold: "",
      after: "따로 노는 채널이 아니라, 하나로 연결된 길이에요.",
    },
    // Note: the JSX uses inline <b> tags within the lead text for 찾고/기억하고/다시 옵니다.
    // Provided as a flat string alternative for renderers that prefer it:
    leadFlat:
      "네이버에서 찾고, 인스타그램으로 기억하고, 카카오톡으로 다시 옵니다. 따로 노는 채널이 아니라, 하나로 연결된 길이에요.",
    note: "한 채널만 잘해도 부족합니다. 세 개가 연결될 때 손님이 단골이 됩니다.",
    noteBold: "세 개가 연결될 때",
  },
  report: {
    kicker: "진단부터 · Diagnose first",
    title: "실행 전에, 솔직한 진단부터.",
    lead: {
      before: "광고비를 늘리기 전에 우리 가게의 온라인 상태를 ",
      bold: "신호등으로 한눈에",
      after: " 보여드립니다. 좋은 건 좋다고, 시급한 건 시급하다고 — 있는 그대로.",
    },
  },
  pricing: {
    kicker: "요금제 · Pricing",
    title: "진단으로 시작해서,\n필요한 만큼만.",
    lead: {
      before: "묶음 약정도, 숨은 비용도 없습니다. ",
      bold: "진단부터 가볍게 시작",
      after: "하고 가게에 맞게 키우세요.",
    },
  },
  faq: {
    kicker: "자주 묻는 질문 · FAQ",
    title: "궁금한 걸 먼저 풀어드릴게요.",
  },
  honesty: {
    kicker: "우리의 원칙",
    title: "신뢰는, 하지 않는 것에서 시작됩니다.",
    lead: {
      before: "마케팅은 결국 신뢰입니다. 그래서 픽스업이 ",
      bold: "절대 하지 않는 네 가지",
      after: "를 먼저 약속합니다.",
    },
  },
  differentiator: {
    kicker: "The difference · 우리의 차별점",
    title: "봇이 아니라,\n진짜 사람이 응대합니다.",
    lead: {
      before:
        "대행사에 맡기면 누가 우리 가게를 맡는지도 모릅니다. 픽스업은 ",
      bold: "가게마다 한국인 담당자 한 명",
      after:
        "이 붙어, 진단부터 실행까지 직접 챙기고 카카오톡으로 바로 소통해요.",
    },
  },
  finalCta: {
    kicker: "무료 진단 신청",
    title: "오늘, 우리 가게\n온라인 점수부터\n확인해 보세요.",
    titleHl: "온라인 점수", // highlighted span within title line 2
    lead: "3채널 진단 + 신호등 리포트 + 담당자 1:1 설명까지 무료. 약정도, 부담도 없습니다.",
    leadBold: "무료",
  },
} as const;
