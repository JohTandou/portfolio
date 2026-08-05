import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { IdentitySection } from '../IdentitySection';
import { act } from 'react';

// Mock providers and framer-motion
vi.mock('../../providers/ReducedMotionProvider', () => ({
  useReducedMotion: () => ({ isReducedMotion: true }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// Mock next/image — rend un <img> natif avec les props passées
vi.mock('next/image', () => ({
  default: ({ src, alt, fill, ...props }: Record<string, unknown>) => (
    <img src={String(src)} alt={String(alt ?? '')} />
  ),
}));

describe('IdentitySection', () => {
  it('should render identity information', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<IdentitySection />);
    });

    expect(container.textContent).toContain('JOH');
    expect(container.textContent).toContain('TANDOU');
    expect(container.textContent).toContain('IDENTITÉ');
  });

  it('should render the identity photo inside a round container with a spinning SVG ring', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<IdentitySection />);
    });

    // Vérifie que la photo d'identité est présente avec le bon src et alt
    const img = container.querySelector('img[alt="Photo de Joh Tandou"]');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toBe('/identity-photo.jpg');
    expect(img?.getAttribute('alt')).toBe('Photo de Joh Tandou');

    // Vérifie la présence du SVG avec l'anneau doré
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();

    // Vérifie le cercle avec les attributs dasharray et couleur accent-1
    const circle = svg?.querySelector('circle');
    expect(circle).not.toBeNull();
    expect(circle?.getAttribute('fill')).toBe('none');
    expect(circle?.getAttribute('stroke')).toBe('var(--color-accent-1)');
    expect(circle?.getAttribute('stroke-dasharray')).toBe('6 16');
    expect(circle?.getAttribute('stroke-linecap')).toBe('round');

    // Vérifie que le SVG porte l'animation avatar-ring-spin (ou none si reduced-motion)
    const svgStyle = svg?.getAttribute('style') ?? '';
    expect(svgStyle).toContain('animation');
  });

  it('should render the left pane without sticky positioning', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<IdentitySection />);
    });

    // Le panneau gauche ne doit PAS être sticky. On vérifie l'absence de md:sticky
    // en regardant les éléments fils directs de la grille principale.
    const grid = container.querySelector('.grid');
    expect(grid).not.toBeNull();

    const children = grid?.children;
    expect(children).not.toBeNull();
    if (children && children.length >= 2) {
      const leftPane = children[0] as HTMLElement;
      // Le panneau gauche ne doit PAS avoir la classe md:sticky
      expect(leftPane.className).not.toContain('md:sticky');
      // Ne doit pas non plus avoir alignSelf: start via style (ou pas de style du tout)
      const styleAttr = leftPane.getAttribute('style') ?? '';
      expect(styleAttr).not.toContain('start');
    }
  });

  it('should apply responsive order classes so the identity card moves left on desktop', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<IdentitySection />);
    });

    const grid = container.querySelector('.grid');
    expect(grid).not.toBeNull();

    const children = grid?.children;
    expect(children).not.toBeNull();
    expect(children?.length).toBeGreaterThanOrEqual(2);

    if (children && children.length >= 2) {
      const photoPane = children[0] as HTMLElement;
      const cardPane = children[1] as HTMLElement;

      // Photo/nom : order-1 (mobile) et md:order-2 (desktop→droite)
      expect(photoPane.className).toContain('order-1');
      expect(photoPane.className).toContain('md:order-2');

      // Carte Identité : order-2 (mobile) et md:order-1 (desktop→gauche)
      expect(cardPane.className).toContain('order-2');
      expect(cardPane.className).toContain('md:order-1');
    }
  });

  it('should pass animation props to the portrait + name container', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<IdentitySection />);
    });

    // Le premier enfant de la grille est le container portrait + nom (left pane)
    const grid = container.querySelector('.grid');
    expect(grid).not.toBeNull();

    const children = grid?.children;
    expect(children).not.toBeNull();

    if (children && children.length >= 2) {
      const leftPane = children[0] as HTMLElement;
      // Vérifie que le left pane a les classes flex-col + items-center
      expect(leftPane.className).toContain('flex-col');
      expect(leftPane.className).toContain('items-center');

      // Vérifie que la photo et le nom sont bien à l'intérieur
      expect(leftPane.querySelector('img[alt="Photo de Joh Tandou"]')).not.toBeNull();
      expect(leftPane.textContent).toContain('JOH');
      expect(leftPane.textContent).toContain('TANDOU');
    }
  });

  it('should wrap the main identity card in a native div with .glass-card class', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<IdentitySection />);
    });

    // Le panneau droit (identity card) doit avoir .glass-card
    const glassCardElements = container.querySelectorAll('.glass-card');
    expect(glassCardElements.length).toBeGreaterThanOrEqual(1);

    // La première .glass-card (carte principale) doit contenir IDENTITÉ
    const mainCard = Array.from(glassCardElements).find((el) =>
      el.textContent?.includes('IDENTITÉ')
    );
    expect(mainCard).not.toBeNull();

    // La carte principale doit contenir les badges de stats RPG
    expect(mainCard?.textContent).toContain('Localisation');
    expect(mainCard?.textContent).toContain('Full-Stack');
  });

  it('should not render any mini-stat cards inside the main identity card', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<IdentitySection />);
    });

    // Vérifie que les libellés des mini-stats RPG sont absents
    expect(container.textContent).not.toContain('DATASETS_HANDLED');
    expect(container.textContent).not.toContain('APPS_DEPLOYED');
    expect(container.textContent).not.toContain('USERS_SUPPORTED');
    expect(container.textContent).not.toContain('STACKS_MASTERED');
    expect(container.textContent).not.toContain('1M+');
    expect(container.textContent).not.toContain('5+');
    expect(container.textContent).not.toContain('20+');
    expect(container.textContent).not.toContain('4');
  });

  it('should display Île-de-France as location', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<IdentitySection />);
    });

    expect(container.textContent).toContain('Île-de-France');
  });

  it('should render the formation subsection with EFREI Paris and Université Paris Cité', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<IdentitySection />);
    });

    expect(container.textContent).toContain('Formation');
    expect(container.textContent).toContain('EFREI Paris');
    expect(container.textContent).toContain('Diplôme d\'Ingénieur');
    expect(container.textContent).toContain('2021 → 2023');
    expect(container.textContent).toContain('Université Paris Cité');
    expect(container.textContent).toContain('Licence MIAGE');
    expect(container.textContent).toContain('2018 → 2021');
  });
});
