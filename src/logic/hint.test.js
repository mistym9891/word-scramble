import { describe, it, expect } from 'vitest';
import { getHint } from './hint.js';

describe('getHint', () => {
  it('reveals the first N letters followed by underscores', () => {
    expect(getHint('apple', 1)).toBe('a____');
    expect(getHint('apple', 3)).toBe('app__');
  });

  it('reveals nothing when N is 0', () => {
    expect(getHint('apple', 0)).toBe('_____');
  });

  it('reveals the whole word when N equals the word length', () => {
    expect(getHint('apple', 5)).toBe('apple');
  });

  it('reveals the whole word when N is larger than the word length', () => {
    expect(getHint('apple', 99)).toBe('apple');
  });

  it('reveals the whole word when N is Infinity', () => {
    expect(getHint('apple', Infinity)).toBe('apple');
  });

  it('reveals nothing when N is -Infinity', () => {
    expect(getHint('apple', -Infinity)).toBe('_____');
  });

  it('handles an empty word', () => {
    expect(getHint('', 3)).toBe('');
    expect(getHint('', 0)).toBe('');
    expect(getHint('', Infinity)).toBe('');
  });

  it('treats negative, NaN and non-numeric counts as 0', () => {
    expect(getHint('apple', -2)).toBe('_____');
    expect(getHint('apple', NaN)).toBe('_____');
    expect(getHint('apple', undefined)).toBe('_____');
  });

  it('floors fractional counts', () => {
    expect(getHint('apple', 2.9)).toBe('ap___');
  });
});
