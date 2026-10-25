import { describe, it, expect } from 'vitest';
import { calculateScore } from '../src/calculateScore.js';

describe('calculateScore', () => {
  it('returns wordLength * 10 for the base case', () => {
    expect(calculateScore({ wordLength: 5, hintsUsed: 0, seconds: 0 })).toBe(50);
  });

  it('subtracts 5 points per hint used', () => {
    expect(calculateScore({ wordLength: 5, hintsUsed: 2, seconds: 0 })).toBe(40);
  });

  it('subtracts floor(seconds / 10) for time', () => {
    expect(calculateScore({ wordLength: 5, hintsUsed: 0, seconds: 25 })).toBe(48);
    expect(calculateScore({ wordLength: 5, hintsUsed: 0, seconds: 9 })).toBe(50);
  });

  it('combines hint and time penalties', () => {
    expect(calculateScore({ wordLength: 6, hintsUsed: 1, seconds: 30 })).toBe(52);
  });

  it('never goes below 0', () => {
    expect(calculateScore({ wordLength: 1, hintsUsed: 5, seconds: 500 })).toBe(0);
  });
});
