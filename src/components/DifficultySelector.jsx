import React from 'react';

const LEVELS = [
  { key: 'easy', label: 'Easy' },
  { key: 'medium', label: 'Medium' },
  { key: 'hard', label: 'Hard' },
];

const DifficultySelector = ({ value, onChange }) => (
  <div role="group" aria-label="Difficulty" style={{ display: 'flex', gap: '8px' }}>
    {LEVELS.map(({ key, label }) => {
      const active = value === key;
      return (
        <button
          key={key}
          type="button"
          aria-pressed={active}
          data-testid={`difficulty-${key}`}
          onClick={() => onChange(key)}
          style={{
            flex: 1,
            padding: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            borderRadius: '12px',
            color: '#F8FAFC',
            background: active ? '#6366F1' : '#334155',
            border: `2px solid ${active ? '#6366F1' : 'transparent'}`,
          }}
        >
          {label}
        </button>
      );
    })}
  </div>
);

export default DifficultySelector;
