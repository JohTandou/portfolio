"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../providers/ReducedMotionProvider";

const SCRAMBLE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&$%";

interface TextScrambleProps {
  text: string;
  duration?: number;
  className?: string;
}

/**
 * Effet de text scramble cyberpunk.
 * Chaque caractère converge progressivement vers sa valeur finale
 * via un charset aléatoire avec stagger aléatoire.
 * Respecte les préférences de réduction de mouvement.
 */
export function TextScramble({
  text,
  duration = 800,
  className = "",
}: TextScrambleProps) {
  const { isReducedMotion } = useReducedMotion();
  const [displayText, setDisplayText] = useState(text);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isReducedMotion) {
      setDisplayText(text);
      return;
    }

    const chars = text.split("");
    const totalChars = chars.length;

    /* Stagger aléatoire : chaque caractère a un moment de début et de fin différent */
    const charMeta = chars.map((targetChar, index) => {
      const isWhitespace = /\s/.test(targetChar);
      const stagger = isWhitespace
        ? 0
        : Math.random() * 0.4 + (index / totalChars) * 0.3;
      const charDuration = isWhitespace ? 0 : 0.3 + Math.random() * 0.4;
      return {
        targetChar,
        isWhitespace,
        start: stagger,
        end: stagger + charDuration,
      };
    });

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const result = charMeta.map((meta) => {
        if (meta.isWhitespace) return meta.targetChar;

        if (progress >= meta.end) {
          return meta.targetChar;
        }

        if (progress >= meta.start) {
          /* Caractère en cours de résolution : on mélange aléatoirement */
          const charProgress = (progress - meta.start) / (meta.end - meta.start);
          /* Probabilité d'afficher le vrai caractère augmente avec le temps */
          if (Math.random() < charProgress) {
            return meta.targetChar;
          }
          return SCRAMBLE_CHARSET[
            Math.floor(Math.random() * SCRAMBLE_CHARSET.length)
          ];
        }

        /* Caractère pas encore commencé : caractère aléatoire */
        return SCRAMBLE_CHARSET[
          Math.floor(Math.random() * SCRAMBLE_CHARSET.length)
        ];
      });

      setDisplayText(result.join(""));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    startTimeRef.current = 0;
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [text, duration, isReducedMotion]);

  return (
    <span className={className} aria-label={text}>
      {displayText}
    </span>
  );
}
