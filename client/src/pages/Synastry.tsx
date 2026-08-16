import { type CSSProperties, useMemo, useState } from "react";
import { HeartHandshake, RotateCcw } from "lucide-react";
import { BirthProfileForm } from "@/components/BirthProfileForm";
import { ToolLayout } from "@/components/ToolLayout";
import { calculateSynastry, type NatalChart } from "@/lib/astrology";

export default function Synastry() {
  const [first, setFirst] = useState<NatalChart | null>(null);
  const [second, setSecond] = useState<NatalChart | null>(null);
  const synastryCalculation = useMemo(() => {
    if (!first || !second) return { data: null, error: null };
    try {
      return { data: calculateSynastry(first, second), error: null };
    } catch {
      return { data: null, error: "No pudimos comparar estas cartas. Revisa los datos de ambas personas e inténtalo nuevamente." };
    }
  }, [first, second]);
  const analysis = synastryCalculation.data;
  return <ToolLayout eyebrow="Sinastría" title="La geometría del encuentro" intro="Compara dos cartas de nacimiento para observar aspectos entre planetas, afinidades de elemento y los puntos que invitan a construir diálogo.">
    {!analysis ? synastryCalculation.error ? <CalculationFallback message={synastryCalculation.error} onReset={() => { setFirst(null); setSecond(null); }} /> : <section className="synastry-forms"><div className="synastry-intro"><span className="number-orb">02</span><h2>Dos mapas.<br />Una conversación.</h2><p>Genera cada carta por separado. No publicamos ni almacenamos tus datos de nacimiento.</p></div><div className="profile-form-card"><div className="profile-label"><span>A</span><h3>Primera persona</h3>{first && <button onClick={() => setFirst(null)}><RotateCcw size={14} /> Cambiar</button>}</div>{first ? <ProfileDone chart={first} /> : <BirthProfileForm onGenerated={setFirst} label="Guardar carta A" compact />}</div><div className="profile-form-card"><div className="profile-label"><span>B</span><h3>Segunda persona</h3>{second && <button onClick={() => setSecond(null)}><RotateCcw size={14} /> Cambiar</button>}</div>{second ? <ProfileDone chart={second} /> : <BirthProfileForm onGenerated={setSecond} label="Guardar carta B" compact />}</div></section> : <section className="synastry-result"><div className="synastry-score"><div className="score-ring" style={{ "--score": analysis.score } as CSSProperties}><span>{analysis.score}</span><small>/100</small></div><div><span className="eyebrow"><HeartHandshake size={14} /> Lectura comparativa</span><h2>Compatibilidad simbólica</h2><p>{analysis.harmonious} aspectos armónicos y {analysis.dynamic} dinámicos componen esta conversación. La puntuación resume patrones geométricos; no define el valor ni el futuro de una relación.</p></div><button className="button button--ghost" onClick={() => { setFirst(null); setSecond(null); }}><RotateCcw size={16} /> Nuevas cartas</button></div><div className="synastry-insight-grid"><section><h3>Lo que fluye</h3><p>Los sextiles y trígonos pueden facilitar el entendimiento, la cooperación y el reconocimiento mutuo.</p><strong>{analysis.aspects.filter((aspect) => aspect.tone === "armónico").length} conexiones armónicas</strong></section><section><h3>Lo que moviliza</h3><p>Las cuadraturas, oposiciones y quincuncios suelen invitar a negociar ritmos, deseos y formas de estar.</p><strong>{analysis.aspects.filter((aspect) => aspect.tone === "dinámico").length} conexiones dinámicas</strong></section></div><section className="result-panel synastry-aspects"><div className="panel-heading"><span>Aspectos entre ambas cartas</span><small>Ordenados por cercanía</small></div>{analysis.aspects.slice(0, 14).map((aspect, index) => <div className="aspect-row" key={`${aspect.first.name}-${aspect.second.name}-${index}`}><span className={`tone-dot tone-dot--${aspect.tone}`} /><strong>{aspect.first.symbol} {aspect.symbol} {aspect.second.symbol}</strong><span>{aspect.first.name} — {aspect.second.name} · {aspect.name} · orbe {aspect.orb.toFixed(1)}°</span></div>)}</section></section>}
  </ToolLayout>;
}

function ProfileDone({ chart }: { chart: NatalChart }) {
  return <div className="profile-done"><span>{chart.ascendantSign.symbol}</span><div><strong>Ascendente en {chart.ascendantSign.name}</strong><p>{chart.planets.find((planet) => planet.name === "Sol")?.symbol} Sol en {chart.planets.find((planet) => planet.name === "Sol")?.sign.name}</p><small>{chart.profile.location.name}, {chart.profile.location.country}</small></div></div>;
}

function CalculationFallback({ message, onReset }: { message: string; onReset: () => void }) {
  return <section className="calculation-fallback"><span>✦</span><h2>El cálculo necesita una revisión.</h2><p>{message}</p><button className="button button--outline" onClick={onReset}>Volver a ingresar datos</button></section>;
}
