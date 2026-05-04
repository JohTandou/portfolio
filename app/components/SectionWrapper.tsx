"use client";

import { HudCorners } from "./HudCorners";

/* Wrapper standardisé pour les sections avec padding, max-width et coins HUD */
interface SectionWrapperProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export function SectionWrapper({
  children,
  id,
  className = "",
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative flex min-h-screen flex-col items-center justify-center px-6 py-24 ${className}`}
    >
      {/* Coins HUD positionnés aux quatre angles */}
      <div className="pointer-events-none absolute top-6 left-6">
        <HudCorners size={32} />
      </div>
      <div className="pointer-events-none absolute top-6 right-6 rotate-90">
        <HudCorners size={32} />
      </div>
      <div className="pointer-events-none absolute bottom-6 left-6 -rotate-90">
        <HudCorners size={32} />
      </div>
      <div className="pointer-events-none absolute bottom-6 right-6 rotate-180">
        <HudCorners size={32} />
      </div>

      <div className="w-full max-w-5xl">{children}</div>
    </section>
  );
}
