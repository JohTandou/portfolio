import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { LanguageModulesSection } from '../LanguageModulesSection';
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

describe('LanguageModulesSection', () => {
  it('should render the section title', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<LanguageModulesSection />);
    });

    expect(container.textContent).toContain('MODULES LINGUISTIQUES');
  });

  it('should render the subtitle from the copy system', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<LanguageModulesSection />);
    });

    // Sous-chaîne distinctive du sous-titre public
    expect(container.textContent).toContain('contextes professionnels');
  });

  it('should render FR, EN, and ES language modules', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<LanguageModulesSection />);
    });

    expect(container.textContent).toContain('FR');
    expect(container.textContent).toContain('EN');
    expect(container.textContent).toContain('ES');
  });

  it('should render language names and levels', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<LanguageModulesSection />);
    });

    expect(container.textContent).toContain('FRANÇAIS');
    expect(container.textContent).toContain('ANGLAIS');
    expect(container.textContent).toContain('ESPAGNOL');
    expect(container.textContent).toContain('NATIVE');
    expect(container.textContent).toContain('C1');
    expect(container.textContent).toContain('B1');
  });

  it('should render detail lines for each language', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<LanguageModulesSection />);
    });

    expect(container.textContent).toContain('TOEIC');
    expect(container.textContent).toContain('ILSC');
    expect(container.textContent).toContain('Montréal');
    expect(container.textContent).toContain('CORE');
    expect(container.textContent).toContain('ADVANCED');
    expect(container.textContent).toContain('INTERMEDIATE');
  });
});
