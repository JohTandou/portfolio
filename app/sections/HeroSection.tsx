"use client";

import { useEffect, useState, useRef } from "react";
import { HeroBackground, HeroBackgroundHandle } from "../components/HeroBackground";
import { HeroMenu } from "../components/HeroMenu";
import { HeroTransitionOverlay } from "../components/HeroTransitionOverlay";
import { useReducedMotion } from "../providers/ReducedMotionProvider";
import { useHeroTransition } from "../hooks/useHeroTransition";
import { VIDEO_TARGETS } from "../lib/constants";

/* ============================================================
   HeroSection — Section hero immersive avec menu CP2077
   et transitions vidéo programmatiques.
   ============================================================ */

export function HeroSection() {
  const { isReducedMotion } = useReducedMotion();
  const heroBgRef = useRef<HeroBackgroundHandle>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);

  /* Récupération asynchrone de la vidéo et de sa durée */
  useEffect(() => {
    const handle = heroBgRef.current;
    if (!handle) return;

    const interval = setInterval(() => {
      const video = handle.getVideoElement();
      const duration = handle.getDuration();
      if (video && duration > 0) {
        videoRef.current = video;
        setVideoDuration(duration);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const { isTransitioning, navigateTo } = useHeroTransition({
    videoRef,
    videoDuration,
    isReducedMotion,
  });

  const handleNavigate = (sectionId: string) => {
    const targetProgress = VIDEO_TARGETS[sectionId] ?? 0.05;

    if (sectionId === "continue") {
      // "Continuer" = débloquer le scroll (scrub léger puis scroll libre)
      navigateTo(targetProgress);
      return;
    }

    // Autres sections : scrub vidéo + scroll vers section
    navigateTo(targetProgress, sectionId);
  };

  return (
    <section id="hero" className="relative min-h-[200vh] overflow-hidden">
      <div className="sticky top-0 h-screen w-full">
        {/* Arrière-plan Hero avec vidéo */}
        <HeroBackground ref={heroBgRef} />

        {/* Overlay de transition */}
        <HeroTransitionOverlay isVisible={isTransitioning} />

        {/* Contenu du menu CP2077 */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-8 md:items-start md:justify-center md:pb-0">
          <HeroMenu onNavigate={handleNavigate} isTransitioning={isTransitioning} />
        </div>
      </div>
    </section>
  );
}
