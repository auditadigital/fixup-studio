import { Logo } from "@/components/Logo";
import { Button } from "@fixup/ui";
import { site } from "@/lib/site";
import { HERO } from "@/lib/content";

export default function Header() {
  return (
    <header className="hdr">
      <div className="hdr-in">
        <a className="brand" href="#top" aria-label="Fixup Studio 홈">
          <Logo size={34} />
          <span className="bt">
            <b>{site.brand.ko}</b>
            <span>Fixup&nbsp;Studio</span>
          </span>
        </a>
        <nav className="hdr-nav">
          {site.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hdr-cta">
          <Button variant="primary" href="#contact">
            {HERO.ctaPrimary}
          </Button>
        </div>
      </div>
    </header>
  );
}
