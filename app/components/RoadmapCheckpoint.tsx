"use client";

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
      className="group flex flex-col items-center gap-3 text-left md:items-start"
      style={{ background: "none", border: "none", padding: 0 }}
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
    </button>
  );
}
