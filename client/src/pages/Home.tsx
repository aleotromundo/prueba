import { ArrowRight, BookOpenText, Compass, HeartHandshake, MoonStar, Orbit, Sparkles, SunMedium } from "lucide-react";
import { Link } from "wouter";
import { SiteHeader } from "@/components/SiteHeader";

const tools = [
  { icon: Orbit, title: "Carta natal", text: "Planetas, ascendente, casas y aspectos en una sola lectura.", href: "/carta-natal", tag: "Esencial" },
  { icon: HeartHandshake, title: "Sinastría", text: "Dos cartas, sus aspectos y una lectura relacional clara.", href: "/sinastria", tag: "Vínculos" },
  { icon: Compass, title: "Tránsitos", text: "El cielo actual en diálogo con tu carta de nacimiento.", href: "/transitos", tag: "Ahora" },
  { icon: SunMedium, title: "Retorno solar", text: "El instante exacto en que el Sol regresa a su posición natal.", href: "/retorno-solar", tag: "Ciclos" },
  { icon: MoonStar, title: "Ascendente y dominantes", text: "Una lectura directa de tu horizonte y énfasis planetarios.", href: "/ascendente", tag: "Esencia" },
];

export default function Home() {
  return (
    <div className="app-shell home-page">
      <SiteHeader />
      <main>
        <section className="hero container">
          <div className="hero__copy">
            <span className="eyebrow"><Sparkles size={14} /> Astrología, a tu ritmo</span>
            <h1>Un mapa del cielo.<br /><em>Una nueva forma</em> de habitarlo.</h1>
            <p>AstroNexo convierte tu momento de nacimiento en una carta clara, visual y personal. Sin anuncios, sin ruido y en español.</p>
            <div className="hero__actions">
              <Link href="/carta-natal" className="button button--primary">Crear mi carta <ArrowRight size={17} /></Link>
              <Link href="/guia" className="button button--ghost">Explorar la guía</Link>
            </div>
            <div className="hero__details"><span><i /> Cálculos por coordenadas</span><span><i /> Privacidad primero</span><span><i /> Sin publicidad</span></div>
          </div>
          <div className="hero-orbit" aria-label="Ilustración cósmica abstracta">
            <div className="orbit orbit--one" /><div className="orbit orbit--two" /><div className="orbit orbit--three" />
            <div className="orbit-planet orbit-planet--one" /><div className="orbit-planet orbit-planet--two" /><div className="orbit-planet orbit-planet--three" />
            <div className="hero-sun"><span>☉</span></div>
            <div className="hero-constellation">✦</div>
          </div>
        </section>
        <section className="tools-section container">
          <div className="section-heading"><div><span className="eyebrow">Herramientas</span><h2>Todo lo esencial,<br />en un solo lugar.</h2></div><p>Explora tus ciclos, vínculos y símbolos con herramientas diseñadas para una lectura pausada.</p></div>
          <div className="tool-grid">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return <Link href={tool.href} className={`tool-card tool-card--${index + 1}`} key={tool.title}>
                <div className="tool-card__top"><span className="tool-icon"><Icon size={21} /></span><span>{tool.tag}</span></div>
                <div><h3>{tool.title}</h3><p>{tool.text}</p></div><span className="tool-card__link">Abrir <ArrowRight size={15} /></span>
              </Link>;
            })}
          </div>
        </section>
        <section className="manifesto container">
          <div className="manifesto__mark">✦</div>
          <div><span className="eyebrow">La intención</span><h2>Claridad antes que exceso.</h2><p>Una carta natal no es una sentencia: es un lenguaje de símbolos. Diseñamos AstroNexo para que puedas consultarlo con curiosidad, criterio y tiempo propio.</p></div>
          <Link href="/guia" className="button button--outline">Ir a la biblioteca <BookOpenText size={17} /></Link>
        </section>
      </main>
      <footer className="footer container"><span>© 2026 AstroNexo</span><span>Una plataforma sin publicidad.</span><Link href="/guia">Guía astrológica</Link></footer>
    </div>
  );
}
