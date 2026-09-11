import { MissionEntry } from "../types";

export const MISSIONS_DATA: MissionEntry[] = [
  {
    id: "topseeker",
    missionId: "#001",
    codename: "TOPSEEKER",
    classification: "SAAS · COACHING CARRIÈRE IA",
    status: "shipped",
    timeline: "02/2026 → EN COURS",
    briefing:
      "SaaS de coaching carrière assisté par IA, utilisé par plus de 100 utilisateurs.",
    objectives: [
      "Analyse ATS, CV & lettres DOCX, préparation entretiens, coaching vocal, emails IA",
      "Kanban, Google OAuth, Stripe, Supabase/2FA, rate limiting, monitoring, intégration Gemini",
    ],
    arsenal: ["Next.js", "FastAPI", "Supabase", "Cloudflare R2", "Render", "Vercel"],
    access: [
      { label: "SAAS_URL", url: "https://topseeker.fr", type: "demo" },
    ],
  },
  {
    id: "swarm-wiki",
    missionId: "#002",
    codename: "AGENT_SWARM",
    classification: "PERSONAL · AGENTIC PIPELINE",
    status: "shipped",
    timeline: "05/2026 → EN COURS",
    briefing:
      "Pipeline agentique OpenCode orchestrant la recherche, la planification, l'implémentation, les tests et la revue, avec validation humaine aux étapes critiques.",
    objectives: [
      "Classification en 5 routes + orchestration de 9 agents spécialisés + 2 agents utilitaires",
      "Pipeline : search, plan, front, back, tests, review, documentation, PR automatisées",
      "Documentation live sur swarm-wiki.vercel.app",
    ],
    arsenal: ["Angular", "OpenCode", "DeepSeek V4 Pro", "Vercel"],
    access: [
      { label: "GitHub", url: "https://github.com/JohTandou/agent-swarm", type: "github" },
      { label: "Documentation", url: "https://swarm-wiki.vercel.app", type: "demo" },
    ],
  },
  {
    id: "bible-ai",
    missionId: "#003",
    codename: "SCRIPTURA",
    classification: "PERSONAL · APP D'ÉTUDE IA",
    status: "in-progress",
    timeline: "03/2026 → EN COURS",
    briefing:
      "Application d'étude et de méditation assistée par IA. Exploration spirituelle augmentée par la technologie.",
    objectives: [
      "Moteur de recherche sémantique",
      "Génération de plans de lecture personnalisés",
      "Chatbot théologique avec sources vérifiables",
      "Synchronisation cross-device",
    ],
    arsenal: ["Flutter", "Supabase", "FastAPI", "Render", "Vercel"],
    access: [
      { label: "SAAS_URL", url: "https://scriptura-bible.vercel.app", type: "demo" },
    ],
  },
  {
    id: "zero-waste",
    missionId: "#004",
    codename: "USEFOOD",
    classification: "ACADEMIC · EFREI",
    status: "archived",
    timeline: "01/2022 → 03/2023",
    briefing:
      "Plateforme mobile anti-gaspillage alimentaire.",
    objectives: [
      "Scan de code-barres pour identification rapide des produits",
      "Rappels automatiques avant péremption",
      "Suggestions de recettes basées sur les produits disponibles",
      "Stockage et synchronisation via Cloud Firestore",
    ],
    arsenal: ["Flutter", "Firebase", "Android", "iOS"],
    access: [],
  },
  {
    id: "strategy-ai",
    missionId: "#005",
    codename: "STRATEGY_AI",
    classification: "ACADEMIC · UNIVERSITÉ PARIS",
    status: "archived",
    timeline: "01/2021 → 04/2021",
    briefing:
      "IA de jeu de stratégie.",
    objectives: [
      "Prise de décision adaptée à l'état du jeu",
      "Architecture modulaire pour différents types d'unités",
      "Simulation et test en conditions réelles",
    ],
    arsenal: ["C#", "Unity"],
    access: [],
  },
  {
    id: "puck-collector",
    missionId: "#006",
    codename: "PUCK_COLLECTOR",
    classification: "ACADEMIC · UNIVERSITÉ PARIS",
    status: "archived",
    timeline: "01/2020 → 04/2020",
    briefing:
      "Robot ramasseur de palets.",
    objectives: [
      "Détection et suivi de lignes colorées au sol",
      "Détection des palets par capteurs",
      "Ramassage et dépôt automatique en zone cible",
    ],
    arsenal: ["Java", "Eclipse", "SVN"],
    access: [],
  },
];
