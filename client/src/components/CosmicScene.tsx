import { useEffect, useRef } from "react";
import * as THREE from "three";

function seeded(index: number) {
  const value = Math.sin(index * 91.317 + 7.41) * 43758.5453;
  return value - Math.floor(value);
}

export function CosmicScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let frame = 0;
    try {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0, 18);
      const cosmos = new THREE.Group();
      scene.add(cosmos);

      const count = window.innerWidth < 700 ? 180 : 520;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const color = new THREE.Color();
      for (let index = 0; index < count; index += 1) {
        const radius = 5 + seeded(index) * 27;
        const theta = seeded(index + 21) * Math.PI * 2;
        const phi = Math.acos(2 * seeded(index + 101) - 1);
        positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[index * 3 + 1] = radius * Math.cos(phi) * 0.72;
        positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 8;
        color.setHSL(0.63 + seeded(index + 73) * 0.16, 0.52, 0.65 + seeded(index + 7) * 0.24);
        colors[index * 3] = color.r;
        colors[index * 3 + 1] = color.g;
        colors[index * 3 + 2] = color.b;
      }
      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ size: 0.045, transparent: true, opacity: 0.78, vertexColors: true, depthWrite: false }));
      cosmos.add(stars);

      const orbitGroup = new THREE.Group();
      orbitGroup.position.set(5.6, 1.2, -5.5);
      orbitGroup.rotation.set(0.35, -0.25, 0.4);
      const rings = [3.6, 5.2, 6.9];
      rings.forEach((radius, index) => {
        const geometry = new THREE.TorusGeometry(radius, 0.011, 5, 96);
        const material = new THREE.MeshBasicMaterial({ color: index === 1 ? 0xe7c99c : 0x9e9af2, transparent: true, opacity: index === 1 ? 0.42 : 0.25 });
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = Math.PI / 2 + index * 0.28;
        ring.rotation.y = index * 0.36;
        orbitGroup.add(ring);
      });
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.8, 20, 20), new THREE.MeshBasicMaterial({ color: 0xf5c980, transparent: true, opacity: 0.95 }));
      orbitGroup.add(core);
      const companion = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 14), new THREE.MeshBasicMaterial({ color: 0xc1b0ff }));
      companion.position.set(3.55, 0.8, 0.2);
      orbitGroup.add(companion);
      cosmos.add(orbitGroup);

      const pointer = { x: 0, y: 0 };
      const handlePointer = (event: PointerEvent) => {
        pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
      };
      const resize = () => {
        if (!renderer) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };
      const render = () => {
        if (!renderer) return;
        cosmos.rotation.y += reducedMotion ? 0 : 0.00055;
        cosmos.rotation.x += reducedMotion ? 0 : (pointer.y * 0.035 - cosmos.rotation.x) * 0.016;
        orbitGroup.rotation.z += reducedMotion ? 0 : 0.0011;
        camera.position.x += reducedMotion ? 0 : (pointer.x * 0.62 - camera.position.x) * 0.02;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        if (!reducedMotion) frame = window.requestAnimationFrame(render);
      };
      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", handlePointer, { passive: true });
      resize();
      render();

      return () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", handlePointer);
        starGeometry.dispose();
        (stars.material as THREE.Material).dispose();
        orbitGroup.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            (object.material as THREE.Material).dispose();
          }
        });
        renderer?.dispose();
      };
    } catch {
      renderer?.dispose();
      return;
    }
  }, []);

  return <canvas ref={canvasRef} className="cosmic-scene" aria-hidden="true" />;
}
