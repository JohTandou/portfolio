import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { Navigation } from '../Navigation';
import { act } from 'react';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
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
const mockToggleAudio = vi.fn();
let mockIsAudioActive = false;

vi.mock('../../hooks/useAudioPlayer', () => ({
  useAudioPlayer: () => ({
    isActive: mockIsAudioActive,
    toggle: mockToggleAudio,
    activate: vi.fn(),
    deactivate: vi.fn(),
  }),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Volume2: (props: any) => <span data-testid="volume-2" {...props}>VOL2</span>,
  VolumeX: (props: any) => <span data-testid="volume-x" {...props}>VOLX</span>,
}));

describe('Navigation', () => {
  it('should render navigation links', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<Navigation />);
    });
    
    expect(container.textContent).toContain('IDENTITÉ');
    expect(container.textContent).toContain('EXPÉRIENCE');
    expect(container.textContent).toContain('CONTACT');
  });
});

describe('Logo button', () => {
  it('should render the desktop logo image with correct alt text', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<Navigation />);
    });

    const logoImage = container.querySelector('[alt="Logo JOH TANDOU"]');
    expect(logoImage).not.toBeNull();
    expect(logoImage?.getAttribute('src')).toBe('/logo.png');
    expect(logoImage?.getAttribute('data-testid')).toBe('next-image');
  });

  it('should have an accessible aria-label on the desktop logo button', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<Navigation />);
    });

    const logoButton = container.querySelector('[aria-label="Retour à l\'accueil — JOH TANDOU"]');
    expect(logoButton).not.toBeNull();
    expect(logoButton?.tagName).toBe('BUTTON');
  });

  it('should have a 44px touch target on the desktop logo button', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<Navigation />);
    });

    const logoButton = container.querySelector('[aria-label="Retour à l\'accueil — JOH TANDOU"]');
    expect(logoButton).not.toBeNull();
    // Vérifie les classes de touch target : h-11 (44px) et min-w-[44px]
    expect(logoButton?.className).toContain('h-11');
    expect(logoButton?.className).toContain('min-w-[44px]');
  });

  it('should render the mobile logo image with correct alt and src', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<Navigation />);
    });

    const mobileButton = container.querySelector('[aria-label="Retour à l\'accueil"]');
    expect(mobileButton).not.toBeNull();
    expect(mobileButton?.tagName).toBe('BUTTON');

    const mobileImage = mobileButton?.querySelector('img');
    expect(mobileImage).not.toBeNull();
    expect(mobileImage?.getAttribute('alt')).toBe('JOH TANDOU');
    expect(mobileImage?.getAttribute('src')).toBe('/logo.png');
  });

  it('should have correct touch target and styling on the mobile logo button', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<Navigation />);
    });

    const mobileButton = container.querySelector('[aria-label="Retour à l\'accueil"]');
    expect(mobileButton).not.toBeNull();
    // Le logo mobile est désormais un mot-symbole horizontal : hauteur 44px, largeur adaptative
    expect(mobileButton?.className).toContain('h-11');
    expect(mobileButton?.className).toContain('min-h-[44px]');
    expect(mobileButton?.className).toContain('min-w-[44px]');
    // Ne doit PAS être carré (pas de w-11)
    expect(mobileButton?.className).not.toContain('w-11');
    // Caché sur desktop, visible sur mobile
    expect(mobileButton?.className).toContain('md:hidden');
  });

  it('should NOT have data-nav-glow on the desktop logo button', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<Navigation />);
    });

    const logoButton = container.querySelector('[aria-label="Retour à l\'accueil — JOH TANDOU"]');
    expect(logoButton).not.toBeNull();
    expect(logoButton?.hasAttribute('data-nav-glow')).toBe(false);
  });

  it('should NOT have data-nav-glow on the mobile logo button', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<Navigation />);
    });

    const mobileButton = container.querySelector('[aria-label="Retour à l\'accueil"]');
    expect(mobileButton).not.toBeNull();
    expect(mobileButton?.hasAttribute('data-nav-glow')).toBe(false);
  });
});

describe('Audio toggle button', () => {
  beforeEach(() => {
    mockToggleAudio.mockReset();
    mockIsAudioActive = false;
  });

  it('should render audio button with inactive state', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<Navigation />);
    });

    const audioButton = container.querySelector('[aria-label="Activer la musique d\'ambiance"]');
    expect(audioButton).not.toBeNull();
    expect(audioButton?.getAttribute('aria-pressed')).toBe('false');
    expect(audioButton?.getAttribute('type')).toBe('button');
    expect(container.querySelector('[data-testid="volume-x"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="volume-2"]')).toBeNull();
  });

  it('should render audio button with active state', () => {
    mockIsAudioActive = true;

    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<Navigation />);
    });

    const audioButton = container.querySelector('[aria-label="Désactiver la musique d\'ambiance"]');
    expect(audioButton).not.toBeNull();
    expect(audioButton?.getAttribute('aria-pressed')).toBe('true');
    expect(container.querySelector('[data-testid="volume-2"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="volume-x"]')).toBeNull();
  });

  it('should call toggle when audio button is clicked', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<Navigation />);
    });

    const audioButton = container.querySelector('[aria-label="Activer la musique d\'ambiance"]');
    expect(audioButton).not.toBeNull();

    act(() => {
      (audioButton as HTMLButtonElement).click();
    });

    expect(mockToggleAudio).toHaveBeenCalledTimes(1);
  });

  it('should always render audio button regardless of reduced-motion', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<Navigation />);
    });

    // Le bouton audio doit être présent même avec isReducedMotion=true
    const audioButtons = container.querySelectorAll('[aria-label="Activer la musique d\'ambiance"]');
    expect(audioButtons.length).toBeGreaterThan(0);
  });
});
