/**
 * Pure score calculation for a solved word.
 * Formula: wordLength * 10 - hintsUsed * 5 - floor(seconds / 10), minimum 0.
 */
const toNumber = (value) => (Number.isFinite(value) ? value : 0);

export function calculateScore({ wordLength = 0, hintsUsed = 0, seconds = 0 } = {}) {
  const score =
    toNumber(wordLength) * 10 - toNumber(hintsUsed) * 5 - Math.floor(toNumber(seconds) / 10);
  return Math.max(0, score);
}

export default calculateScore;
