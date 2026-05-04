"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "../providers/ReducedMotionProvider";

/* Barre de progression animée, réutilisable pour les langues */
interface AnimatedBarProps {
  target: number;
  delay?: number;
  className?: string;
}

export function AnimatedBar({ target, delay = 0, className = "" }: AnimatedBarProps) {
  const { isReducedMotion } = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [width, setWidth] = useState(isReducedMotion ? target : 0);

  useEffect(() => {
    if (isReducedMotion) {
      setWidth(target);
      return;
    }

    if (isInView) {
      const timer = setTimeout(() => {
        setWidth(target);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, target, delay, isReducedMotion]);

  return (
    <div
      ref={ref}
      className={`w-full overflow-hidden rounded-sm ${className}`}
      style={{
        backgroundColor: "var(--color-bg-elevated)",
        height: "4px",
      }}
    >
      <motion.div
        className="h-full rounded-sm"
        style={{
          backgroundColor: "var(--color-accent-1)",
          width: `${width}%`,
          transition: isReducedMotion
            ? "none"
            : `width 1s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
        }}
      />
    </div>
  );
}
