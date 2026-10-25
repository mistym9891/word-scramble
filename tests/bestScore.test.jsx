import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import BestScore from '../src/BestScore.jsx';
import { BEST_SCORE_KEY, readBestScore, recordBestScore } from '../src/bestScore.js';

const createMockStorage = (initial = {}) => {
  const data = { ...initial };
  return {
    getItem: vi.fn((k) => (Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null)),
    setItem: vi.fn((k, v) => { data[k] = String(v); }),
    removeItem: vi.fn((k) => { delete data[k]; }),
    clear: vi.fn(),
    data,
  };
};

describe('best score persistence', () => {
  let storage;

  beforeEach(() => {
    storage = createMockStorage();
    vi.stubGlobal('localStorage', storage);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('starts at 0 when nothing is stored', () => {
    render(<BestScore />);
    expect(screen.getByTestId('best-score').textContent).toBe('Best: 0');
    expect(readBestScore()).toBe(0);
  });

  it('treats corrupted stored data as 0', () => {
    storage.data[BEST_SCORE_KEY] = 'banana';
    expect(readBestScore()).toBe(0);
    storage.data[BEST_SCORE_KEY] = '-5';
    expect(readBestScore()).toBe(0);
  });

  it('updates when the score is higher', () => {
    storage.data[BEST_SCORE_KEY] = '100';
    render(<BestScore score={250} />);
    expect(storage.setItem).toHaveBeenCalledWith(BEST_SCORE_KEY, '250');
    expect(screen.getByTestId('best-score').textContent).toBe('Best: 250');
  });

  it('does not update when the score is lower', () => {
    storage.data[BEST_SCORE_KEY] = '300';
    render(<BestScore score={120} />);
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(screen.getByTestId('best-score').textContent).toBe('Best: 300');
  });

  it('stores the rounded, clamped value', () => {
    expect(recordBestScore(199.6)).toBe(200);
    expect(storage.setItem).toHaveBeenCalledWith(BEST_SCORE_KEY, '200');
    expect(recordBestScore(-40)).toBe(200);
  });

  it('survives a re-render', () => {
    const { rerender } = render(<BestScore score={180} />);
    expect(screen.getByTestId('best-score').textContent).toBe('Best: 180');
    rerender(<BestScore score={90} />);
    expect(screen.getByTestId('best-score').textContent).toBe('Best: 180');
    rerender(<BestScore />);
    expect(screen.getByTestId('best-score').textContent).toBe('Best: 180');
    expect(storage.data[BEST_SCORE_KEY]).toBe('180');
  });
});
