import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침 — 픽스업 스튜디오",
  robots: { index: false }, // placeholder draft — do not index until legal-reviewed
};

export default function Privacy() {
  return (
    <main className="wrap" style={{ paddingTop: 96, paddingBottom: 64, maxWidth: 760 }}>
      <p className="kicker"><Link href="/">← 픽스업 스튜디오</Link></p>
      <h1 className="h-sec">개인정보처리방침</h1>
      <p className="lead">최종 수정일: {site.legalUpdated}</p>
      <p className="lead" style={{ color: "var(--urgent)" }}>
        ※ 본 문서는 검토용 초안(placeholder)입니다. 법무 검토 후 실제 방침으로 교체하세요.
      </p>
      {/* TODO(legal): 실제 개인정보처리방침으로 교체 — 아래 항목 채우기 */}
      <h2 className="h-sec" style={{ fontSize: 22, marginTop: 32 }}>1. 수집하는 개인정보 항목</h2>
      <p className="lead">이름, 업체명, 연락처, 업종, 인스타그램/네이버 링크, 문의 내용. {/* TODO 확정 */}</p>
      <h2 className="h-sec" style={{ fontSize: 22, marginTop: 24 }}>2. 이용 목적</h2>
      <p className="lead">무료 진단 및 상담 제공, 서비스 안내. 광고 수신과 무관합니다.</p>
      <h2 className="h-sec" style={{ fontSize: 22, marginTop: 24 }}>3. 보유 및 이용 기간</h2>
      <p className="lead">{/* TODO 기간 확정 */} 상담 종료 후 일정 기간 보관 후 파기.</p>
      <h2 className="h-sec" style={{ fontSize: 22, marginTop: 24 }}>4. 제3자 제공</h2>
      <p className="lead">원칙적으로 제3자에게 제공하지 않습니다. {/* TODO 예외 명시 */}</p>
      <h2 className="h-sec" style={{ fontSize: 22, marginTop: 24 }}>5. 문의처</h2>
      <p className="lead">{site.contact.email}</p>
    </main>
  );
}
