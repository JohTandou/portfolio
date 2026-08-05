import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { TechArsenalSection } from '../TechArsenalSection';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock components
vi.mock('../components/SectionWrapper', () => ({
  SectionWrapper: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('../components/TechIcon', () => ({
  TechIcon: ({ label }: any) => <span>{label}</span>,
}));
vi.mock('../components/BackgroundSection', () => ({
  BackgroundSection: ({ children }: any) => <div>{children}</div>,
}));

describe('TechArsenalSection', () => {
  it('should render the section title and the 3 category groups', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<TechArsenalSection />);
    });
    
    expect(container.textContent).toContain('ARSENAL TECH');
    // Titre de section
    expect(container.textContent).toContain('Stack, outils et compétences techniques');
    // Les 3 groupes
    expect(container.textContent).toContain('PROFESSIONNEL');
    expect(container.textContent).toContain('PRODUITS LIVRÉS');
    expect(container.textContent).toContain('AI & AUTOMATION');
  });

  it('should render tech items from each group', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<TechArsenalSection />);
    });

    // Groupe PROFESSIONNEL
    expect(container.textContent).toContain('Java');
    expect(container.textContent).toContain('TypeScript');
    expect(container.textContent).toContain('React');
    expect(container.textContent).toContain('Angular');

    // Groupe PRODUITS LIVRÉS
    expect(container.textContent).toContain('Supabase');
    expect(container.textContent).toContain('Flutter');
    expect(container.textContent).toContain('Xamarin');

    // Groupe AI & AUTOMATION
    expect(container.textContent).toContain('OpenCode');
    expect(container.textContent).toContain('Claude Code');
    expect(container.textContent).toContain('Codex');
    expect(container.textContent).toContain('OpenClaw');
  });

  it('should wrap each category in a glass-card container', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<TechArsenalSection />);
    });

    const glassCards = container.querySelectorAll('.glass-card');
    expect(glassCards.length).toBe(3);
  });
});
