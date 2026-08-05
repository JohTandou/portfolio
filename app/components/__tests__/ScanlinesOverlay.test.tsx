import React from 'react';
import { describe, it, expect } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { ScanlinesOverlay } from '../ScanlinesOverlay';

describe('ScanlinesOverlay', () => {
  it('should render the overlay elements', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<ScanlinesOverlay />);
    });
    
    // Should have 2 divs for the overlay
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBe(2);
    
    // Check for aria-hidden
    expect(divs[0].getAttribute('aria-hidden')).toBe('true');
    expect(divs[1].getAttribute('aria-hidden')).toBe('true');
  });
});
