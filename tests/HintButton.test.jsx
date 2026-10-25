// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import HintButton from '../src/HintButton.jsx';

afterEach(() => {
  cleanup();
});

describe('HintButton', () => {
  it('renders the label with the number of hints left', () => {
    render(<HintButton hintsLeft={2} onHint={() => {}} />);
    expect(screen.getByRole('button', { name: 'Hint (2 left)' })).toBeTruthy();
  });

  it('calls onHint when clicked', () => {
    const onHint = vi.fn();
    render(<HintButton hintsLeft={3} onHint={onHint} />);
    fireEvent.click(screen.getByRole('button', { name: 'Hint (3 left)' }));
    expect(onHint).toHaveBeenCalledTimes(1);
  });

  it('is enabled when hints are left', () => {
    render(<HintButton hintsLeft={1} onHint={() => {}} />);
    expect(screen.getByRole('button', { name: 'Hint (1 left)' }).disabled).toBe(false);
  });

  it('is disabled and does not call onHint when hintsLeft is 0', () => {
    const onHint = vi.fn();
    render(<HintButton hintsLeft={0} onHint={onHint} />);
    const button = screen.getByRole('button', { name: 'Hint (0 left)' });
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(onHint).not.toHaveBeenCalled();
  });
});
