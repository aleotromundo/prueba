import { useRef, useState, type ReactNode, type RefObject } from "react";
import { BookOpenText, ExternalLink, Orbit, ScrollText } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { ZODIAC } from "@/lib/astrology";
import { aspectsGuide, deepDiveGuides, housesGuide, planetaryGuides, signGuides, sourceById, sourceGuides } from "@/lib/editorial";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const tabs = ["Signos", "Planetas", "Casas", "Aspectos", "Lecturas", "Fuentes"] as const;
type Tab = typeof tabs[number];

type DetailItem = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  description: string;
  sections: { title: string; content: ReactNode }[];
  references?: readonly string[];
};

export default function Guide() {
  const [active, setActive] = useState<Tab>("Signos");
  return <ToolLayout eyebrow="Guía astrológica" title="Un vocabulario para mirar el cielo" intro="Una biblioteca original para ir más allá de las definiciones: símbolos, geometría, ciclos y criterios para leer una carta con contexto.">
    <section className="guide-shell"><aside className="guide-nav"><span className="eyebrow"><BookOpenText size={14} /> Biblioteca</span><h2>Seis capas<br />del mapa.</h2>{tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} className={active === tab ? "guide-tab guide-tab--active" : "guide-tab"}><span>{tab}</span><b>{String(tabs.indexOf(tab) + 1).padStart(2, "0")}</b></button>)}</aside><div className="guide-content">{active === "Signos" && <SignsContent />}{active === "Planetas" && <PlanetsContent />}{active === "Casas" && <HousesContent />}{active === "Aspectos" && <AspectsContent />}{active === "Lecturas" && <DeepDiveContent />}{active === "Fuentes" && <SourcesContent />}</div></section>
  </ToolLayout>;
}

function DetailDialog({ item, onClose, returnFocusRef }: { item: DetailItem | null; onClose: () => void; returnFocusRef: RefObject<HTMLElement | null> }) {
  return <Dialog open={Boolean(item)} onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent className="guide-detail-dialog" onCloseAutoFocus={(event) => { event.preventDefault(); returnFocusRef.current?.focus(); }}>
      {item && <>
        <DialogHeader>
          <span className="eyebrow">{item.eyebrow}</span>
          <DialogTitle>{item.title}</DialogTitle>
          {item.subtitle && <DialogDescription>{item.subtitle}</DialogDescription>}
        </DialogHeader>
        <div className="guide-detail-dialog__body">
          <p className="guide-detail-dialog__lead">{item.description}</p>
          <div className="guide-detail-sections">{item.sections.map((section) => <section key={section.title}><h3>{section.title}</h3><div>{section.content}</div></section>)}</div>
          {item.references && item.references.length > 0 && <div className="guide-detail-sources"><span className="eyebrow">Contexto y método</span><SourceLinks ids={item.references} /></div>}
          <p className="guide-detail-dialog__disclaimer">Las características interpretativas pertenecen a tradiciones astrológicas y se ofrecen como lenguaje simbólico. Las referencias técnicas describen astronomía, historia o método; no prueban causalidad entre posiciones celestes y personalidad.</p>
        </div>
      </>}
    </DialogContent>
  </Dialog>;
}

function SourceLinks({ ids }: { ids: readonly string[] }) {
  return <div className="guide-source-links">{ids.map((id) => { const source = sourceById[id]; return source ? <a key={source.id} href={source.href} target="_blank" rel="noreferrer">{source.title} <ExternalLink size={12} /></a> : null; })}</div>;
}

function List({ items }: { items: readonly string[] }) { return <ul className="guide-detail-list">{items.map((item) => <li key={item}>{item}</li>)}</ul>; }

function useDetailSelection<T>() {
  const [selected, setSelected] = useState<T | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const open = (item: T, trigger: HTMLElement) => { triggerRef.current = trigger; setSelected(item); };
  const close = () => setSelected(null);
  return { selected, triggerRef, open, close };
}

function ZodiacGlyph({ symbol, element }: { symbol: string; element: string }) {
  return <span className={`zodiac-glyph zodiac-glyph--${element.toLowerCase()}`} aria-hidden="true"><span>{symbol}</span></span>;
}

function SignsContent() {
  const { selected, triggerRef, open, close } = useDetailSelection<typeof signGuides[number]>();
  const detail = selected && {
    eyebrow: `${selected.element} · ${selected.modality} · ${selected.polarity}`,
    title: `${selected.name}: ${selected.keyword}`,
    subtitle: `${selected.archetype} · Regencia tradicional: ${selected.rulerTraditional}`,
    description: selected.description,
    sections: [
      { title: "Coordenadas del signo", content: <div className="guide-detail-facts"><span><b>Elemento</b>{selected.element}</span><span><b>Modalidad</b>{selected.modality}</span><span><b>Polaridad</b>{selected.polarity}</span><span><b>Regencia</b>{selected.rulerTraditional}{selected.rulerModern !== selected.rulerTraditional ? ` · ${selected.rulerModern} en la tradición moderna` : ""}</span><span><b>Momento simbólico</b>{selected.season}</span></div> },
      { title: "Recursos que puede desarrollar", content: <List items={selected.strengths} /> },
      { title: "Tensiones que conviene observar", content: <List items={selected.tensions} /> },
      { title: "Preguntas de integración", content: <List items={selected.questions} /> },
    ],
    references: ["history", "nasa"],
  } satisfies DetailItem;
  return <><div className="guide-content__heading"><span className="eyebrow">Los doce signos</span><h2>Doce cualidades de expresión</h2><p>Un signo no agota a una persona. En una carta, describe el estilo que adopta un planeta o un punto determinado. <strong>Abre cualquier tarjeta</strong> para explorar su arquitectura simbólica.</p></div><div className="sign-grid">{signGuides.map((sign, index) => <button type="button" className="sign-card guide-card-button" key={sign.name} onClick={(event) => open(sign, event.currentTarget)} aria-label={`Abrir detalle de ${sign.name}`}><ZodiacGlyph symbol={ZODIAC[index]?.symbol ?? sign.name.slice(0, 1)} element={sign.element} /><small>{sign.element} · {sign.modality}</small><h3>{sign.name}</h3><strong>{sign.keyword}</strong><p>{sign.description}</p><em>Ver ficha completa →</em></button>)}</div><DetailDialog item={detail ?? null} onClose={close} returnFocusRef={triggerRef} /></>;
}

function PlanetsContent() {
  const { selected, triggerRef, open, close } = useDetailSelection<typeof planetaryGuides[number]>();
  const detail = selected && { eyebrow: `Planeta · ${selected.symbol}`, title: selected.name, subtitle: selected.cycle, description: selected.description, sections: [{ title: "Campos de experiencia", content: <p>{selected.domains}</p> }, { title: "Expresión constructiva", content: <p>{selected.constructive}</p> }, { title: "Sombra o exceso", content: <p>{selected.shadow}</p> }, { title: "Preguntas de integración", content: <List items={selected.questions} /> }], references: selected.references } satisfies DetailItem;
  return <><div className="guide-content__heading"><span className="eyebrow">Planetas</span><h2>Funciones que se mueven</h2><p>En astrología, los planetas representan funciones psicológicas y ritmos de experiencia dentro del mapa. <strong>Abre una ficha</strong> para distinguir potencial, tensión y preguntas.</p></div><div className="planet-guide">{planetaryGuides.map((planet) => <button type="button" className="planet-guide__card guide-card-button" key={planet.name} onClick={(event) => open(planet, event.currentTarget)} aria-label={`Abrir detalle de ${planet.name}`}><span>{planet.symbol}</span><div><h3>{planet.name}</h3><p>{planet.description}</p><em>Explorar función →</em></div></button>)}</div><DetailDialog item={detail ?? null} onClose={close} returnFocusRef={triggerRef} /></>;
}

function HousesContent() {
  const { selected, triggerRef, open, close } = useDetailSelection<typeof housesGuide[number]>();
  const detail = selected && { eyebrow: `Casa ${selected.number} · ${selected.axis}`, title: selected.topic, subtitle: selected.keywords.join(" · "), description: selected.description, sections: [{ title: "Ámbito de experiencia", content: <p>{selected.description}</p> }, { title: "Palabras clave", content: <List items={selected.keywords} /> }, { title: "Preguntas de integración", content: <List items={selected.questions} /> }], references: ["nasa", "method"] } satisfies DetailItem;
  return <><div className="guide-content__heading"><span className="eyebrow">Las casas</span><h2>Doce ámbitos de experiencia</h2><p>Las casas sitúan los símbolos en sectores de la vida. En AstroNexo se presentan en sistema de casas iguales desde el ascendente. <strong>Abre cada casa</strong> para ver su eje y preguntas.</p></div><div className="houses-grid">{housesGuide.map((house) => <button type="button" className="house-card guide-card-button" key={house.number} onClick={(event) => open(house, event.currentTarget)} aria-label={`Abrir detalle de casa ${house.number}`}><span>{String(house.number).padStart(2, "0")}</span><div className="house-arc" /><h3>Casa {house.number}</h3><p>{house.topic}</p><em>Ver ámbito →</em></button>)}</div><DetailDialog item={detail ?? null} onClose={close} returnFocusRef={triggerRef} /></>;
}

function AspectsContent() {
  const { selected, triggerRef, open, close } = useDetailSelection<typeof aspectsGuide[number]>();
  const detail = selected && { eyebrow: `Aspecto · ${selected.angle}`, title: `${selected.symbol} ${selected.name}`, subtitle: "Distancia angular entre dos puntos", description: selected.description, sections: [{ title: "Qué describe", content: <p>{selected.description}</p> }, { title: "Posibilidad constructiva", content: <p>{selected.constructive}</p> }, { title: "Tensión posible", content: <p>{selected.challenge}</p> }, { title: "Preguntas de integración", content: <List items={selected.questions} /> }], references: ["method", "jpl"] } satisfies DetailItem;
  return <><div className="guide-content__heading"><span className="eyebrow"><Orbit size={14} /> Aspectos</span><h2>La relación entre dos puntos</h2><p>Los aspectos son distancias angulares. Ayudan a observar cómo dos funciones se combinan, cooperan o se desafían. <strong>Abre un aspecto</strong> para comprender su geometría.</p></div><div className="aspect-guide">{aspectsGuide.map((aspect) => <button type="button" className="aspect-guide__card guide-card-button" key={aspect.name} onClick={(event) => open(aspect, event.currentTarget)} aria-label={`Abrir detalle de ${aspect.name}`}><span>{aspect.symbol}</span><div><h3>{aspect.name}</h3><p>{aspect.description}</p><em>{aspect.angle} · Ver detalle →</em></div></button>)}</div><DetailDialog item={detail ?? null} onClose={close} returnFocusRef={triggerRef} /></>;
}

function DeepDiveContent() {
  const { selected, triggerRef, open, close } = useDetailSelection<typeof deepDiveGuides[number]>();
  const detail = selected && { eyebrow: `Lectura ${selected.number}`, title: selected.title, subtitle: selected.subtitle, description: selected.body, sections: [{ title: "Nota de lectura", content: <p>{selected.note}</p> }, { title: "Cómo usar esta idea", content: <p>Leé este concepto junto con la carta completa, el contexto de nacimiento y las decisiones concretas de la persona. Una definición aislada puede sonar concluyente; una lectura situada abre preguntas y reconoce matices.</p> }], references: ["nasa", "jpl", "method"] } satisfies DetailItem;
  return <><div className="guide-content__heading"><span className="eyebrow"><ScrollText size={14} /> Lecturas esenciales</span><h2>Aprender a leer sin simplificar</h2><p>Estas notas articulan conceptos técnicos y simbólicos en un lenguaje claro. Están redactadas por AstroNexo y sirven para acompañar, no reemplazar, tu propio criterio. <strong>Abre una lectura</strong> para verla en profundidad.</p></div><div className="deep-dive-grid">{deepDiveGuides.map((guide) => <button type="button" className="deep-dive-card guide-card-button" key={guide.number} onClick={(event) => open(guide, event.currentTarget)} aria-label={`Abrir lectura ${guide.number}`}><span>{guide.number}</span><small>{guide.subtitle}</small><h3>{guide.title}</h3><p>{guide.body}</p><div><b>Nota de lectura</b><em>{guide.note}</em></div><strong>Leer en detalle →</strong></button>)}</div><DetailDialog item={detail ?? null} onClose={close} returnFocusRef={triggerRef} /></>;
}

function SourcesContent() { return <><div className="guide-content__heading"><span className="eyebrow"><BookOpenText size={14} /> Referencias</span><h2>Cómo construimos esta biblioteca</h2><p>AstroNexo separa los datos astronómicos calculables de los marcos de interpretación astrológica. Las referencias aportan contexto histórico y técnico; los textos del sitio son originales y no reproducen contenido de terceros.</p></div><div className="source-guide">{sourceGuides.map((source) => <a key={source.title} href={source.href} target="_blank" rel="noreferrer"><span>{source.category}</span><h3>{source.title} <ExternalLink size={14} /></h3><p>{source.text}</p><b>Consultar fuente</b></a>)}</div><aside className="editorial-principle"><span>✦</span><p><strong>Principio editorial.</strong> La astrología se presenta aquí como un lenguaje simbólico y cultural. Las posiciones celestes proceden de cálculos astronómicos; su lectura no es una afirmación científica ni un sustituto de asesoramiento profesional.</p></aside></>; }
