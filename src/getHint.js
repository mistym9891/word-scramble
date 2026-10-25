/**
 * Build a hint for a word: the first `revealed` letters followed by
 * underscores for the remaining positions.
 *
 * `revealed` is clamped to 0..word.length (+Infinity reveals the whole word,
 * -Infinity, NaN and non-numeric values reveal nothing). Fractions are floored.
 * An empty (or non-string) word yields ''.
 */
export function getHint(word, revealed) {
  if (typeof word !== 'string' || word.length === 0) return '';
  const numeric = Number(revealed);
  const requested = Number.isNaN(numeric) ? 0 : Math.floor(numeric);
  const count = Math.min(word.length, Math.max(0, requested));
  return word.slice(0, count) + '_'.repeat(word.length - count);
}

export default getHint;
