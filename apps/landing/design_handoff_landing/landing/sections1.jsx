// sections1.jsx — Icons, Header, Hero, Problem, Funnel
// Exports to window for sibling babel scripts.

/* ── Icon set (simple stroke SVGs) ─────────────────────────── */
const I = {
  search: (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>),
  pin: (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>),
  insta: (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/></svg>),
  chat: (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 11.5c0 4-4 7-9 7a10 10 0 01-3-.5L4 20l1.2-3.3A6.5 6.5 0 013 11.5C3 7.5 7 4.5 12 4.5s9 3 9 7z"/></svg>),
  eye: (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>),
  heart: (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20.8 5.6a5.5 5.5 0 00-7.8 0L12 6.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>),
  repeat: (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>),
  check: (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12.5l4.5 4.5L19 6.5"/></svg>),
  x: (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>),
  plus: (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>),
  arrow: (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>),
  phone: (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L8.1 9.5a16 16 0 006 6l1.1-1.1a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z"/></svg>),
  mail: (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>),
  spark: (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>),
  user: (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>),
  alert: (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10.3 3.9 1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>),
  ghost: (p)=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 21V10a7 7 0 0114 0v11l-3-2-2 2-2-2-2 2-2-2z"/><path d="M9 11h.01M15 11h.01"/></svg>),
};

const Logo = ({size=34, fill="var(--accent)", stroke="#FFF7F0"})=>(
  <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="32" height="32" rx="9" fill={fill}/>
    <path d="M10.5 17.5l4 4 9-10.5" stroke={stroke} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── Header ─────────────────────────────────────────────────── */
function Header({onCta}){
  return (
    <header className="hdr">
      <div className="hdr-in">
        <a className="brand" href="#top" aria-label="Fixup Studio 홈">
          <Logo size={34}/>
          <span className="bt"><b>픽스업 스튜디오</b><span>Fixup&nbsp;Studio</span></span>
        </a>
        <nav className="hdr-nav">
          <a href="#how">서비스</a>
          <a href="#report">진단 리포트</a>
          <a href="#pricing">요금제</a>
          <a href="#faq">자주 묻는 질문</a>
        </nav>
        <div className="hdr-cta">
          <a className="btn btn-primary" href="#contact" onClick={onCta}>무료 진단 받기</a>
        </div>
      </div>
    </header>
  );
}

/* ── Hero ───────────────────────────────────────────────────── */
const HERO_COPY = {
  pregunta:{
    eyebrow:"동네 가게를 위한 디지털 마케팅",
    h1:(<>우리 가게,<br/>온라인에서 <span className="hl">제대로</span><br/>보이고 있나요?</>),
    sub:(<>네이버·인스타그램·카카오톡 통합 마케팅. <b>광고대행사가 아니라, 솔직하게 진단하고 직접 실행하는 파트너</b>입니다.</>),
  },
  directo:{
    eyebrow:"네이버 · 인스타그램 · 카카오톡",
    h1:(<>흩어진 우리 가게 마케팅,<br/><span className="hl">한 번에 제대로.</span></>),
    sub:(<>세 채널을 하나의 구매 여정으로 연결합니다. <b>진단부터 실행까지, 한국인 담당자가 직접</b> 운영해요.</>),
  },
  beneficio:{
    eyebrow:"검색 · 기억 · 재방문",
    h1:(<><span className="hl">검색</span>되고, <span className="hl">기억</span>되고,<br/>다시 찾는 가게로.</>),
    sub:(<>손님이 찾고, 기억하고, 다시 오게 만드는 온라인 흐름을 만듭니다. <b>과장 없이, 솔직하게.</b></>),
  },
};

function Hero({variant="pregunta", onCta}){
  const c = HERO_COPY[variant] || HERO_COPY.pregunta;
  return (
    <section className="hero" id="top">
      <div className="glow"></div>
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">{I.spark({width:13,height:13})} {c.eyebrow}</span>
            <h1>{c.h1}</h1>
            <p className="sub">{c.sub}</p>
            <div className="cta-row">
              <a className="btn btn-primary btn-lg" href="#contact" onClick={onCta}>무료 진단 받기 <span className="ar">→</span></a>
              <a className="btn btn-kakao" href="#contact" onClick={onCta}>{I.chat({className:"btn-icn"})} 카카오톡 상담</a>
              <a className="btn btn-secondary" href="tel:0212345678">{I.phone({className:"btn-icn"})} 전화하기</a>
            </div>
            <div className="trust">
              <span>광고대행사 아님</span>
              <span>가짜 리뷰 없음</span>
              <span>한국인 담당자 직접 운영</span>
            </div>
          </div>

          <div className="hero-vis">
            <div className="ph shot">
              <div className="ph-l">
                <span className="t">Foto · Hero</span>
                <span className="d">동네 가게 사장님이 가게 앞에서 웃는 따뜻한 실사. 자연광, 진짜 공간 — 스톡 사진 금지.</span>
              </div>
            </div>
            <div className="float f-naver">
              <span className="fi" style={{background:"var(--naver)"}}>{I.pin({width:18,height:18})}</span>
              <span className="fx"><b>네이버 플레이스 1위</b><span>지역 검색 노출</span></span>
            </div>
            <div className="float f-score">
              <span className="lbl">온라인 점수</span>
              <span className="big">87점</span>
            </div>
            <div className="float f-kakao">
              <span className="fi" style={{background:"var(--kakao)",color:"var(--kakao-ink)"}}>{I.chat({width:18,height:18})}</span>
              <span className="fx"><b>카카오 채널 +312</b><span>단골 재방문</span></span>
            </div>
          </div>
        </div>

        <div className="logos rv">
          <div className="ll">이런 동네 가게와 함께합니다</div>
          <div className="row">
            <span className="chip"><span className="e">🧴</span> 피부과 · 에스테틱</span>
            <span className="chip"><span className="e">☕</span> 카페 · 디저트</span>
            <span className="chip"><span className="e">🍽️</span> 음식점</span>
            <span className="chip"><span className="e">💈</span> 미용실 · 헤어</span>
            <span className="chip"><span className="e">💪</span> 필라테스 · 헬스</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Problem ────────────────────────────────────────────────── */
const PROBS = [
  {ic:I.search, h:"검색해도 안 나와요", p:"손님이 동네 이름으로 검색해도 우리 가게가 안 보입니다. 네이버 플레이스 정보가 비어 있거나 오래됐어요.", q:"// 잠재 손님을 경쟁 가게에 뺏기는 중"},
  {ic:I.ghost, h:"인스타는 방치 상태", p:"계정은 만들었지만 마지막 게시물이 반 년 전. 손님이 보고 '아직 하나?' 싶어 발길을 돌립니다.", q:"// 기억에 남지 않는 가게"},
  {ic:I.repeat, h:"한 번 오고 안 와요", p:"어렵게 온 첫 손님과 다시 연결될 방법이 없습니다. 카카오 채널도, 재방문 유도도 없어요.", q:"// 단골이 쌓이지 않는 구조"},
];

function Problem(){
  return (
    <section id="problem">
      <div className="wrap">
        <div className="sec-head center rv">
          <p className="kicker">이런 적, 없으세요?</p>
          <h2 className="h-sec">가게는 좋은데,<br/>온라인에서만 손님을 놓치고 있다면.</h2>
          <p className="lead">대부분의 동네 가게가 같은 곳에서 막힙니다. 광고를 더 쓰기 전에, <b>어디가 새는지부터 정확히 봐야</b> 합니다.</p>
        </div>
        <div className="prob-grid">
          {PROBS.map((x,i)=>(
            <div className="prob rv" key={i} style={{transitionDelay:(i*70)+"ms"}}>
              <span className="pic">{x.ic({width:22,height:22})}</span>
              <h3>{x.h}</h3>
              <p>{x.p}</p>
              <div className="q mono">{x.q}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Funnel ─────────────────────────────────────────────────── */
const STAGES = [
  {step:"01 · Find", name:"네이버", en:"Naver", color:"var(--naver)", ic:I.search, kr:"찾게 만들기", desc:"플레이스 최적화, 지역 검색 노출, 진짜 정보 정리로 \u2018검색되는 가게\u2019를 만듭니다."},
  {step:"02 · Recall", name:"인스타그램", en:"Instagram", color:"var(--insta)", grad:"var(--insta-grad)", ic:I.insta, kr:"기억하게 만들기", desc:"가게의 분위기와 메뉴를 꾸준히 보여줘 손님 머릿속에 남는 브랜드를 만듭니다."},
  {step:"03 · Return", name:"카카오톡", en:"Kakao", color:"var(--kakao)", inkColor:"var(--kakao-ink)", ic:I.chat, kr:"다시 오게 만들기", desc:"채널 메시지, 쿠폰, 예약으로 한 번 온 손님을 단골로 연결합니다."},
];

function Funnel({layout="vertical"}){
  return (
    <section id="how" className="sec-alt">
      <div className="wrap">
        <div className="sec-head center rv">
          <p className="kicker">How it works · 작동 방식</p>
          <h2 className="h-sec">세 채널, 하나의 구매 여정.</h2>
          <p className="lead">네이버에서 <b>찾고</b>, 인스타그램으로 <b>기억하고</b>, 카카오톡으로 <b>다시 옵니다</b>. 따로 노는 채널이 아니라, 하나로 연결된 길이에요.</p>
        </div>
        <div className="funnel" data-layout={layout}>
          {STAGES.map((s,i)=>(
            <React.Fragment key={i}>
              <div className="fstage rv" style={{transitionDelay:(i*80)+"ms"}}>
                <span className="fic" style={{background:s.grad||s.color, color:s.inkColor||"#fff"}}>{s.ic({width:26,height:26})}</span>
                <div className="fbody">
                  <div className="fstep">{s.step}</div>
                  <div className="fname jua">{s.name}<span className="en">{s.kr}</span></div>
                  <p className="fdesc">{s.desc}</p>
                </div>
              </div>
              {i<STAGES.length-1 && (
                <div className="fconn" aria-hidden="true">{I.arrow({width:24,height:24})}</div>
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="funnel-note rv">한 채널만 잘해도 부족합니다. <b>세 개가 연결될 때</b> 손님이 단골이 됩니다.</p>
      </div>
    </section>
  );
}

Object.assign(window, { I, Logo, Header, Hero, Problem, Funnel });
