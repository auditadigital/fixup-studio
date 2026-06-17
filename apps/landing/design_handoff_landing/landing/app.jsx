// app.jsx — Fixup Studio landing app: tweaks wiring + reveal + toast.
document.documentElement.classList.add("js-rv");

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "heroVariant": "pregunta",
  "accent": ["#D85A40", "#BE4733", "#A53C2A"],
  "density": "regular",
  "funnel": "vertical"
}/*EDITMODE-END*/;

// curated, on-brand accents — each [500, 600(button), press]; all pass white text on 600
const ACCENTS = [
  ["#D85A40", "#BE4733", "#A53C2A"], // Coral (marca)
  ["#C8503A", "#A83C2C", "#8E2F22"], // Terracota
  ["#E0A52E", "#946312", "#7A5210"], // Ámbar miel
  ["#5B9E73", "#3F7D5A", "#356B4C"], // Verde salvia
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [toast, setToast] = React.useState(null);
  const toastRef = React.useRef(null);

  // apply theme / density / accent to <html> so body + everything tracks it
  React.useEffect(() => {
    const r = document.documentElement;
    r.setAttribute("data-theme", t.dark ? "dark" : "light");
    r.setAttribute("data-density", t.density);
    const a = t.accent || ACCENTS[0];
    r.style.setProperty("--accent", a[0]);
    r.style.setProperty("--accent-600", a[1]);
    r.style.setProperty("--accent-press", a[2]);
  }, [t.dark, t.density, t.accent]);

  // reveal-on-scroll — rect-based (IntersectionObserver is unreliable in some
  // embedded preview frames); guaranteed safety reveal so content never sticks hidden
  React.useEffect(() => {
    const reveal = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      document.querySelectorAll(".rv:not(.in)").forEach((el) => {
        if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add("in");
      });
    };
    reveal();
    const onScroll = () => reveal();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const safety = setTimeout(() => {
      document.querySelectorAll(".rv:not(.in)").forEach((el) => el.classList.add("in"));
    }, 1800);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(safety);
    };
  }, []);

  const showToast = React.useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 1600);
  }, []);

  return (
    <div className="site">
      <Header />
      <Hero variant={t.heroVariant} />
      <Problem />
      <Funnel layout={t.funnel} />
      <Differentiator />
      <Report />
      <Pricing />
      <Honesty />
      <FAQ />
      <FinalCTA onToast={showToast} />
      <Footer />

      <div className={"toast" + (toast ? " show" : "")}>{toast}</div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Tema" />
        <TweakToggle label="다크 모드 (Dark)" value={t.dark} onChange={(v) => setTweak("dark", v)} />
        <TweakColor label="Acento" value={t.accent}
                    options={ACCENTS}
                    onChange={(v) => setTweak("accent", v)} />

        <TweakSection label="Hero" />
        <TweakRadio label="Copy del hero" value={t.heroVariant}
                    options={[
                      { value: "pregunta", label: "질문형" },
                      { value: "directo", label: "직설형" },
                      { value: "beneficio", label: "혜택형" },
                    ]}
                    onChange={(v) => setTweak("heroVariant", v)} />

        <TweakSection label="Layout" />
        <TweakRadio label="Densidad" value={t.density}
                    options={[
                      { value: "compact", label: "좁게" },
                      { value: "regular", label: "보통" },
                      { value: "comfy", label: "넓게" },
                    ]}
                    onChange={(v) => setTweak("density", v)} />
        <TweakRadio label="Embudo" value={t.funnel}
                    options={[
                      { value: "vertical", label: "세로" },
                      { value: "horizontal", label: "가로" },
                    ]}
                    onChange={(v) => setTweak("funnel", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
