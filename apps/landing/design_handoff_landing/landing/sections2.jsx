// sections2.jsx — Differentiator, Report, Pricing, Honesty, FAQ, FinalCTA, Footer
// Relies on globals from sections1.jsx (I, Logo).

/* ── Differentiator ─────────────────────────────────────────── */
function Differentiator(){
  return (
    <section id="who">
      <div className="wrap">
        <div className="diff-grid">
          <div className="diff-vis rv">
            <div className="ph shot">
              <div className="ph-l">
                <span className="t">Foto · 담당자</span>
                <span className="d">실제 담당자가 노트북 앞에서 사장님과 통화하는 자연스러운 장면. 정면 미소, 진짜 사람.</span>
              </div>
            </div>
            <div className="tag"><span className="dot"></span><b>한국인 담당자 · 직접 응대</b></div>
          </div>
          <div className="diff rv">
            <p className="kicker">The difference · 우리의 차별점</p>
            <h2>봇이 아니라,<br/>진짜 사람이 응대합니다.</h2>
            <p>대행사에 맡기면 누가 우리 가게를 맡는지도 모릅니다. 픽스업은 <b>가게마다 한국인 담당자 한 명</b>이 붙어, 진단부터 실행까지 직접 챙기고 카카오톡으로 바로 소통해요.</p>
            <div className="compare">
              <div className="cmp bad">
                <div className="ch">{I.x({width:15,height:15})} 흔한 대행사</div>
                <ul>
                  <li><span className="m">{I.x({width:15,height:15,style:{color:"var(--ink-soft)"}})}</span> 담당자가 자주 바뀜</li>
                  <li><span className="m">{I.x({width:15,height:15,style:{color:"var(--ink-soft)"}})}</span> 자동 봇·매크로 응대</li>
                  <li><span className="m">{I.x({width:15,height:15,style:{color:"var(--ink-soft)"}})}</span> 무슨 작업을 했는지 깜깜</li>
                </ul>
              </div>
              <div className="cmp good">
                <div className="ch">{I.check({width:15,height:15})} 픽스업 스튜디오</div>
                <ul>
                  <li><span className="m">{I.check({width:15,height:15,style:{color:"var(--good)"}})}</span> 전담 한국인 담당자 고정</li>
                  <li><span className="m">{I.check({width:15,height:15,style:{color:"var(--good)"}})}</span> 사람이 직접 응대</li>
                  <li><span className="m">{I.check({width:15,height:15,style:{color:"var(--good)"}})}</span> 매달 솔직한 리포트 공유</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Audit Report ───────────────────────────────────────────── */
const RITEMS = [
  {led:"var(--good)", n:"네이버", rows:[["플레이스 등록","정상"],["최근 리뷰","12건"]]},
  {led:"var(--warn)", n:"인스타그램", rows:[["최근 게시물","2개월 전"],["프로필 정보","미흡"]]},
  {led:"var(--urgent)", n:"카카오톡", rows:[["채널 개설","없음"],["재방문 유도","없음"]]},
];
const RSTEPS = [
  {t:"인스타그램 주 2회 콘텐츠 복구", s:"메뉴·분위기 중심으로 \u2018살아있는 계정\u2019으로."},
  {t:"카카오 채널 개설 + 첫 쿠폰 발송", s:"첫 방문 손님을 단골로 연결하는 고리 만들기."},
  {t:"네이버 리뷰 응대 루틴 세팅", s:"진짜 리뷰에 정성껏 답하기 — 조작 없이."},
];

function Report(){
  return (
    <section id="report" className="sec-alt">
      <div className="wrap">
        <div className="sec-head center rv">
          <p className="kicker">진단부터 · Diagnose first</p>
          <h2 className="h-sec">실행 전에, 솔직한 진단부터.</h2>
          <p className="lead">광고비를 늘리기 전에 우리 가게의 온라인 상태를 <b>신호등으로 한눈에</b> 보여드립니다. 좋은 건 좋다고, 시급한 건 시급하다고 — 있는 그대로.</p>
        </div>
        <div className="report rv">
          <div className="rcover">
            <div>
              <div className="rk">온라인 presence 진단 리포트 · 샘플</div>
              <h3>○○ 에스테틱 · 강남점</h3>
              <p className="rs">네이버 · 인스타그램 · 카카오톡 통합 점검 결과</p>
            </div>
            <div className="rscore">
              <div className="num">58<span className="den">/100</span></div>
              <div className="lb">개선 여지 큼</div>
            </div>
          </div>
          <div className="rbody">
            <div className="rcards">
              {RITEMS.map((r,i)=>(
                <div className="ritem" key={i}>
                  <div className="rih"><span className="led" style={{background:r.led}}></span><span className="rin">{r.n}</span></div>
                  {r.rows.map((row,j)=>(
                    <div className="rl" key={j}><span>{row[0]}</span><span className="st">{row[1]}</span></div>
                  ))}
                </div>
              ))}
            </div>
            <div className="rplan">
              <h4>이번 달 실행 플랜</h4>
              {RSTEPS.map((s,i)=>(
                <div className="rstep" key={i}>
                  <span className="sn">{i+1}</span>
                  <div className="stx">{s.t}<span>{s.s}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="center" style={{marginTop:"calc(28px * var(--sp))"}}>
          <a className="btn btn-primary btn-lg rv" href="#contact">내 가게 무료로 진단받기 <span className="ar">→</span></a>
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ────────────────────────────────────────────────── */
const PLANS = [
  {n:"진단", d:"먼저 상태부터 정확히 파악하고 싶다면.", w:"₩99,000", per:"1회", one:"단발 진단", feat:false,
   items:["3채널 온라인 정밀 진단","신호등 리포트 + 실행 플랜","담당자 1:1 설명 (30분)","진행 시 진단비 환급"]},
  {n:"기본", d:"핵심 채널을 안정적으로 운영하고 싶다면.", w:"₩350,000", per:"월", one:"가장 가벼운 시작", feat:false,
   items:["네이버 플레이스 관리","인스타그램 주 2회 운영","월간 리포트","카카오톡 상담 응대"]},
  {n:"성장", d:"검색·콘텐츠·재방문을 본격적으로.", w:"₩650,000", per:"월", one:"가장 인기", feat:true,
   items:["기본 플랜 전체 포함","인스타 주 3~4회 + 릴스","카카오 채널 + 쿠폰 운영","네이버 리뷰 관리","월 2회 전략 미팅"]},
  {n:"프리미엄", d:"여러 매장·브랜드를 통합 관리.", w:"₩1,200,000~", per:"월", one:"맞춤 견적", feat:false,
   items:["성장 플랜 전체 포함","멀티 매장 통합 운영","촬영·디자인 제작 지원","우선 응대 + 전담 매니저","맞춤 캠페인 설계"]},
];

function Pricing(){
  return (
    <section id="pricing">
      <div className="wrap">
        <div className="sec-head center rv">
          <p className="kicker">요금제 · Pricing</p>
          <h2 className="h-sec">진단으로 시작해서,<br/>필요한 만큼만.</h2>
          <p className="lead">묶음 약정도, 숨은 비용도 없습니다. <b>진단부터 가볍게 시작</b>하고 가게에 맞게 키우세요.</p>
        </div>
        <div className="pricing">
          {PLANS.map((p,i)=>(
            <div className={"plan rv"+(p.feat?" feat":"")} key={i} style={{transitionDelay:(i*60)+"ms"}}>
              {p.feat && <span className="pop">가장 인기</span>}
              <div className="pn jua">{p.n}</div>
              <p className="pd">{p.d}</p>
              <div className="pr"><span className="w">{p.w}</span><span className="per">/ {p.per}</span></div>
              <div className="pone">{p.one}</div>
              <ul>
                {p.items.map((it,j)=>(
                  <li key={j}><span className="m">{I.check({width:15,height:15})}</span>{it}</li>
                ))}
              </ul>
              <a className={"btn "+(p.feat?"btn-primary":"btn-secondary")} href="#contact">{p.n==="진단"?"진단 신청":"상담 신청"}</a>
            </div>
          ))}
        </div>
        <p className="price-note rv">// 모든 금액은 VAT 별도 · 약정 없음 · 진단 후 진행 시 진단비 100% 환급</p>
      </div>
    </section>
  );
}

/* ── Honesty ────────────────────────────────────────────────── */
const DONTS = [
  {b:"가짜 리뷰를 쓰지 않습니다", s:"조작된 후기는 신뢰를 무너뜨리고, 결국 손님을 잃게 합니다."},
  {b:"보장 문구로 속이지 않습니다", s:"\u20181위 보장\u2019 같은 과장 대신, 가능한 것과 어려운 것을 솔직히 말합니다."},
  {b:"묶음 약정으로 가두지 않습니다", s:"효과가 없으면 떠날 수 있어야 합니다. 그래서 약정이 없어요."},
  {b:"깜깜이로 일하지 않습니다", s:"무슨 작업을 왜 했는지, 매달 리포트로 투명하게 공유합니다."},
];

function Honesty(){
  return (
    <section id="honesty" className="sec-alt">
      <div className="wrap">
        <div className="honesty rv">
          <div className="glow2"></div>
          <div className="hin">
            <span className="hk">{I.spark({width:13,height:13,style:{verticalAlign:"-2px",marginRight:"6px"}})}우리의 원칙</span>
            <h2>신뢰는, 하지 않는 것에서 시작됩니다.</h2>
            <p className="hsub">마케팅은 결국 신뢰입니다. 그래서 픽스업이 <b style={{color:"#FBF8F2"}}>절대 하지 않는 네 가지</b>를 먼저 약속합니다.</p>
            <div className="dont-list">
              {DONTS.map((d,i)=>(
                <div className="dont" key={i}>
                  <span className="x">{I.x({width:15,height:15})}</span>
                  <div><b>{d.b}</b><span>{d.s}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ────────────────────────────────────────────────────── */
const FAQS = [
  {q:"광고대행사랑 뭐가 다른가요?", a:"광고비를 태우는 곳이 아니라, 먼저 진단하고 직접 실행하는 파트너입니다. 한국인 담당자가 가게마다 고정으로 붙어 카카오톡으로 직접 소통하고, 매달 솔직한 리포트를 드립니다."},
  {q:"정말 가짜 리뷰는 안 만드나요?", a:"네. 조작 리뷰는 단기적으로도 위험하고 신뢰를 무너뜨립니다. 저희는 진짜 손님의 후기를 잘 받고 정성껏 응대하는 방식만 사용합니다."},
  {q:"우리 같은 작은 가게도 가능한가요?", a:"카페, 음식점, 미용실, 피부과 등 동네 단위 매장을 위해 만든 서비스입니다. 비전문가도 30초면 이해할 수 있게 모든 과정을 쉽게 설명해 드려요."},
  {q:"진단은 정말 무료인가요?", a:"네, 3채널 기본 진단과 신호등 리포트, 담당자 설명까지 무료입니다. 더 깊은 정밀 진단(₩99,000)은 이후 정식 진행 시 100% 환급됩니다."},
  {q:"약정이 있나요?", a:"없습니다. 효과가 없다면 언제든 멈출 수 있어야 한다고 믿습니다. 묶음 약정이나 위약금 없이 월 단위로 운영합니다."},
];

function FAQ(){
  const [open,setOpen]=React.useState(0);
  return (
    <section id="faq">
      <div className="wrap">
        <div className="sec-head center rv">
          <p className="kicker">자주 묻는 질문 · FAQ</p>
          <h2 className="h-sec">궁금한 걸 먼저 풀어드릴게요.</h2>
        </div>
        <div className="faq rv">
          {FAQS.map((f,i)=>(
            <div className="qa" data-open={open===i?"1":"0"} key={i}>
              <button onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i}>
                <span className="q">{f.q}</span>
                <span className="ic">{I.plus({width:15,height:15})}</span>
              </button>
              <div className="a"><div className="a-in">{f.a}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA + Form ───────────────────────────────────────── */
const BIZ = ["피부과·에스테틱","카페·디저트","음식점","미용실·헤어","기타"];

function FinalCTA({onToast}){
  const [sent,setSent]=React.useState(false);
  const [biz,setBiz]=React.useState("피부과·에스테틱");
  const [form,setForm]=React.useState({name:"",phone:"",msg:""});
  const [err,setErr]=React.useState({});
  const upd=(k)=>(e)=>setForm(f=>({...f,[k]:e.target.value}));

  const submit=(e)=>{
    e.preventDefault();
    const er={};
    if(!form.name.trim()) er.name=1;
    if(!/^[0-9\-\s]{8,}$/.test(form.phone.trim())) er.phone=1;
    setErr(er);
    if(Object.keys(er).length){ onToast && onToast("입력을 확인해 주세요"); return; }
    setSent(true);
  };

  return (
    <section id="contact" className="final sec-alt">
      <div className="glow"></div>
      <div className="wrap">
        <div className="final-grid">
          <div className="rv">
            <p className="kicker">무료 진단 신청</p>
            <h2>오늘, 우리 가게<br/><span className="hl">온라인 점수</span>부터<br/>확인해 보세요.</h2>
            <p>3채널 진단 + 신호등 리포트 + 담당자 1:1 설명까지 <b>무료</b>. 약정도, 부담도 없습니다.</p>
            <div className="ways">
              <div className="way"><span className="wi">{I.chat({width:19,height:19})}</span><div><b>카카오톡 채널</b><span>@fixupstudio</span></div></div>
              <div className="way"><span className="wi">{I.phone({width:18,height:18})}</span><div><b>02-1234-5678</b><span>평일 10:00–19:00</span></div></div>
              <div className="way"><span className="wi">{I.mail({width:18,height:18})}</span><div><b>hello@fixup.studio</b><span>24시간 접수</span></div></div>
            </div>
          </div>

          <div className="form-card rv">
            {sent ? (
              <div className="form-success">
                <span className="ck">{I.check({width:30,height:30})}</span>
                <h4>신청이 접수됐어요!</h4>
                <p>담당자가 1영업일 안에 카카오톡 또는 전화로 연락드릴게요. 감사합니다 🙏</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="ft jua">무료 진단 신청하기</div>
                <p className="fsub">1분이면 충분해요. 진단 결과는 무료로 보내드립니다.</p>
                <div className={"field"+(err.name?" err":"")}>
                  <label>사장님 성함 <span className="rq">*</span></label>
                  <input value={form.name} onChange={upd("name")} placeholder="홍길동" />
                  <div className="em">성함을 입력해 주세요.</div>
                </div>
                <div className={"field"+(err.phone?" err":"")}>
                  <label>연락처 <span className="rq">*</span></label>
                  <input value={form.phone} onChange={upd("phone")} placeholder="010-1234-5678" inputMode="tel" />
                  <div className="em">올바른 연락처를 입력해 주세요.</div>
                </div>
                <div className="field">
                  <label>업종</label>
                  <div className="chips-in">
                    {BIZ.map(b=>(
                      <button type="button" key={b} className="chip-r" data-on={biz===b?"1":"0"} onClick={()=>setBiz(b)}>{b}</button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>가게 주소 또는 네이버 플레이스 (선택)</label>
                  <textarea value={form.msg} onChange={upd("msg")} placeholder="가게 이름·지역만 적어주셔도 됩니다."></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">무료 진단 받기 <span className="ar">→</span></button>
                <p className="form-fine">신청 시 개인정보는 진단·상담 목적에만 사용되며, 광고 수신과 무관합니다.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────────── */
function Footer(){
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <a className="brand" href="#top">
              <Logo size={34}/>
              <span className="bt"><b>픽스업 스튜디오</b><span>Fixup&nbsp;Studio</span></span>
            </a>
            <p className="fb">동네 가게를 위한 정직한 디지털 마케팅. 네이버·인스타그램·카카오톡을 하나로 연결해, 검색되고 기억되고 다시 찾는 가게를 만듭니다.</p>
          </div>
          <div>
            <h5>서비스</h5>
            <ul>
              <li><a href="#how">작동 방식</a></li>
              <li><a href="#report">진단 리포트</a></li>
              <li><a href="#pricing">요금제</a></li>
              <li><a href="#faq">자주 묻는 질문</a></li>
            </ul>
          </div>
          <div>
            <h5>문의</h5>
            <ul>
              <li><a href="#contact">무료 진단 신청</a></li>
              <li><a href="tel:0212345678">02-1234-5678</a></li>
              <li><a href="#contact">카카오톡 @fixupstudio</a></li>
              <li><a href="mailto:hello@fixup.studio">hello@fixup.studio</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bot">
          <span className="cp">© 2026 Fixup Studio · 픽스업 스튜디오. 정직한 마케팅.</span>
          <div className="pl">
            <a href="#how" aria-label="네이버">{I.pin({width:17,height:17})}</a>
            <a href="#how" aria-label="인스타그램">{I.insta({width:17,height:17})}</a>
            <a href="#contact" aria-label="카카오톡">{I.chat({width:17,height:17})}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Differentiator, Report, Pricing, Honesty, FAQ, FinalCTA, Footer });
