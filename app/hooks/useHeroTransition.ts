"use client";

import { useState, useCallback, useRef } from "react";
import { gsap } from "gsap";

/* ============================================================
   useHeroTransition — Orchestration des transitions vidéo
   Verrouille les inputs, scrub la vidéo via GSAP et déclenche
   le scroll vers la section cible.
   ============================================================ */

interface UseHeroTransitionOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoDuration: number;
  isReducedMotion: boolean;
}

export function useHeroTransition({
  videoRef,
  videoDuration,
  isReducedMotion,
}: UseHeroTransitionOptions) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionRef = useRef<gsap.core.Tween | null>(null);

  const navigateTo = useCallback(
    (targetProgress: number, sectionId?: string) => {
      if (isTransitioning || videoDuration === 0) return;

      const video = videoRef.current;
      if (!video) return;

      setIsTransitioning(true);

      const targetTime = Math.max(
        0,
        Math.min(videoDuration, targetProgress * videoDuration)
      );
      const currentTime = video.currentTime;

      /* Mode réduit : transition instantanée */
      if (isReducedMotion) {
        video.currentTime = targetTime;
        if (sectionId) {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: "auto" });
        }
        setIsTransitioning(false);
        return;
      }

      /* Animation GSAP du scrub vidéo */
      const scrubObj = { t: currentTime };
      transitionRef.current = gsap.to(scrubObj, {
        t: targetTime,
        duration: 0.6,
        ease: "power2.inOut",
        onUpdate: () => {
          video.currentTime = scrubObj.t;
        },
        onComplete: () => {
          if (sectionId) {
            const el = document.getElementById(sectionId);
            if (el) {
              const lenis = (
                window as Window & {
                  __lenis?: {
                    scrollTo: (target: string | HTMLElement, options?: object) => void;
                  };
                }
              ).__lenis;
              if (lenis) {
                lenis.scrollTo(el, { offset: 0 });
              } else {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }
          }
          setTimeout(() => {
            setIsTransitioning(false);
          }, 400);
        },
      });
    },
    [isTransitioning, videoDuration, videoRef, isReducedMotion]
  );

  const cancelTransition = useCallback(() => {
    if (transitionRef.current) {
      transitionRef.current.kill();
      transitionRef.current = null;
    }
    setIsTransitioning(false);
  }, []);

  return { isTransitioning, navigateTo, cancelTransition };
}
