import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { CheckpointModal } from '../CheckpointModal';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

// Mock useLockBodyScroll
vi.mock('../hooks/useLockBodyScroll', () => ({
  useLockBodyScroll: vi.fn(),
}));

describe('CheckpointModal', () => {
  const mockCheckpoint = {
    label: 'PHASE 1',
    title: 'Test Title',
    manifesto: 'Test Manifesto',
  };

  it('should render the checkpoint details when open', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<CheckpointModal checkpoint={mockCheckpoint} isOpen={true} onClose={() => {}} />);
    });
    
    expect(container.textContent).toContain('PHASE 1');
    expect(container.textContent).toContain('Test Title');
    expect(container.textContent).toContain('Test Manifesto');
    expect(container.textContent).toContain('[ FERMER ]');
  });

  it('should not render when closed', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<CheckpointModal checkpoint={mockCheckpoint} isOpen={false} onClose={() => {}} />);
    });
    
    expect(container.textContent).toBe('');
  });
});
