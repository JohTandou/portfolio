import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { ReducedMotionProvider, useReducedMotion } from '../ReducedMotionProvider';

// Mock localStorage
vi.stubGlobal('localStorage', {
  removeItem: vi.fn(),
});

describe('ReducedMotionProvider', () => {
  it('should provide the correct initial state', () => {
    let contextValue: any;
    const TestComponent = () => {
      contextValue = useReducedMotion();
      return null;
    };

    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(
        <ReducedMotionProvider>
          <TestComponent />
        </ReducedMotionProvider>
      );
    });
    
    expect(contextValue.isReducedMotion).toBe(false);
  });
});
