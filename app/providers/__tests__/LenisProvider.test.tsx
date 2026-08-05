import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";

/* ============================================================
   Tests LenisProvider — Garanties scroll restoration + cleanup
   Convention : createRoot + act, comme le reste du projet.

   On utilise vi.hoisted() pour que les références de mock
   survivent au hoisting de vi.mock par Vitest.
   ============================================================ */

/* --- Mocks hoistés --- */

const { mockScrollTo, mockDestroy, mockRaf, mockConstructor } = vi.hoisted(
  () => ({
    mockScrollTo: vi.fn(),
    mockDestroy: vi.fn(),
    mockRaf: vi.fn(),
    mockConstructor: vi.fn(),
  }),
);

vi.mock("lenis", () => ({
  default: mockConstructor.mockImplementation(() => ({
    scrollTo: mockScrollTo,
    destroy: mockDestroy,
    raf: mockRaf,
  })),
}));

const { mockUseReducedMotion } = vi.hoisted(() => ({
  mockUseReducedMotion: vi.fn(() => ({ isReducedMotion: false })),
}));

vi.mock("../ReducedMotionProvider", () => ({
  useReducedMotion: mockUseReducedMotion,
}));

/* Import après les mocks */
import { LenisProvider } from "../LenisProvider";

/* --- Helpers --- */

function mountProvider(isReducedMotion = false) {
  mockUseReducedMotion.mockReturnValue({ isReducedMotion });
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      <LenisProvider>
        <div data-testid="child">Contenu</div>
      </LenisProvider>,
    );
  });
  return {
    container,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      document.body.removeChild(container);
    },
  };
}

/* --- Setup & Teardown --- */

beforeEach(() => {
  vi.clearAllMocks();
  mockUseReducedMotion.mockReturnValue({ isReducedMotion: false });
  /* jsdom ne définit pas scrollRestoration nativement : on le crée */
  if (typeof history !== "undefined") {
    (history as Record<string, unknown>).scrollRestoration = "auto";
  }
  /* jsdom ne définit pas window.scrollTo nativement via une
     propriété directe : on utilise defineProperty pour garantir
     l'écrasement. */
  Object.defineProperty(window, "scrollTo", {
    value: vi.fn(),
    writable: true,
    configurable: true,
  });
  delete (window as Record<string, unknown>).__lenis;
});

afterEach(() => {
  delete (window as Record<string, unknown>).__lenis;
  if (typeof history !== "undefined") {
    (history as Record<string, unknown>).scrollRestoration = "auto";
  }
});

/* ================================================================
   TESTS
   ================================================================ */

describe("LenisProvider — scrollRestoration", () => {
  it("passe history.scrollRestoration à 'manual' au montage", () => {
    /* jsdom : s'assurer que la propriété existe avant le montage */
    history.scrollRestoration = "auto";
    const { unmount } = mountProvider(false);
    expect(history.scrollRestoration).toBe("manual");
    unmount();
  });

  it("restaure history.scrollRestoration à sa valeur d'origine au démontage", () => {
    history.scrollRestoration = "auto";

    const { unmount } = mountProvider(false);

    expect(history.scrollRestoration).toBe("manual");

    unmount();

    expect(history.scrollRestoration).toBe("auto");
  });

  it("préserve la valeur originale même si elle était déjà 'manual'", () => {
    history.scrollRestoration = "manual";
    const { unmount } = mountProvider(false);

    expect(history.scrollRestoration).toBe("manual");
    unmount();
    expect(history.scrollRestoration).toBe("manual");
  });
});

describe("LenisProvider — scroll au sommet", () => {
  it("appelle lenis.scrollTo(0, { immediate: true }) au montage", () => {
    const { unmount } = mountProvider(false);

    expect(mockScrollTo).toHaveBeenCalledWith(0, {
      immediate: true,
    });
    unmount();
  });

  it("appelle window.scrollTo(0, 0) quand isReducedMotion est true (sans Lenis)", () => {
    const spyScrollTo = vi
      .spyOn(window, "scrollTo")
      .mockImplementation(() => {});

    const { unmount } = mountProvider(true);

    expect(mockConstructor).not.toHaveBeenCalled();
    expect(spyScrollTo).toHaveBeenCalledWith(0, 0);

    spyScrollTo.mockRestore();
    unmount();
  });
});

describe("LenisProvider — gestion de l'instance Lenis", () => {
  it("crée une instance Lenis quand isReducedMotion est false", () => {
    const { unmount } = mountProvider(false);
    expect(mockConstructor).toHaveBeenCalledTimes(1);
    unmount();
  });

  it("ne crée PAS d'instance Lenis quand isReducedMotion est true", () => {
    const { unmount } = mountProvider(true);
    expect(mockConstructor).not.toHaveBeenCalled();
    unmount();
  });

  it("détruit l'instance Lenis au démontage", () => {
    const { unmount } = mountProvider(false);
    expect(mockDestroy).not.toHaveBeenCalled();
    unmount();
    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });
});

describe("LenisProvider — propriété globale window.__lenis", () => {
  it("expose l'instance Lenis sur window.__lenis au montage", () => {
    const { unmount } = mountProvider(false);
    expect((window as Record<string, unknown>).__lenis).toBeDefined();
    unmount();
  });

  it("supprime window.__lenis au démontage", () => {
    const { unmount } = mountProvider(false);
    expect((window as Record<string, unknown>).__lenis).toBeDefined();
    unmount();
    expect((window as Record<string, unknown>).__lenis).toBeUndefined();
  });
});

describe("LenisProvider — rendu des enfants", () => {
  it("rend les enfants quand Lenis est actif", () => {
    const { container, unmount } = mountProvider(false);
    expect(container.querySelector('[data-testid="child"]')).toBeTruthy();
    expect(container.textContent).toContain("Contenu");
    unmount();
  });

  it("rend les enfants quand isReducedMotion est true", () => {
    const { container, unmount } = mountProvider(true);
    expect(container.querySelector('[data-testid="child"]')).toBeTruthy();
    expect(container.textContent).toContain("Contenu");
    unmount();
  });
});

describe("LenisProvider — préserve les navigations d'ancres", () => {
  it("laisse window.__lenis exposé pour que Navigation puisse appeler scrollTo", () => {
    const { unmount } = mountProvider(false);

    const lenisInstance = (window as Record<string, unknown>)
      .__lenis as { scrollTo: ReturnType<typeof vi.fn> } | undefined;

    expect(lenisInstance).toBeDefined();

    /* Simule un appel de scrollTo d'ancre comme le ferait Navigation */
    const fakeElement = document.createElement("section");
    fakeElement.id = "contact";
    document.body.appendChild(fakeElement);

    lenisInstance!.scrollTo(fakeElement, { offset: -80 });

    expect(mockScrollTo).toHaveBeenCalledWith(fakeElement, { offset: -80 });

    document.body.removeChild(fakeElement);
    unmount();
  });
});
