import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "이용약관 — 픽스업 스튜디오",
  // 사업자 정보를 채우고 법무 검토 후 index: true 로 변경하세요.
  robots: { index: false },
};

type Section = { h: string; body: React.ReactNode };

const sections: Section[] = [
  {
    h: "1. 목적",
    body: (
      <p className="lead">
        본 약관은 {site.brand.ko}(이하 「회사」)가 제공하는 디지털 마케팅 진단 및 관련
        서비스(이하 「서비스」)의 이용 조건과 절차, 회사와 이용자의 권리·의무를 규정함을
        목적으로 합니다.
      </p>
    ),
  },
  {
    h: "2. 정의",
    body: (
      <p className="lead">
        「이용자」란 본 약관에 따라 회사가 제공하는 서비스를 신청·이용하는 소상공인 및 사업자를
        말합니다. 「진단」이란 네이버·인스타그램·카카오톡 등 온라인 채널 현황에 대한
        무료/유료 점검 결과물을 말합니다.
      </p>
    ),
  },
  {
    h: "3. 약관의 효력 및 변경",
    body: (
      <p className="lead">
        본 약관은 웹사이트에 게시함으로써 효력이 발생합니다. 회사는 관계 법령을 위배하지 않는
        범위에서 약관을 변경할 수 있으며, 변경 시 시행일과 함께 본 페이지에 사전 고지합니다.
      </p>
    ),
  },
  {
    h: "4. 서비스 내용",
    body: (
      <p className="lead">
        회사는 소상공인 대상 온라인 마케팅 현황 진단, 네이버·인스타그램·카카오톡 채널 운영
        개선 컨설팅 및 실행 지원 서비스를 제공합니다. 구체적인 제공 범위는 진단 결과와 별도
        계약 내용에 따릅니다.
      </p>
    ),
  },
  {
    h: "5. 무료 진단",
    body: (
      <p className="lead">
        무료 진단은 이용자가 직접 신청한 경우에 한해 제공되며, 공개된 정보와 이용자가 제공한
        자료를 바탕으로 작성됩니다. 무료 진단 결과는 참고용이며 특정 성과를 보장하지 않습니다.
      </p>
    ),
  },
  {
    h: "6. 요금 및 환급",
    body: (
      <p className="lead">
        유료 진단(진단 ₩99,000)을 받은 뒤 월 운영 플랜을 계약하는 경우 진단비는 100% 환급(차감)됩니다.
        유료 서비스는 월 단위로 운영되며 장기 약정이 없습니다. 요금표 및 환급·해지 조건의 세부
        사항은 별도 계약서에 따릅니다.
      </p>
    ),
  },
  {
    h: "7. 이용자의 의무",
    body: (
      <p className="lead">
        이용자는 신청 시 정확한 정보를 제공해야 하며, 타인의 정보를 무단으로 사용해서는 안 됩니다.
        제공한 자료의 적법성·정확성에 대한 책임은 이용자에게 있습니다.
      </p>
    ),
  },
  {
    h: "8. 회사의 의무",
    body: (
      <p className="lead">
        회사는 관계 법령과 본 약관을 준수하며, 이용자의 개인정보를 「개인정보처리방침」에 따라
        안전하게 관리합니다. 회사는 안정적인 서비스 제공을 위해 노력합니다.
      </p>
    ),
  },
  {
    h: "9. 책임의 한계",
    body: (
      <p className="lead">
        회사는 제공한 진단 결과 및 권고 사항에 따른 실행 결과를 보증하지 않습니다. 서비스 성과는
        이용자의 업종·지역·경쟁 환경 등 외부 요인에 따라 달라질 수 있습니다. 회사는 천재지변,
        제3자 플랫폼(네이버·인스타그램·카카오 등)의 정책 변경 등 회사의 통제를 벗어난 사유로
        발생한 손해에 대해 책임을 지지 않습니다.
      </p>
    ),
  },
  {
    h: "10. 지식재산권",
    body: (
      <p className="lead">
        회사가 제공한 진단 리포트·콘텐츠의 지식재산권은 회사에 귀속됩니다. 이용자는 자신의
        사업 목적 범위 내에서 이를 활용할 수 있으며, 무단 복제·재배포할 수 없습니다.
      </p>
    ),
  },
  {
    h: "11. 준거법 및 관할",
    body: (
      <p className="lead">
        본 약관은 대한민국 법령에 따라 해석되며, 서비스 이용과 관련한 분쟁은 관계 법령이 정한
        절차에 따른 관할 법원을 제1심 관할로 합니다.
      </p>
    ),
  },
  {
    h: "12. 문의처",
    body: (
      <p className="lead">
        • 이메일: {site.contact.email}<br />
        • 전화: {site.contact.phone}<br />
        (상호·사업자등록번호·주소 등 사업자 정보는 정식 출시 전 기입)
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <main className="wrap" style={{ paddingTop: 96, paddingBottom: 64, maxWidth: 760 }}>
      <p className="kicker"><Link href="/">← 픽스업 스튜디오</Link></p>
      <h1 className="h-sec">이용약관</h1>
      <p className="lead">최종 수정일: {site.legalUpdated}</p>
      {sections.map((s) => (
        <section key={s.h}>
          <h2 className="h-sec" style={{ fontSize: 22, marginTop: 28 }}>{s.h}</h2>
          {s.body}
        </section>
      ))}
    </main>
  );
}
