"use client";

import { useRef, useEffect, useState } from "react";
import { useReducedMotion } from "../providers/ReducedMotionProvider";

/* ============================================================
   HeroBackground — Vidéo scroll-driven avec pin scroll
   Le scroll est capturé par la vidéo tant qu'elle n'est pas
   terminée. Quand la vidéo atteint la fin, le scroll natif
   reprend. Quand on remonte en haut de page, le pin scroll
   se réactive automatiquement.

   Expose la vidéo et sa durée au parent via onVideoReady.
   ============================================================ */

const VIDEO_SRC = "/assets/videos/hero-video.mp4";
const SCROLL_FOR_FULL_VIDEO = 5000;

interface HeroBackgroundProps {
  onVideoReady?: (video: HTMLVideoElement, duration: number) => void;
}

export function HeroBackground({ onVideoReady }: HeroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isReducedMotion } = useReducedMotion();
  const [videoDuration, setVideoDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  /* Chargement de la durée vidéo */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const duration = video.duration;
      setVideoDuration(duration);
      setIsReady(true);
      onVideoReady?.(video, duration);
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [onVideoReady]);

  /* Pin scroll — capture le scroll pour la vidéo */
  useEffect(() => {
    if (isReducedMotion || !isReady || videoDuration === 0) return;

    const video = videoRef.current;
    if (!video) return;

    const lenis = (window as Window & { __lenis?: { stop: () => void; start: () => void; on: (event: string, cb: (e: { scroll: number }) => void) => void; off: (event: string, cb: (e: { scroll: number }) => void) => void } }).__lenis;

    /* Fallback natif quand Lenis n'est pas présent */
    if (!lenis) {
      const container = document.getElementById("hero");
      if (!container) return;
      const scrollRange = container.offsetHeight - window.innerHeight;
      if (scrollRange <= 0) return;

      const handleScroll = () => {
        const progress = Math.max(0, Math.min(1, window.scrollY / scrollRange));
        video.currentTime = progress * videoDuration;
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }

    /* Mode pin scroll avec Lenis */
    let accumulatedScroll = 0;
    let hasStoppedLenis = false;
    let lenisScrollCleanup: (() => void) | null = null;

    const stopLenis = () => {
      if (!hasStoppedLenis) {
        lenis.stop();
        hasStoppedLenis = true;
      }
    };

    const startLenis = () => {
      if (hasStoppedLenis) {
        lenis.start();
        hasStoppedLenis = false;
      }
    };

    /* Quand Lenis est actif, on s'abonne à son scroll pour savoir
       quand on remonte en haut de page (scroll <= 0) */
    const watchLenisScroll = () => {
      const handleLenisScroll = (e: { scroll: number }) => {
        if (e.scroll <= 0) {
          /* On est revenu en haut → reprendre le pin scroll */
          if (lenisScrollCleanup) {
            lenisScrollCleanup();
            lenisScrollCleanup = null;
          }
          stopLenis();
          attachWheel();
        }
      };
      lenis.on("scroll", handleLenisScroll);
      lenisScrollCleanup = () => lenis.off("scroll", handleLenisScroll);
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        /* Scroll vers le bas */
        if (accumulatedScroll >= SCROLL_FOR_FULL_VIDEO) {
          /* Vidéo terminée → redémarrer Lenis et laisser défiler */
          window.removeEventListener("wheel", handleWheel);
          startLenis();
          watchLenisScroll();
          return;
        }
        e.preventDefault();
        accumulatedScroll += e.deltaY;
      } else {
        /* Scroll vers le haut */
        if (accumulatedScroll <= 0) {
          e.preventDefault(); /* Empêche le bounce Mac */
          return;
        }
        e.preventDefault();
        accumulatedScroll += e.deltaY;
      }

      accumulatedScroll = Math.max(0, Math.min(SCROLL_FOR_FULL_VIDEO, accumulatedScroll));
      const progress = accumulatedScroll / SCROLL_FOR_FULL_VIDEO;
      video.currentTime = progress * videoDuration;
    };

    const attachWheel = () => {
      window.addEventListener("wheel", handleWheel, { passive: false });
    };

    /* Démarrer en mode vidéo (Lenis arrêté) */
    stopLenis();
    attachWheel();

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (lenisScrollCleanup) lenisScrollCleanup();
      if (hasStoppedLenis) lenis.start();
    };
  }, [isReducedMotion, isReady, videoDuration]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay scanline + vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-bg-deep)] opacity-80" />
      <div className="absolute inset-0 bg-[var(--color-bg-deep)] opacity-40 mix-blend-multiply" />

      {/* Grain subtil */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
