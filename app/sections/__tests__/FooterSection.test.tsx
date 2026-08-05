import React from 'react';
import { describe, it, expect } from 'vitest';
import { createRoot } from 'react-dom/client';
import { FooterSection } from '../FooterSection';
import { act } from 'react';

describe('FooterSection', () => {
  it('should render footer content', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<FooterSection />);
    });
    
    expect(container.textContent).toContain('JOH TANDOU');
    expect(container.textContent).toContain('EMAIL');
    expect(container.textContent).toContain('LINKEDIN');
    expect(container.textContent).toContain('GITHUB');
  });
});
