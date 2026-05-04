"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";

/* ============================================================
   Avatar3D — Sculpture abstraite wireframe + particules flottantes
   Direction esthétique : cyberpunk minimaliste, éclairage néon

   NOTE : Le canvas R3F est temporairement désactivé car
   @react-three/fiber n'est pas encore compatible avec React 19.
   Le fallback SVG animé est utilisé à la place.
   ============================================================ */

export interface Avatar3DHandle {
  setRotationY: (angle: number) => void;
}

interface Avatar3DProps {
  className?: string;
}

/* Fallback SVG statique avec animations CSS */
function AvatarFallback() {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: "clamp(180px, 25vw, 320px)",
        height: "clamp(180px, 25vw, 320px)",
      }}
    >
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="var(--color-accent-3)"
          strokeWidth="1.5"
          strokeDasharray="30 15"
          style={{ transformOrigin: "center", animation: "spin 20s linear infinite" }}
        />
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
          strokeDasharray="20 20"
          style={{ transformOrigin: "center", animation: "spin-reverse 15s linear infinite" }}
        />
        <circle
          cx="100"
          cy="100"
          r="50"
          fill="none"
          stroke="var(--color-accent-1)"
          strokeWidth="1.5"
          strokeDasharray="15 25"
          style={{ transformOrigin: "center", animation: "spin 12s linear infinite" }}
        />
        <circle
          cx="100"
          cy="100"
          r="25"
          fill="none"
          stroke="var(--color-text-dim)"
          strokeWidth="0.5"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}

export const Avatar3D = forwardRef<Avatar3DHandle, Avatar3DProps>(
  function Avatar3D({ className = "" }, ref) {
    const isMobile = useMediaQuery("(max-width: 767px)");

    /* Exposition du ref pour contrôle externe (stub — pas de rotation 3D en SVG) */
    useImperativeHandle(ref, () => ({
      setRotationY: () => {
        /* Pas d'implémentation en mode fallback SVG */
      },
    }));

    /* Sur mobile ET desktop : fallback SVG (R3F désactivé temporairement) */
    if (isMobile || true) {
      return <AvatarFallback />;
    }
  }
);
