import { MissionEntry } from "../types";

export const MISSIONS_DATA: MissionEntry[] = [
  {
    id: "topseeker",
    missionId: "#001",
    codename: "TOPSEEKER",
    classification: "SAAS · CAREER COACHING",
    status: "shipped",
    timeline: "02/2025 → ONGOING",
    briefing:
      "Plateforme de coaching carrière assistée par IA. Analyse CV, lettres, simulations d'entretiens, coaching vocal. Production-grade.",
    objectives: [
      "Intégration Gemini 3 Flash multi-étapes",
      "Anti-hallucination via prompts en chaîne",
      "Paiements Stripe + 2FA Supabase",
      "Storage Cloudflare R2 + rate limiting",
      "Monitoring + déploiement Render/Vercel",
    ],
    arsenal: ["Next.js", "FastAPI", "Postgres", "Supabase", "Gemini", "Stripe"],
    access: [
      { label: "Live Demo", url: "#", type: "demo" },
      { label: "GitHub", url: "#", type: "github" },
    ],
  },
  {
    id: "bible-ai",
    missionId: "#002",
    codename: "BIBLE_AI",
    classification: "PERSONAL · APP D'ÉTUDE IA",
    status: "in-progress",
    timeline: "2025 → EN COURS",
    briefing:
      "Application d'étude et de méditation assistée par IA. Exploration spirituelle augmentée par la technologie.",
    objectives: [
      "Moteur de recherche sémantique",
      "Génération de plans de lecture personnalisés",
      "Chatbot théologique avec sources vérifiables",
      "Synchronisation cross-device",
      "Mode focus avec lecture immersive",
    ],
    arsenal: ["React Native", "Expo", "Supabase", "Claude API", "TypeScript"],
    access: [
      { label: "GitHub", url: "#", type: "github" },
    ],
  },
  {
    id: "academic-1",
    missionId: "#003",
    codename: "ACADEMIC_1",
    classification: "ACADEMIC · EFREI",
    status: "archived",
    timeline: "2022 — EFREI",
    briefing:
      "Projet académique réalisé dans le cadre du cursus ingénieur à l'EFREI Paris.",
    objectives: [
      "Conception d'une architecture logicielle distribuée",
      "Implémentation de patterns de conception avancés",
      "Rapport technique et soutenance devant jury",
    ],
    arsenal: ["Java", "Spring Boot", "MySQL", "Docker"],
    access: [],
  },
  {
    id: "academic-2",
    missionId: "#004",
    codename: "ACADEMIC_2",
    classification: "ACADEMIC · EFREI",
    status: "archived",
    timeline: "2023 — EFREI",
    briefing:
      "Projet de fin d'études traitant d'un sujet innovant en ingénierie logicielle.",
    objectives: [
      "Recherche et état de l'art approfondi",
      "Prototypage fonctionnel avec itérations agiles",
      "Documentation technique complète",
    ],
    arsenal: ["Python", "TensorFlow", "React", "FastAPI"],
    access: [],
  },
];
