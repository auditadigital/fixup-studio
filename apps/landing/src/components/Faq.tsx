"use client";
import * as React from "react";
import { Icon } from "@/components/icons";
import { FAQS, HEADS } from "@/lib/content";
import { Reveal } from "@/components/Reveal";

export function Faq() {
  const [open, setOpen] = React.useState(0);

  return (
    <section id="faq">
      <div className="wrap">
        <Reveal className="sec-head center">
          <p className="kicker">{HEADS.faq.kicker}</p>
          <h2 className="h-sec">{HEADS.faq.title}</h2>
        </Reveal>
        <Reveal className="faq">
          {FAQS.map((f, i) => (
            <div className="qa" data-open={open === i ? "1" : "0"} key={i}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
              >
                <span className="q">{f.q}</span>
                <span className="ic">{Icon.plus({ width: 15, height: 15 })}</span>
              </button>
              <div className="a">
                <div className="a-in">{f.a}</div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
