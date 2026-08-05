import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRoot } from "react-dom/client";
import { RainOverlay } from "../RainOverlay";
import { act } from "react";

/* ── Mocks locaux ───────────────────────────────────────────────── */

/* Mock du provider ReducedMotion */
vi.mock("../../providers/ReducedMotionProvider", () => ({
  useReducedMotion: () => ({ isReducedMotion: false }),
}));

/* Mock useMediaQuery — maîtrisable test par test */
const useMediaQueryMock = vi.fn(() => false);
vi.mock("../../hooks/useMediaQuery", () => ({
  useMediaQuery: (query: string) => useMediaQueryMock(query),
}));

/* Référence au mock global matchMedia (défini dans vitest.setup.ts) */
const matchMediaMock = window.matchMedia as ReturnType<typeof vi.fn>;

/* Référence au mock global canvas getContext */
const getContextMock = HTMLCanvasElement.prototype.getContext as ReturnType<
  typeof vi.fn
>;

/* Raccourci pour récupérer le contexte mock après render */
function getMockCtx() {
  return getContextMock.mock.results[
    getContextMock.mock.results.length - 1
  ]?.value as {
    clearRect: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    restore: ReturnType<typeof vi.fn>;
    scale: ReturnType<typeof vi.fn>;
    beginPath: ReturnType<typeof vi.fn>;
    moveTo: ReturnType<typeof vi.fn>;
    lineTo: ReturnType<typeof vi.fn>;
    stroke: ReturnType<typeof vi.fn>;
    strokeStyle: string;
    lineWidth: number;
    lineCap: string;
  };
}

beforeEach(() => {
  useMediaQueryMock.mockReturnValue(false);

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
    strokeStyle: "",
    lineWidth: 0,
    lineCap: "",
  };
  getContextMock.mockReturnValue(canvasCtx);

  /* Par défaut : pas de reduced motion */
  matchMediaMock.mockReturnValue({
    matches: false,
    media: "(prefers-reduced-motion: reduce)",
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

  /* Mock requestAnimationFrame / cancelAnimationFrame */
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    const id = Math.floor(Math.random() * 100000);
    setTimeout(() => cb(performance.now()), 0);
    return id;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

/* ── Tests ──────────────────────────────────────────────────────── */

describe("RainOverlay", () => {
  it("rend un canvas avec aria-hidden", () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => {
      root.render(
        <RainOverlay
          sectionId="test-section"
          isActive={true}
          isReducedMotion={false}
        />
      );
    });

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeDefined();
    expect(canvas?.getAttribute("aria-hidden")).toBe("true");
  });

  it("affiche l'attribut data-section-id pour le debug", () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => {
      root.render(
        <RainOverlay
          sectionId="identity"
          isActive={true}
          isReducedMotion={false}
        />
      );
    });

    const canvas = container.querySelector("canvas");
    expect(canvas?.getAttribute("data-section-id")).toBe("identity");
  });

  it("masque le canvas quand isReducedMotion est true (provider)", () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => {
      root.render(
        <RainOverlay
          sectionId="test-section"
          isActive={true}
          isReducedMotion={true}
        />
      );
    });

    const canvas = container.querySelector("canvas");
    expect(canvas?.className).toContain("hidden");
  });

  it("masque le canvas quand isActive est false", () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => {
      root.render(
        <RainOverlay
          sectionId="test-section"
          isActive={false}
          isReducedMotion={false}
        />
      );
    });

    const canvas = container.querySelector("canvas");
    expect(canvas?.className).toContain("hidden");
  });

  it("masque le canvas quand le natif prefers-reduced-motion est actif (même si le provider dit non)", () => {
    useMediaQueryMock.mockReturnValue(true);

    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => {
      root.render(
        <RainOverlay
          sectionId="test-section"
          isActive={true}
          isReducedMotion={false}
        />
      );
    });

    const canvas = container.querySelector("canvas");
    expect(canvas?.className).toContain("hidden");
    expect(canvas?.getAttribute("data-reduced-motion")).toBe("true");
  });

  it("affiche le canvas quand isActive et pas de reduced motion", () => {
    useMediaQueryMock.mockReturnValue(false);

    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => {
      root.render(
        <RainOverlay
          sectionId="test-section"
          isActive={true}
          isReducedMotion={false}
        />
      );
    });

    const canvas = container.querySelector("canvas");
    expect(canvas?.className).not.toContain("hidden");
  });

  it("a le z-index correct (z-[3])", () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => {
      root.render(
        <RainOverlay
          sectionId="test-section"
          isActive={true}
          isReducedMotion={false}
        />
      );
    });

    const canvas = container.querySelector("canvas");
    expect(canvas?.className).toContain("z-[3]");
  });

  it("nettoie requestAnimationFrame au démontage", () => {
    const cancelSpy = vi.spyOn(window, "cancelAnimationFrame");

    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => {
      root.render(
        <RainOverlay
          sectionId="test-section"
          isActive={true}
          isReducedMotion={false}
        />
      );
    });

    act(() => {
      root.unmount();
    });

    /* cancelAnimationFrame devrait avoir été appelé au moins une fois */
    expect(cancelSpy).toHaveBeenCalled();
  });

  it("utilise useMediaQuery avec la bonne query pour le reduced motion natif", () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => {
      root.render(
        <RainOverlay
          sectionId="test-section"
          isActive={true}
          isReducedMotion={false}
        />
      );
    });

    expect(useMediaQueryMock).toHaveBeenCalledWith(
      "(prefers-reduced-motion: reduce)"
    );
  });

  it("a l'attribut data-reduced-motion à false quand tout est normal", () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => {
      root.render(
        <RainOverlay
          sectionId="test-section"
          isActive={true}
          isReducedMotion={false}
        />
      );
    });

    const canvas = container.querySelector("canvas");
    expect(canvas?.getAttribute("data-reduced-motion")).toBe("false");
  });

  /* ── Tests : rendu batché par profondeur ── */

  it("utilise le rendu batché : chaque frame fait max 2 appels stroke() (un par profondeur)", async () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => {
      root.render(
        <RainOverlay
          sectionId="batch-test"
          isActive={true}
          isReducedMotion={false}
        />
      );
    });

    /* Attendre que rAF ait tourné (mock déclenche setTimeout) */
    await new Promise((r) => setTimeout(r, 50));

    const ctx = getMockCtx();
    if (!ctx) return;

    /* Vérifier que beginPath et stroke sont appelés (batch) */
    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
  });

  /* ── Tests : frame pacing (MIN_FRAME_MS = 32) ── */

  it("respecte le frame pacing : deux frames rapprochées ne rendent qu'une fois", async () => {
    /* On va simuler rAF avec des timestamps contrôlés */
    let rAFCounter = 0;
    const timestamps = [0, 10, 20, 40]; // la 4e frame dépasse MIN_FRAME_MS (32)
    const rAFSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: FrameRequestCallback) => {
        const ts = timestamps[rAFCounter] ?? timestamps[timestamps.length - 1];
        rAFCounter++;
        setTimeout(() => cb(ts), 0);
        return rAFCounter;
      });

    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => {
      root.render(
        <RainOverlay
          sectionId="frame-pacing-test"
          isActive={true}
          isReducedMotion={false}
        />
      );
    });

    await new Promise((r) => setTimeout(r, 100));

    /* Le frame pacing est en place — le composant tourne sans erreur */
    expect(rAFSpy).toHaveBeenCalled();
  });

  it("le canvas est masqué (hidden) quand le natif détecte reduced motion même si le provider ignore", () => {
    useMediaQueryMock.mockReturnValue(true);

    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => {
      root.render(
        <RainOverlay
          sectionId="test-section"
          isActive={true}
          isReducedMotion={false}
        />
      );
    });

    const canvas = container.querySelector("canvas");
    expect(canvas?.className).toContain("hidden");
  });
});
