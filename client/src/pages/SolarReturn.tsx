import { useMemo, useState } from "react";
import { CalendarDays, RotateCcw, SunMedium } from "lucide-react";
import { BirthProfileForm } from "@/components/BirthProfileForm";
import { ChartWheel } from "@/components/ChartWheel";
import { ToolLayout } from "@/components/ToolLayout";
import { calculateSolarReturn, formatInstant, type NatalChart } from "@/lib/astrology";

export default function SolarReturn() {
  const [natal, setNatal] = useState<NatalChart | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const returnCalculation = useMemo(() => {
    if (!natal) return { data: null, error: null };
    if (year < 1900 || year > 2100) return { data: null, error: "Ingresa un año entre 1900 y 2100 para calcular el retorno solar." };
    try {
      return { data: calculateSolarReturn(natal.profile, year), error: null };
    } catch {
      return { data: null, error: "No pudimos calcular ese retorno solar. Revisa el año o genera la carta otra vez." };
    }
  }, [natal, year]);
  const solarReturn = returnCalculation.data;
  return <ToolLayout eyebrow="Retorno solar" title="El comienzo de tu año solar" intro="Encuentra el instante en que el Sol vuelve a la posición exacta que ocupaba al nacer y observa la carta simbólica del ciclo que comienza.">
    {!natal ? <section className="calculator-grid"><div className="calculator-aside"><span className="number-orb">04</span><h2>El Sol vuelve a casa.</h2><p>El retorno solar ocurre cada año cerca de tu cumpleaños, pero no siempre a la misma hora. El cálculo busca la coincidencia exacta de longitud solar.</p></div><BirthProfileForm onGenerated={setNatal} label="Calcular mi retorno" /></section> : !solarReturn ? <section className="calculation-fallback"><span>✦</span><h2>El cálculo necesita una revisión.</h2><p>{returnCalculation.error}</p><button className="button button--outline" onClick={() => setYear(new Date().getFullYear())}>Restablecer año</button><button className="button button--ghost" onClick={() => setNatal(null)}>Cambiar datos</button></section> : <section className="return-result"><div className="return-selector"><div><span className="eyebrow"><SunMedium size={14} /> Retorno solar</span><h2>Elige el ciclo a observar</h2></div><label className="year-select"><span>Año</span><input type="number" value={year} min="1900" max="2100" onChange={(event) => setYear(Number(event.target.value))} /></label><button className="button button--ghost" onClick={() => setNatal(null)}><RotateCcw size={16} /> Cambiar datos</button></div><div className="return-main"><ChartWheel chart={solarReturn.chart} showAspects={false} /><div className="return-copy"><span className="return-sun">☉</span><h3>Retorno solar {year}</h3><p>El Sol recupera el grado natal el <strong>{formatInstant(solarReturn.instant, natal.profile.location.timezone)}</strong>.</p><div className="return-detail"><CalendarDays size={18} /><span>Usamos la ubicación natal seleccionada para levantar esta carta de retorno.</span></div><p className="result-disclaimer">El retorno solar es una técnica interpretativa. Este cálculo muestra el instante astronómico y una distribución simbólica de casas iguales.</p></div></div></section>}
  </ToolLayout>;
}
