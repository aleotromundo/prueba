import { useMemo, useState } from "react";
import { CalendarClock, RotateCcw } from "lucide-react";
import { BirthProfileForm } from "@/components/BirthProfileForm";
import { ToolLayout } from "@/components/ToolLayout";
import { getTransits, type NatalChart } from "@/lib/astrology";

export default function Transits() {
  const [natal, setNatal] = useState<NatalChart | null>(null);
  const transitCalculation = useMemo(() => {
    if (!natal) return { data: null, error: null };
    try {
      return { data: getTransits(natal), error: null };
    } catch {
      return { data: null, error: "No pudimos calcular los tránsitos actuales. Intenta generar la carta nuevamente." };
    }
  }, [natal]);
  const transitData = transitCalculation.data;
  return <ToolLayout eyebrow="Tránsitos" title="El cielo actual sobre tu carta" intro="Observa las posiciones planetarias de este momento y los aspectos que forman con los puntos de tu carta natal.">
    {!transitData ? transitCalculation.error ? <section className="calculation-fallback"><span>✦</span><h2>El cálculo necesita una revisión.</h2><p>{transitCalculation.error}</p><button className="button button--outline" onClick={() => setNatal(null)}>Volver a ingresar datos</button></section> : <section className="calculator-grid"><div className="calculator-aside"><span className="number-orb">03</span><h2>Tu mapa, en movimiento.</h2><p>Los tránsitos comparan el cielo de ahora con los símbolos de tu nacimiento. Cada aspecto describe un ciclo, no una instrucción.</p></div><BirthProfileForm onGenerated={setNatal} label="Ver mis tránsitos" /></section> : <section className="transit-results"><div className="result-toolbar"><div><span className="eyebrow"><CalendarClock size={14} /> Cielo de hoy</span><h2>Tránsitos sobre {natal!.ascendantSign.name}</h2><p>{new Intl.DateTimeFormat("es-AR", { dateStyle: "full", timeStyle: "short" }).format(new Date())}</p></div><button className="button button--ghost" onClick={() => setNatal(null)}><RotateCcw size={16} /> Cambiar carta</button></div><div className="transit-constellation"><div className="transit-orbit"><span className="transit-dot transit-dot--one" /><span className="transit-dot transit-dot--two" /><span className="transit-dot transit-dot--three" /><b>AHORA</b></div><div><h3>El presente tiene geometría.</h3><p>La lista reúne los contactos más cercanos entre los planetas en tránsito y tus posiciones natales.</p></div></div><section className="result-panel"><div className="panel-heading"><span>Aspectos activos</span><small>{transitData.aspects.length} contactos relevantes</small></div>{transitData.aspects.map((aspect, index) => <div className="transit-row" key={`${aspect.first.name}-${aspect.second.name}-${index}`}><span className={`tone-dot tone-dot--${aspect.tone}`} /><div><strong>{aspect.first.symbol} {aspect.first.name} en tránsito {aspect.symbol} {aspect.second.symbol} natal</strong><span>{aspect.name} · orbe {aspect.orb.toFixed(1)}° · {aspect.tone === "armónico" ? "apertura y colaboración" : aspect.tone === "dinámico" ? "revisión y ajuste" : "énfasis y presencia"}</span></div><span>{aspect.second.sign.symbol}</span></div>)}</section></section>}
  </ToolLayout>;
}
