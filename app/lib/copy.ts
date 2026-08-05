/* Système de copy varianté pour le portfolio.
   Toute chaîne visible par l'utilisateur qui diffère entre / (public) et /1 (geneva)
   est centralisée ici. Les sections importent getCopy(variant) et utilisent les clés. */

import { PortfolioVariant } from "../types";

export interface GenevaInfoTexts {
  mobilite: string;
  relocalisation: string;
  statut: string;
  disponibilite: string;
}

export interface RoadmapTexts {
  subtitle: string;
  now: {
    title: string;
    description: string;
    manifesto: string;
  };
  mid: {
    title: string;
    description: string;
    manifesto: string;
  };
  long: {
    title: string;
    description: string;
    manifesto: string;
  };
}

export interface PortfolioCopy {
  /* Hero */
  heroBadge: string | null;
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  heroStack: string;

  /* Identity */
  identityLocation: string;
  identityBio: string;
  identityStatut: string;

  /* Experience */
  experienceSubtitle: string;

  /* Tech Arsenal */
  techArsenalSubtitle: string;

  /* Human Protocols */
  humanProtocolsSubtitle: string;

  /* Missions */
  missionsSubtitle: string;

  /* Language Modules */
  languageModulesSubtitle: string;

  /* Interest Feed */
  interestFeedSubtitle: string;

  /* Roadmap */
  roadmapSubtitle: string;

  /* Geneva-specific (null on public) */
  genevaInfo: GenevaInfoTexts | null;

  /* Per-checkpoint roadmap data */
  roadmap: RoadmapTexts;
}

const BASE_COPY: Omit<PortfolioCopy, "genevaInfo"> = {
  heroBadge: null,
  heroTitle: "Software Engineer — Java & Web",
  heroSubtitle:
    "2+ ans d’expérience sur des applications métier, des interfaces web et des produits mis en production.",
  heroTagline:
    "Du desktop Java/Swing au SaaS full-stack : je construis des applications qui résistent au réel.",
  heroStack: "Java/Swing · Angular · React/Next.js · Python/FastAPI · SQL",

  identityLocation: "Île-de-France",
  identityBio:
    "Développeur spécialisé en architectures full-stack, passionné par l'optimisation et la manipulation de jeux de données complexes.",
  identityStatut: "OPERATIONAL",

  experienceSubtitle: "Parcours professionnel, missions et projets marquants.",

  techArsenalSubtitle: "Stack, outils et compétences techniques",

  humanProtocolsSubtitle: "Soft skills et méthodologies de travail",

  missionsSubtitle: "Projets réalisés, études de cas et démonstrations.",

  languageModulesSubtitle: "Langues mobilisées dans des contextes professionnels et internationaux.",

  interestFeedSubtitle: "Ce qui nourrit mon regard, mes réflexes et ma façon de construire.",

  roadmapSubtitle: "Objectifs professionnels et aspirations futures.",

  roadmap: {
    subtitle: "Objectifs professionnels et aspirations futures.",
    now: {
      title: "Consultant @ Talan. Side projects en orbite.",
      description: "CDI chez Talan + développement de projets personnels",
      manifesto:
        "En ce moment, je consolide mon expertise full-stack au sein de Talan tout en développant des side projects ambitieux. Mon objectif est d'approfondir mes compétences en architectures distribuées et en IA appliquée au produit.",
    },
    mid: {
      title: "Faire émerger mes projets personnels en produits viables.",
      description: "Passage à l'échelle des projets personnels",
      manifesto:
        "À moyen terme, l'ambition est de transformer les side projects en produits viables. Cela implique de monter en compétence sur le growth, le marketing produit, et peut-être de constituer une petite équipe autour d'une vision commune.",
    },
    long: {
      title: "Nouveau chapitre : relever des défis à l'échelle d'un grand groupe.",
      description: "Évolution vers des responsabilités élargies",
      manifesto:
        "Sur le long terme, je vise des responsabilités techniques élargies au sein d'un grand groupe, en capitalisant sur mon expérience multi-sectorielle pour concevoir et piloter des systèmes à fort impact.",
    },
  },
};

const GENEVA_COPY: PortfolioCopy = {
  ...BASE_COPY,
  heroBadge: null,
  heroTitle: "Software Engineer — Java & Web",
  heroSubtitle: BASE_COPY.heroSubtitle,
  heroTagline: BASE_COPY.heroTagline,
  heroStack: BASE_COPY.heroStack,

  roadmap: {
    ...BASE_COPY.roadmap,
    now: {
      title: "Consultant @ Talan. Side projects en orbite. Genève / remote.",
      description: "CDI chez Talan + disponibilité Genève et remote",
      manifesto:
        "En ce moment, je consolide mon expertise full-stack au sein de Talan tout en développant des side projects ambitieux. Je suis ouvert aux opportunités à Genève ou en remote, avec une présence possible sur site selon les besoins.",
    },
    long: {
      title: "Nouvelle base : Suisse. Nouveau terrain de jeu, mêmes ambitions amplifiées.",
      description: "Relocalisation en Suisse (CH)",
      manifesto:
        "Sur le long terme, je vise une installation durable à Genève pour intégrer un écosystème tech mature, construire une équipe autour d'une vision commune, et relever des défis techniques à haute exigence dans un cadre de vie propice à l'épanouissement.",
    },
  },

  genevaInfo: {
    mobilite: "Mobilité : Genève / Grand Genève",
    relocalisation: "Relocalisation côté français après signature",
    statut: "Statut : ressortissant français, éligible au permis G UE/AELE",
    disponibilite: "Disponibilité : selon préavis contractuel",
  },
};

export function getCopy(variant: PortfolioVariant): PortfolioCopy {
  return variant === "geneva" ? GENEVA_COPY : { ...BASE_COPY, genevaInfo: null };
}
