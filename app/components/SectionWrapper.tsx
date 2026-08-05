"use client";

/* Wrapper de contenu — utilisé à l'intérieur des BackgroundSection.
   Ne rend pas de <section> (géré par BackgroundSection). */

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className = "", id }: SectionWrapperProps) {
  return (
    <div id={id} className={`relative ${className}`}>
      {children}
    </div>
  );
}
