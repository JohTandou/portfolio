"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "../providers/ReducedMotionProvider";

const DIGITS = "0123456789";

interface DigitizeTextProps {
  text: string;
  onComplete?: () => void;
  duration?: number;
}

/* Effet de numérisation : caractères → chiffres → disparition */
export function DigitizeText({ text, onComplete, duration = 1500 }: DigitizeTextProps) {
  const { isReducedMotion } = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (isReducedMotion) {
      setDisplay("");
      onComplete?.();
      return;
    }

    let start = 0;
    let raf: number;
    const chars = text.split("");

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);

      const result = chars.map((char, i) => {
        if (char === " ") return " ";
        const charStart = (i / chars.length) * 0.6;
        if (progress > charStart + 0.4) return "";
        if (progress > charStart) return DIGITS[Math.floor(Math.random() * DIGITS.length)];
        return char;
      });

      setDisplay(result.join(""));
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [text, duration, isReducedMotion, onComplete]);

  if (isReducedMotion) return null;

  return <span className="font-mono text-green-400">{display}</span>;
}
