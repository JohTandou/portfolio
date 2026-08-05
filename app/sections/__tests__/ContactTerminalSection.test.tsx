import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { ContactTerminalSection } from '../ContactTerminalSection';
import { act } from 'react';

// Mock dependencies
vi.mock('../../components/BackgroundSection', () => ({
  BackgroundSection: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../../components/TerminalInput', () => ({
  TerminalInput: ({ label, error, ...props }: any) => (
    <div>
      <label>{label}</label>
      <input {...props} />
      {error && <span>{error}</span>}
    </div>
  ),
}));

vi.mock('../../components/TerminalButton', () => ({
  TerminalButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('../../components/TerminalSpinner', () => ({
  TerminalSpinner: () => <span>Spinner</span>,
}));

vi.mock('../../components/DigitizeText', () => ({
  DigitizeText: ({ text }: any) => <span>{text}</span>,
}));

vi.mock('../../providers/ReducedMotionProvider', () => ({
  useReducedMotion: () => ({ isReducedMotion: true }),
}));

describe('ContactTerminalSection', () => {
  it('should render contact form', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<ContactTerminalSection />);
    });
    
    expect(container.textContent).toContain('ÉTABLIR_UNE_CONNEXION');
    expect(container.querySelector('input[name="nom"]')).toBeDefined();
    expect(container.querySelector('input[name="email"]')).toBeDefined();
  });

  it('should render the glass-panel wrapper for the form', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<ContactTerminalSection />);
    });

    // Vérifie que .glass-panel est présent
    const glassPanel = container.querySelector('.glass-panel');
    expect(glassPanel).not.toBeNull();
    expect(glassPanel?.textContent).toContain('ÉTABLIR_UNE_CONNEXION');
  });

  it('should render all form fields with correct labels', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<ContactTerminalSection />);
    });

    const labels = container.querySelectorAll('label');
    const labelTexts = Array.from(labels).map((l) => l.textContent);
    expect(labelTexts).toContain('nom');
    expect(labelTexts).toContain('email');
    expect(labelTexts).toContain('entreprise (optionnel)');
    expect(labelTexts).toContain('sujet');
    expect(labelTexts).toContain('message');
  });

  it('should render the submit button with correct text', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<ContactTerminalSection />);
    });

    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    expect(button?.textContent).toContain('TRANSMETTRE');
  });
});
