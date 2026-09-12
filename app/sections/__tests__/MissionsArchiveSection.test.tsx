import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { MissionsArchiveSection } from '../MissionsArchiveSection';
import { act } from 'react';
import { DESKTOP_CARD_WIDTH } from '../../lib/constants';

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
      root.render(<MissionsArchiveSection />);
    });
    return container;
  };

  it('devrait afficher le titre MISSIONS_ARCHIVE et les codenames des 6 missions (TOPSEEKER, SCRIPTURA, AGENT_SWARM, USEFOOD, STRATEGY_AI, PUCK_COLLECTOR)', () => {
    const container = render();

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

  it('devrait afficher les flèches de navigation sur desktop (conteneur sans md:hidden)', () => {
    const container = render();

    const prev = container.querySelector('[aria-label="Mission précédente"]');
    const next = container.querySelector('[aria-label="Mission suivante"]');
    expect(prev).not.toBeNull();
    expect(next).not.toBeNull();

    const nav = prev!.parentElement;
    expect(nav?.className).not.toContain('md:hidden');
    expect(nav?.className).toContain('mt-8');
  });

  it('devrait recentrer via scrollTo au clic sur un dot', () => {
    const container = render();

    const dots = container.querySelectorAll('[aria-label^="Aller à la mission"]');
    act(() => {
      (dots[1] as HTMLButtonElement).click();
    });

    expect(scrollToMock).toHaveBeenCalledWith({
      left: DESKTOP_CARD_WIDTH + 24,
      behavior: 'smooth',
    });
  });

  it('devrait recentrer via scrollTo au clic sur une carte', () => {
    const container = render();

    const cards = container.querySelectorAll('.glass-card');
    expect(cards.length).toBeGreaterThan(1);
    const wrapper = cards[1].parentElement as HTMLElement;
    act(() => {
      wrapper.click();
    });

    expect(scrollToMock).toHaveBeenCalledWith({
      left: DESKTOP_CARD_WIDTH + 24,
      behavior: 'smooth',
    });
  });

  it('devrait laisser un clic sur un lien interne ouvrir le lien sans recentrer', () => {
    const container = render();

    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
    const link = links[0] as HTMLAnchorElement;
    // Empêche la navigation jsdom non implémentée lors du test.
    link.addEventListener('click', (e) => e.preventDefault());
    act(() => {
      link.click();
    });

    expect(scrollToMock).not.toHaveBeenCalled();
  });
});
