/* Types de base de l'application */

export interface SectionProps {
  id: string;
  className?: string;
}

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
