import React from 'react';
import { createRoot } from 'react-dom/client';
import WordScramble from './WordScramble.jsx';
import { countVisit } from './visits.js';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WordScramble />
  </React.StrictMode>
);

countVisit();
