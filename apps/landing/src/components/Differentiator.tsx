import * as React from "react";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { Placeholder } from "@/components/Placeholder";
import { COMPARE, HEADS } from "@/lib/content";

export function Differentiator() {
  const head = HEADS.differentiator;
  const title = head.title;
  const lead = head.lead;

  return (
    <section id="who">
      <div className="wrap">
        <div className="diff-grid">
          <Reveal className="diff-vis">
            <Placeholder
              label="Foto · 담당자"
              brief="실제 담당자가 노트북 앞에서 사장님과 통화하는 자연스러운 장면. 정면 미소, 진짜 사람."
              aspect="1/1"
              src="/images/manager.jpg"
              sizes="(max-width: 880px) 90vw, 440px"
            />
            {/* TODO: casos reales */}
            <div className="tag">
              <span className="dot"></span>
              <b>한국인 담당자 · 직접 응대</b>
            </div>
          </Reveal>

          <Reveal className="diff">
            <p className="kicker">{head.kicker}</p>
            <h2>
              {title.split("\n").map((t, i, a) => (
                <React.Fragment key={i}>
                  {t}
                  {i < a.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
            <p>
              {lead.before}
              {lead.bold ? <b>{lead.bold}</b> : null}
              {lead.after}
            </p>

            <div className="compare">
              <div className="cmp bad">
                <div className="ch">
                  {Icon.x({ width: 15, height: 15 })} {COMPARE.bad.title}
                </div>
                <ul>
                  {COMPARE.bad.items.map((item, i) => (
                    <li key={i}>
                      <span className="m">
                        {Icon.x({ width: 15, height: 15, style: { color: "var(--ink-soft)" } })}
                      </span>{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cmp good">
                <div className="ch">
                  {Icon.check({ width: 15, height: 15 })} {COMPARE.good.title}
                </div>
                <ul>
                  {COMPARE.good.items.map((item, i) => (
                    <li key={i}>
                      <span className="m">
                        {Icon.check({ width: 15, height: 15, style: { color: "var(--good)" } })}
                      </span>{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
