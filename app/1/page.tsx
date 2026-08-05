"use client";

import dynamic from "next/dynamic";
import { BootSequence } from "../sections/BootSequence";
import { HeroSection } from "../sections/HeroSection";
import { GenevaInfoSection } from "./GenevaInfoSection";
import { IdentitySection } from "../sections/IdentitySection";
import { ExperienceLogSection } from "../sections/ExperienceLogSection";
import { TechArsenalSection } from "../sections/TechArsenalSection";
import { HumanProtocolsSection } from "../sections/HumanProtocolsSection";
import { MissionsArchiveSection } from "../sections/MissionsArchiveSection";
import { LanguageModulesSection } from "../sections/LanguageModulesSection";
import { InterestFeedSection } from "../sections/InterestFeedSection";
import { FutureRoadmapSection } from "../sections/FutureRoadmapSection";
import { FooterSection } from "../sections/FooterSection";

/* Lazy-load du formulaire de contact pour réduire le First Load JS */
const ContactTerminalSection = dynamic(
  () =>
    import("../sections/ContactTerminalSection").then(
      (m) => m.ContactTerminalSection
    ),
  { ssr: false }
);

/* ============================================================
   Page Geneva (/1) — Variante pour Genève & Grand Genève
   Mêmes sections partagées que /, avec variant="geneva".
   Contenu Genève : GenevaInfoSection entre Hero et Identity.
   ============================================================ */

export default function GenevaPage() {
  return (
    <>
      <BootSequence />
      <HeroSection variant="geneva" />
      <GenevaInfoSection />
      <IdentitySection variant="geneva" />
      <ExperienceLogSection variant="geneva" />
      <TechArsenalSection variant="geneva" />
      <HumanProtocolsSection variant="geneva" />
      <MissionsArchiveSection variant="geneva" />
      <LanguageModulesSection variant="geneva" />
      <InterestFeedSection variant="geneva" />
      <FutureRoadmapSection variant="geneva" />
      <ContactTerminalSection />
      <FooterSection />
    </>
  );
}
