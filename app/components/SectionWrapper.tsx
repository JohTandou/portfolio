"use client";

import { HudCorners } from "./HudCorners";

/* Wrapper de contenu avec coins HUD — utilisé à l'intérieur des BackgroundSection.
   Ne rend pas de <section> (géré par BackgroundSection). */

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className = "", id }: SectionWrapperProps) {
  return (
    <div id={id} className={`relative ${className}`}>
      {/* Coins HUD positionnés aux quatre angles */}
      <div className="pointer-events-none absolute top-4 left-4">
        <HudCorners size={28} />
      </div>
      <div className="pointer-events-none absolute top-4 right-4 rotate-90">
        <HudCorners size={28} />
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 -rotate-90">
        <HudCorners size={28} />
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 rotate-180">
        <HudCorners size={28} />
      </div>
      {children}
    </div>
  );
}
