import * as React from "react";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { PROBS, HEADS } from "@/lib/content";

export function Problem() {
  const head = HEADS.problem;
  const title = head.title;
  const lead = head.lead;

  return (
    <section id="problem">
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

        <div className="prob-grid">
          {PROBS.map((x, i) => (
            <Reveal className="prob" delay={i * 70} key={i}>
              <span className="pic">{Icon[x.icon]({ width: 22, height: 22 })}</span>
              <h3>{x.h}</h3>
              <p>{x.p}</p>
              <div className="q mono">{x.q}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
