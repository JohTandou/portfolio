import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { MissionsArchiveSection } from '../MissionsArchiveSection';
import { act } from 'react';

// ── Mocks ─────────────────────────────────────────────────────────
vi.mock('../components/BackgroundSection', () => ({
  BackgroundSection: ({ children, id }: any) => (
    <section id={id}>{children}</section>
  ),
}));

vi.mock('../providers/ReducedMotionProvider', () => ({
  useReducedMotion: () => ({ isReducedMotion: true, toggleReducedMotion: () => {} }),
}));

vi.mock('../../hooks/useMediaQuery', () => ({
  useMediaQuery: () => false,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// ── Tests ─────────────────────────────────────────────────────────
describe('MissionsArchiveSection', () => {
  it('devrait afficher le titre MISSIONS_ARCHIVE et les codenames des 6 missions (TOPSEEKER, SCRIPTURA, AGENT_SWARM, USEFOOD, STRATEGY_AI, PUCK_COLLECTOR)', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<MissionsArchiveSection />);
    });

    // Titre principal
    expect(container.textContent).toContain('MISSIONS_ARCHIVE');

    // Tous les codenames de MISSIONS_DATA
    expect(container.textContent).toContain('TOPSEEKER');
    expect(container.textContent).toContain('SCRIPTURA');
    expect(container.textContent).toContain('AGENT_SWARM');
    expect(container.textContent).toContain('USEFOOD');
    expect(container.textContent).toContain('STRATEGY_AI');
    expect(container.textContent).toContain('PUCK_COLLECTOR');
  });
});
