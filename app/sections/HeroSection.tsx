"use client";

import { BackgroundSection } from "../components/BackgroundSection";
import { HeroMenu } from "../components/HeroMenu";

/* ============================================================
   HeroSection — Section hero immersive avec fond fixe glassmorphism
   et menu de navigation CP2077.
   ============================================================ */

export function HeroSection() {
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <BackgroundSection
      id="hero"
      backgroundImage="/backgrounds/hero.jpg"
      contentPosition="right"
    >
      <HeroMenu onNavigate={handleNavigate} isTransitioning={false} />
    </BackgroundSection>
  );
}
