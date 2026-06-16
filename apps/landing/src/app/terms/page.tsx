import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "이용약관 — 픽스업 스튜디오",
  robots: { index: false }, // placeholder draft — do not index until legal-reviewed
};

export default function Terms() {
  return (
    <main className="wrap" style={{ paddingTop: 96, paddingBottom: 64, maxWidth: 760 }}>
      <p className="kicker"><Link href="/">← 픽스업 스튜디오</Link></p>
      <h1 className="h-sec">이용약관</h1>
      <p className="lead">최종 수정일: {site.legalUpdated}</p>
      <p className="lead" style={{ color: "var(--urgent)" }}>
        ※ 본 문서는 검토용 초안(placeholder)입니다. 법무 검토 후 실제 약관으로 교체하세요.
      </p>
      {/* TODO(legal): 실제 이용약관으로 교체 — 아래 항목 채우기 */}
      <h2 className="h-sec" style={{ fontSize: 22, marginTop: 32 }}>1. 목적</h2>
      <p className="lead">
        본 약관은 픽스업 스튜디오(이하 &ldquo;회사&rdquo;)가 제공하는 디지털 마케팅 진단 및 관련 서비스(이하 &ldquo;서비스&rdquo;) 이용에 관한
        기본적인 사항을 규정함을 목적으로 합니다. {/* TODO 확정 */}
      </p>
      <h2 className="h-sec" style={{ fontSize: 22, marginTop: 24 }}>2. 서비스 내용</h2>
      <p className="lead">
        회사는 소상공인 대상 온라인 마케팅 현황 진단, 네이버·인스타그램·카카오톡 채널 운영 개선 컨설팅 및 실행 지원 서비스를
        제공합니다. {/* TODO 세부 내용 확정 */}
      </p>
      <h2 className="h-sec" style={{ fontSize: 22, marginTop: 24 }}>3. 요금 및 환급</h2>
      <p className="lead">
        무료 진단 후 유료 서비스 진행 시 진단비는 100% 환급됩니다. 유료 서비스는 월 단위로 운영되며 장기 약정이 없습니다.
        요금 및 환급 조건의 세부 사항은 별도 계약서에 따릅니다. {/* TODO 요금표 및 환급 조건 확정 */}
      </p>
      <h2 className="h-sec" style={{ fontSize: 22, marginTop: 24 }}>4. 책임의 한계</h2>
      <p className="lead">
        회사는 제공한 진단 결과 및 권고 사항에 따른 실행 결과에 대해 보증하지 않습니다. 서비스 성과는 고객사 업종, 지역,
        경쟁 환경 등 외부 요인에 따라 달라질 수 있습니다. {/* TODO 면책 범위 법무 검토 필요 */}
      </p>
      <h2 className="h-sec" style={{ fontSize: 22, marginTop: 24 }}>5. 문의처</h2>
      <p className="lead">{site.contact.email}</p>
    </main>
  );
}
