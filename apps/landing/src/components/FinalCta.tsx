import * as React from "react";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/icons";
import { LeadForm } from "@/components/LeadForm";
import { HEADS } from "@/lib/content";
import { site } from "@/lib/site";

const { kicker, title, titleHl, lead, leadBold } = HEADS.finalCta;

/** Render the title string, splitting on \n into lines and highlighting titleHl in the matching line. */
function Title() {
  const lines = title.split("\n");
  return (
    <h2>
      {lines.map((line, i) => {
        const idx = line.indexOf(titleHl);
        const node =
          idx >= 0 ? (
            <>
              {line.slice(0, idx)}
              <span className="hl">{titleHl}</span>
              {line.slice(idx + titleHl.length)}
            </>
          ) : (
            line
          );
        return (
          <React.Fragment key={i}>
            {node}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </h2>
  );
}

/** Render the lead string, bolding the leadBold substring. */
function Lead() {
  const idx = lead.indexOf(leadBold);
  if (idx < 0) return <p>{lead}</p>;
  return (
    <p>
      {lead.slice(0, idx)}
      <b>{leadBold}</b>
      {lead.slice(idx + leadBold.length)}
    </p>
  );
}

export function FinalCta() {
  return (
    <section id="contact" className="final sec-alt">
      <div className="glow"></div>
      <div className="wrap">
        <div className="final-grid">
          {/* Left column */}
          <Reveal>
            <p className="kicker">{kicker}</p>
            <Title />
            <Lead />

            <div className="ways">
              <a
                href={site.contact.kakaoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="way"
              >
                <span className="wi">{Icon.chat({ width: 19, height: 19 })}</span>
                <div>
                  <b>카카오톡 채널</b>
                  <span>{site.contact.kakaoHandle}</span>
                </div>
              </a>

              <a href={site.contact.phoneTel} className="way">
                <span className="wi">{Icon.phone({ width: 18, height: 18 })}</span>
                <div>
                  <b>{site.contact.phone}</b>
                  <span>{site.contact.hours}</span>
                </div>
              </a>

              <a
                href={`mailto:${site.contact.email}`}
                className="way"
              >
                <span className="wi">{Icon.mail({ width: 18, height: 18 })}</span>
                <div>
                  <b>{site.contact.email}</b>
                  <span>24시간 접수</span>
                </div>
              </a>
            </div>
          </Reveal>

          {/* Right column — LeadForm renders its own .form-card wrapper */}
          <Reveal>
            <LeadForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
