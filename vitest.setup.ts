import { vi } from 'vitest';
import React from 'react';

// Make React globally available for tests
(global as any).React = React;

// Mock matchMedia for jsdom (not available natively)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver for jsdom
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
  root: Element | null = null;
  rootMargin = '';
  thresholds: readonly number[] = [];
  constructor(
    _callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit
  ) {
    // stub
  }
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver for jsdom
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

// Mock canvas getContext for jsdom
const mockCtx = {
  clearRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  arc: vi.fn(),
  createLinearGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  strokeStyle: '',
  lineWidth: 0,
  lineCap: '',
  fillStyle: '',
  getImageData: vi.fn(() => ({ data: new Uint8ClampedArray() })),
  putImageData: vi.fn(),
};

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  configurable: true,
  value: vi.fn().mockReturnValue(mockCtx),
});

// Mock getBoundingClientRect for jsdom
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

// Mock requestAnimationFrame / cancelAnimationFrame for jsdom
window.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
  const id = Math.floor(Math.random() * 100000);
  setTimeout(() => cb(performance.now()), 0);
  return id;
}) as unknown as typeof window.requestAnimationFrame;

window.cancelAnimationFrame = vi.fn() as unknown as typeof window.cancelAnimationFrame;
