import { describe, it, expect } from 'vitest';
import { filterWordsByDifficulty } from '../src/difficulty.js';

const WORDS = ['AB', 'CAT', 'FROG', 'APPLE', 'BANANA', 'ELEPHANT', 'KANGAROO', 'NETHERLANDS'];

describe('filterWordsByDifficulty', () => {
  it('returns 3-4 letter words for easy', () => {
    expect(filterWordsByDifficulty(WORDS, 'easy')).toEqual(['CAT', 'FROG']);
  });

  it('returns 5-6 letter words for medium', () => {
    expect(filterWordsByDifficulty(WORDS, 'medium')).toEqual(['APPLE', 'BANANA']);
  });

  it('returns 7+ letter words for hard', () => {
    expect(filterWordsByDifficulty(WORDS, 'hard')).toEqual(['ELEPHANT', 'KANGAROO', 'NETHERLANDS']);
  });

  it('returns an empty array for an empty list', () => {
    expect(filterWordsByDifficulty([], 'easy')).toEqual([]);
    expect(filterWordsByDifficulty([], 'medium')).toEqual([]);
    expect(filterWordsByDifficulty([], 'hard')).toEqual([]);
  });

  it('throws on an invalid level', () => {
    expect(() => filterWordsByDifficulty(WORDS, 'expert')).toThrow();
    expect(() => filterWordsByDifficulty(WORDS, undefined)).toThrow();
    expect(() => filterWordsByDifficulty(WORDS, 'toString')).toThrow();
  });

  it('does not mutate the input', () => {
    const input = [...WORDS];
    filterWordsByDifficulty(input, 'easy');
    expect(input).toEqual(WORDS);
  });
});
