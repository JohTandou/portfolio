"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "./ReducedMotionProvider";

/* Provider Lenis pour le smooth scroll global.
   Garantit qu'un refresh/reload (F5) arrive toujours en haut de page
   malgré la restauration de scroll du navigateur et l'état interne de Lenis. */
export function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isReducedMotion } = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  /* Sauvegarde la valeur d'origine de scrollRestoration pour la
     restaurer proprement au démontage du provider */
  const originalScrollRestoration = useRef<ScrollRestoration>(
    typeof history !== "undefined" && "scrollRestoration" in history
      ? history.scrollRestoration
      : "auto",
  );

  useEffect(() => {
    /* ---- Désactive la restauration de scroll native du navigateur ----
       Sans cela, Chromium/Firefox replacent l'utilisateur à sa position
       de scroll précédente au reload, ce qui entre en conflit avec Lenis
       et casse l'expérience "toujours en haut au refresh". */
    if (typeof history !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    /* Si l'utilisateur préfère réduire les mouvements, on n'instancie pas
       Lenis mais on force quand même le scroll en haut. */
    if (isReducedMotion) {
      /* Même sans Lenis, on garantit le scroll en haut au reload
         pour contrer toute tentative de restauration de position */
      window.scrollTo(0, 0);

      return () => {
        /* Restauration de la propriété globale modifiée */
        if (typeof history !== "undefined" && "scrollRestoration" in history) {
          history.scrollRestoration = originalScrollRestoration.current;
        }
      };
    }

    const lenis = new Lenis({
      duration: 0.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true,
      autoResize: true,
    });

    lenisRef.current = lenis;
    /* Expose l'instance pour que Navigation puisse s'y abonner directement
       et obtenir des updates scroll immédiats */
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    /* Force le scroll tout en haut immédiatement après l'instanciation
       de Lenis. { immediate: true } évite toute animation parasite au
       chargement et garantit que le scroll s'exécute sans lerp. */
    lenis.scrollTo(0, { immediate: true });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      delete (window as Window & { __lenis?: Lenis }).__lenis;

      /* Restauration de la propriété globale modifiée au démontage */
      if (typeof history !== "undefined" && "scrollRestoration" in history) {
        history.scrollRestoration = originalScrollRestoration.current;
      }
    };
  }, [isReducedMotion]);

  return <>{children}</>;
}
