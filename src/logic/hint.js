/**
 * Build a hint for a word: the first `revealedCount` letters followed by
 * underscores for the remaining letters.
 *
 * - An empty (or non-string/nullish) word returns ''.
 * - A negative, NaN or non-numeric revealedCount reveals nothing.
 * - A revealedCount larger than the word length (including Infinity)
 *   reveals the whole word.
 * - Fractional counts are floored.
 *
 * @param {string} word
 * @param {number} revealedCount
 * @returns {string}
 */
export function getHint(word, revealedCount) {
  const text = typeof word === 'string' ? word : '';
  const length = text.length;
  if (length === 0) return '';

  let count = typeof revealedCount === 'number' ? revealedCount : 0;
  if (Number.isNaN(count)) {
    count = 0;
  } else if (count === Infinity) {
    count = length;
  } else if (count === -Infinity) {
    count = 0;
  } else {
    count = Math.floor(count);
  }
  count = Math.min(Math.max(count, 0), length);

  return text.slice(0, count) + '_'.repeat(length - count);
}
