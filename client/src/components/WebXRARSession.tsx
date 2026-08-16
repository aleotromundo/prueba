import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type XRObject = { name: string; symbol: string; color: string; azimuth: number; altitude: number; kind: "body" | "star" };

type Props = {
  objects: XRObject[];
  initialHeading: number;
  onStateChange?: (state: "starting" | "active" | "ended" | "unsupported" | "error", message?: string) => void;
};

const toRadians = (degrees: number) => degrees * Math.PI / 180;

function makeLabel(object: XRObject) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 160;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = object.kind === "body" ? "bold 42px system-ui" : "32px system-ui";
  context.fillStyle = object.color;
  context.shadowColor = object.color;
  context.shadowBlur = 18;
  context.fillText(`${object.symbol} ${object.name}`, 20, 72);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(object.kind === "body" ? 1.8 : 1.3, object.kind === "body" ? 0.56 : 0.44, 1);
  return sprite;
}

export default function WebXRARSession({ objects, initialHeading, onStateChange }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("Preparando la sesión AR espacial…");
  const objectsRef = useRef(objects);
  const headingRef = useRef(initialHeading);
  const callbackRef = useRef(onStateChange);
  objectsRef.current = objects;
  headingRef.current = initialHeading;
  callbackRef.current = onStateChange;

  useEffect(() => {
    let cancelled = false;
    let session: any;
    let renderer: THREE.WebGLRenderer | undefined;
    let scene: THREE.Scene | undefined;
    let referenceSpace: any;

    const start = async () => {
      const xr = (navigator as Navigator & { xr?: any }).xr;
      if (!xr?.requestSession) {
        onStateChange?.("unsupported", "Este navegador no ofrece WebXR immersive-ar.");
        return;
      }
      onStateChange?.("starting");
      try {
        const supported = await xr.isSessionSupported?.("immersive-ar");
        if (supported === false) throw new Error("unsupported");
        session = await xr.requestSession("immersive-ar", { requiredFeatures: ["local-floor"], optionalFeatures: ["dom-overlay"], domOverlay: { root: mountRef.current } });
        if (cancelled || !mountRef.current) return session.end();
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;
        renderer.xr.setReferenceSpaceType("local-floor");
        await renderer.xr.setSession(session);
        mountRef.current.appendChild(renderer.domElement);
        scene = new THREE.Scene();
        const group = new THREE.Group();
        scene.add(group);
        const headingOffset = toRadians(headingRef.current);
        for (const object of objectsRef.current) {
          const azimuth = toRadians(object.azimuth) - headingOffset;
          const altitude = toRadians(object.altitude);
          const radius = 10;
          const position = new THREE.Vector3(Math.sin(azimuth) * Math.cos(altitude) * radius, Math.sin(altitude) * radius, -Math.cos(azimuth) * Math.cos(altitude) * radius);
          const geometry = new THREE.SphereGeometry(object.kind === "body" ? 0.13 : 0.07, 12, 8);
          const material = new THREE.MeshBasicMaterial({ color: object.color });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.copy(position);
          group.add(mesh);
          const label = makeLabel(object);
          if (label) { label.position.copy(position); label.position.x += 0.22; label.position.y += 0.16; group.add(label); }
        }
        referenceSpace = await session.requestReferenceSpace("local-floor");
        renderer.xr.setReferenceSpace(referenceSpace);
        session.addEventListener("end", () => { renderer?.setAnimationLoop(null); renderer?.dispose(); renderer?.domElement.remove();         callbackRef.current?.("ended"); });
        setMessage("AR espacial activo. El cielo está anclado al espacio rastreado por el dispositivo; apuntá al norte antes de iniciar para alinear el rumbo.");
        callbackRef.current?.("active");
        renderer.setAnimationLoop(() => { if (renderer && scene) renderer.render(scene, renderer.xr.getCamera()); });
      } catch (error) {
        const unsupported = error instanceof Error && error.message === "unsupported";
        setMessage(unsupported ? "Tu dispositivo no admite WebXR AR auténtico." : "No se pudo iniciar la sesión WebXR AR. El planetario local sigue disponible.");
        callbackRef.current?.(unsupported ? "unsupported" : "error", "No se pudo iniciar la sesión WebXR AR.");
        try { await session?.end(); } catch { /* sesión no iniciada */ }
      }
    };
    void start();
    return () => { cancelled = true; renderer?.setAnimationLoop(null); renderer?.dispose(); if (session) void session.end().catch(() => undefined); };
  }, []);

  return <div ref={mountRef} className="webxr-ar-session" role="status" aria-live="polite"><span>{message}</span></div>;
}
