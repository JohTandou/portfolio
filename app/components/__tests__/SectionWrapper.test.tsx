import React from 'react';
import { describe, it, expect } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { SectionWrapper } from '../SectionWrapper';

describe('SectionWrapper', () => {
  it('should render children', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(
        <SectionWrapper id="test">
          <div id="child">Child Content</div>
        </SectionWrapper>
      );
    });
    
    const child = container.querySelector('#child');
    expect(child).toBeDefined();
    expect(child?.textContent).toBe('Child Content');
  });
});
