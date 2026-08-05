/* Constantes globales de l'application */

/** Largeur de carte partagée pour les carrousels desktop (Missions + Experience).
 *  Mobile reste à 85vw, géré dans chaque section via useMediaQuery. */
export const DESKTOP_CARD_WIDTH = 500;

export const SECTION_IDS = [
  "boot",
  "hero",
  "identity",
  "experience",
  "tech-arsenal",
  "human-protocols",
  "missions",
  "languages",
  "interests",
  "roadmap",
  "contact",
  "footer",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/* Mapping section -> ratio de progression vidéo (0..1)
   Ajustez ces valeurs pour qu'elles correspondent exactement
   aux timestamps visuels de hero-video.mp4.
   Exemple : si la section "Expérience" commence à 4.2s sur une vidéo de 14s,
   le ratio cible est 4.2 / 14 = 0.30. */
export const VIDEO_TARGETS: Record<string, number> = {
  continue: 0.02,       /* léger mouvement initial, puis scroll libre */
  identity: 0.12,       /* première section après le hero */
  experience: 0.22,
  "tech-arsenal": 0.32,
  "human-protocols": 0.40,
  missions: 0.48,
  languages: 0.55,
  interests: 0.62,
  roadmap: 0.68,
  contact: 0.75,
};
