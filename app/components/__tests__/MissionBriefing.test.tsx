import React from 'react';
import { describe, it, expect } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { MissionBriefing } from '../MissionBriefing';

describe('MissionBriefing', () => {
  const mockMission = {
    missionId: 'M-001',
    status: 'shipped' as const,
    codename: 'PROJECT X',
    classification: 'TOP SECRET',
    timeline: '2023',
    briefing: 'Test Briefing',
    objectives: ['Obj 1', 'Obj 2'],
    arsenal: ['React', 'TypeScript'],
    access: [{ label: 'Link', url: 'https://example.com' }],
  };

  it('should render the mission details', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => {
      root.render(<MissionBriefing mission={mockMission} isFocused={false} />);
    });
    
    expect(container.textContent).toContain('MISSION_ID : M-001');
    expect(container.textContent).toContain('STATUS: SHIPPED');
    expect(container.textContent).toContain('PROJECT X');
    expect(container.textContent).toContain('Test Briefing');
    expect(container.textContent).toContain('Obj 1');
    expect(container.textContent).toContain('React');
    expect(container.textContent).toContain('LINK');
  });
});
