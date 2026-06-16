import * as React from "react";
import { Reveal } from "@/components/Reveal";
import { REPORT, RITEMS, RSTEPS, HEADS } from "@/lib/content";
import { Button } from "@fixup/ui";

export function AuditReport() {
  const head = HEADS.report;
  const title = head.title;
  const lead = head.lead;

  return (
    <section id="report" className="sec-alt">
      <div className="wrap">
        <Reveal className="sec-head center">
          <p className="kicker">{head.kicker}</p>
          <h2 className="h-sec">
            {title.split("\n").map((t, i, a) => (
              <React.Fragment key={i}>
                {t}
                {i < a.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <p className="lead">
            {lead.before}
            {lead.bold ? <b>{lead.bold}</b> : null}
            {lead.after}
          </p>
        </Reveal>

        <Reveal className="report">
          <div className="rcover">
            <div>
              <div className="rk">{REPORT.kicker}</div>
              <h3>{REPORT.title}</h3>
              <p className="rs">{REPORT.subtitle}</p>
            </div>
            <div className="rscore">
              <div className="num">
                {REPORT.score}
                <span className="den">{REPORT.scoreDen}</span>
              </div>
              <div className="lb">{REPORT.scoreLabel}</div>
            </div>
          </div>

          <div className="rbody">
            <div className="rcards">
              {RITEMS.map((r, i) => (
                <div className="ritem" key={i}>
                  <div className="rih">
                    <span className="led" style={{ background: r.led }}></span>
                    <span className="rin">{r.name}</span>
                  </div>
                  {r.rows.map((row, j) => (
                    <div className="rl" key={j}>
                      <span>{row[0]}</span>
                      <span className="st">{row[1]}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="rplan">
              <h4>{REPORT.planTitle}</h4>
              {RSTEPS.map((s, i) => (
                <div className="rstep" key={i}>
                  <span className="sn">{i + 1}</span>
                  <div className="stx">
                    {s.t}
                    <span>{s.s}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="center" delay={0}>
          <div style={{ marginTop: 28 }}>
            <Button variant="primary" size="lg" href="#contact">
              {REPORT.cta} <span className="ar">→</span>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
