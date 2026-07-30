"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "./ReducedMotionProvider";

/* Provider Lenis pour le smooth scroll global */
export function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isReducedMotion } = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    /* Si l'utilisateur préfère réduire les mouvements, on n'instancie pas Lenis */
    if (isReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 0.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true,
      autoResize: true,
    });

    lenisRef.current = lenis;
    /* Expose l'instance pour que HeroBackground puisse s'y abonner
       directement et obtenir des updates scroll immédiats */
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, [isReducedMotion]);

  return <>{children}</>;
}
