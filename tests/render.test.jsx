import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import WordScramble from '../src/WordScramble.jsx';

describe('Word Scramble', () => {
  it('renders the start screen without crashing', () => {
    const { container } = render(<WordScramble />);
    expect(container.textContent.length).toBeGreaterThan(20);
  });

  it('shows at least one interactive control', () => {
    const { container } = render(<WordScramble />);
    expect(container.querySelectorAll('button, input').length).toBeGreaterThan(0);
  });
});
