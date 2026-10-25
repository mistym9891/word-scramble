const LEVEL_RANGES = {
  easy: { min: 3, max: 4 },
  medium: { min: 5, max: 6 },
  hard: { min: 7, max: Infinity },
};

export function filterWordsByDifficulty(words, level) {
  if (!Object.prototype.hasOwnProperty.call(LEVEL_RANGES, level)) {
    throw new Error(`Unknown difficulty level: ${String(level)}`);
  }
  const { min, max } = LEVEL_RANGES[level];
  return (words || []).filter((word) => {
    const length = String(word).length;
    return length >= min && length <= max;
  });
}
