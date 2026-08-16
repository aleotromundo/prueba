import { useEffect, useRef, useState } from "react";

type StellariumObject = { name: string; symbol: string; color: string };

type Props = {
  latitude: number;
  longitude: number;
  date: Date;
  heading: number;
  selectedName?: string | null;
  onSelect?: (object: StellariumObject | null) => void;
};

type StelInstance = {
  core: { observer: { latitude: number; longitude: number; elevation: number; utc: number; yaw: number; pitch: number }; selection?: { designations: () => string[] }; atmosphere?: { visible: boolean }; milkyway?: { visible: boolean }; stars?: { visible: boolean }; constellations?: { lines_visible: boolean; labels_visible: boolean; images_visible: boolean; show_only_pointed: boolean }; };
  change: (callback: (object: unknown, attribute: string) => void) => void;
  setFont?: (name: string, url: string, scale: number) => void;
};

type StelFactory = (options: { wasmFile: string; canvas: HTMLCanvasElement; translateFn?: (domain: string, value: string) => string; onReady: (instance: StelInstance) => void; onError?: (error: unknown) => void }) => void;

declare global { interface Window { StelWebEngine?: StelFactory } }

const MJD_UNIX_EPOCH = 40587;
const radians = (degrees: number) => degrees * Math.PI / 180;
const normalizeName = (value: string) => value.replace(/^NAME\s+/i, "").trim();
const SPANISH_CONSTELLATIONS: Record<string, string> = { Leo: "Leo", Bootes: "Boyero", "Boötes": "Boyero", "Coma Berenices": "Cabellera de Berenice", Hercules: "Hércules", Orion: "Orión", Scorpius: "Escorpio", Sagittarius: "Sagitario", Capricornus: "Capricornio", Aquarius: "Acuario", Pisces: "Piscis", Aries: "Aries", Taurus: "Tauro", Gemini: "Géminis", Cancer: "Cáncer", Virgo: "Virgo", Libra: "Libra", Ophiuchus: "Ofiuco", Andromeda: "Andrómeda", Cassiopeia: "Casiopea", Cygnus: "Cisne", Canis: "Can Mayor", "Canis Major": "Can Mayor", "Canis Minor": "Can Menor", Centaurus: "Centauro", Crux: "Cruz del Sur", Hydra: "Hidra", Lyra: "Lira", Aquila: "Águila", Delphinus: "Delfín", Pegasus: "Pegaso", Perseus: "Perseo", Corona: "Corona", Corvus: "Cuervo", Lupus: "Lobo", Puppis: "Popa", Vela: "Vela", Carina: "Quilla", Triangulum: "Triángulo", Arcturus: "Arturo", Sirius: "Sirio", Canopus: "Canopo", Spica: "Espiga", Aldebaran: "Aldebarán" };

let enginePromise: Promise<void> | null = null;
function loadEngine() {
  if (window.StelWebEngine) return Promise.resolve();
  if (!enginePromise) {
    enginePromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-stellarium-engine="true"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("No se pudo cargar el engine Stellarium.")), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = "/stellarium/engine/stellarium-web-engine.js";
      script.async = true;
      script.dataset.stellariumEngine = "true";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("No se pudo cargar el engine Stellarium."));
      document.head.appendChild(script);
    });
  }
  return enginePromise;
}

export function mapStellariumSelection(name: string | null): StellariumObject | null {
  if (!name) return null;
  const normalized = name.toLowerCase();
  const known: Record<string, StellariumObject> = {
    sun: { name: "Sol", symbol: "☉", color: "#ffd16d" },
    moon: { name: "Luna", symbol: "☽", color: "#d7e7ff" },
    mercury: { name: "Mercurio", symbol: "☿", color: "#c7b39d" },
    venus: { name: "Venus", symbol: "♀", color: "#f6d28e" },
    mars: { name: "Marte", symbol: "♂", color: "#ee836f" },
    jupiter: { name: "Júpiter", symbol: "♃", color: "#e8b27f" },
    saturn: { name: "Saturno", symbol: "♄", color: "#d9c18d" },
    uranus: { name: "Urano", symbol: "♅", color: "#8edcf1" },
    neptune: { name: "Neptuno", symbol: "♆", color: "#8c9cf3" },
    pluto: { name: "Plutón", symbol: "♇", color: "#c7a18f" },
  };
  return known[normalized] ?? { name: normalizeName(name), symbol: "✦", color: "#e6ddff" };
}

export function StellariumPlanetarium({ latitude, longitude, date, heading, onSelect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<StelInstance | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("Cargando Stellarium Web Engine…");

  useEffect(() => {
    let disposed = false;
    void loadEngine().then(() => {
      if (disposed || !canvasRef.current || !window.StelWebEngine) return;
      window.StelWebEngine({
        wasmFile: "/stellarium/engine/stellarium-web-engine.wasm",
        canvas: canvasRef.current,
        translateFn: (_domain, value) => SPANISH_CONSTELLATIONS[value] ?? value,
        onError: () => { setState("error"); setMessage("Stellarium no pudo iniciar. No hay un planetario alternativo activo."); },
        onReady: (stel) => {
          if (disposed) return;
          instanceRef.current = stel;
          const observer = stel.core.observer;
          observer.latitude = radians(latitude);
          observer.longitude = radians(longitude);
          observer.elevation = 0;
          observer.utc = date.getTime() / 86400000 + MJD_UNIX_EPOCH;
          observer.yaw = radians(heading);
          observer.pitch = radians(30);
          if (stel.core.atmosphere) stel.core.atmosphere.visible = false;
          if (stel.core.milkyway) stel.core.milkyway.visible = true;
          if (stel.core.stars) stel.core.stars.visible = true;
          if (stel.core.constellations) { stel.core.constellations.lines_visible = true; stel.core.constellations.labels_visible = true; stel.core.constellations.images_visible = false; stel.core.constellations.show_only_pointed = false; }
          const core = stel.core as StelInstance["core"] & { stars: { addDataSource: (source: { url: string }) => void }; skycultures: { addDataSource: (source: { url: string; key: string }) => void }; dsos: { addDataSource: (source: { url: string }) => void }; milkyway: { addDataSource: (source: { url: string }) => void }; planets: { addDataSource: (source: { url: string; key: string }) => void } };
          core.stars.addDataSource({ url: "/stellarium/data/stars" });
          core.skycultures.addDataSource({ url: "/stellarium/data/skycultures/western", key: "western" });
          core.dsos.addDataSource({ url: "/stellarium/data/dso" });
          core.milkyway.addDataSource({ url: "/stellarium/data/surveys/milkyway" });
          core.planets.addDataSource({ url: "/stellarium/data/surveys/sso/moon", key: "moon" });
          core.planets.addDataSource({ url: "/stellarium/data/surveys/sso/sun", key: "sun" });
          core.planets.addDataSource({ url: "/stellarium/data/surveys/sso/moon", key: "default" });
          stel.change(() => {
            const selected = stel.core.selection?.designations?.()[0];
            onSelect?.(mapStellariumSelection(selected ? normalizeName(selected) : null));
          });
          setState("ready");
          setMessage("Stellarium activo: estrellas, constelaciones y objetos profundos en español.");
        },
      });
    }).catch(() => { if (!disposed) { setState("error"); setMessage("No se pudo cargar Stellarium. No hay un planetario alternativo activo."); } });
    return () => { disposed = true; instanceRef.current = null; if (canvasRef.current) { canvasRef.current.width = 1; canvasRef.current.height = 1; } };
  }, []);

  useEffect(() => {
    const observer = instanceRef.current?.core.observer;
    if (!observer) return;
    observer.latitude = radians(latitude);
    observer.longitude = radians(longitude);
    observer.utc = date.getTime() / 86400000 + MJD_UNIX_EPOCH;
    observer.yaw = radians(heading);
  }, [latitude, longitude, date, heading]);

  return <div className={`stellarium-planetarium stellarium-planetarium--${state}`}>
    <canvas ref={canvasRef} aria-label="Planetario Stellarium con estrellas, planetas y objetos profundos" />
    <div className="stellarium-planetarium__status" role="status" aria-live="polite"><span className="stellarium-planetarium__dot" />{message}</div>
  </div>;
}
