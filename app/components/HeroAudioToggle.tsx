"use client";

/* Bouton de toggle audio intégré au menu cyberpunk */
import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "../providers/AudioProvider";

export function HeroAudioToggle() {
  const { isMuted, toggleMute } = useAudio();

  return (
    <button
      onClick={toggleMute}
      className="group flex w-full items-center gap-2 border-none bg-transparent px-1 py-1.5 text-left font-terminal text-sm uppercase tracking-wider text-[var(--color-text-mid)] transition-colors duration-200 hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-1)]"
      aria-pressed={!isMuted}
      aria-label={isMuted ? "Activer le son" : "Couper le son"}
    >
      {isMuted ? (
        <VolumeX className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Volume2 className="h-4 w-4" aria-hidden="true" />
      )}
      <span>{isMuted ? "MUET" : "SON"}</span>
    </button>
  );
}
