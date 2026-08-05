import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('audio-asset-integrity', () => {
  it('should verify that the audio file exists and has a reasonable size', () => {
    const audioPath = path.join(process.cwd(), 'public', 'audio', 'portfolio-music.mp3');
    
    expect(fs.existsSync(audioPath)).toBe(true);
    
    const stats = fs.statSync(audioPath);
    // Check if file size is greater than 0 (e.g., at least 10KB)
    expect(stats.size).toBeGreaterThan(10000);
  });
});
