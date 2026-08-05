import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';

/* Mock le module de copy AVANT l'import du composant.
   Le composant GenevaInfoSection importe getCopy depuis ../lib/copy.
   On intercepte via le chemin alias @/lib/copy (vitest le normalise). */
vi.mock('@/lib/copy', () => ({
  getCopy: vi.fn(),
}));

import { GenevaInfoSection } from '../GenevaInfoSection';
import { getCopy } from '@/lib/copy';
import type { PortfolioCopy } from '@/lib/copy';

/** Construit un mock minimal de PortfolioCopy pour les tests du composant */
function mockGenevaCopy(
  genevaInfo: PortfolioCopy['genevaInfo']
): Partial<PortfolioCopy> {
  return { genevaInfo } as Partial<PortfolioCopy>;
}

describe('GenevaInfoSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ── Rendu des quatre textes ──────────────────────────────────── */

  it('affiche les quatre textes genevaInfo (mobilité, relocalisation, statut, disponibilité)', () => {
    vi.mocked(getCopy).mockReturnValue(
      mockGenevaCopy({
        mobilite: 'Mobilité : Genève / Grand Genève',
        relocalisation: 'Relocalisation côté français après signature',
        statut: 'Statut : ressortissant français, éligible au permis G UE/AELE',
        disponibilite: 'Disponibilité : selon préavis contractuel',
      })
    );

    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<GenevaInfoSection />);
    });

    // Titre de section
    expect(container.textContent).toContain('INFORMATIONS GENÈVE');

    // Labels en uppercase
    expect(container.textContent).toContain('MOBILITÉ');
    expect(container.textContent).toContain('RELOCALISATION');
    expect(container.textContent).toContain('STATUT');
    expect(container.textContent).toContain('DISPONIBILITÉ');

    // Valeurs textuelles
    expect(container.textContent).toContain('Genève / Grand Genève');
    expect(container.textContent).toContain(
      'Relocalisation côté français après signature'
    );
    expect(container.textContent).toContain(
      'ressortissant français, éligible au permis G UE/AELE'
    );
    expect(container.textContent).toContain('selon préavis contractuel');
  });

  /* ── Cas null (pas de section Genève) ─────────────────────────── */

  it('retourne null (ne rend rien dans le DOM) si genevaInfo est null', () => {
    vi.mocked(getCopy).mockReturnValue(
      mockGenevaCopy(null)
    );

    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<GenevaInfoSection />);
    });

    expect(container.innerHTML).toBe('');
  });

  /* ── Grille 2 colonnes ────────────────────────────────────────── */

  it('possède une grille responsive à 2 colonnes sur desktop (sm:grid-cols-2)', () => {
    vi.mocked(getCopy).mockReturnValue(
      mockGenevaCopy({
        mobilite: 'Mobilité : Genève / Grand Genève',
        relocalisation: 'Relocalisation côté français après signature',
        statut: 'Statut : ressortissant français, éligible au permis G UE/AELE',
        disponibilite: 'Disponibilité : selon préavis contractuel',
      })
    );

    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<GenevaInfoSection />);
    });

    const grid = container.querySelector('.grid');
    expect(grid).not.toBeNull();
    expect(grid?.className).toContain('sm:grid-cols-2');
  });

  /* ── Labels des items ─────────────────────────────────────────── */

  it('chaque item possède un label en uppercase avec tracking-widest', () => {
    vi.mocked(getCopy).mockReturnValue(
      mockGenevaCopy({
        mobilite: 'Mobilité : Genève / Grand Genève',
        relocalisation: 'Relocalisation côté français après signature',
        statut: 'Statut : ressortissant français, éligible au permis G UE/AELE',
        disponibilite: 'Disponibilité : selon préavis contractuel',
      })
    );

    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<GenevaInfoSection />);
    });

    const labels = container.querySelectorAll('.tracking-widest');
    expect(labels.length).toBe(4);

    const labelTexts = Array.from(labels).map((el) => el.textContent?.trim());
    expect(labelTexts).toContain('MOBILITÉ');
    expect(labelTexts).toContain('RELOCALISATION');
    expect(labelTexts).toContain('STATUT');
    expect(labelTexts).toContain('DISPONIBILITÉ');
  });

  /* ── Style glass-panel ────────────────────────────────────────── */

  it('le conteneur principal porte la classe glass-panel', () => {
    vi.mocked(getCopy).mockReturnValue(
      mockGenevaCopy({
        mobilite: 'Mobilité : Genève / Grand Genève',
        relocalisation: 'Relocalisation côté français après signature',
        statut: 'Statut : ressortissant français, éligible au permis G UE/AELE',
        disponibilite: 'Disponibilité : selon préavis contractuel',
      })
    );

    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<GenevaInfoSection />);
    });

    const glassPanel = container.querySelector('.glass-panel');
    expect(glassPanel).not.toBeNull();
  });
});
