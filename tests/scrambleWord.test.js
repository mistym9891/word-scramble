import { describe, it, expect } from 'vitest';
import { scrambleWord } from '../src/scrambleWord.js';

const mulberry32 = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const sorted = (s) => Array.from(s).sort().join('');

const WORDS = ['PERU', 'BRAZIL', 'AUSTRALIA', 'NETHERLANDS', 'AB', 'ABA', 'LILY', 'MASSACHUSETTS'];

describe('scrambleWord', () => {
  it('keeps the same letter multiset', () => {
    for (const word of WORDS) {
      for (let seed = 1; seed <= 25; seed++) {
        const out = scrambleWord(word, mulberry32(seed));
        expect(out).toHaveLength(word.length);
        expect(sorted(out)).toBe(sorted(word));
      }
    }
  });

  it('always differs from the input when there are 2+ distinct letters', () => {
    for (const word of WORDS) {
      for (let seed = 1; seed <= 50; seed++) {
        expect(scrambleWord(word, mulberry32(seed))).not.toBe(word);
      }
    }
  });

  it('differs even with degenerate fake rngs', () => {
    for (const word of WORDS) {
      for (const value of [0, 0.5, 0.999999]) {
        const out = scrambleWord(word, () => value);
        expect(out).not.toBe(word);
        expect(sorted(out)).toBe(sorted(word));
      }
    }
  });

  it('is deterministic for the same seed', () => {
    expect(scrambleWord('BARCELONA', mulberry32(7))).toBe(scrambleWord('BARCELONA', mulberry32(7)));
  });

  it('returns an empty string and single letters unchanged', () => {
    expect(scrambleWord('')).toBe('');
    expect(scrambleWord('A')).toBe('A');
    expect(scrambleWord('A', () => 0)).toBe('A');
  });

  it('returns words with one distinct letter unchanged', () => {
    expect(scrambleWord('AAAA', mulberry32(3))).toBe('AAAA');
  });

  it('swaps a two-letter word with distinct letters', () => {
    expect(scrambleWord('AB', () => 0)).toBe('BA');
    expect(scrambleWord('AB', mulberry32(11))).toBe('BA');
  });

  it('works with the default Math.random', () => {
    const out = scrambleWord('SWITZERLAND');
    expect(out).not.toBe('SWITZERLAND');
    expect(sorted(out)).toBe(sorted('SWITZERLAND'));
  });
});
