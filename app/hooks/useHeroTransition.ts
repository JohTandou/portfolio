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
    (sectionId: string, targetProgress?: number) => {
      if (isTransitioning) return;

      const video = videoRef.current;

      /* Fallback : si la vidéo n'est pas prête, scroll direct */
      if (!video || videoDuration === 0) {
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
        return;
      }

      setIsTransitioning(true);

      const currentTime = video.currentTime;
      const isDirectScrub = targetProgress !== undefined;

      const targetTime = isDirectScrub
        ? Math.max(0, Math.min(videoDuration, targetProgress * videoDuration))
        : videoDuration;

      const scrubDuration = isDirectScrub
        ? 0.6
        : videoDuration > 0
          ? videoDuration * 0.5
          : 3;

      /* Mode réduit : transition instantanée */
      if (isReducedMotion) {
        video.currentTime = targetTime;
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "auto" });
        setIsTransitioning(false);
        return;
      }

      /* Animation GSAP du scrub vidéo */
      const scrubObj = { t: currentTime };
      transitionRef.current = gsap.to(scrubObj, {
        t: targetTime,
        duration: scrubDuration,
        ease: "power1.inOut",
        onUpdate: () => {
          video.currentTime = scrubObj.t;
        },
        onComplete: () => {
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
