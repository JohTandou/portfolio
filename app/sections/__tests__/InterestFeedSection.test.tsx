import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { InterestFeedSection } from '../InterestFeedSection';
import { act } from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, whileInView, viewport, transition, whileHover, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    h2: ({ children, ...props }: any) => {
      const { initial, whileInView, viewport, transition, ...rest } = props;
      return <h2 {...rest}>{children}</h2>;
    },
    p: ({ children, ...props }: any) => {
      const { initial, whileInView, viewport, transition, ...rest } = props;
      return <p {...rest}>{children}</p>;
    },
  },
}));

// Mock SectionWrapper
vi.mock('../../components/SectionWrapper', () => ({
  SectionWrapper: ({ children }: any) => <div>{children}</div>,
}));

// Mock BackgroundSection
vi.mock('../../components/BackgroundSection', () => ({
  BackgroundSection: ({ children }: any) => <div>{children}</div>,
}));

describe('InterestFeedSection', () => {
  it('should render the section title', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<InterestFeedSection />);
    });

    expect(container.textContent).toContain("FLUX D'INTÉRÊTS");
    expect(container.textContent).toContain('Ce qui nourrit mon regard');
  });

  it('should render all 3 interest cards', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<InterestFeedSection />);
    });

    expect(container.textContent).toContain('TENNIS / PADEL');
    expect(container.textContent).toContain('BEATMAKING');
    expect(container.textContent).toContain('PHOTOGRAPHIE');
  });

  it('should wrap each interest card in a native div with .glass-card class', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<InterestFeedSection />);
    });

    const glassCards = container.querySelectorAll('.glass-card');
    expect(glassCards.length).toBe(3);

    // Vérifie que les classes de groupe sont présentes
    const firstCard = glassCards[0];
    expect(firstCard.className).toContain('group');

    // Chaque carte doit contenir son contenu
    expect(glassCards[0].textContent).toContain('TENNIS / PADEL');
    expect(glassCards[1].textContent).toContain('BEATMAKING');
    expect(glassCards[2].textContent).toContain('PHOTOGRAPHIE');
  });


  it('should render polaroid decorative elements', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<InterestFeedSection />);
    });

    // Les polaroids sont des divs avec aria-hidden="true"
    const hiddenDivs = container.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenDivs.length).toBeGreaterThanOrEqual(3);
  });

  it('should render baseline descriptions for each interest', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<InterestFeedSection />);
    });

    expect(container.textContent).toContain('Reflexes calibrés');
    expect(container.textContent).toContain('Compositeur en chambre');
    expect(container.textContent).toContain('Cadrer le réel');
  });
});
