import type { Metadata } from "next";
import { Jua, Noto_Sans_KR, Space_Mono } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const jua = Jua({ weight: "400", subsets: ["latin"], variable: "--font-jua", display: "swap" });
const noto = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-noto-kr", display: "swap" });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "픽스업 스튜디오 — 동네 가게 디지털 마케팅 · 무료 진단",
  description: "네이버·인스타그램·카카오톡 통합 마케팅. 광고대행사가 아니라 솔직하게 진단하고 직접 실행하는 파트너. 무료 진단 받기.",
  keywords: ["동네 가게 마케팅", "네이버 플레이스", "인스타그램 마케팅", "카카오톡 채널", "소상공인 마케팅", "무료 온라인 진단"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Fixup Studio",
    title: "픽스업 스튜디오 — 우리 가게, 온라인에서 제대로 보이고 있나요?",
    description: "네이버·인스타그램·카카오톡을 하나로. 무료 진단부터 시작하세요.",
    // images: [{ url: "/og.png", width: 1200, height: 630 }], // TODO real OG image
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${jua.variable} ${noto.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
