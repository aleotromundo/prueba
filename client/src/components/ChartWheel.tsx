import { useState } from "react";
import { type NatalChart, formatDegree, ZODIAC } from "@/lib/astrology";

type Props = {
  chart: NatalChart;
  showAspects?: boolean;
  className?: string;
};

const polar = (angle: number, radius: number) => {
  const radians = ((angle - 90) * Math.PI) / 180;
  return { x: 210 + radius * Math.cos(radians), y: 210 + radius * Math.sin(radians) };
};

export function ChartWheel({ chart, showAspects = true, className = "" }: Props) {
  const [selectedPlanet, setSelectedPlanet] = useState(chart.planets[0]);
  const planetPoint = (longitude: number) => polar(longitude, 112);
  return (
    <div className={`chart-wheel ${className}`} aria-label="Rueda zodiacal de la carta natal">
      <svg viewBox="0 0 420 420" role="img" aria-labelledby="wheel-title">
        <title id="wheel-title">Carta natal con signos, casas, planetas y aspectos</title>
        <defs>
          <radialGradient id="wheelCore" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#201c45" stopOpacity="0.98" />
            <stop offset="68%" stopColor="#11132d" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#090a1b" stopOpacity="1" />
          </radialGradient>
          <filter id="softGlow"><feGaussianBlur stdDeviation="2.2" /></filter>
        </defs>
        <circle cx="210" cy="210" r="196" className="wheel-halo" filter="url(#softGlow)" />
        <circle cx="210" cy="210" r="190" className="wheel-outer" />
        <circle cx="210" cy="210" r="150" className="wheel-ring" />
        <circle cx="210" cy="210" r="132" className="wheel-ring wheel-ring--subtle" />
        <circle cx="210" cy="210" r="126" fill="url(#wheelCore)" className="wheel-core" />
        {Array.from({ length: 12 }, (_, index) => {
          const angle = index * 30;
          const start = polar(angle, 151);
          const end = polar(angle, 190);
          return (
            <g key={angle}>
              <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} className="wheel-tick" />
              <text x={polar(angle + 15, 171).x} y={polar(angle + 15, 171).y + 6} className="wheel-sign">
                {ZODIAC[index]?.symbol}
              </text>
            </g>
          );
        })}
        {chart.houses.map((cusp, index) => {
          const outer = polar(cusp, 128);
          const inner = polar(cusp, 28);
          const number = polar(cusp + 15, 48);
          return (
            <g key={`house-${index}`}>
              <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} className={index === 0 ? "house-line house-line--asc" : "house-line"} />
              <text x={number.x} y={number.y + 4} className="house-number">{index + 1}</text>
            </g>
          );
        })}
        {showAspects && chart.aspects.slice(0, 20).map((aspect, index) => {
          const first = planetPoint(aspect.first.longitude);
          const second = planetPoint(aspect.second.longitude);
          return <line key={`${aspect.first.name}-${aspect.second.name}-${index}`} x1={first.x} y1={first.y} x2={second.x} y2={second.y} className={`aspect-line aspect-line--${aspect.tone}`} />;
        })}
        <line x1={210} y1={210} x2={polar(chart.ascendant, 192).x} y2={polar(chart.ascendant, 192).y} className="asc-line" />
        {chart.planets.map((planet) => {
          const position = polar(planet.longitude, 112);
          return (
            <g key={planet.name} className={selectedPlanet.name === planet.name ? "planet-node planet-node--selected" : "planet-node"} role="button" tabIndex={0} aria-label={`Ver ${planet.name} en ${planet.sign.name}`} onClick={() => setSelectedPlanet(planet)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedPlanet(planet); }}>
              <circle cx={position.x} cy={position.y} r="13" />
              <text x={position.x} y={position.y + 5.5}>{planet.symbol}</text>
            </g>
          );
        })}
        <circle cx="210" cy="210" r="24" className="wheel-center" />
        <text x="210" y="206" textAnchor="middle" className="wheel-center__small">ASC</text>
        <text x="210" y="221" textAnchor="middle" className="wheel-center__sign">{chart.ascendantSign.symbol}</text>
      </svg>
      <div className="wheel-caption"><span>{selectedPlanet.symbol} {selectedPlanet.name}</span><strong>{selectedPlanet.sign.name} · {formatDegree(selectedPlanet.degreeInSign)} · Casa {selectedPlanet.house}</strong></div>
      <div className="wheel-legend" aria-label="Leyenda de la carta natal">
        <span><b>♈︎–♓︎</b> Signos zodiacales</span>
        <span><b>☉ ☽ ☿ ♀ ♂ ♃ ♄ ♅ ♆ ♇</b> Planetas</span>
        <span><i className="legend-line legend-line--asc" /> Ascendente</span>
        <span><i className="legend-line legend-line--harmonic" /> Aspecto armónico</span>
        <span><i className="legend-line legend-line--dynamic" /> Aspecto dinámico</span>
        <span><i className="legend-line legend-line--neutral" /> Conjunción / énfasis</span>
        <span><b>1–12</b> Casas iguales</span>
        <span><b>{selectedPlanet.symbol}</b> Planeta seleccionado</span>
      </div>
    </div>
  );
}
