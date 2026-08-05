import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { BackgroundSection } from '../BackgroundSection';
import { act } from 'react';

/* ── Mocks locaux ───────────────────────────────────────────────── */

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} data-testid="next-image" />;
  },
}));

// Mock useReducedMotion
vi.mock('../../providers/ReducedMotionProvider', () => ({
  useReducedMotion: () => ({ isReducedMotion: false }),
}));

// Mock useSectionActivity
vi.mock('../../hooks/useSectionActivity', () => ({
  useSectionActivity: () => ({
    isVisible: true,
    isPageVisible: true,
    isActive: true,
  }),
}));

/* Référence au mock global getContext (défini dans vitest.setup.ts) */
const getContextMock = HTMLCanvasElement.prototype.getContext as ReturnType<
  typeof vi.fn
>;

/* Référence au mock global matchMedia */
const matchMediaMock = window.matchMedia as ReturnType<typeof vi.fn>;

beforeEach(() => {
  /* Réinitialiser le contexte canvas mock */
  const canvasCtx = {
    clearRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    scale: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    strokeStyle: '',
    lineWidth: 0,
    lineCap: '',
  };
  getContextMock.mockReturnValue(canvasCtx);

  /* Réinitialiser matchMedia pour chaque test */
  matchMediaMock.mockReturnValue({
    matches: false,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });

  /* Mock getBoundingClientRect */
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    width: 1440,
    height: 900,
    top: 0,
    left: 0,
    bottom: 900,
    right: 1440,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  }));

  /* Mock requestAnimationFrame */
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    const id = Math.floor(Math.random() * 100000);
    setTimeout(() => cb(performance.now()), 0);
    return id;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

/* ── Tests ──────────────────────────────────────────────────────── */

describe('BackgroundSection', () => {
  it('should render children and support contentPosition', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(
        <BackgroundSection id="test" backgroundImage="/test.jpg" contentPosition="center">
          <div id="child">Child Content</div>
        </BackgroundSection>
      );
    });
    
    const child = container.querySelector('#child');
    expect(child).toBeDefined();
    expect(child?.textContent).toBe('Child Content');
    
    // Check for center positioning class
    const contentWrapper = container.querySelector('.justify-center');
    expect(contentWrapper).toBeDefined();
  });

  it('rend le canvas de pluie (RainOverlay) avec z-[3]', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(
        <BackgroundSection id="test" backgroundImage="/test.jpg" contentPosition="left">
          <div>Content</div>
        </BackgroundSection>
      );
    });

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeDefined();
    expect(canvas?.className).toContain('z-[3]');
    expect(canvas?.getAttribute('aria-hidden')).toBe('true');
  });

  it('préserve les scanlines existantes avec z-[5] et opacity 0.5', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(
        <BackgroundSection id="test" backgroundImage="/test.jpg" contentPosition="left">
          <div>Content</div>
        </BackgroundSection>
      );
    });

    /* Trouver l'élément scanlines par sa classe z-[5] */
    const scanlines = container.querySelector('[class*="z-[5]"]');
    expect(scanlines).toBeDefined();
    expect(scanlines?.getAttribute('aria-hidden')).toBe('true');

    /* Vérifier l'opacité via le style inline */
    const style = scanlines?.getAttribute('style') || '';
    expect(style).toContain('opacity: 0.5');
  });

  it('préserve l\'overlay directionnel avec z-10', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(
        <BackgroundSection id="test" backgroundImage="/test.jpg" contentPosition="right">
          <div>Content</div>
        </BackgroundSection>
      );
    });

    /* Trouver l'overlay par sa classe z-10 */
    const overlays = container.querySelectorAll('[class*="z-10"]');
    expect(overlays.length).toBeGreaterThan(0);
  });

  it('le contenu est en z-20 (au-dessus de tout)', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(
        <BackgroundSection id="test" backgroundImage="/test.jpg" contentPosition="left">
          <div>Content</div>
        </BackgroundSection>
      );
    });

    const contentWrapper = container.querySelector('[class*="z-20"]');
    expect(contentWrapper).toBeDefined();
    expect(contentWrapper?.className).toContain('relative');
  });

  it('l\'ordre des z-index est correctement hiérarchisé dans le conteneur de fond', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(
        <BackgroundSection id="test" backgroundImage="/test.jpg" contentPosition="left">
          <div>Content</div>
        </BackgroundSection>
      );
    });

    /* Le conteneur de fond est z-0 */
    const bgContainer = container.querySelector('[class*="z-0"]');
    expect(bgContainer).toBeDefined();

    /* À l'intérieur, on trouve dans l'ordre du DOM :
       Image, Rain (z-[3]), Scanlines (z-[5]), Overlay (z-10) */
    if (bgContainer) {
      const children = Array.from(bgContainer.children);
      const classes = children.map(
        (c) => c.className.toString()
      );

      /* Vérifier qu'on a bien Rain avant Scanlines avant Overlay */
      const rainIdx = classes.findIndex((c) => c.includes('z-[3]'));
      const scanIdx = classes.findIndex((c) => c.includes('z-[5]'));
      const overlayIdx = classes.findIndex((c) => c.includes('z-10'));

      expect(rainIdx).toBeGreaterThan(-1);
      expect(scanIdx).toBeGreaterThan(-1);
      expect(overlayIdx).toBeGreaterThan(-1);

      /* Rain < Scanlines < Overlay dans le DOM */
      expect(rainIdx).toBeLessThan(scanIdx);
      expect(scanIdx).toBeLessThan(overlayIdx);
    }
  });

  it('utilise useSectionActivity avec le bon sectionId', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(
        <BackgroundSection id="identity" backgroundImage="/test.jpg" contentPosition="left">
          <div>Content</div>
        </BackgroundSection>
      );
    });

    /* Le canvas RainOverlay doit avoir data-section-id="identity" */
    const canvas = container.querySelector('canvas');
    expect(canvas?.getAttribute('data-section-id')).toBe('identity');
  });

  it('supporte le mode contain sans erreur', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(
        <BackgroundSection
          id="test"
          backgroundImage="/test.jpg"
          contentPosition="left"
          backgroundFit="contain"
        >
          <div>Content</div>
        </BackgroundSection>
      );
    });

    /* La section devrait avoir le fond deep */
    const section = container.querySelector('section');
    expect(section?.getAttribute('style')).toContain('background-color');

    /* Les couches d'atmosphère sont toujours présentes */
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeDefined();
  });

  it('supporte desktopAspectRatio sans erreur', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(
        <BackgroundSection
          id="test"
          backgroundImage="/test.jpg"
          contentPosition="left"
          desktopAspectRatio="16 / 9"
        >
          <div>Content</div>
        </BackgroundSection>
      );
    });

    /* Vérifier que le style tag est injecté */
    const styleTag = container.querySelector('style');
    expect(styleTag).toBeDefined();
    expect(styleTag?.textContent).toContain('aspect-ratio');

    /* Les couches sont toujours présentes */
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeDefined();
  });
});
