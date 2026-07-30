"use client";
import { useEffect, useRef } from "react";

/* Hook de sécurité : force opacity:1 si l'élément n'est pas devenu visible après un délai.
   Filet de sécurité pour les animations whileInView qui pourraient ne pas se déclencher
   (scroll containers, SSR, CPU lent). */
export function useAnimationFallback(timeout = 3000) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const timer = setTimeout(() => {
      if (el.style.opacity === "0" || getComputedStyle(el).opacity === "0") {
        el.style.opacity = "1";
        el.style.transform = "none";
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  return ref;
}
