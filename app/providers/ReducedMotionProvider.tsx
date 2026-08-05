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
    /* Clear stale localStorage from removed toggle button */
    localStorage.removeItem("reduced-motion");
    setIsReducedMotion(false);
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
    /* No-op — toggle button has been removed, effects always active */
  }, []);

  return (
    <ReducedMotionContext.Provider
      value={{ isReducedMotion, toggleReducedMotion }}
    >
      {children}
    </ReducedMotionContext.Provider>
  );
}
