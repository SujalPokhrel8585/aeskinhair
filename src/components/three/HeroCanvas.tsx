import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Scene from "./Scene";
import { getPerfTier } from "@/lib/deviceCapability";

/**
 * The 3D stethoscope hero canvas. Loaded via React.lazy so three.js stays out
 * of the main bundle and the page paints first.
 *
 * Adaptive quality: on weaker phones (see lib/deviceCapability) we keep the
 * model fully interactive but render it cheaper - lower dpr, no shadows and
 * no antialiasing. Powerful devices get the exact same look as before.
 */
export default function HeroCanvas() {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = getPerfTier();

  // Pause rendering when canvas is scrolled out of view to fix scroll lag
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 h-110 w-full">
      <Canvas
        className="hero-canvas"
        frameloop={isVisible ? "always" : "never"}
        dpr={tier === "high" ? [1, 2] : [1, 1.5]}
        shadows={tier === "high" ? { type: THREE.PCFSoftShadowMap } : false}
        gl={{ alpha: true, antialias: tier === "high" }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
