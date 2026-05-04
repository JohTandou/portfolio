"use client";

import { useState, useRef, useCallback } from "react";
import { HeroBackground } from "../components/HeroBackground";
import { HeroMenu } from "../components/HeroMenu";
import { HeroTransitionOverlay } from "../components/HeroTransitionOverlay";
import { useReducedMotion } from "../providers/ReducedMotionProvider";
import { useHeroTransition } from "../hooks/useHeroTransition";

/* ============================================================
   HeroSection — Section hero immersive avec menu CP2077
   et transitions vidéo programmatiques.
   ============================================================ */

export function HeroSection() {
  const { isReducedMotion } = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isReady, setIsReady] = useState(true);

  const handleVideoReady = useCallback((video: HTMLVideoElement, duration: number) => {
    videoRef.current = video;
    setVideoDuration(duration);
    setIsReady(true);
  }, []);

  const { isTransitioning, navigateTo } = useHeroTransition({
    videoRef,
    videoDuration,
    isReducedMotion,
  });

  const handleNavigate = (sectionId: string) => {
    navigateTo(sectionId);
  };

  return (
    <section id="hero" className="relative min-h-[200vh] overflow-hidden">
      <div className="sticky top-0 h-screen w-full">
        {/* Arrière-plan Hero avec vidéo */}
        <HeroBackground onVideoReady={handleVideoReady} />

        {/* Overlay de transition */}
        <HeroTransitionOverlay isVisible={isTransitioning} />

        {/* Contenu du menu CP2077 */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-8 md:items-start md:justify-center md:pb-0">
          <HeroMenu
            onNavigate={handleNavigate}
            isTransitioning={isTransitioning || !isReady}
          />
        </div>
      </div>
    </section>
  );
}
