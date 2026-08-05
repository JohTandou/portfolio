"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
   useAudioPlayer — Contrôle l'audio d'ambiance du portfolio
   Basé sur HTMLAudioElement natif, sans dépendance externe.
   Audio désactivé par défaut, activation manuelle uniquement.
   ============================================================ */

const AUDIO_SRC = "/audio/portfolio-music.mp3";

interface AudioPlayerState {
  isActive: boolean;
  toggle: () => void;
  activate: () => void;
  deactivate: () => void;
}

export function useAudioPlayer(): AudioPlayerState {
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* Initialisation unique du HTMLAudioElement */
  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      /* Cleanup complet à l'unmount */
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
      audio.load();
      audioRef.current = null;
    };
  }, []);

  /* Activation : remet currentTime à 0, loop = true, lance la lecture */
  const activate = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.loop = true;

    try {
      await audio.play();
      setIsActive(true);
    } catch {
      /* play() rejeté (ex. politique d'autoplay du navigateur).
         On reste cohérent : isActive reste false, pas de log. */
    }
  }, []);

  /* Désactivation : pause + reset de la position */
  const deactivate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsActive(false);
  }, []);

  /* Bascule activation/désactivation */
  const toggle = useCallback(() => {
    if (isActive) {
      deactivate();
    } else {
      activate();
    }
  }, [isActive, activate, deactivate]);

  return { isActive, toggle, activate, deactivate };
}
