import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { Navigation } from '../Navigation';
import { act } from 'react';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => (
    <img {...props} data-testid="next-image" />
  ),
}));

// Mock providers and framer-motion
vi.mock('../providers/ReducedMotionProvider', () => ({
  useReducedMotion: () => ({ isReducedMotion: true }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

// Mock IntersectionObserver
vi.stubGlobal('IntersectionObserver', vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})));

// Mock useAudioPlayer
vi.mock('../../hooks/useAudioPlayer', () => ({
  useAudioPlayer: () => ({
    isActive: false,
    toggle: vi.fn(),
    activate: vi.fn(),
    deactivate: vi.fn(),
  }),
}));

describe('Navigation Extended', () => {
  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
    // Mock getElementById
    document.getElementById = vi.fn((id) => {
      if (id === 'hero') return document.createElement('div');
      return null;
    });
  });

  it('should trigger scroll to hero when desktop logo is clicked', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<Navigation />);
    });

    const logoButton = container.querySelector('[aria-label="Retour à l\'accueil — JOH TANDOU"]');
    expect(logoButton).not.toBeNull();

    act(() => {
      (logoButton as HTMLButtonElement).click();
    });

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('should trigger scroll to hero when mobile logo button is clicked', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<Navigation />);
    });

    const mobileButton = container.querySelector('[aria-label="Retour à l\'accueil"]');
    expect(mobileButton).not.toBeNull();

    act(() => {
      (mobileButton as HTMLButtonElement).click();
    });

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('should have accessible navigation links', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<Navigation />);
    });

    const navLinks = container.querySelectorAll('nav ul li button');
    navLinks.forEach((link) => {
      // Skip the audio button which has an aria-label
      if (link.getAttribute('aria-label')?.includes('musique')) return;
      
      expect(link.getAttribute('aria-label')).toBeNull(); // Should have accessible name from text content
      expect(link.textContent).not.toBe('');
    });
  });
});
