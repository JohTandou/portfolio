import { describe, it, expect } from 'vitest';
import { COPY } from '@/lib/copy';

/* Tests du système central de copy — source unique de textes.
   La page / est l'unique route : vérifie que les champs de base
   sont renseignés et qu'aucune donnée géographique héritée
   ne subsiste. */

describe('copy system', () => {
  it('aucune donnée géographique héritée ne subsiste dans la copie', () => {
    const allText = JSON.stringify(COPY);
    expect(allText).not.toContain('Genève');
    expect(allText).not.toContain('Grand Genève');
    expect(allText).not.toContain('permis G');
    expect(allText).not.toContain('Suisse');
  });

  it('les champs de base (hero, identity, roadmap) sont bien renseignés', () => {
    expect(COPY.heroTitle).toBeTruthy();
    expect(COPY.heroSubtitle).toBe(
      "2+ ans d’expérience sur des applications métier, des interfaces web et des produits mis en production."
    );
    expect(COPY.heroTagline).toBeTruthy();
    expect(COPY.heroStack).toBe(
      'Java/Swing · Angular · React/Next.js · Python/FastAPI · SQL'
    );
    expect(COPY.identityLocation).toBeTruthy();
    expect(COPY.identityBio).toBeTruthy();
    expect(COPY.identityStatut).toBeTruthy();
    expect(COPY.languageModulesSubtitle).toBeTruthy();
    expect(COPY.interestFeedSubtitle).toBeTruthy();
    expect(COPY.roadmap.now.title).toBeTruthy();
    expect(COPY.roadmap.mid.title).toBeTruthy();
    expect(COPY.roadmap.long.title).toBeTruthy();
  });
});
