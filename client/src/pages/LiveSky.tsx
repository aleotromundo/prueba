import { useEffect, useMemo, useState } from "react";
import { Compass, Crosshair, LocateFixed, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { Body, Equator, Horizon, Observer } from "astronomy-engine";
import { ToolLayout } from "@/components/ToolLayout";

type Coordinates = { latitude: number; longitude: number; accuracy?: number };
type Orientation = { heading: number; accuracy?: number };
type SkyObject = { name: string; symbol: string; color: string; azimuth: number; altitude: number; magnitude?: number; kind: "body" | "star" };

type Star = { name: string; ra: number; dec: number; magnitude: number };
const STARS: Star[] = [
  { name: "Sirio", ra: 6.7525, dec: -16.7161, magnitude: -1.46 },
  { name: "Canopo", ra: 6.3992, dec: -52.6957, magnitude: -0.74 },
  { name: "Rigel", ra: 5.2423, dec: -8.2016, magnitude: 0.13 },
  { name: "Betelgeuse", ra: 5.9195, dec: 7.4071, magnitude: 0.42 },
  { name: "Aldebarán", ra: 4.5987, dec: 16.5093, magnitude: 0.85 },
  { name: "Espiga", ra: 13.4199, dec: -11.1614, magnitude: 0.98 },
  { name: "Antares", ra: 16.4901, dec: -26.4319, magnitude: 1.06 },
  { name: "Vega", ra: 18.6156, dec: 38.7837, magnitude: 0.03 },
  { name: "Altair", ra: 19.8464, dec: 8.8683, magnitude: 0.77 },
  { name: "Fomalhaut", ra: 22.9608, dec: -29.6222, magnitude: 1.16 },
];
const BODIES: { body: Body; name: string; symbol: string; color: string }[] = [
  { body: Body.Sun, name: "Sol", symbol: "☉", color: "#ffd68a" },
  { body: Body.Moon, name: "Luna", symbol: "☽", color: "#d6e6ff" },
  { body: Body.Mercury, name: "Mercurio", symbol: "☿", color: "#c9b7a5" },
  { body: Body.Venus, name: "Venus", symbol: "♀", color: "#ffe2a8" },
  { body: Body.Mars, name: "Marte", symbol: "♂", color: "#ff9e8a" },
  { body: Body.Jupiter, name: "Júpiter", symbol: "♃", color: "#e8c58e" },
  { body: Body.Saturn, name: "Saturno", symbol: "♄", color: "#d6c39a" },
];
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const formatAngle = (value: number) => `${Math.round(((value % 360) + 360) % 360)}°`;

function calculateSky(date: Date, coordinates: Coordinates): SkyObject[] {
  const observer = new Observer(coordinates.latitude, coordinates.longitude, 0);
  const bodies = BODIES.flatMap((item) => {
    const eq = Equator(item.body, date, observer, true, true);
    const horizontal = Horizon(date, observer, eq.ra, eq.dec, "normal");
    return horizontal.altitude > -8 ? [{ ...item, azimuth: horizontal.azimuth, altitude: horizontal.altitude, kind: "body" as const }] : [];
  });
  const stars = STARS.flatMap((star) => {
    const horizontal = Horizon(date, observer, star.ra, star.dec, "normal");
    return horizontal.altitude > -8 ? [{ name: star.name, symbol: "✦", color: "#b9d7ff", azimuth: horizontal.azimuth, altitude: horizontal.altitude, magnitude: star.magnitude, kind: "star" as const }] : [];
  });
  return [...bodies, ...stars].sort((a, b) => b.altitude - a.altitude);
}

export default function LiveSky() {
  const [coordinates, setCoordinates] = useState<Coordinates>({ latitude: -34.9011, longitude: -56.1645 });
  const [orientation, setOrientation] = useState<Orientation>({ heading: 0 });
  const [sensorState, setSensorState] = useState<"idle" | "active" | "denied" | "unsupported">("idle");
  const [locationState, setLocationState] = useState<"manual" | "active" | "denied">("manual");
  const [now, setNow] = useState(() => new Date());
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const compass = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
      const heading = Number.isFinite(compass) ? compass! : event.alpha;
      if (typeof heading === "number" && Number.isFinite(heading)) setOrientation({ heading: (heading + 360) % 360, accuracy: event.absolute ? 1 : undefined });
    };
    if (sensorState === "active") {
      window.addEventListener("deviceorientation", handleOrientation, true);
      return () => window.removeEventListener("deviceorientation", handleOrientation, true);
    }
  }, [sensorState]);

  const objects = useMemo(() => calculateSky(now, coordinates), [now, coordinates]);
  const visibleObjects = objects.filter((object) => object.altitude >= 0);
  const selectedObject = objects.find((object) => object.name === selected) ?? null;

  const requestSensors = async () => {
    if (!("DeviceOrientationEvent" in window)) { setSensorState("unsupported"); return; }
    try {
      const OrientationEvent = DeviceOrientationEvent as typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };
      if (OrientationEvent.requestPermission) {
        const permission = await OrientationEvent.requestPermission();
        if (permission !== "granted") { setSensorState("denied"); return; }
      }
      setSensorState("active");
    } catch { setSensorState("denied"); }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) { setLocationState("denied"); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => { setCoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy }); setLocationState("active"); },
      () => setLocationState("denied"),
      { enableHighAccuracy: true, maximumAge: 300000, timeout: 12000 },
    );
  };

  const projection = (object: SkyObject) => {
    const relative = ((object.azimuth - orientation.heading + 540) % 360) - 180;
    return { x: 50 + Math.sin(relative * Math.PI / 180) * 46, y: 52 - clamp(object.altitude, 0, 90) / 90 * 43 };
  };

  return <ToolLayout eyebrow="Cielo en vivo" title="Apuntá tu teléfono al cielo" intro="Un planetario local que combina tu hora, tu ubicación y la orientación del dispositivo con cálculos astronómicos ejecutados en el navegador.">
    <section className="live-sky-intro"><div><span className="eyebrow"><Sparkles size={14} /> Sin APIs astronómicas externas</span><h2>El cielo, ahora.</h2><p>Las posiciones se calculan localmente con Astronomy Engine. El modo sensor orienta la vista con la brújula del teléfono; el modo manual funciona en cualquier pantalla.</p></div><div className="live-sky-status"><span><ShieldCheck size={15} /> Tus datos no se guardan</span><span><RefreshCw size={15} /> Actualización en tiempo real</span></div></section>
    <section className="live-sky-controls"><div><span className="eyebrow"><LocateFixed size={14} /> Ubicación</span><h3>{locationState === "active" ? "Ubicación del dispositivo" : "Ubicación manual"}</h3><p>{coordinates.latitude.toFixed(4)}°, {coordinates.longitude.toFixed(4)}°{coordinates.accuracy ? ` · precisión ±${Math.round(coordinates.accuracy)} m` : ""}</p>{locationState === "denied" && <small className="live-sky-warning">No se obtuvo ubicación; seguimos con la posición manual.</small>}<button className="button button--outline" onClick={requestLocation}><LocateFixed size={15} /> Usar mi ubicación</button></div><div><span className="eyebrow"><Compass size={14} /> Orientación</span><h3>{sensorState === "active" ? `Rumbo ${Math.round(orientation.heading)}°` : "Modo manual"}</h3><p>{sensorState === "active" ? "Mové el teléfono para actualizar la vista." : "Activá los sensores para apuntar el visor."}</p>{sensorState === "denied" && <small className="live-sky-warning">El permiso fue denegado; podés usar el rumbo manual.</small>}{sensorState === "unsupported" && <small className="live-sky-warning">Este navegador no expone orientación; podés usar el rumbo manual.</small>}<button className="button button--outline" onClick={requestSensors}><Compass size={15} /> {sensorState === "active" ? "Sensores activos" : "Activar sensores"}</button></div><div className="live-sky-manual"><label>Rumbo manual <input type="range" min="0" max="359" value={orientation.heading} onChange={(event) => setOrientation({ heading: Number(event.target.value) })} /></label><strong>{Math.round(orientation.heading)}° · {orientation.heading < 45 || orientation.heading >= 315 ? "Norte" : orientation.heading < 135 ? "Este" : orientation.heading < 225 ? "Sur" : "Oeste"}</strong></div></section>
    <section className="live-sky-viewport" aria-label="Mapa local del cielo"><div className="live-sky-compass"><span>N</span><span>E</span><span>S</span><span>O</span></div><svg viewBox="0 0 100 100" role="img" aria-label="Proyección del cielo visible"><defs><radialGradient id="skyGlow"><stop offset="0" stopColor="#24275c" stopOpacity=".9" /><stop offset="1" stopColor="#090a20" stopOpacity=".2" /></radialGradient></defs><circle cx="50" cy="52" r="48" fill="url(#skyGlow)" /><ellipse cx="50" cy="52" rx="45" ry="22" fill="none" stroke="rgba(176,187,255,.22)" /><ellipse cx="50" cy="52" rx="22" ry="45" fill="none" stroke="rgba(176,187,255,.16)" /><line x1="4" y1="52" x2="96" y2="52" stroke="rgba(176,187,255,.16)" /><line x1="50" y1="4" x2="50" y2="96" stroke="rgba(176,187,255,.16)" />{visibleObjects.map((object) => { const point = projection(object); return <g key={object.name} className="live-sky-object" onClick={() => setSelected(object.name)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelected(object.name); }}><circle cx={point.x} cy={point.y} r={object.kind === "body" ? 1.8 : Math.max(0.7, 1.7 - (object.magnitude ?? 1) * .35)} fill={object.color} /><text x={point.x + 2} y={point.y - 1} fill={object.color}>{object.symbol} {object.name}</text></g>; })}</svg><div className="live-sky-horizon"><span>Horizonte · 0°</span><span>Zénit · 90°</span></div></section>
    <section className="live-sky-readout"><div><span className="eyebrow">Objetos sobre el horizonte</span><h2>{visibleObjects.length} objetos calculados</h2><p>{now.toLocaleString("es-AR", { dateStyle: "full", timeStyle: "medium" })} · lat {coordinates.latitude.toFixed(2)}°, lon {coordinates.longitude.toFixed(2)}°</p></div>{selectedObject && <div className="live-sky-selected"><strong>{selectedObject.symbol} {selectedObject.name}</strong><span>Azimut {formatAngle(selectedObject.azimuth)} · Altura {selectedObject.altitude.toFixed(1)}°</span><button className="button button--ghost" onClick={() => setSelected(null)}>Cerrar</button></div>}</section>
    <aside className="live-sky-note"><Crosshair size={18} /><p><strong>Lectura técnica.</strong> La posición de los cuerpos se calcula localmente con coordenadas horizontales para tu ubicación y hora. La precisión de la brújula depende del teléfono, la calibración y las interferencias; si no hay sensor, usá el rumbo manual.</p></aside>
  </ToolLayout>;
}
