// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import DifficultySelector from '../src/components/DifficultySelector.jsx';

afterEach(() => cleanup());

describe('DifficultySelector', () => {
  it('renders three buttons: easy, medium, hard', () => {
    render(<DifficultySelector value="easy" onChange={() => {}} />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(screen.getByRole('button', { name: /easy/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /medium/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /hard/i })).toBeTruthy();
  });

  it("calls onChange('hard') when clicking hard", () => {
    const onChange = vi.fn();
    render(<DifficultySelector value="easy" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /hard/i }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('hard');
  });

  it('marks only the active button with aria-pressed=true', () => {
    render(<DifficultySelector value="medium" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /medium/i }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: /easy/i }).getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: /hard/i }).getAttribute('aria-pressed')).toBe('false');
  });
});
