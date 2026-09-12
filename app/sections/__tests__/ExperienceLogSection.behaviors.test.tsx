import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { ExperienceLogSection } from '../ExperienceLogSection';
import { act } from 'react';
import { DESKTOP_CARD_WIDTH } from '../../lib/constants';

// Tests additifs (issue #4) : flèches desktop réellement opérationnelles et
// garde-fou du clic sur un lien interne d'une carte. Le garde-fou bouton est
// déjà couvert par ExperienceLogSection.test.tsx, on complète le cas lien.

vi.mock('@/components/ExperienceCard', () => ({
  ExperienceCard: () => (
    <div data-testid="exp-card">
      Card
      <a
        data-testid="exp-card-link"
        href="#details"
        onClick={(e) => e.preventDefault()}
      >
        Détails
      </a>
    </div>
  ),
}));

vi.mock('@/components/SectionWrapper', () => ({
  SectionWrapper: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/BackgroundSection', () => ({
  BackgroundSection: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/lib/experience', () => ({
  EXPERIENCE_DATA: [
    { id: '1', role: 'Role 1', company: 'Comp 1', startDate: '2020', endDate: '2021', location: 'Loc 1', mission: 'Miss 1', impact: ['Imp 1'], stack: ['Tech 1'] },
    { id: '2', role: 'Role 2', company: 'Comp 2', startDate: '2021', endDate: '2022', location: 'Loc 2', mission: 'Miss 2', impact: ['Imp 2'], stack: ['Tech 2'] },
  ],
}));

vi.mock('@/providers/ReducedMotionProvider', () => ({
  useReducedMotion: () => ({ isReducedMotion: true }),
}));

vi.mock('@/hooks/useAnimationFallback', () => ({
  useAnimationFallback: () => ({ current: null }),
}));

vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: () => false,
}));

vi.mock('framer-motion', () => ({
  motion: {
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('ExperienceLogSection — comportements complémentaires', () => {
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
      root.render(<ExperienceLogSection />);
    });
    return container;
  };

  it('doit faire défiler vers la droite au clic sur la flèche suivante', () => {
    const container = render();

    const next = container.querySelector(
      '[aria-label="Expérience suivante"]'
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

  it('doit faire défiler vers la gauche au clic sur la flèche précédente', () => {
    const container = render();

    const prev = container.querySelector(
      '[aria-label="Expérience précédente"]'
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

  it("ne doit pas recentrer quand le clic provient d'un lien interne", () => {
    const container = render();

    const links = container.querySelectorAll('[data-testid="exp-card-link"]');
    expect(links.length).toBeGreaterThan(0);
    act(() => {
      (links[0] as HTMLAnchorElement).click();
    });

    expect(scrollToMock).not.toHaveBeenCalled();
  });
});
