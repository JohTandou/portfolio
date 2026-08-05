"use client";

import { useEffect, useState, useRef } from "react";

/* Options pour le hook d'activité de section.
   Centralise IntersectionObserver + Page Visibility API
   pour partager l'état "actif" entre RainOverlay. */
interface UseSectionActivityOptions {
  /** ID de l'élément section à observer */
  sectionId: string;
  /** Seuil d'intersection (0–1). Défaut 0. */
  threshold?: number;
}

export interface SectionActivityState {
  /** La section est dans le viewport */
  isVisible: boolean;
  /** L'onglet du navigateur est actif */
  isPageVisible: boolean;
  /** true si isVisible ET isPageVisible — prêt à animer */
  isActive: boolean;
}

const SUPPORTS_INTERSECTION =
  typeof IntersectionObserver !== "undefined";

export function useSectionActivity(
  options: UseSectionActivityOptions
): SectionActivityState {
  const { sectionId, threshold = 0 } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  /* ── IntersectionObserver sur l'élément section ── */
  useEffect(() => {
    if (!SUPPORTS_INTERSECTION) return;

    /* Attendre que le DOM soit prêt (Next.js hydration) */
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(sectionId);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold }
      );

      observer.observe(el);
      observerRef.current = observer;
    });

    return () => {
      cancelAnimationFrame(raf);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [sectionId, threshold]);

  /* ── Page Visibility API ── */
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibility = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    /* État initial */
    handleVisibility();

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const isActive = isVisible && isPageVisible;

  return { isVisible, isPageVisible, isActive };
}
