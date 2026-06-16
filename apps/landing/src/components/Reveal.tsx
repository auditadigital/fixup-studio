"use client";
import * as React from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    document.documentElement.classList.add("js");
    const el = ref.current;
    if (!el) return;
    const reveal = () => el.classList.add("in");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal();
            io.unobserve(el);
          }
        });
      },
      // Trigger slightly before fully in view, but never exclude the bottom edge
      // (a negative bottom margin can leave page-bottom content — e.g. the lead
      // form — permanently hidden if it never crosses the threshold).
      { rootMargin: "0px 0px 0px 0px", threshold: 0.05 }
    );
    io.observe(el);
    // Safety net (handoff parity: "reveal-all after 1.8s"): guarantee content is
    // never left hidden if IntersectionObserver misses it (fast scroll, page bottom).
    const safety = window.setTimeout(reveal, 1800);
    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`rv ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
