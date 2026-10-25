import React, { useEffect, useState } from 'react';
import { readBestScore, recordBestScore } from './bestScore.js';

// Shows "Best: N". When a finished-game `score` is given it is recorded
// (only if higher than the stored best); otherwise the stored value is shown.
const BestScore = ({ score, style = {} }) => {
  const [best, setBest] = useState(() => readBestScore());

  useEffect(() => {
    if (score === undefined) {
      setBest(readBestScore());
    } else {
      setBest(recordBestScore(score));
    }
  }, [score]);

  return (
    <div data-testid="best-score" style={style}>
      {`Best: ${best}`}
    </div>
  );
};

export default BestScore;
