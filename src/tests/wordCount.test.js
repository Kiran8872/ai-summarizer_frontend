import { describe, it, expect } from 'vitest';
import { countWords, compressionPercent } from '../utils/wordCount';

describe('wordCount', () => {
  it('counts words', () => {
    expect(countWords('hello world')).toBe(2);
    expect(countWords('')).toBe(0);
  });

  it('computes compression', () => {
    expect(compressionPercent(100, 20)).toBe(80);
  });
});
