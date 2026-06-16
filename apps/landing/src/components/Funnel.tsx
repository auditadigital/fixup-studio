import * as React from "react";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { STAGES, HEADS } from "@/lib/content";

export function Funnel() {
  const head = HEADS.funnel;
  const title = head.title;
  const note = head.note;
  const noteBold = head.noteBold;

  // Split note around the bold phrase
  const noteParts = note.split(noteBold);

  return (
    <section id="how" className="sec-alt">
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
          {/* Inline bolds verbatim from handoff — three bold words require explicit JSX */}
          <p className="lead">
            네이버에서 <b>찾고</b>, 인스타그램으로 <b>기억하고</b>, 카카오톡으로{" "}
            <b>다시 옵니다</b>. 따로 노는 채널이 아니라, 하나로 연결된 길이에요.
          </p>
        </Reveal>

        <div className="funnel" data-layout="vertical">
          {STAGES.map((s, i) => (
            <React.Fragment key={i}>
              <Reveal className="fstage" delay={i * 80}>
                <span
                  className="fic"
                  style={{
                    background: s.grad || s.color,
                    color: s.inkColor || "#fff",
                  }}
                >
                  {Icon[s.icon]({ width: 26, height: 26 })}
                </span>
                <div className="fbody">
                  <div className="fstep">{s.step}</div>
                  <div className="fname jua">
                    {s.name}
                    <span className="en">{s.role}</span>
                  </div>
                  <p className="fdesc">{s.desc}</p>
                </div>
              </Reveal>
              {i < STAGES.length - 1 && (
                <div className="fconn" aria-hidden="true">
                  {Icon.arrow({ width: 24, height: 24 })}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <Reveal className="funnel-note">
          {noteParts[0]}
          <b>{noteBold}</b>
          {noteParts[1]}
        </Reveal>
      </div>
    </section>
  );
}
