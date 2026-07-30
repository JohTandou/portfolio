"use client";

import { useEffect, useState, useCallback } from "react";
import { useReducedMotion } from "../providers/ReducedMotionProvider";

const BOOT_LINES = [
  "> SYSTEM_BOOT_INITIATED...",
  "> LOADING_KERNEL_MODULES...[OK]",
  "> MOUNTING_FILESYSTEMS...[OK]",
  "> INITIALIZING_GRAPHICS_SUBSYSTEM...[OK]",
  "> WELCOME, USER.",
];

/* Durée totale cible ~1.5s répartie sur les lignes */
const TYPING_SPEED_MS = 30;

/**
 * Overlay de séquence de boot terminal cyberpunk.
 * S'affiche une seule fois par session via localStorage.
 * Respecte les préférences de réduction de mouvement.
 */
export function BootSequence() {
  const { isReducedMotion } = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  /* Finalisation de la séquence : fade-out et persistence */
  const handleComplete = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("visited", "true");
      }
    }, 500);
  }, []);

  /* Vérification de localStorage au montage pour éviter le flash */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasVisited = localStorage.getItem("visited") === "true";
    if (!hasVisited) {
      setIsVisible(true);
    }
  }, []);

  /* Animation typewriter ligne par ligne */
  useEffect(() => {
    if (!isVisible) return;

    if (isReducedMotion) {
      /* Mode réduit : affichage instantané de toutes les lignes */
      setDisplayedLines(BOOT_LINES);
      const timer = setTimeout(() => {
        handleComplete();
      }, 800);
      return () => clearTimeout(timer);
    }

    if (currentLineIndex >= BOOT_LINES.length) {
      /* Toutes les lignes sont tapées, on attend un court délai puis on ferme */
      const timer = setTimeout(() => {
        handleComplete();
      }, 600);
      return () => clearTimeout(timer);
    }

    const line = BOOT_LINES[currentLineIndex];

    if (currentCharIndex >= line.length) {
      /* Ligne terminée, on passe à la suivante après un court délai */
      const timer = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, 120);
      return () => clearTimeout(timer);
    }

    /* Affichage caractère par caractère */
    const timer = setTimeout(() => {
      setDisplayedLines((prev) => {
        const next = [...prev];
        next[currentLineIndex] = line.slice(0, currentCharIndex + 1);
        return next;
      });
      setCurrentCharIndex((prev) => prev + 1);
    }, TYPING_SPEED_MS);

    return () => clearTimeout(timer);
  }, [isVisible, isReducedMotion, currentLineIndex, currentCharIndex, handleComplete]);

  const handleSkip = useCallback(() => {
    if (!isVisible || isFadingOut) return;
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("visited", "true");
      }
    }, 300);
  }, [isVisible, isFadingOut]);

  if (!isVisible) return null;

  const isLastLineComplete =
    currentLineIndex === BOOT_LINES.length - 1 &&
    currentCharIndex >= BOOT_LINES[BOOT_LINES.length - 1].length;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-deep)] transition-opacity duration-500 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleSkip}
      role="dialog"
      aria-label="Séquence de démarrage"
      aria-live="polite"
    >
      {/* Bordure fine cyan */}
      <div className="absolute inset-4 border border-[var(--color-accent-1)] opacity-30 sm:inset-8" />

      <div className="glass-panel p-8 relative z-10 w-full max-w-2xl">
        {BOOT_LINES.map((line, lineIdx) => {
          const isDisplayed = lineIdx < displayedLines.length;
          const displayText = displayedLines[lineIdx] ?? "";
          const isCurrentLine = lineIdx === displayedLines.length - 1;

          if (!isDisplayed) return null;

          return (
            <div
              key={line}
              className="font-terminal text-sm tracking-wide text-[var(--color-accent-1)] sm:text-base"
              style={{ lineHeight: 1.8 }}
            >
              {displayText}
              {isCurrentLine && !isReducedMotion && (
                <span className="ml-0.5 inline-block animate-pulse text-[var(--color-accent-1)]">
                  ▋
                </span>
              )}
            </div>
          );
        })}

        {isLastLineComplete && !isReducedMotion && (
          <div className="mt-4 font-terminal text-xs text-[var(--color-text-dim)] animate-pulse">
            [CLIQUEZ N'IMPORTE OÙ POUR PASSER]
          </div>
        )}
      </div>
    </div>
  );
}
