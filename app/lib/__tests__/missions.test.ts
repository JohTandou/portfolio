import { describe, it, expect } from 'vitest';
import { MISSIONS_DATA } from '@/lib/missions';

describe('missions lib', () => {
  it('should contain exactly 6 mission entries', () => {
    expect(MISSIONS_DATA).toHaveLength(6);
  });

  it('should have all entries with required fields', () => {
    for (const entry of MISSIONS_DATA) {
      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('missionId');
      expect(entry).toHaveProperty('codename');
      expect(entry).toHaveProperty('classification');
      expect(entry).toHaveProperty('status');
      expect(entry).toHaveProperty('timeline');
      expect(entry).toHaveProperty('briefing');
      expect(entry).toHaveProperty('objectives');
      expect(entry).toHaveProperty('arsenal');
      expect(entry).toHaveProperty('access');
      expect(Array.isArray(entry.objectives)).toBe(true);
      expect(Array.isArray(entry.arsenal)).toBe(true);
      expect(Array.isArray(entry.access)).toBe(true);
    }
  });

  /* ── Budget éditorial : max 5 objectifs, max 6 tags arsenal ──── */

  it('every mission must respect budget ≤5 objectives', () => {
    for (const entry of MISSIONS_DATA) {
      expect(entry.objectives.length, `${entry.codename} objectives exceed 5`).toBeLessThanOrEqual(5);
    }
  });

  it('every mission must respect budget ≤6 arsenal tags', () => {
    for (const entry of MISSIONS_DATA) {
      expect(entry.arsenal.length, `${entry.codename} arsenal tags exceed 6`).toBeLessThanOrEqual(6);
    }
  });

  /* ── Identity checks ────────────────────────────────────────── */

  it('TOPSEEKER #001 : briefing exact, lien public topseeker.fr, pas de faux GitHub', () => {
    const entry = MISSIONS_DATA.find((m) => m.missionId === '#001');
    expect(entry).toBeDefined();
    expect(entry!.codename).toBe('TOPSEEKER');
    expect(entry!.status).toBe('shipped');
    expect(entry!.timeline).toBe('02/2026 → EN COURS');
    expect(entry!.briefing).toBe(
      'SaaS de coaching carrière assisté par IA, utilisé par plus de 100 utilisateurs.'
    );
    expect(entry!.arsenal).toEqual([
      'Next.js', 'FastAPI', 'Supabase', 'Cloudflare R2', 'Render', 'Vercel',
    ]);
    const objectivesText = entry!.objectives.join(' ');
    expect(objectivesText).toContain('Analyse ATS');
    expect(objectivesText).toContain('DOCX');
    expect(objectivesText).toContain('préparation entretiens');
    expect(objectivesText).toContain('coaching vocal');
    expect(objectivesText).toContain('Kanban');
    expect(objectivesText).toContain('Google OAuth');
    expect(objectivesText).toContain('Stripe');
    expect(objectivesText).toContain('2FA');
    expect(objectivesText).toContain('rate limiting');
    expect(objectivesText).toContain('monitoring');
    expect(objectivesText).toContain('intégration Gemini');
    // Access links
    const demoLink = entry!.access.find((a) => a.type === 'demo');
    expect(demoLink).toBeDefined();
    expect(demoLink!.url).toBe('https://topseeker.fr');
    // Pas de lien GitHub pour TopSeeker
    const ghLink = entry!.access.find((a) => a.type === 'github');
    expect(ghLink).toBeUndefined();
  });

  it('SCRIPTURA #003 : in-progress, app détude IA, lien SAAS_URL scriptura.vercel.app', () => {
    const entry = MISSIONS_DATA.find((m) => m.missionId === '#003');
    expect(entry).toBeDefined();
    expect(entry!.codename).toBe('SCRIPTURA');
    expect(entry!.status).toBe('in-progress');
    expect(entry!.classification).toContain('PERSONAL');
    // Lien SAAS_URL
    const saasLink = entry!.access.find((a) => a.type === 'demo');
    expect(saasLink).toBeDefined();
    expect(saasLink!.url).toBe('https://scriptura.vercel.app');
    // Pas de lien GitHub
    const ghLink = entry!.access.find((a) => a.type === 'github');
    expect(ghLink).toBeUndefined();
  });

  it('AGENT_SWARM #002 : shipped, briefing exact, 9 agents + 2 utilitaires, pas 11, pas autonomie totale, pas Claude, GitHub + Documentation', () => {
    const entry = MISSIONS_DATA.find((m) => m.missionId === '#002');
    expect(entry).toBeDefined();
    expect(entry!.codename).toBe('AGENT_SWARM');
    expect(entry!.status).toBe('shipped');
    expect(entry!.classification).toContain('PERSONAL');
    expect(entry!.timeline).toContain('2026');
    // Briefing exact exigé
    expect(entry!.briefing).toBe(
      'Pipeline agentique OpenCode orchestrant la recherche, la planification, l\'implémentation, les tests et la revue, avec validation humaine aux étapes critiques.'
    );
    // Arsenal
    expect(entry!.arsenal).toContain('OpenCode');
    expect(entry!.arsenal).toContain('DeepSeek V4 Pro');
    expect(entry!.arsenal).toContain('Vercel');
    expect(entry!.arsenal).toContain('Angular');
    // Objectives : 9 agents + 2 utilitaires, jamais 11
    const objectivesText = entry!.objectives.join(' ');
    expect(objectivesText).toContain('9 agents spécialisés');
    expect(objectivesText).toContain('2 agents utilitaires');
    expect(objectivesText).not.toContain('11 agents');
    expect(objectivesText).toContain('search');
    expect(objectivesText).toContain('review');
    // Jamais autonomie totale
    const allText = JSON.stringify(entry);
    expect(allText).not.toContain('autonomie totale');
    // Jamais Claude
    expect(allText).not.toContain('Claude');
    // Access : GitHub + Documentation
    expect(entry!.access).toHaveLength(2);
    const ghLink = entry!.access.find((a) => a.type === 'github');
    expect(ghLink).toBeDefined();
    expect(ghLink!.url).toBe('https://github.com/JohTandou/agent-swarm');
    const docLink = entry!.access.find((a) => a.type === 'demo');
    expect(docLink).toBeDefined();
    expect(docLink!.url).toContain('swarm-wiki.vercel.app');
  });

  it('USEFOOD #004 : Flutter anti-gaspillage, EFREI, pas de métrique inventée', () => {
    const entry = MISSIONS_DATA.find((m) => m.missionId === '#004');
    expect(entry).toBeDefined();
    expect(entry!.codename).toBe('USEFOOD');
    expect(entry!.status).toBe('archived');
    expect(entry!.classification).toContain('EFREI');
    expect(entry!.timeline).toContain('2022');
    expect(entry!.timeline).toContain('2023');
    expect(entry!.arsenal).toContain('Flutter');
    expect(entry!.arsenal).toContain('Firebase');
    expect(entry!.arsenal).toContain('Android');
    expect(entry!.arsenal).toContain('iOS');
    // No invented metric (%)
    const allText = JSON.stringify(entry);
    expect(allText).not.toContain('%');
    // Objectives
    const objectivesText = entry!.objectives.join(' ');
    expect(objectivesText).toContain('code-barres');
    expect(objectivesText).toContain('péremption');
    expect(objectivesText).toContain('recettes');
  });

  it('STRATEGY_AI #005 : archived, Université Paris, C#/Unity', () => {
    const entry = MISSIONS_DATA.find((m) => m.missionId === '#005');
    expect(entry).toBeDefined();
    expect(entry!.codename).toBe('STRATEGY_AI');
    expect(entry!.status).toBe('archived');
    expect(entry!.classification).toContain('ACADEMIC');
    expect(entry!.classification).toContain('UNIVERSITÉ PARIS');
    expect(entry!.timeline).toContain('2021');
    expect(entry!.arsenal).toContain('C#');
    expect(entry!.arsenal).toContain('Unity');
    expect(entry!.briefing).toContain('stratégie');
    expect(entry!.access).toHaveLength(0);
  });

  it('PUCK_COLLECTOR #006 : archived, Université Paris', () => {
    const entry = MISSIONS_DATA.find((m) => m.missionId === '#006');
    expect(entry).toBeDefined();
    expect(entry!.codename).toBe('PUCK_COLLECTOR');
    expect(entry!.status).toBe('archived');
    expect(entry!.classification).toContain('ACADEMIC');
    expect(entry!.classification).toContain('UNIVERSITÉ PARIS');
    expect(entry!.timeline).toContain('2020');
    expect(entry!.arsenal).toContain('Java');
    expect(entry!.arsenal).toContain('Eclipse');
    expect(entry!.arsenal).toContain('SVN');
    expect(entry!.briefing).toContain('ramasseur');
    expect(entry!.briefing).toContain('palets');
    expect(entry!.access).toHaveLength(0);
  });

  it('should not contain old ACADEMIC_1 or ACADEMIC_2 codenames', () => {
    const codenames = MISSIONS_DATA.map((m) => m.codename);
    expect(codenames).not.toContain('ACADEMIC_1');
    expect(codenames).not.toContain('ACADEMIC_2');
  });
});
