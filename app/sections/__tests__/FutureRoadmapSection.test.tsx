import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { FutureRoadmapSection } from '../FutureRoadmapSection';
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

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('lucide-react', () => ({
  ArrowUpRight: (props: any) => (
    <span data-testid="arrow-up-right-icon" {...props}>
      ↗
    </span>
  ),
}));

// ── Tests ─────────────────────────────────────────────────────────
describe('FutureRoadmapSection', () => {
  it('devrait afficher le titre FUTURE_ROADMAP et tous les checkpoints (NOW, MID-TERM, LONG HORIZON) avec isReducedMotion activé', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<FutureRoadmapSection />);
    });

    // Titre principal
    expect(container.textContent).toContain('FUTURE_ROADMAP');

    // Les 3 checkpoints de ROADMAP_DATA
    expect(container.textContent).toContain('NOW');
    expect(container.textContent).toContain('MID-TERM');
    expect(container.textContent).toContain('LONG HORIZON');
  });

  it('chaque checkpoint affiche un indicateur visuel (icône expansion) avec aria-hidden', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<FutureRoadmapSection />);
    });

    // Trois indicateurs, un par checkpoint
    const indicators = container.querySelectorAll(
      '[data-testid="arrow-up-right-icon"]',
    );
    expect(indicators).toHaveLength(3);

    // Chaque indicateur est décoratif (aria-hidden)
    indicators.forEach((icon) => {
      const parentSpan = icon.closest('[aria-hidden]');
      expect(parentSpan).not.toBeNull();
      expect(parentSpan!.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
