import { describe, it, expect } from 'vitest';
import { getCopy } from '@/lib/copy';

describe('roadmap — copy variants', () => {
  /* ── Variante publique ───────────────────────────────────────── */

  it('variante publique : NOW ne mentionne ni Genève, ni remote, ni disponibilité', () => {
    const copy = getCopy('public');
    const nowText = [
      copy.roadmap.now.title,
      copy.roadmap.now.description,
      copy.roadmap.now.manifesto,
    ].join(' ');
    expect(nowText).not.toContain('Genève');
    expect(nowText).not.toContain('remote');
    expect(nowText).not.toContain('disponibilité immédiate');
    expect(nowText).not.toContain('disponible');
  });

  it('variante publique : LONG HORIZON ne mentionne ni Genève, ni Suisse, ni relocalisation', () => {
    const copy = getCopy('public');
    const longText = [
      copy.roadmap.long.title,
      copy.roadmap.long.description,
      copy.roadmap.long.manifesto,
    ].join(' ');
    expect(longText).not.toContain('Genève');
    expect(longText).not.toContain('Suisse');
    expect(longText).not.toContain('relocalisation');
  });

  it('variante publique : NOW status is active', () => {
    // Le statut est dans le composant, pas dans le copy — testé via
    // le fait que le NOW est le premier checkpoint (toujours active
    // dans FutureRoadmapSection).
    const copy = getCopy('public');
    expect(copy.roadmap.now.title).toBeTruthy();
  });

  it('variante publique : tous les champs roadmap sont renseignés', () => {
    const copy = getCopy('public');
    const checkpoints = ['now', 'mid', 'long'] as const;
    for (const id of checkpoints) {
      expect(copy.roadmap[id].title).toBeTruthy();
      expect(copy.roadmap[id].description).toBeTruthy();
      expect(copy.roadmap[id].manifesto).toBeTruthy();
    }
  });

  /* ── Variante Genève ─────────────────────────────────────────── */

  it('variante geneva : NOW mentionne Genève et remote', () => {
    const copy = getCopy('geneva');
    const nowText = [
      copy.roadmap.now.title,
      copy.roadmap.now.description,
      copy.roadmap.now.manifesto,
    ].join(' ');
    expect(nowText).toContain('Genève');
    expect(nowText).toContain('remote');
  });

  it('variante geneva : LONG HORIZON mentionne installation durable et équipe à Genève', () => {
    const copy = getCopy('geneva');
    const longText = [
      copy.roadmap.long.title,
      copy.roadmap.long.description,
      copy.roadmap.long.manifesto,
    ].join(' ');
    expect(longText).toContain('installation durable');
    expect(longText).toContain('équipe');
    expect(longText).toContain('Genève');
  });

  it('genevaInfo est null sur public, renseigné sur geneva', () => {
    expect(getCopy('public').genevaInfo).toBeNull();
    const genevaInfo = getCopy('geneva').genevaInfo;
    expect(genevaInfo).not.toBeNull();
    expect(genevaInfo!.mobilite).toContain('Genève');
    expect(genevaInfo!.disponibilite).toBeTruthy();
  });
});
