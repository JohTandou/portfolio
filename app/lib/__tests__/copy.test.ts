import { describe, it, expect } from 'vitest';
import { getCopy } from '@/lib/copy';

/* Tests du système central de copy varianté.
   Couvre les deux variantes : public et geneva.
   Vérifie que genevaInfo est null sur public et contient exactement
   les quatre formulations imposées sur geneva. */

describe('copy system — variant public', () => {
  it('genevaInfo est null', () => {
    const copy = getCopy('public');
    expect(copy.genevaInfo).toBeNull();
  });

  it('aucun champ de la copie publique ne contient de données Genève', () => {
    const copy = getCopy('public');
    const allText = JSON.stringify(copy);
    expect(allText).not.toContain('Genève');
    expect(allText).not.toContain('Grand Genève');
    expect(allText).not.toContain('permis G');
    expect(allText).not.toContain('Suisse');
  });

  it('les champs de base (hero, identity, roadmap) sont bien renseignés', () => {
    const copy = getCopy('public');
    expect(copy.heroTitle).toBeTruthy();
    expect(copy.heroSubtitle).toBe(
      "2+ ans d’expérience sur des applications métier, des interfaces web et des produits mis en production."
    );
    expect(copy.heroTagline).toBeTruthy();
    expect(copy.heroStack).toBe(
      'Java/Swing · Angular · React/Next.js · Python/FastAPI · SQL'
    );
    expect(copy.identityLocation).toBeTruthy();
    expect(copy.identityBio).toBeTruthy();
    expect(copy.identityStatut).toBeTruthy();
    expect(copy.languageModulesSubtitle).toBeTruthy();
    expect(copy.interestFeedSubtitle).toBeTruthy();
    expect(copy.roadmap.now.title).toBeTruthy();
    expect(copy.roadmap.mid.title).toBeTruthy();
    expect(copy.roadmap.long.title).toBeTruthy();
  });
});

describe('copy system — variant geneva', () => {
  it('genevaInfo contient exactement les quatre formulations imposées', () => {
    const copy = getCopy('geneva');
    const info = copy.genevaInfo;
    expect(info).not.toBeNull();

    // Mobilité
    expect(info!.mobilite).toBe('Mobilité : Genève / Grand Genève');

    // Relocalisation
    expect(info!.relocalisation).toBe('Relocalisation côté français après signature');

    // Statut
    expect(info!.statut).toBe(
      'Statut : ressortissant français, éligible au permis G UE/AELE'
    );

    // Disponibilité
    expect(info!.disponibilite).toBe('Disponibilité : selon préavis contractuel');
  });

  it('genevaInfo n’expose que les quatre champs attendus (mobilite, relocalisation, statut, disponibilite)', () => {
    const copy = getCopy('geneva');
    const info = copy.genevaInfo!;
    const keys = Object.keys(info);
    expect(keys).toHaveLength(4);
    expect(keys).toContain('mobilite');
    expect(keys).toContain('relocalisation');
    expect(keys).toContain('statut');
    expect(keys).toContain('disponibilite');
  });

  it('aucun champ genevaInfo n’est vide ou absent', () => {
    const copy = getCopy('geneva');
    const info = copy.genevaInfo!;
    for (const [key, value] of Object.entries(info)) {
      expect(value, `Le champ "${key}" ne doit pas être vide`).toBeTruthy();
      expect(typeof value, `Le champ "${key}" doit être une chaîne`).toBe('string');
      expect((value as string).trim().length, `Le champ "${key}" ne doit pas être une chaîne vide`).toBeGreaterThan(0);
    }
  });

  it('genevaInfo ne contient pas le terme « recherche »', () => {
    const copy = getCopy('geneva');
    const info = copy.genevaInfo!;
    const allText = Object.values(info).join(' ');
    expect(allText).not.toMatch(/recherche/i);
  });

  it('les champs roadmap de la variante geneva surchargent correctement le now et le long horizon', () => {
    const copy = getCopy('geneva');
    expect(copy.roadmap.now.title).toContain('Genève');
    expect(copy.roadmap.long.title).toContain('Suisse');
    // mid horizon reste identique à la base
    expect(copy.roadmap.mid.title).toBe('Faire émerger mes projets personnels en produits viables.');
  });

  it('les deux variantes (public et geneva) partagent le même heroSubtitle et heroStack', () => {
    const publicCopy = getCopy('public');
    const genevaCopy = getCopy('geneva');
    expect(genevaCopy.heroSubtitle).toBe(publicCopy.heroSubtitle);
    expect(genevaCopy.heroStack).toBe(publicCopy.heroStack);
  });

  it('les deux variantes partagent les mêmes sous-titres de section', () => {
    const publicCopy = getCopy('public');
    const genevaCopy = getCopy('geneva');
    expect(genevaCopy.languageModulesSubtitle).toBe(publicCopy.languageModulesSubtitle);
    expect(genevaCopy.interestFeedSubtitle).toBe(publicCopy.interestFeedSubtitle);
  });
});
