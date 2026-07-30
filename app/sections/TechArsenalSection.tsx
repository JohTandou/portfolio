"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "../components/SectionWrapper";
import { TechIcon } from "../components/TechIcon";
import { BackgroundSection } from "../components/BackgroundSection";

const CATEGORIES = [
  {
    name: "LANGAGES",
    items: ["JavaScript", "TypeScript", "Java", "Python", "HTML", "CSS"],
  },
  {
    name: "FRAMEWORKS / RUNTIMES",
    items: ["React", "Angular", "Next.js", "Spring", "JEE", "FastAPI", "Bootstrap"],
  },
  {
    name: "LIBS & TOOLING",
    items: ["Lombok", "MyBatis", "Maven", "Postman", "Git", "VS Code", "IntelliJ"],
  },
  {
    name: "DATA",
    items: ["SQL", "Firestore", "Supabase", "SQL Developer", "phpMyAdmin"],
  },
  {
    name: "CLOUD & DEPLOY",
    items: ["GCP", "Cloud Run", "Firebase", "Vercel", "Render", "Stripe"],
  },
  {
    name: "METHODS",
    items: ["Agile", "Scrum", "Kanban", "Jira", "Planning Poker"],
  },
  {
    name: "AI & AUTOMATION",
    items: ["Claude Code", "OpenCode", "OpenClaw", "Docker Agent"],
  },
];

/* Arsenal technologique — stack, outils et compétences techniques */
export function TechArsenalSection() {
  let globalIndex = 0;

  return (
    <BackgroundSection id="tech-arsenal" backgroundImage="/backgrounds/technical-skills.jpg" contentPosition="left" wideContent>
      <SectionWrapper>
        <div className="flex w-full flex-col gap-12">
        {/* Titre et sous-titre */}
        <div className="flex flex-col gap-3">
          <motion.h2
            className="font-display font-bold tracking-tight"
            style={{
              fontSize: "clamp(3rem, 6vw, 5rem)",
              color: "var(--color-text-high)",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            ARSENAL TECH
          </motion.h2>
          <motion.p
            className="font-mono text-sm"
            style={{ color: "var(--color-text-mid)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Stack, outils et compétences techniques
          </motion.p>
        </div>

        {/* Grille de catégories — 4 colonnes max pour éviter le débordement */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <div key={category.name} className="glass-card overflow-hidden p-4 flex flex-col gap-3">
              {/* Label de catégorie */}
              <div className="flex flex-col gap-2">
                <span
                  className="font-mono text-xs uppercase tracking-widest"
                  style={{ color: "var(--color-accent-1)" }}
                >
                  {category.name}
                </span>
                <div
                  className="h-px w-8"
                  style={{
                    backgroundColor: "var(--color-accent-1)",
                    opacity: 0.4,
                  }}
                />
              </div>

              {/* Liste des technos */}
              <div className="flex flex-col gap-1.5">
                {category.items.map((item) => {
                  const currentIndex = globalIndex;
                  globalIndex += 1;
                  return <TechIcon key={item} label={item} index={currentIndex} />;
                })}
              </div>
            </div>
          ))}
        </div>
        </div>
      </SectionWrapper>
    </BackgroundSection>
  );
}
