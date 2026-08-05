"use client";

import { ArrowUpRight } from "lucide-react";
import { RoadmapCheckpoint } from "../types";

interface RoadmapCheckpointProps {
  checkpoint: RoadmapCheckpoint;
  isActive: boolean;
  onClick: () => void;
}

/* Checkpoint cliquable sur la timeline de la feuille de route */
export function RoadmapCheckpointComponent({
  checkpoint,
  isActive,
  onClick,
}: RoadmapCheckpointProps) {
  return (
    <button
      className="glass-card p-4 group relative flex flex-col items-center gap-3 text-left md:items-start"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${checkpoint.label}: ${checkpoint.title}`}
    >
      {/* Cercle néon */}
      <div
        className="h-6 w-6 flex-shrink-0 rounded-full border-2 transition-transform duration-200 group-hover:scale-110"
        style={{
          borderColor: "var(--color-accent-1)",
          boxShadow: isActive
            ? "0 0 12px var(--color-accent-1), inset 0 0 6px rgba(0,240,255,0.3)"
            : "none",
          backgroundColor: isActive
            ? "rgba(0, 240, 255, 0.15)"
            : "transparent",
        }}
      />

      {/* Label */}
      <span
        className="font-mono text-xs uppercase tracking-widest"
        style={{
          color: isActive ? "var(--color-accent-1)" : "var(--color-text-dim)",
        }}
      >
        {checkpoint.label}
      </span>

      {/* Titre */}
      <h3
        className="font-display text-lg font-semibold"
        style={{ color: "var(--color-text-high)" }}
      >
        {checkpoint.title}
      </h3>

      {/* Description */}
      <p
        className="font-body text-sm"
        style={{ color: "var(--color-text-mid)" }}
      >
        {checkpoint.description}
      </p>

      {/* Indicateur visuel cliquable — icône d'expansion en HUD */}
      <span
        aria-hidden="true"
        className="absolute top-3 right-3 flex items-center justify-center motion-safe:transition-all motion-safe:duration-300 motion-reduce:transition-none"
        style={{
          opacity: "var(--indicator-opacity, 0.25)",
          transform:
            "scale(var(--indicator-scale, 1)) translate(var(--indicator-x, 0), var(--indicator-y, 0))",
        }}
      >
        <ArrowUpRight
          size={14}
          strokeWidth={2.5}
          style={{ color: "var(--color-accent-1)" }}
        />
      </span>

      {/* Styles hover/focus/active injectés via une couche CSS embarquée */}
      <style jsx>{`
        button.group:hover {
          --indicator-opacity: 1;
          --indicator-scale: 1.15;
          --indicator-x: 1px;
          --indicator-y: -1px;
        }
        button.group:focus-visible {
          --indicator-opacity: 1;
          --indicator-scale: 1.15;
          --indicator-x: 1px;
          --indicator-y: -1px;
        }
        button.group:active {
          --indicator-scale: 0.9;
          --indicator-x: 0;
          --indicator-y: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          button.group:hover,
          button.group:focus-visible {
            --indicator-opacity: 1;
            --indicator-scale: 1;
            --indicator-x: 0;
            --indicator-y: 0;
          }
          button.group:active {
            --indicator-scale: 0.95;
          }
        }
      `}</style>
    </button>
  );
}
