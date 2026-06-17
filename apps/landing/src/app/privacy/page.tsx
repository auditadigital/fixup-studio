import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침 — 픽스업 스튜디오",
  // 사업자 정보(사업자등록번호·주소·대표자·보호책임자)를 채우고 법무 검토 후
  // index: true 로 변경하세요.
  robots: { index: false },
};

type Section = { h: string; body: React.ReactNode };

const sections: Section[] = [
  {
    h: "1. 총칙",
    body: (
      <p className="lead">
        {site.brand.ko}(이하 「회사」)는 정보주체의 개인정보를 중요하게 생각하며,
        「개인정보 보호법」 및 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」(정보통신망법)을
        준수합니다. 본 방침은 회사가 운영하는 웹사이트에서 무료 진단 신청 시 수집·이용되는
        개인정보의 처리 기준을 안내합니다.
      </p>
    ),
  },
  {
    h: "2. 수집하는 개인정보 항목",
    body: (
      <>
        <p className="lead"><strong>필수 항목:</strong> 이름, 업체명, 연락처(전화번호), 업종.</p>
        <p className="lead"><strong>선택 항목:</strong> 인스타그램 계정, 네이버 플레이스 링크, 문의 내용(가게 주소·메시지).</p>
        <p className="lead"><strong>자동 생성·기록:</strong> 개인정보 수집·이용 동의 일시, 신청 일시.</p>
        <p className="lead">회사는 광고성 정보 전송을 위한 별도 쿠키나 행태정보 수집 도구를 사용하지 않습니다.</p>
      </>
    ),
  },
  {
    h: "3. 개인정보의 수집·이용 목적",
    body: (
      <p className="lead">
        무료 진단 결과 제공, 진단 결과에 대한 상담 및 서비스 안내, 본인 확인 및 연락을 위해
        이용합니다. 수집한 개인정보는 정보주체가 직접 진단을 요청한 본 목적 외의
        광고성 정보 발송에는 이용하지 않습니다.
      </p>
    ),
  },
  {
    h: "4. 보유 및 이용 기간",
    body: (
      <p className="lead">
        수집·이용 목적이 달성되거나 정보주체가 동의를 철회한 경우 지체 없이 파기합니다.
        다만 상담 이력 관리를 위해 신청일로부터 1년간 보관 후 파기하며, 관계 법령에 별도
        보존 의무가 있는 경우 해당 기간 동안 보관합니다.
      </p>
    ),
  },
  {
    h: "5. 개인정보 처리의 위탁",
    body: (
      <>
        <p className="lead">
          회사는 안정적인 서비스 제공을 위해 아래와 같이 개인정보 처리를 위탁합니다.
        </p>
        <p className="lead">
          • <strong>Supabase</strong> — 신청 데이터의 저장 및 호스팅(데이터베이스 인프라).
        </p>
        <p className="lead">
          위탁에 따라 개인정보가 국외(클라우드 인프라 소재지)에 저장될 수 있으며, 회사는
          수탁사가 개인정보를 안전하게 처리하도록 관리·감독합니다.
          (인프라 소재 국가 및 이전 일시·방법은 정식 출시 전 구체적으로 고지합니다.)
        </p>
      </>
    ),
  },
  {
    h: "6. 제3자 제공",
    body: (
      <p className="lead">
        회사는 정보주체의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에
        근거가 있거나 수사기관의 적법한 요청이 있는 경우는 예외로 합니다.
      </p>
    ),
  },
  {
    h: "7. 정보주체의 권리와 행사 방법",
    body: (
      <p className="lead">
        정보주체는 언제든지 자신의 개인정보에 대한 열람·정정·삭제·처리정지를 요청하거나
        수집·이용 동의를 철회할 수 있습니다. 아래 문의처로 요청하시면 지체 없이 조치합니다.
        동의 철회 시 무료 진단·상담 제공이 제한될 수 있습니다.
      </p>
    ),
  },
  {
    h: "8. 개인정보의 파기",
    body: (
      <p className="lead">
        보유 기간이 경과하거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다.
        전자적 파일은 복구·재생되지 않도록 안전하게 삭제하며, 출력물은 분쇄 또는 소각합니다.
      </p>
    ),
  },
  {
    h: "9. 개인정보의 안전성 확보 조치",
    body: (
      <p className="lead">
        회사는 개인정보에 대한 접근 권한을 최소한의 담당자로 제한하고, 전송 구간 암호화 및
        접근 통제 등 합리적인 보호조치를 적용합니다.
      </p>
    ),
  },
  {
    h: "10. 개인정보 보호책임자",
    body: (
      <p className="lead">
        개인정보 처리에 관한 문의·불만·피해 구제는 아래로 연락해 주세요.<br />
        • 이메일: {site.contact.email}<br />
        • 전화: {site.contact.phone}<br />
        (보호책임자 성명 및 사업자 정보는 정식 출시 전 기입)
      </p>
    ),
  },
  {
    h: "11. 고지의 의무",
    body: (
      <p className="lead">
        본 방침의 내용 추가·삭제·변경이 있을 경우 시행 전 본 페이지를 통해 고지합니다.
      </p>
    ),
  },
];

export default function Privacy() {
  return (
    <main className="wrap" style={{ paddingTop: 96, paddingBottom: 64, maxWidth: 760 }}>
      <p className="kicker"><Link href="/">← 픽스업 스튜디오</Link></p>
      <h1 className="h-sec">개인정보처리방침</h1>
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
