import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { useSectionActivity, SectionActivityState } from "../useSectionActivity";

/* ── Mocks ──────────────────────────────────────────────────────── */

const mockIntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
window.IntersectionObserver = mockIntersectionObserver as any;

describe("useSectionActivity", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", vi.fn((cb) => cb(performance.now())));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    
    // Mock document.getElementById
    const mockElement = document.createElement("div");
    mockElement.id = "test-section";
    document.body.appendChild(mockElement);
    vi.spyOn(document, "getElementById").mockReturnValue(mockElement);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("devrait retourner l'état initial", () => {
    let state: SectionActivityState | undefined;
    const TestComponent = () => {
      state = useSectionActivity({ sectionId: "test-section" });
      return null;
    };
    
    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => {
      root.render(<TestComponent />);
    });
    
    expect(state?.isVisible).toBe(false);
    expect(state?.isPageVisible).toBe(true);
    expect(state?.isActive).toBe(false);
    
    root.unmount();
  });

  it("devrait mettre à jour isVisible quand IntersectionObserver déclenche", () => {
    let state: SectionActivityState | undefined;
    const TestComponent = () => {
      state = useSectionActivity({ sectionId: "test-section" });
      return null;
    };
    
    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => {
      root.render(<TestComponent />);
    });
    
    // Simuler l'intersection
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });
    
    expect(state?.isVisible).toBe(true);
    expect(state?.isActive).toBe(true);
    
    root.unmount();
  });

  it("devrait mettre à jour isPageVisible quand visibilitychange déclenche", () => {
    let state: SectionActivityState | undefined;
    const TestComponent = () => {
      state = useSectionActivity({ sectionId: "test-section" });
      return null;
    };
    
    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => {
      root.render(<TestComponent />);
    });
    
    // Simuler le changement de visibilité
    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        writable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    
    expect(state?.isPageVisible).toBe(false);
    expect(state?.isActive).toBe(false);
    
    root.unmount();
  });
});
