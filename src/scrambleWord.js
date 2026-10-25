const MAX_SHUFFLE_ATTEMPTS = 10;

const shuffle = (letters, rng) => {
  const result = [...letters];
  for (let i = result.length - 1; i > 0; i--) {
    const r = rng();
    const j = Math.min(i, Math.max(0, Math.floor(r * (i + 1)) || 0));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Returns a permutation of the letters of `word`.
 * - Words of length 0 or 1 are returned unchanged.
 * - Words with a single distinct letter (e.g. "AAA") cannot differ and are returned unchanged.
 * - Otherwise the result always differs from the input.
 * `rng` must return a number in [0, 1), defaulting to Math.random.
 */
export function scrambleWord(word, rng = Math.random) {
  if (typeof word !== 'string') return '';
  const letters = Array.from(word);
  if (letters.length < 2) return word;

  const firstDifferent = letters.findIndex((l) => l !== letters[0]);
  if (firstDifferent === -1) return word;

  for (let attempt = 0; attempt < MAX_SHUFFLE_ATTEMPTS; attempt++) {
    const candidate = shuffle(letters, rng).join('');
    if (candidate !== word) return candidate;
  }

  // Deterministic fallback: swap two differing letters so the result is guaranteed to differ.
  const fallback = [...letters];
  [fallback[0], fallback[firstDifferent]] = [fallback[firstDifferent], fallback[0]];
  return fallback.join('');
}

export default scrambleWord;
