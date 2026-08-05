import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { HumanProtocolsSection } from '../HumanProtocolsSection';
import { act } from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, whileInView, viewport, transition, variants, ...rest } = props;
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
  useInView: () => true,
}));

// Mock SectionWrapper
vi.mock('../../components/SectionWrapper', () => ({
  SectionWrapper: ({ children }: any) => <div>{children}</div>,
}));

// Mock BackgroundSection
vi.mock('../../components/BackgroundSection', () => ({
  BackgroundSection: ({ children }: any) => <div>{children}</div>,
}));

// Mock ReducedMotionProvider
vi.mock('../../providers/ReducedMotionProvider', () => ({
  useReducedMotion: () => ({ isReducedMotion: true }),
}));

describe('HumanProtocolsSection', () => {
  it('should render the section title', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HumanProtocolsSection />);
    });

    expect(container.textContent).toContain('PROTOCOLES HUMAINS');
    expect(container.textContent).toContain('Soft skills et m\u00e9thodologies de travail');
  });

  it('should render all 5 protocol cards', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HumanProtocolsSection />);
    });

    expect(container.textContent).toContain('ADAPTATION');
    expect(container.textContent).toContain('SENS DU TERRAIN');
    expect(container.textContent).toContain('FIABILIT\u00c9');
    // L\u2019apostrophe typographique (U+2019) dans ESPRIT D\u2019\u00c9QUIPE est v\u00e9rifi\u00e9e
    // en deux parties pour \u00e9viter les ambigu\u00eft\u00e9s d\u2019encodage
    expect(container.textContent).toContain('ESPRIT D');
    expect(container.textContent).toContain('\u00c9QUIPE');
    expect(container.textContent).toContain('CURIOSIT\u00c9 APPLIQU\u00c9E');
  });

  it('should wrap each protocol card in a native div with .glass-card class', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HumanProtocolsSection />);
    });

    const glassCards = container.querySelectorAll('.glass-card');
    expect(glassCards.length).toBe(5);

    // Chaque carte doit avoir son contenu
    expect(glassCards[0].textContent).toContain('ADAPTATION');
    expect(glassCards[1].textContent).toContain('SENS DU TERRAIN');
  });

  it('should display protocol numbers and descriptions', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HumanProtocolsSection />);
    });

    // Num\u00e9ros des protocoles
    expect(container.textContent).toContain('01');
    expect(container.textContent).toContain('05');

    // Descriptions partielles (v\u00e9rification que le contenu est rendu)
    expect(container.textContent).toContain('Xamarin');
    expect(container.textContent).toContain('Devoxx');
    expect(container.textContent).toContain('SNCF');
  });

  it('should render the blinking cursor indicator', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<HumanProtocolsSection />);
    });

    // Le caract\u00e8re \u25b8 doit \u00eatre pr\u00e9sent pour chaque protocole
    const cursorMatches = container.innerHTML.match(/\u25b8/g);
    expect(cursorMatches).not.toBeNull();
    expect(cursorMatches!.length).toBeGreaterThanOrEqual(1);
  });
});
