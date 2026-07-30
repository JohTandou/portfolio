"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

/* Contexte pour la préférence de réduction des mouvements */
interface ReducedMotionContextValue {
  isReducedMotion: boolean;
  toggleReducedMotion: () => void;
}

const ReducedMotionContext = createContext<ReducedMotionContextValue>({
  isReducedMotion: false,
  toggleReducedMotion: () => {},
});

export function useReducedMotion() {
  return useContext(ReducedMotionContext);
}

export function ReducedMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    /* Lecture de la préférence système et du localStorage au montage */
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stored = localStorage.getItem("reduced-motion");

    if (stored !== null) {
      setIsReducedMotion(stored === "true");
    } else {
      setIsReducedMotion(mediaQuery.matches);
    }

    /* Écoute des changements de préférence système */
    const handleChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem("reduced-motion") === null) {
        setIsReducedMotion(event.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  /* Synchronisation de la classe CSS .reduced-motion sur <html> */
  useEffect(() => {
    if (isReducedMotion) {
      document.documentElement.classList.add("reduced-motion");
    } else {
      document.documentElement.classList.remove("reduced-motion");
    }
  }, [isReducedMotion]);

  const toggleReducedMotion = useCallback(() => {
    setIsReducedMotion((prev) => {
      const next = !prev;
      localStorage.setItem("reduced-motion", String(next));
      return next;
    });
  }, []);

  return (
    <ReducedMotionContext.Provider
      value={{ isReducedMotion, toggleReducedMotion }}
    >
      {children}
    </ReducedMotionContext.Provider>
  );
}
