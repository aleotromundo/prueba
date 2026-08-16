import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Check, Compass, Crosshair, Eye, EyeOff, LocateFixed, Moon, RefreshCw, ShieldCheck, Sparkles, Sun, Target, ZoomIn } from "lucide-react";
import { Body, Equator, Horizon, Observer } from "astronomy-engine";
import { ToolLayout } from "@/components/ToolLayout";

type Coordinates = { latitude: number; longitude: number; accuracy?: number };
type SkyObject = { name: string; symbol: string; color: string; azimuth: number; altitude: number; magnitude?: number; kind: "body" | "star"; body?: Body };
type Star = { name: string; ra: number; dec: number; magnitude: number };
type SensorState = "idle" | "active" | "denied" | "unsupported";
type JplState = "idle" | "loading" | "verified" | "unavailable";

const STARS: Star[] = [
  { name: "Sirio", ra: 6.7525, dec: -16.7161, magnitude: -1.46 }, { name: "Canopo", ra: 6.3992, dec: -52.6957, magnitude: -0.74 },
  { name: "Rigel", ra: 5.2423, dec: -8.2016, magnitude: 0.13 }, { name: "Betelgeuse", ra: 5.9195, dec: 7.4071, magnitude: 0.42 },
  { name: "Aldebarán", ra: 4.5987, dec: 16.5093, magnitude: 0.85 }, { name: "Espiga", ra: 13.4199, dec: -11.1614, magnitude: 0.98 },
  { name: "Antares", ra: 16.4901, dec: -26.4319, magnitude: 1.06 }, { name: "Vega", ra: 18.6156, dec: 38.7837, magnitude: 0.03 },
  { name: "Altair", ra: 19.8464, dec: 8.8683, magnitude: 0.77 }, { name: "Fomalhaut", ra: 22.9608, dec: -29.6222, magnitude: 1.16 },
];
const BODIES: { body: Body; name: string; symbol: string; color: string }[] = [
  { body: Body.Sun, name: "Sol", symbol: "☉", color: "#ffd36e" }, { body: Body.Moon, name: "Luna", symbol: "☽", color: "#d9ebff" },
  { body: Body.Mercury, name: "Mercurio", symbol: "☿", color: "#c7b4a4" }, { body: Body.Venus, name: "Venus", symbol: "♀", color: "#ffe7a8" },
  { body: Body.Mars, name: "Marte", symbol: "♂", color: "#ff846f" }, { body: Body.Jupiter, name: "Júpiter", symbol: "♃", color: "#e7bb78" },
  { body: Body.Saturn, name: "Saturno", symbol: "♄", color: "#d8c48e" },
];
const normalize = (value: number) => ((value % 360) + 360) % 360;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const formatAngle = (value: number) => `${Math.round(normalize(value))}°`;
const jplIds: Partial<Record<Body, string>> = { [Body.Sun]: "10", [Body.Moon]: "301", [Body.Mercury]: "199", [Body.Venus]: "299", [Body.Mars]: "499", [Body.Jupiter]: "599", [Body.Saturn]: "699" };

function calculateSky(date: Date, coordinates: Coordinates): SkyObject[] {
  const observer = new Observer(coordinates.latitude, coordinates.longitude, 0);
  const bodies = BODIES.flatMap((item) => {
    const eq = Equator(item.body, date, observer, true, true);
    const horizontal = Horizon(date, observer, eq.ra, eq.dec, "normal");
    return horizontal.altitude > -8 ? [{ ...item, azimuth: horizontal.azimuth, altitude: horizontal.altitude, kind: "body" as const }] : [];
  });
  const stars = STARS.flatMap((star) => {
    const horizontal = Horizon(date, observer, star.ra, star.dec, "normal");
    return horizontal.altitude > -8 ? [{ name: star.name, symbol: "✦", color: "#c5dcff", azimuth: horizontal.azimuth, altitude: horizontal.altitude, magnitude: star.magnitude, kind: "star" as const }] : [];
  });
  return [...bodies, ...stars].sort((a, b) => b.altitude - a.altitude);
}

export default function LiveSky() {
  const [coordinates, setCoordinates] = useState<Coordinates>({ latitude: -34.9011, longitude: -56.1645 });
  const [orientation, setOrientation] = useState({ heading: 0, raw: 0, accuracy: undefined as number | undefined });
  const [sensorState, setSensorState] = useState<SensorState>("idle");
  const [locationState, setLocationState] = useState<"manual" | "active" | "denied">("manual");
  const [now, setNow] = useState(() => new Date());
  const [selected, setSelected] = useState<string | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [fieldOfView, setFieldOfView] = useState(152);
  const [calibrationOffset, setCalibrationOffset] = useState(0);
  const [jplState, setJplState] = useState<JplState>("idle");
  const [jplMessage, setJplMessage] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const compass = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
      const raw = Number.isFinite(compass) ? compass! : event.alpha;
      if (typeof raw === "number" && Number.isFinite(raw)) setOrientation({ raw: normalize(raw), heading: normalize(raw + calibrationOffset), accuracy: event.absolute ? 1 : undefined });
    };
    if (sensorState === "active") {
      window.addEventListener("deviceorientation", handleOrientation, true);
      return () => window.removeEventListener("deviceorientation", handleOrientation, true);
    }
  }, [sensorState, calibrationOffset]);

  useEffect(() => {
    if (videoRef.current && streamRef.current) videoRef.current.srcObject = streamRef.current;
  }, [cameraEnabled]);

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);

  const objects = useMemo(() => calculateSky(now, coordinates), [now, coordinates]);
  const visibleObjects = objects.filter((object) => object.altitude >= 0);
  const selectedObject = objects.find((object) => object.name === selected) ?? null;
  const viewHalfAngle = fieldOfView / 2;

  const requestSensors = async () => {
    if (!("DeviceOrientationEvent" in window)) { setSensorState("unsupported"); return; }
    try {
      const OrientationEvent = DeviceOrientationEvent as typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };
      if (OrientationEvent.requestPermission && await OrientationEvent.requestPermission() !== "granted") { setSensorState("denied"); return; }
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

  const toggleCamera = async () => {
    if (cameraEnabled) {
      streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null; setCameraEnabled(false); return;
    }
    if (!navigator.mediaDevices?.getUserMedia) return setJplMessage("Este navegador no permite cámara AR; seguimos en modo planetario.");
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      setCameraEnabled(true);
    } catch { setCameraEnabled(false); setJplMessage("No se concedió acceso a la cámara; el planetario local sigue disponible."); }
  };

  const calibrate = () => setCalibrationOffset(normalize(-orientation.raw));
  const project = (object: SkyObject) => {
    const relative = ((object.azimuth - orientation.heading + 540) % 360) - 180;
    if (Math.abs(relative) > viewHalfAngle) return null;
    return { x: 50 + (relative / viewHalfAngle) * 45, y: 76 - (clamp(object.altitude, 0, 90) / 90) * 58 };
  };
  const projectedObjects = visibleObjects.flatMap((object) => { const point = project(object); return point ? [{ object, point }] : []; });
  const direction = orientation.heading < 45 || orientation.heading >= 315 ? "Norte" : orientation.heading < 135 ? "Este" : orientation.heading < 225 ? "Sur" : "Oeste";
  const selectObject = (name: string) => { setSelected((current) => current === name ? null : name); setJplState("idle"); setJplMessage(""); };

  const verifyWithJpl = async () => {
    if (!selectedObject?.body || !jplIds[selectedObject.body]) return;
    setJplState("loading"); setJplMessage("");
    try {
      const start = new Date(now.getTime() - 60_000).toISOString().replace(/\.\d{3}Z$/, "Z");
      const stop = new Date(now.getTime() + 60 * 60_000).toISOString().replace(/\.\d{3}Z$/, "Z");
      const params = new URLSearchParams({ format: "json", COMMAND: `'${jplIds[selectedObject.body]}'`, OBJ_DATA: "NO", MAKE_EPHEM: "YES", EPHEM_TYPE: "OBSERVER", CENTER: "500@399", START_TIME: `'${start}'`, STOP_TIME: `'${stop}'`, STEP_SIZE: "60m", QUANTITIES: "4,9" });
      const response = await fetch(`https://ssd.jpl.nasa.gov/api/horizons.api?${params.toString()}`);
      if (!response.ok) throw new Error("HTTP");
      const payload = await response.json() as { result?: string };
      if (!payload.result) throw new Error("DATA");
      setJplState("verified"); setJplMessage("JPL Horizons devolvió una efeméride para este cuerpo. El visor continúa usando el cálculo local.");
    } catch { setJplState("unavailable"); setJplMessage("JPL no respondió ahora; la posición local sigue siendo la fuente activa y verificable."); }
  };

  return <ToolLayout eyebrow="Cielo en vivo" title="Apuntá tu teléfono al cielo" intro="Un planetario local que combina tu hora, tu ubicación y la orientación del dispositivo con cálculos astronómicos ejecutados en el navegador.">
    <section className="live-sky-intro"><div><span className="eyebrow"><Sparkles size={14} /> Vista de planetario y AR</span><h2>El cielo, ahora.</h2><p>Elegí planetario local o cámara AR. Las posiciones de Sol, Luna, planetas y estrellas se calculan en el dispositivo; la red solo se usa si pedís una verificación opcional.</p></div><div className="live-sky-status"><span><ShieldCheck size={15} /> Tus datos no se guardan</span><span><RefreshCw size={15} /> Actualización en tiempo real</span></div></section>
    <section className="live-sky-controls"><div><span className="eyebrow"><LocateFixed size={14} /> Ubicación</span><h3>{locationState === "active" ? "Ubicación del dispositivo" : "Ubicación manual"}</h3><p>{coordinates.latitude.toFixed(4)}°, {coordinates.longitude.toFixed(4)}°{coordinates.accuracy ? ` · precisión ±${Math.round(coordinates.accuracy)} m` : ""}</p>{locationState === "denied" && <small className="live-sky-warning">No se obtuvo ubicación; seguimos con la posición manual.</small>}<button className="button button--outline" onClick={requestLocation}><LocateFixed size={15} /> Usar mi ubicación</button></div><div><span className="eyebrow"><Compass size={14} /> Orientación</span><h3>{sensorState === "active" ? `Rumbo ${Math.round(orientation.heading)}°` : "Modo manual"}</h3><p>{sensorState === "active" ? "Mové el teléfono para desplazar la vista." : "Activá los sensores para apuntar el visor."}</p>{sensorState === "denied" && <small className="live-sky-warning">El permiso fue denegado; podés usar el rumbo manual.</small>}{sensorState === "unsupported" && <small className="live-sky-warning">Este navegador no expone orientación; podés usar el rumbo manual.</small>}<div className="live-sky-control-row"><button className="button button--outline" onClick={requestSensors}><Compass size={15} /> {sensorState === "active" ? "Sensores activos" : "Activar sensores"}</button><button className="button button--ghost" onClick={calibrate} disabled={sensorState !== "active"}><Target size={15} /> Calibrar</button></div></div><div className="live-sky-manual"><label>Rumbo manual <input type="range" min="0" max="359" value={orientation.heading} onChange={(event) => setOrientation({ ...orientation, heading: Number(event.target.value), raw: Number(event.target.value) })} /></label><strong>{Math.round(orientation.heading)}° · {direction}</strong></div></section>
    <section className="live-sky-tools" aria-label="Controles del visor"><button className={`button ${cameraEnabled ? "button--active" : "button--outline"}`} onClick={toggleCamera}><Camera size={15} /> {cameraEnabled ? "Salir de cámara AR" : "Usar cámara AR"}</button><button className={`button ${nightMode ? "button--active" : "button--outline"}`} onClick={() => setNightMode((value) => !value)}>{nightMode ? <Sun size={15} /> : <Moon size={15} />} {nightMode ? "Modo claro" : "Modo nocturno"}</button><button className="button button--outline" onClick={() => setShowLabels((value) => !value)}>{showLabels ? <EyeOff size={15} /> : <Eye size={15} />} {showLabels ? "Ocultar etiquetas" : "Mostrar etiquetas"}</button><label className="live-sky-range"><ZoomIn size={15} /> FOV <input type="range" min="60" max="180" value={fieldOfView} onChange={(event) => setFieldOfView(Number(event.target.value))} /><strong>{fieldOfView}°</strong></label></section>
    <section className={`live-sky-horizon-view ${nightMode ? "live-sky-horizon-view--night" : ""}`} aria-label="Vista de planetario local"><div className={`live-sky-scene ${cameraEnabled ? "live-sky-scene--camera" : ""}`}><div className="live-sky-camera-layer" aria-hidden={!cameraEnabled}>{cameraEnabled && <video ref={videoRef} autoPlay muted playsInline />}</div><div className="live-sky-scene__veil" /><div className="live-sky-scene__atmosphere" /><div className="live-sky-scene__topbar"><span>N {Math.round(orientation.heading)}°</span><span>{direction}</span><span>Campo de visión {fieldOfView}°</span></div><div className="live-sky-scene__horizon"><span>Horizonte · 0°</span><i /><span>Zénit · 90°</span></div><svg viewBox="0 0 100 100" role="img" aria-label="Objetos celestes calculados en tiempo real"><defs><filter id="sceneGlow"><feGaussianBlur stdDeviation=".8" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>{projectedObjects.map(({ object, point }) => { const isBody = object.kind === "body"; const isFeatured = isBody || (object.magnitude ?? 9) <= .55; const size = isBody ? (object.name === "Sol" ? 1.45 : object.name === "Luna" ? 1.25 : .95) : Math.max(.45, 1.15 - (object.magnitude ?? 1) * .18); return <g key={object.name} className={`live-sky-object ${isBody ? "live-sky-object--body" : "live-sky-object--star"} ${selected === object.name ? "live-sky-object--selected" : ""}`} onClick={() => selectObject(object.name)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectObject(object.name); } }} aria-label={`${object.name}, azimut ${formatAngle(object.azimuth)}, altura ${object.altitude.toFixed(1)} grados`}>{isBody && <circle cx={point.x} cy={point.y} r={size * 2.1} fill={object.color} opacity=".3" filter="url(#sceneGlow)" />}{!isBody && <circle cx={point.x} cy={point.y} r={size * 1.5} fill={object.color} opacity=".5" filter="url(#sceneGlow)" />}<circle cx={point.x} cy={point.y} r={size} fill={object.color} stroke={selected === object.name ? "#fff" : "none"} strokeWidth=".55" filter="url(#sceneGlow)" />{showLabels && isBody ? <text className="live-sky-scene-label live-sky-scene-label--body" x={point.x + 2.5} y={point.y - 1.5} fill={object.color}>{selected === object.name ? `${object.symbol} ${object.name}` : object.symbol}</text> : showLabels && isFeatured && <text className="live-sky-scene-label" x={point.x + 2.5} y={point.y - 1.5} fill="#eef4ff">{object.symbol} {object.name}</text>}</g>; })}</svg><div className="live-sky-crosshair" aria-hidden="true"><span /><span /></div><div className="live-sky-scene__footer"><span>{cameraEnabled ? "Cámara AR activa · objetos calculados localmente" : "Planetario local · escena calculada"}</span><span>Orientación por sensores o rumbo manual</span></div></div><p className="live-sky-attribution">{cameraEnabled ? "La imagen proviene de la cámara del dispositivo; los overlays son una aproximación orientativa." : "Fondo panorámico: ESO/S. Brunier · CC BY 4.0"} · <a href="https://www.eso.org/public/images/eso0932a/" target="_blank" rel="noreferrer">ver fuente</a></p></section>
    <div className="live-sky-legend" aria-label="Objetos visibles"><div className="live-sky-legend__heading"><span className="eyebrow">Objetos en este campo</span><small>Seleccioná un objeto para ver su posición exacta</small></div><div className="live-sky-legend__items">{visibleObjects.map((object) => <button key={object.name} type="button" className={`live-sky-chip ${selected === object.name ? "live-sky-chip--selected" : ""}`} onClick={() => selectObject(object.name)}><i style={{ backgroundColor: object.color, boxShadow: `0 0 9px ${object.color}` }} />{object.name}<small>{object.kind === "body" ? "planeta" : "estrella"}</small></button>)}</div></div>
    <section className="live-sky-readout"><div><span className="eyebrow">Objetos sobre el horizonte</span><h2>{visibleObjects.length} objetos calculados</h2><p>{now.toLocaleString("es-AR", { dateStyle: "full", timeStyle: "medium" })} · lat {coordinates.latitude.toFixed(2)}°, lon {coordinates.longitude.toFixed(2)}°</p></div>{selectedObject && <div className="live-sky-selected"><strong>{selectedObject.symbol} {selectedObject.name}</strong><span>Azimut {formatAngle(selectedObject.azimuth)} · Altura {selectedObject.altitude.toFixed(1)}°</span>{selectedObject.body && <button className="button button--outline" onClick={verifyWithJpl} disabled={jplState === "loading"}><Check size={15} /> {jplState === "loading" ? "Verificando…" : "Verificar con JPL"}</button>}<button className="button button--ghost" onClick={() => setSelected(null)}>Cerrar</button>{jplMessage && <small className={`live-sky-jpl-message live-sky-jpl-message--${jplState}`}>{jplMessage}</small>}</div>}</section>
    <aside className="live-sky-note"><Crosshair size={18} /><p><strong>Cómo leerlo.</strong> En planetario, el fondo es una referencia visual y los objetos se calculan en tiempo real. En AR, la cámara muestra tu entorno y los objetos se superponen de forma orientativa; calibrá el rumbo y usá la ficha para confirmar azimut y altura. Si no hay permisos, el modo manual sigue funcionando.</p></aside>
  </ToolLayout>;
}
