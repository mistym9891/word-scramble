export const BEST_SCORE_KEY = 'ws-best-score';

// Reads the stored best score. Anything that is not a non-negative integer
// string (missing, corrupted, tampered) is deliberately treated as 0.
export const readBestScore = () => {
  try {
    const raw = localStorage.getItem(BEST_SCORE_KEY);
    if (typeof raw !== 'string' || !/^\d{1,15}$/.test(raw)) return 0;
    return Number(raw);
  } catch {
    return 0;
  }
};

// Records a finished game's score. The score is rounded and clamped at 0 (the
// same normalisation calculateScore applies) and stored only when higher than
// the current best. Returns the best score after the update.
export const recordBestScore = (score) => {
  const current = readBestScore();
  const numeric = Number(score);
  if (!Number.isFinite(numeric)) return current;
  const normalised = Math.max(0, Math.round(numeric));
  if (normalised <= current) return current;
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(normalised));
  } catch {
    return current;
  }
  return normalised;
};
