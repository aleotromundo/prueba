import { Link, useLocation } from "wouter";
import { Menu, MoonStar, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["/carta-natal", "Carta natal"],
  ["/sinastria", "Sinastría"],
  ["/transitos", "Tránsitos"],
  ["/retorno-solar", "Retorno solar"],
  ["/ascendente", "Ascendente"],
  ["/guia", "Guía"],
  ["/cielo-en-vivo", "Cielo en vivo"],
];

export function SiteHeader() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Link href="/" className="brand" onClick={close} aria-label="AstroNexo, inicio">
          <span className="brand__mark"><MoonStar size={19} /></span>
          <span>ASTRO<span>NEXO</span></span>
        </Link>
        <nav className="main-nav" aria-label="Navegación principal">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={location === href ? "nav-link nav-link--active" : "nav-link"}>
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/carta-natal" className="header-cta">Crear mi carta</Link>
        <button className="mobile-menu" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Abrir navegación">
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav container" aria-label="Navegación móvil">
          {links.map(([href, label]) => (
            <Link key={href} href={href} onClick={close} className={location === href ? "nav-link nav-link--active" : "nav-link"}>{label}</Link>
          ))}
          <Link href="/carta-natal" onClick={close} className="header-cta">Crear mi carta</Link>
        </nav>
      )}
    </header>
  );
}
