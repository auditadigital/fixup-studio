import { Button } from "@fixup/ui";
import { Icon } from "@/components/icons";
import { Placeholder } from "@/components/Placeholder";
import { HERO } from "@/lib/content";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="glow" />
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              {Icon.spark({ width: 13, height: 13 })} {HERO.eyebrow}
            </span>
            <h1>
              {HERO.h1.line1}
              <br />
              {HERO.h1.line2Before}
              <span className="hl">{HERO.h1.line2Hl}</span>
              <br />
              {HERO.h1.line3}
            </h1>
            <p className="sub">
              {HERO.sub.before}
              <b>{HERO.sub.bold}</b>
              {HERO.sub.after}
            </p>
            <div className="cta-row">
              <Button variant="primary" size="lg" href="#contact">
                {HERO.ctaPrimary} <span className="ar">→</span>
              </Button>
              <Button
                variant="kakao"
                href={site.contact.kakaoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {Icon.chat({ className: "btn-icn" })} {HERO.ctaKakao}
              </Button>
              <Button variant="secondary" href={site.contact.phoneTel}>
                {Icon.phone({ className: "btn-icn" })} {HERO.ctaPhone}
              </Button>
            </div>
            <div className="trust">
              {HERO.trust.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="hero-vis">
            <Placeholder
              label={HERO.hero_photo.label}
              brief={HERO.hero_photo.brief}
              aspect="4/5"
              src="/images/hero-owner.jpg"
              priority
              sizes="(max-width: 960px) 90vw, 460px"
            />
            <div className="float f-naver">
              <span className="fi" style={{ background: "var(--naver)" }}>
                {Icon.pin({ width: 18, height: 18 })}
              </span>
              <span className="fx">
                <b>{HERO.floats.naver.title}</b>
                <span>{HERO.floats.naver.sub}</span>
              </span>
            </div>
            <div className="float f-score">
              <span className="lbl">{HERO.floats.score.label}</span>
              <span className="big">{HERO.floats.score.big}</span>
            </div>
            <div className="float f-kakao">
              <span
                className="fi"
                style={{ background: "var(--kakao)", color: "var(--kakao-ink)" }}
              >
                {Icon.chat({ width: 18, height: 18 })}
              </span>
              <span className="fx">
                <b>{HERO.floats.kakao.title}</b>
                <span>{HERO.floats.kakao.sub}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="logos">
          <div className="ll">{HERO.logosLabel}</div>
          <div className="row">
            {HERO.logos.map(({ emoji, label }) => (
              <span className="chip" key={label}>
                <span className="e">{emoji}</span> {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
