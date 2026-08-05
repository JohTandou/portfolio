"use client";

import dynamic from "next/dynamic";
import { BootSequence } from "./sections/BootSequence";
import { HeroSection } from "./sections/HeroSection";
import { IdentitySection } from "./sections/IdentitySection";
import { ExperienceLogSection } from "./sections/ExperienceLogSection";
import { TechArsenalSection } from "./sections/TechArsenalSection";
import { HumanProtocolsSection } from "./sections/HumanProtocolsSection";
import { MissionsArchiveSection } from "./sections/MissionsArchiveSection";
import { LanguageModulesSection } from "./sections/LanguageModulesSection";
import { InterestFeedSection } from "./sections/InterestFeedSection";
import { FutureRoadmapSection } from "./sections/FutureRoadmapSection";
import { FooterSection } from "./sections/FooterSection";

/* Lazy-load du formulaire de contact pour réduire le First Load JS */
const ContactTerminalSection = dynamic(
  () => import("./sections/ContactTerminalSection").then((m) => m.ContactTerminalSection),
  { ssr: false }
);

/* Page d'accueil principale — assemblage de toutes les sections, variante publique */
export default function HomePage() {
  return (
    <>
      <BootSequence />
      <HeroSection variant="public" />
      <IdentitySection variant="public" />
      <ExperienceLogSection variant="public" />
      <TechArsenalSection variant="public" />
      <HumanProtocolsSection variant="public" />
      <MissionsArchiveSection variant="public" />
      <LanguageModulesSection variant="public" />
      <InterestFeedSection variant="public" />
      <FutureRoadmapSection variant="public" />
      <ContactTerminalSection />
      <FooterSection />
    </>
  );
}
