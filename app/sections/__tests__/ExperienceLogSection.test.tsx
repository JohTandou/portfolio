import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { ExperienceLogSection } from '../ExperienceLogSection';
import { act } from 'react';

// Mocks de dépendances — seules les dépendances externes sont mockées,
// le composant ExperienceLogSection lui-même est rendu réellement.
vi.mock('@/components/ExperienceCard', () => ({
  ExperienceCard: () => <div data-testid="exp-card">Card</div>,
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
});
