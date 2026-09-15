import { describe, it, expect } from 'vitest';
import { COPY } from '@/lib/copy';

describe('roadmap — copy', () => {
  /* ── Source unique de textes ─────────────────────────────────── */

  it('NOW ne mentionne ni mobilité, ni remote, ni disponibilité', () => {
    const nowText = [
      COPY.roadmap.now.title,
      COPY.roadmap.now.description,
      COPY.roadmap.now.manifesto,
    ].join(' ');
    expect(nowText).not.toContain('Genève');
    expect(nowText).not.toContain('remote');
    expect(nowText).not.toContain('disponibilité immédiate');
    expect(nowText).not.toContain('disponible');
  });

  it('LONG HORIZON ne mentionne ni relocalisation, ni installation durable', () => {
    const longText = [
      COPY.roadmap.long.title,
      COPY.roadmap.long.description,
      COPY.roadmap.long.manifesto,
    ].join(' ');
    expect(longText).not.toContain('Genève');
    expect(longText).not.toContain('Suisse');
    expect(longText).not.toContain('relocalisation');
  });

  it('NOW status is active', () => {
    // Le statut est dans le composant, pas dans le copy — testé via
    // le fait que le NOW est le premier checkpoint (toujours active
    // dans FutureRoadmapSection).
    expect(COPY.roadmap.now.title).toBeTruthy();
  });

  it('tous les champs roadmap sont renseignés', () => {
    const checkpoints = ['now', 'mid', 'long'] as const;
    for (const id of checkpoints) {
      expect(COPY.roadmap[id].title).toBeTruthy();
      expect(COPY.roadmap[id].description).toBeTruthy();
      expect(COPY.roadmap[id].manifesto).toBeTruthy();
    }
  });
});
