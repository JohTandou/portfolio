"use client";

import { useState, useEffect } from "react";

/* ============================================================
   useKonamiCode — Détecte la séquence Konami (↑↑↓↓←→←→BA)
   ============================================================ */

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/* Détecte la séquence Konami et déclenche un callback */
export function useKonamiCode(onActivate: () => void) {
  const [sequence, setSequence] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setSequence((prev) => {
        const next = [...prev, e.key];
        if (next.length > KONAMI_SEQUENCE.length) {
          next.shift();
        }
        if (next.join(",") === KONAMI_SEQUENCE.join(",")) {
          onActivate();
          return [];
        }
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onActivate]);

  return sequence;
}
