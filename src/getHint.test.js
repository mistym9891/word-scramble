import { describe, it, expect } from 'vitest';
import { getHint } from './getHint.js';

describe('getHint', () => {
  it('reveals the first N letters and masks the rest', () => {
    expect(getHint('apple', 1)).toBe('a____');
    expect(getHint('apple', 3)).toBe('app__');
    expect(getHint('apple', 5)).toBe('apple');
  });

  it('returns only underscores when revealed is 0', () => {
    expect(getHint('apple', 0)).toBe('_____');
  });

  it('clamps negative values to 0', () => {
    expect(getHint('apple', -3)).toBe('_____');
    expect(getHint('apple', -Infinity)).toBe('_____');
  });

  it('clamps over-length values to the whole word', () => {
    expect(getHint('apple', 10)).toBe('apple');
  });

  it('treats +Infinity as over-length and returns the whole word', () => {
    expect(getHint('apple', Infinity)).toBe('apple');
  });

  it('treats NaN as 0', () => {
    expect(getHint('apple', NaN)).toBe('_____');
  });

  it('floors fractional values', () => {
    expect(getHint('apple', 2.9)).toBe('ap___');
  });

  it('returns an empty string for an empty word', () => {
    expect(getHint('', 0)).toBe('');
    expect(getHint('', 3)).toBe('');
    expect(getHint('', Infinity)).toBe('');
  });
});
