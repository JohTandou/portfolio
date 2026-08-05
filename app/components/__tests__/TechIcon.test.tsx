import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { TechIcon } from '../TechIcon';
import { act } from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      // Expose the stagger delay as a data attribute for assertions
      const { initial, whileInView, viewport, transition, ...rest } = props;
      const delayAttr = typeof transition?.delay === 'number'
        ? { 'data-delay': String(transition.delay) }
        : {};
      return <div {...rest} {...delayAttr}>{children}</div>;
    },
  },
}));

describe('TechIcon', () => {
  it("affiche le label et la flèche décorative", () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<TechIcon label="React" />);
    });

    expect(container.textContent).toContain('▸');
    expect(container.textContent).toContain('React');
  });

  it("utilise un index par défaut de 0 (délai de stagger = 0 * 0.04 = 0)", () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<TechIcon label="React" />);
    });

    const div = container.querySelector('div');
    expect(div).toBeDefined();
    // index non fourni → index = 0 → delay = 0 * 0.04 = 0
    expect(div?.getAttribute('data-delay')).toBe('0');
  });

  it("calcule le stagger delay = index * 0.04 pour chaque position", () => {
    const testCases = [
      { index: 0, expectedDelay: '0' },
      { index: 1, expectedDelay: '0.04' },
      { index: 5, expectedDelay: '0.2' },
      { index: 10, expectedDelay: '0.4' },
      { index: 25, expectedDelay: '1' },
    ];

    for (const tc of testCases) {
      const container = document.createElement('div');
      const root = createRoot(container);
      act(() => {
        root.render(<TechIcon label="React" index={tc.index} />);
      });

      const div = container.querySelector('div');
      expect(div?.getAttribute('data-delay')).toBe(
        tc.expectedDelay,
        `index=${tc.index} → delay attendu=${tc.expectedDelay}`
      );
    }
  });

  it("affiche uniquement le label sans description (prop description supprimée)", () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<TechIcon label="TypeScript" index={2} />);
    });

    // Le DOM doit contenir le label et la flèche, rien d'autre
    expect(container.textContent).toBe('▸TypeScript');
  });
});
