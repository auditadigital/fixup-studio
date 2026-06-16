import * as React from "react";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { DONTS, HEADS } from "@/lib/content";

export function Honesty() {
  const head = HEADS.honesty;
  const lead = head.lead;

  return (
    <section id="honesty" className="sec-alt">
      <div className="wrap">
        <Reveal className="honesty">
          <div className="glow2"></div>
          <div className="hin">
            <span className="hk">
              {Icon.spark({ width: 13, height: 13, style: { verticalAlign: "-2px", marginRight: "6px" } })}
              {head.kicker}
            </span>
            <h2>
              {head.title.split("\n").map((t, i, a) => (
                <React.Fragment key={i}>
                  {t}
                  {i < a.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
            <p className="hsub">
              {lead.before}
              <b style={{ color: "#FBF8F2" }}>{lead.bold}</b>
              {lead.after}
            </p>
            <div className="dont-list">
              {DONTS.map((d, i) => (
                <div className="dont" key={i}>
                  <span className="x">{Icon.x({ width: 15, height: 15 })}</span>
                  <div>
                    <b>{d.b}</b>
                    <span>{d.s}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
