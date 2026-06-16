import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/icons";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          {/* Column 1: Brand + blurb */}
          <div>
            <a className="brand" href="#top">
              <Logo size={34} />
              <span className="bt">
                <b>{site.brand.ko}</b>
                <span>Fixup&nbsp;Studio</span>
              </span>
            </a>
            <p className="fb">
              동네 가게를 위한 정직한 디지털 마케팅. 네이버·인스타그램·카카오톡을 하나로 연결해,
              검색되고 기억되고 다시 찾는 가게를 만듭니다.
            </p>
          </div>

          {/* Column 2: 서비스 */}
          <div>
            <h5>서비스</h5>
            <ul>
              <li><a href="#how">작동 방식</a></li>
              <li><a href="#report">진단 리포트</a></li>
              <li><a href="#pricing">요금제</a></li>
              <li><a href="#faq">자주 묻는 질문</a></li>
            </ul>
          </div>

          {/* Column 3: 문의 */}
          <div>
            <h5>문의</h5>
            <ul>
              <li><a href="#contact">무료 진단 신청</a></li>
              <li>
                <a href={site.contact.phoneTel}>{site.contact.phone}</a>
              </li>
              <li>
                <a
                  href={site.contact.kakaoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  카카오톡 {site.contact.kakaoHandle}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </li>
              <li>
                <Link href="/privacy">개인정보처리방침</Link>
              </li>
              <li>
                <Link href="/terms">이용약관</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="foot-bot">
          <span className="cp">© 2026 Fixup Studio · 픽스업 스튜디오. 정직한 마케팅.</span>
          <div className="pl">
            <a href="#how" aria-label="네이버">
              {Icon.pin({ width: 17, height: 17 })}
            </a>
            <a href="#how" aria-label="인스타그램">
              {Icon.insta({ width: 17, height: 17 })}
            </a>
            <a href="#contact" aria-label="카카오톡">
              {Icon.chat({ width: 17, height: 17 })}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
