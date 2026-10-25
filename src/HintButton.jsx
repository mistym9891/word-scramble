import React from 'react';

const HintButton = ({ hintsLeft, onHint }) => (
  <button type="button" onClick={onHint} disabled={hintsLeft === 0}>
    {`Hint (${hintsLeft} left)`}
  </button>
);

export default HintButton;
