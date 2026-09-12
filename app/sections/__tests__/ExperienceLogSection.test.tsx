import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { ExperienceLogSection } from '../ExperienceLogSection';
import { act } from 'react';
import { DESKTOP_CARD_WIDTH } from '../../lib/constants';

// Mocks de dépendances — seules les dépendances externes sont mockées,
// le composant ExperienceLogSection lui-même est rendu réellement.
// Le bouton interne permet de tester le garde-fou du clic-carte.
vi.mock('@/components/ExperienceCard', () => ({
  ExperienceCard: () => (
    <div data-testid="exp-card">
      Card
      <button data-testid="exp-card-action" type="button">
        Détails
      </button>
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

vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe('ExperienceLogSection', () => {
  const scrollToMock = vi.fn();
  const scrollByMock = vi.fn();

  beforeEach(() => {
    // jsdom n'implémente pas le scroll programmatique : on le stubbe pour
    // pouvoir vérifier les appels de recentrage.
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

  it('doit afficher le titre EXPERIENCE_LOG et les deux entrées mockées', () => {
    const container = render();

    expect(container.textContent).toContain('EXPERIENCE_LOG');

    const cards = container.querySelectorAll('[data-testid="exp-card"]');
    expect(cards.length).toBe(2);
  });

  it('doit afficher les flèches de navigation mobile', () => {
    const container = render();

    const prevButtons = container.querySelectorAll('[aria-label="Expérience précédente"]');
    const nextButtons = container.querySelectorAll('[aria-label="Expérience suivante"]');

    // Il doit y avoir exactement un bouton précédent et un bouton suivant (mobile uniquement)
    expect(prevButtons.length).toBe(1);
    expect(nextButtons.length).toBe(1);
  });

  it('ne doit pas afficher de conteneur desktop hidden md:flex', () => {
    const container = render();

    // Aucun élément ne doit avoir la classe hidden et md:flex simultanément
    // (le conteneur desktop a été supprimé)
    const navContainers = container.querySelectorAll('[class*="mt-6"]');
    let desktopContainerFound = false;
    navContainers.forEach((el) => {
      const cls = el.getAttribute('class') || '';
      if (cls.includes('hidden') && cls.includes('md:flex')) {
        desktopContainerFound = true;
      }
    });
    expect(desktopContainerFound).toBe(false);
  });

  it('doit afficher les indicateurs de pagination', () => {
    const container = render();

    const indicators = container.querySelectorAll('[aria-label^="Aller à l\'expérience"]');
    expect(indicators.length).toBe(2);
  });

  it('doit afficher les flèches de navigation sur desktop (conteneur sans md:hidden)', () => {
    const container = render();

    const prev = container.querySelector('[aria-label="Expérience précédente"]');
    const next = container.querySelector('[aria-label="Expérience suivante"]');
    expect(prev).not.toBeNull();
    expect(next).not.toBeNull();

    // Le conteneur des flèches n'est plus masqué en desktop.
    const nav = prev!.parentElement;
    expect(nav?.className).not.toContain('md:hidden');
    expect(nav?.className).toContain('mt-8');
  });

  it('doit recentrer le carrousel au clic sur un dot (goToIndex)', () => {
    const container = render();

    const dots = container.querySelectorAll('[aria-label^="Aller à l\'expérience"]');
    act(() => {
      (dots[1] as HTMLButtonElement).click();
    });

    expect(scrollToMock).toHaveBeenCalledWith({
      left: DESKTOP_CARD_WIDTH + 24,
      behavior: 'smooth',
    });
  });

  it('doit recentrer le carrousel au clic sur une carte', () => {
    const container = render();

    const cards = container.querySelectorAll('[data-testid="exp-card"]');
    const wrapper = cards[1].parentElement as HTMLElement;
    act(() => {
      wrapper.click();
    });

    expect(scrollToMock).toHaveBeenCalledWith({
      left: DESKTOP_CARD_WIDTH + 24,
      behavior: 'smooth',
    });
  });

  it('ne doit pas recentrer quand le clic provient d\'un bouton interne', () => {
    const container = render();

    const innerButtons = container.querySelectorAll('[data-testid="exp-card-action"]');
    expect(innerButtons.length).toBeGreaterThan(0);
    act(() => {
      (innerButtons[0] as HTMLButtonElement).click();
    });

    expect(scrollToMock).not.toHaveBeenCalled();
  });
});
