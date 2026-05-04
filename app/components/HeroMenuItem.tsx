"use client";

/* Composant item de menu cyberpunk individuel */
import { motion } from "framer-motion";

interface HeroMenuItemProps {
  label: string;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  index: number;
  isPrimary?: boolean;
}

export function HeroMenuItem({
  label,
  onClick,
  isActive = false,
  isDisabled = false,
  index,
  isPrimary = false,
}: HeroMenuItemProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDisabled ? 0.4 : 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        group relative w-full cursor-pointer border-none bg-transparent text-left
        px-3 py-2.5 transition-colors duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-1)]
        disabled:cursor-not-allowed
        ${isPrimary ? "font-display text-lg font-bold uppercase tracking-widest" : "font-terminal text-base uppercase tracking-wider"}
      `}
    >
      {/* Ligne de séparation animée */}
      <span
        className="absolute top-0 left-0 h-px w-full origin-left scale-x-0 bg-[var(--color-primary)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
        style={{ transitionDelay: "50ms" }}
      />

      {/* Curseur clignotant */}
      {isActive && (
        <span
          className="mr-2 inline-block text-[var(--color-accent-1)]"
          style={{ animation: "blink 1s step-end infinite" }}
        >
          &gt;
        </span>
      )}

      {/* Label */}
      <span className="relative z-10 text-[var(--color-text-high)] transition-colors duration-300 group-hover:text-[var(--color-bg-deep)]">
        {label}
      </span>

      {/* Fond hover jaune */}
      <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[var(--color-primary)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
    </motion.button>
  );
}
