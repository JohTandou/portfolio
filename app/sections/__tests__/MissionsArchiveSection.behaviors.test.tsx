import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { MissionsArchiveSection } from '../MissionsArchiveSection';
import { act } from 'react';
import { DESKTOP_CARD_WIDTH } from '../../lib/constants';

// Tests additifs (issue #4) : flèches desktop réellement opérationnelles et
// garde-fou du clic sur un bouton interne d'une carte. Le garde-fou lien est
// déjà couvert par MissionsArchiveSection.test.tsx, on complète le cas bouton.

vi.mock('@/components/MissionBriefing', () => ({
  MissionBriefing: ({ mission }: any) => (
    <div className="glass-card" data-testid="mission-card">
      {mission.codename}
      <button data-testid="mission-card-button" type="button">
        Action
      </button>
      <a
        data-testid="mission-card-link"
        href="#details"
        onClick={(e) => e.preventDefault()}
      >
        Lien
      </a>
    </div>
  ),
}));

vi.mock('@/components/BackgroundSection', () => ({
  BackgroundSection: ({ children, id }: any) => (
    <section id={id}>{children}</section>
  ),
}));

vi.mock('@/providers/ReducedMotionProvider', () => ({
  useReducedMotion: () => ({ isReducedMotion: true, toggleReducedMotion: () => {} }),
}));

vi.mock('@/hooks/useMediaQuery', () => ({
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

describe('MissionsArchiveSection — comportements complémentaires', () => {
  const scrollToMock = vi.fn();
  const scrollByMock = vi.fn();

  beforeEach(() => {
    // jsdom n'implémente pas le scroll programmatique : on le stubbe.
    HTMLElement.prototype.scrollTo = scrollToMock as unknown as typeof HTMLElement.prototype.scrollTo;
    HTMLElement.prototype.scrollBy = scrollByMock as unknown as typeof HTMLElement.prototype.scrollBy;
    scrollToMock.mockClear();
    scrollByMock.mockClear();
  });

  const render = () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<MissionsArchiveSection />);
    });
    return container;
  };

  it('devrait faire défiler vers la droite au clic sur la flèche suivante', () => {
    const container = render();

    const next = container.querySelector(
      '[aria-label="Mission suivante"]'
    ) as HTMLButtonElement;
    expect(next).not.toBeNull();
    act(() => {
      next.click();
    });

    expect(scrollByMock).toHaveBeenCalledWith({
      left: DESKTOP_CARD_WIDTH + 24,
      behavior: 'smooth',
    });
  });

  it('devrait faire défiler vers la gauche au clic sur la flèche précédente', () => {
    const container = render();

    const prev = container.querySelector(
      '[aria-label="Mission précédente"]'
    ) as HTMLButtonElement;
    expect(prev).not.toBeNull();
    act(() => {
      prev.click();
    });

    expect(scrollByMock).toHaveBeenCalledWith({
      left: -(DESKTOP_CARD_WIDTH + 24),
      behavior: 'smooth',
    });
  });

  it("devrait laisser un clic sur un bouton interne s'exécuter sans recentrer", () => {
    const container = render();

    const buttons = container.querySelectorAll('[data-testid="mission-card-button"]');
    expect(buttons.length).toBeGreaterThan(0);
    act(() => {
      (buttons[0] as HTMLButtonElement).click();
    });

    expect(scrollToMock).not.toHaveBeenCalled();
  });
});
