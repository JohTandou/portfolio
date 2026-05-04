"use client";

import { useState, useCallback, useRef } from "react";

/* ============================================================
   useHeroTransition — Orchestration des transitions vidéo
   Scrub la vidéo frame par frame à 30fps puis déclenche
   le scroll vers la section cible.
   ============================================================ */

const FPS = 30;

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
  const rafRef = useRef<number | null>(null);

  const navigateTo = useCallback(
    (sectionId: string) => {
      if (isTransitioning) return;

      const video = videoRef.current;

      /* Fallback : si la vidéo n'est pas prête, scroll direct */
      if (!video || videoDuration === 0) {
        const el = document.getElementById(sectionId);
        if (el) {
          window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
        }
        return;
      }

      setIsTransitioning(true);

      /* Mode réduit : transition instantanée */
      if (isReducedMotion) {
        video.currentTime = videoDuration;
        const el = document.getElementById(sectionId);
        if (el) {
          window.scrollTo({ top: el.offsetTop, behavior: "auto" });
        }
        setIsTransitioning(false);
        return;
      }

      const totalFrames = Math.round(videoDuration * FPS);
      const scrubDurationMs = (totalFrames / FPS) * 1000;
      const startTime = performance.now();
      const startFrame = Math.round(video.currentTime * FPS);

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / scrubDurationMs);
        const targetFrame = Math.round(
          startFrame + progress * (totalFrames - startFrame)
        );

        video.currentTime = targetFrame / FPS;

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          const el = document.getElementById(sectionId);
          if (el) {
            window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
          }
          setTimeout(() => {
            setIsTransitioning(false);
          }, 400);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [isTransitioning, videoDuration, videoRef, isReducedMotion]
  );

  const cancelTransition = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsTransitioning(false);
  }, []);

  return { isTransitioning, navigateTo, cancelTransition };
}
