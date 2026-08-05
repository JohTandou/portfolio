import { describe, it, expect } from 'vitest';
import manifest from '../manifest';

describe('manifest', () => {
  it('should have the correct icon', () => {
    const m = manifest();
    expect(m.icons).toContainEqual({ src: "/favicon.png", sizes: "any", type: "image/png" });
  });

  it('should use the teal theme color #3ECFB2', () => {
    const m = manifest();
    expect(m.theme_color).toBe('#3ECFB2');
  });
});
