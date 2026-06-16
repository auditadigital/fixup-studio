// Central site config. Replace TODO values with real data before launch.
export const site = {
  brand: { ko: "픽스업 스튜디오", latin: "Fixup Studio" },
  url: "https://fixup.studio", // TODO confirm production domain
  contact: {
    phone: "02-1234-5678", // TODO real phone
    phoneTel: "tel:0212345678", // TODO
    email: "hello@fixup.studio", // TODO real email
    kakaoHandle: "@fixupstudio", // TODO real Kakao channel
    kakaoUrl: "https://pf.kakao.com/_fixupstudio", // TODO real channel URL
    hours: "평일 10:00–19:00",
  },
  nav: [
    { href: "#how", label: "서비스" },
    { href: "#report", label: "진단 리포트" },
    { href: "#pricing", label: "요금제" },
    { href: "#faq", label: "자주 묻는 질문" },
  ],
  legalUpdated: "2026-06-16", // privacy/terms 최종 수정일 (TODO 법무 검토)
} as const;
