"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { useReducedMotion } from "../providers/ReducedMotionProvider";

interface TerminalButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
}

/* Bouton style terminal cyberpunk — bordure cyan, glow jaune au hover */
export function TerminalButton({ children, className = "", ...props }: TerminalButtonProps) {
  const { isReducedMotion } = useReducedMotion();

  return (
    <motion.button
      type="button"
      className={`relative overflow-hidden border border-[var(--color-accent-1)] bg-transparent px-8 py-3 font-terminal text-lg tracking-widest text-[var(--color-accent-1)] transition-colors hover:bg-[var(--color-accent-1)] hover:text-[var(--color-bg-deep)] hover:shadow-[0_0_20px_rgba(252,238,10,0.4)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      whileHover={isReducedMotion ? {} : { scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
