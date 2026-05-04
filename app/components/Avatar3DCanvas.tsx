"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

/* ============================================================
   Avatar3DCanvas — Partie R3F isolée pour éviter le crash
   React 19 au chargement du module principal
   ============================================================ */

interface SceneContentProps {
  groupRef: React.RefObject<THREE.Group | null>;
}

function SceneContent({ groupRef }: SceneContentProps) {
  /* Particules flottantes — 100 points aléatoires dans une sphère de rayon 2 */
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.cbrt(Math.random()) * 2;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  const particlesRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    /* Rotation lente du groupe entier sur Y */
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
    /* Rotation indépendante des particules */
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.05;
      particlesRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Icosahedron extérieur — wireframe cyan */}
      <mesh>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshBasicMaterial
          color="var(--color-accent-1)"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Icosahedron intérieur — wireframe jaune, plus petit */}
      <mesh scale={0.6}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshBasicMaterial
          color="var(--color-primary)"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Particules flottantes */}
      <points ref={particlesRef} geometry={particlesGeometry}>
        <pointsMaterial
          color="var(--color-accent-1)"
          size={0.02}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

interface Avatar3DCanvasProps {
  groupRef: React.RefObject<{ setRotationY: (angle: number) => void } | null>;
  fallback: React.ReactNode;
}

export function Avatar3DCanvas({ groupRef, fallback }: Avatar3DCanvasProps) {
  const [hasError, setHasError] = useState(false);
  const threeGroupRef = useRef<THREE.Group>(null);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  /* Synchronise le ref externe avec le ref Three.js après le montage */
  useEffect(() => {
    if (groupRef.current && threeGroupRef.current) {
      groupRef.current.setRotationY = (angle: number) => {
        if (threeGroupRef.current) {
          threeGroupRef.current.rotation.y = angle;
        }
      };
    }
  }, [groupRef]);

  if (hasError) {
    return <>{fallback}</>;
  }

  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: "clamp(180px, 25vw, 320px)",
        height: "clamp(180px, 25vw, 320px)",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 50 }}
        onError={handleError}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <SceneContent groupRef={threeGroupRef} />
      </Canvas>
    </div>
  );
}
