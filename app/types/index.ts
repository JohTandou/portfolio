/* Types de base de l'application */

export interface SectionProps {
  id: string;
  className?: string;
}

/* Types de variantes du portfolio */

/** Variante active du portfolio — détermine les textes et le contenu affiché */
export type PortfolioVariant = "public" | "geneva";

/**
 * Textes conditionnels par variante, sans duplication.
 * La clé `public` définit la base exhaustive obligatoire.
 * Les autres variantes ne déclarent que leurs surcharges — les champs absents héritent de `public`.
 *
 * @example
 * const heroTexts: VariantTexts<"title" | "subtitle"> = {
 *   public:  { title: "Joh Tandou", subtitle: "Développeur Full-Stack" },
 *   geneva:  { title: "Joh Tandou — Genève" },
 * };
 */
export type VariantTexts<T extends string> = {
  public: Record<T, string>;
} & {
  [V in Exclude<PortfolioVariant, "public">]: Partial<Record<T, string>>;
};

/* Types pour les sections du Sprint 3 */

export type JobStatus = "active" | "completed" | "internship";

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  client: string;
  location: string;
  startDate: string;
  endDate: string | null;
  status: JobStatus;
  mission: string;
  impact: string[];
  stack: string[];
}

export type MissionStatus = "shipped" | "in-progress" | "archived";

export interface MissionEntry {
  id: string;
  missionId: string;
  codename: string;
  classification: string;
  status: MissionStatus;
  timeline: string;
  briefing: string;
  objectives: string[];
  arsenal: string[];
  access: {
    label: string;
    url: string;
    type: "demo" | "github" | "case-study";
  }[];
}

export type CheckpointStatus = "active" | "upcoming" | "future";

export interface RoadmapCheckpoint {
  id: string;
  label: string;
  title: string;
  description: string;
  manifesto: string;
  status: CheckpointStatus;
}
