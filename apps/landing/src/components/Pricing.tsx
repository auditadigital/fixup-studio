import * as React from "react";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { Button } from "@fixup/ui";
import { PLANS, PRICE_NOTE, HEADS } from "@/lib/content";

export function Pricing() {
  const head = HEADS.pricing;
  const lead = head.lead;

  return (
    <section id="pricing">
      <div className="wrap">
        <Reveal className="sec-head center">
          <p className="kicker">{head.kicker}</p>
          <h2 className="h-sec">
            {head.title.split("\n").map((t, i, a) => (
              <React.Fragment key={i}>
                {t}
                {i < a.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <p className="lead">
            {lead.before}
            <b>{lead.bold}</b>
            {lead.after}
          </p>
        </Reveal>

        <div className="pricing">
          {PLANS.map((p, i) => (
            <Reveal className={"plan" + (p.feat ? " feat" : "")} delay={i * 60} key={i}>
              {p.feat && <span className="pop">가장 인기</span>}
              <div className="pn jua">{p.n}</div>
              <p className="pd">{p.d}</p>
              <div className="pr">
                <span className="w">{p.w}</span>
                <span className="per">/ {p.per}</span>
              </div>
              <div className="pone">{p.one}</div>
              <ul>
                {p.items.map((it, j) => (
                  <li key={j}>
                    <span className="m">{Icon.check({ width: 15, height: 15 })}</span>
                    {it}
                  </li>
                ))}
              </ul>
              <Button variant={p.feat ? "primary" : "secondary"} href="#contact">
                {p.n === "진단" ? "진단 신청" : "상담 신청"}
              </Button>
            </Reveal>
          ))}
        </div>

        <p className="price-note rv">{PRICE_NOTE}</p>
      </div>
    </section>
  );
}
