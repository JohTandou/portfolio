import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { ExperienceCard } from '../ExperienceCard';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, whileInView, viewport, transition, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    span: ({ children, ...props }: any) => {
      const { initial, whileInView, viewport, transition, ...rest } = props;
      return <span {...rest}>{children}</span>;
    },
  },
}));

// Mock ReducedMotionProvider
vi.mock('../../providers/ReducedMotionProvider', () => ({
  useReducedMotion: () => ({ isReducedMotion: true }),
}));

describe('ExperienceCard', () => {
  const mockEntry = {
    company: 'Test Company',
    role: 'Software Engineer',
    startDate: '2020',
    endDate: '2021',
    location: 'Remote',
    mission: 'Test Mission',
    impact: ['Impact 1', 'Impact 2'],
    stack: ['React', 'TypeScript'],
  };

  it('should render the experience details', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<ExperienceCard entry={mockEntry} index={0} isActive={false} />);
    });
    
    expect(container.textContent).toContain('TE'); // Initials
    expect(container.textContent).toContain('COMPANY_ID : Test Company'); // Eyebrow entreprise
    expect(container.textContent).toContain('Software Engineer');
    expect(container.textContent).toContain('2020 → 2021');
    expect(container.textContent).toContain('Test Mission');
    expect(container.textContent).toContain('Impact 1');
    expect(container.textContent).toContain('React');
  });

  it('should wrap the card in a native div with .glass-card class', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<ExperienceCard entry={mockEntry} index={0} isActive={false} />);
    });

    const glassCardElements = container.querySelectorAll('.glass-card');
    expect(glassCardElements.length).toBe(1);

    const card = glassCardElements[0];
    expect(card.className).toContain('group');
    expect(card.className).toContain('relative');
    expect(card.textContent).toContain('Software Engineer');
  });

  it('should render scanlines overlay inside the card', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<ExperienceCard entry={mockEntry} index={0} isActive={false} />);
    });

    // The scanlines div should exist and have pointer-events-none
    const divs = container.querySelectorAll('div');
    const scanlines = Array.from(divs).find((d) =>
      d.className.includes('pointer-events-none')
    );
    expect(scanlines).not.toBeNull();
    expect(scanlines?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render all sections: Mission, Impact, Stack', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<ExperienceCard entry={mockEntry} index={0} isActive={false} />);
    });

    expect(container.textContent).toContain('Mission');
    expect(container.textContent).toContain('Impact');
    expect(container.textContent).toContain('Stack');
  });

  it('should handle current position (no endDate)', () => {
    const activeEntry = { ...mockEntry, endDate: null };
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<ExperienceCard entry={activeEntry} index={0} isActive={false} />);
    });

    expect(container.textContent).toContain('2020 → NOW');
  });
});
