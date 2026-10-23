import React, { useState, useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS & DATA
// ═══════════════════════════════════════════════════════════════════════════

const DIFFICULTY_CONFIG = {
  easy: { timeLimit: 45, hints: 3, scoreMultiplier: 1.0, label: 'Easy', emoji: '🌱', desc: 'Short words, generous time' },
  medium: { timeLimit: 35, hints: 2, scoreMultiplier: 1.5, label: 'Medium', emoji: '🌿', desc: 'Moderate challenge' },
  hard: { timeLimit: 25, hints: 1, scoreMultiplier: 2.0, label: 'Hard', emoji: '🔥', desc: 'Longer words, less time' },
  expert: { timeLimit: 18, hints: 0, scoreMultiplier: 3.0, label: 'Expert', emoji: '💀', desc: 'No hints, maximum pressure' },
};

const CATEGORIES = {
  countries: {
    name: 'Countries',
    emoji: '🌍',
    color: '#10B981',
    words: {
      easy: ['PERU', 'CUBA', 'FIJI', 'MALI', 'IRAN', 'IRAQ', 'OMAN', 'CHAD', 'TOGO'],
      medium: ['BRAZIL', 'CANADA', 'FRANCE', 'MEXICO', 'POLAND', 'SWEDEN', 'TURKEY', 'NORWAY'],
      hard: ['AUSTRALIA', 'ARGENTINA', 'INDONESIA', 'SINGAPORE', 'LITHUANIA', 'GUATEMALA'],
      expert: ['NETHERLANDS', 'SWITZERLAND', 'AFGHANISTAN', 'MOZAMBIQUE', 'LIECHTENSTEIN'],
    }
  },
  cities: {
    name: 'Cities',
    emoji: '🏙️',
    color: '#6366F1',
    words: {
      easy: ['ROME', 'OSLO', 'LIMA', 'KIEV', 'BAKU', 'DOHA', 'SUVA', 'SOFIA'],
      medium: ['BERLIN', 'LONDON', 'MADRID', 'SYDNEY', 'MUMBAI', 'MOSCOW', 'DUBLIN', 'VIENNA'],
      hard: ['AMSTERDAM', 'BARCELONA', 'SINGAPORE', 'MELBOURNE', 'STOCKHOLM', 'VANCOUVER'],
      expert: ['JOHANNESBURG', 'PHILADELPHIA', 'INDIANAPOLIS', 'MASSACHUSETTS'],
    }
  },
  plants: {
    name: 'Plants',
    emoji: '🌿',
    color: '#22C55E',
    words: {
      easy: ['FERN', 'PALM', 'LILY', 'ROSE', 'MINT', 'SAGE', 'VINE', 'MOSS'],
      medium: ['CACTUS', 'BAMBOO', 'ORCHID', 'WILLOW', 'CLOVER', 'DAHLIA', 'JASMINE'],
      hard: ['LAVENDER', 'ROSEMARY', 'MARIGOLD', 'HIBISCUS', 'DAFFODIL', 'BLUEBELL'],
      expert: ['BOUGAINVILLEA', 'CHRYSANTHEMUM', 'RHODODENDRON', 'PHILODENDRON'],
    }
  },
  animals: {
    name: 'Animals',
    emoji: '🦁',
    color: '#F59E0B',
    words: {
      easy: ['BEAR', 'DEER', 'FROG', 'LION', 'WOLF', 'SEAL', 'HAWK', 'CRAB'],
      medium: ['JAGUAR', 'MONKEY', 'RABBIT', 'TURTLE', 'PARROT', 'SALMON', 'DOLPHIN'],
      hard: ['ELEPHANT', 'KANGAROO', 'FLAMINGO', 'CROCODILE', 'ARMADILLO', 'CHAMELEON'],
      expert: ['HIPPOPOTAMUS', 'RATTLESNAKE', 'CHIMPANZEE', 'ORANGUTAN'],
    }
  },
  food: {
    name: 'Food',
    emoji: '🍕',
    color: '#EF4444',
    words: {
      easy: ['RICE', 'SOUP', 'CAKE', 'FISH', 'BEEF', 'CORN', 'PEAR', 'PLUM'],
      medium: ['BURGER', 'CHEESE', 'SALAD', 'SALMON', 'TOMATO', 'POTATO', 'MANGO'],
      hard: ['SANDWICH', 'SPAGHETTI', 'CHOCOLATE', 'PINEAPPLE', 'CROISSANT', 'AVOCADO'],
      expert: ['WATERMELON', 'POMEGRANATE', 'CAULIFLOWER', 'BLUEBERRY'],
    }
  },
  sports: {
    name: 'Sports',
    emoji: '⚽',
    color: '#8B5CF6',
    words: {
      easy: ['GOLF', 'POLO', 'SURF', 'SWIM', 'YOGA', 'BIKE', 'HIKE', 'DIVE'],
      medium: ['TENNIS', 'SOCCER', 'HOCKEY', 'BOXING', 'KARATE', 'ROWING', 'SKIING'],
      hard: ['BASEBALL', 'FOOTBALL', 'SWIMMING', 'MARATHON', 'CLIMBING', 'LACROSSE'],
      expert: ['BASKETBALL', 'VOLLEYBALL', 'GYMNASTICS', 'SNOWBOARDING'],
    }
  },
  technology: {
    name: 'Technology',
    emoji: '💻',
    color: '#06B6D4',
    words: {
      easy: ['CODE', 'DATA', 'WIFI', 'CHIP', 'APPS', 'BYTE', 'LINK', 'CHAT'],
      medium: ['LAPTOP', 'TABLET', 'ROUTER', 'PYTHON', 'SERVER', 'CODING', 'MOBILE'],
      hard: ['COMPUTER', 'SOFTWARE', 'INTERNET', 'DATABASE', 'ALGORITHM', 'BLUETOOTH'],
      expert: ['PROGRAMMING', 'CYBERSECURITY', 'BLOCKCHAIN', 'INTELLIGENCE'],
    }
  },
  movies: {
    name: 'Movies',
    emoji: '🎬',
    color: '#EC4899',
    words: {
      easy: ['JAWS', 'CARS', 'HUGO', 'DUNE', 'COCO', 'ROOM', 'HEAT', 'HOOK'],
      medium: ['AVATAR', 'FROZEN', 'PSYCHO', 'MATRIX', 'ROCKY', 'GREASE', 'ALIENS'],
      hard: ['INCEPTION', 'GLADIATOR', 'MOONLIGHT', 'SPOTLIGHT', 'ZOOTOPIA'],
      expert: ['INTERSTELLAR', 'RATATOUILLE', 'BRAVEHEART', 'CASABLANCA'],
    }
  },
};

const AVATARS = ['😀', '😎', '🤓', '🦊', '🐼', '🦁', '🐸', '🦄', '🐲', '👾', '🤖', '👻', '🎃', '⭐', '🌟', '💫'];

const THEME = {
  primary: '#6366F1',
  secondary: '#F59E0B',
  background: '#0F172A',
  card: '#1E293B',
  cardLight: '#334155',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
};

const TILE_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#EF4444', '#14B8A6'];

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const generatePlayerId = () => `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const scrambleWord = (word) => {
  const letters = word.split('');
  let scrambled = [...letters];
  let attempts = 0;
  do {
    for (let i = scrambled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
    attempts++;
  } while (scrambled.join('') === word && attempts < 10);
  return scrambled.join('');
};

const getRandomWord = (category, difficulty) => {
  const words = CATEGORIES[category]?.words[difficulty] || [];
  return words[Math.floor(Math.random() * words.length)] || 'WORD';
};

const calculateScore = (timeRemaining, hintsUsed, config) => {
  let score = 100 * config.scoreMultiplier;
  score += timeRemaining * 3;
  score -= hintsUsed * 20;
  if (hintsUsed === 0) score += 50;
  return Math.max(0, Math.round(score));
};

// QR Code Generator (simple SVG-based)
const QRCode = ({ value, size = 180 }) => {
  // Simplified QR-like pattern for demo - in production use a real QR library
  const gridSize = 21;
  const cellSize = size / gridSize;
  const pattern = [];
  
  // Generate deterministic pattern from value
  let seed = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  
  // Corner patterns (finder patterns)
  const addFinder = (x, y) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const isOuter = i === 0 || i === 6 || j === 0 || j === 6;
        const isInner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        if (isOuter || isInner) pattern.push({ x: x + i, y: y + j });
      }
    }
  };
  
  addFinder(0, 0);
  addFinder(14, 0);
  addFinder(0, 14);
  
  // Data pattern
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const inFinder = (i < 8 && j < 8) || (i < 8 && j > 12) || (i > 12 && j < 8);
      if (!inFinder && random() > 0.5) {
        pattern.push({ x: i, y: j });
      }
    }
  }
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx="8" />
      {pattern.map((cell, idx) => (
        <rect
          key={idx}
          x={cell.x * cellSize + 2}
          y={cell.y * cellSize + 2}
          width={cellSize - 1}
          height={cellSize - 1}
          fill="#0F172A"
        />
      ))}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Button = ({ children, onClick, variant = 'primary', disabled, size = 'md', className = '', style = {} }) => {
  const baseStyle = {
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '12px',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.15s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };
  
  const variants = {
    primary: { background: THEME.primary, color: '#FFFFFF' },
    secondary: { background: THEME.cardLight, color: THEME.text },
    success: { background: THEME.success, color: '#FFFFFF' },
    danger: { background: THEME.error, color: '#FFFFFF' },
    ghost: { background: 'transparent', color: THEME.textMuted, border: `1px solid ${THEME.cardLight}` },
  };
  
  const sizes = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '12px 24px', fontSize: '16px' },
    lg: { padding: '16px 32px', fontSize: '18px' },
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...variants[variant], ...sizes[size], ...style }}
      className={className}
    >
      {children}
    </button>
  );
};

const Card = ({ children, style = {}, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: THEME.card,
      borderRadius: '16px',
      padding: '20px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.15s ease',
      ...style,
    }}
  >
    {children}
  </div>
);

const Input = ({ value, onChange, placeholder, maxLength, style = {} }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    maxLength={maxLength}
    style={{
      width: '100%',
      padding: '14px 18px',
      fontSize: '16px',
      background: THEME.cardLight,
      border: `2px solid transparent`,
      borderRadius: '12px',
      color: THEME.text,
      outline: 'none',
      transition: 'border-color 0.15s ease',
      ...style,
    }}
    onFocus={(e) => e.target.style.borderColor = THEME.primary}
    onBlur={(e) => e.target.style.borderColor = 'transparent'}
  />
);

const LetterTile = ({ letter, index, onClick, isPlaced, isRevealed, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled || isPlaced}
    style={{
      width: '52px',
      height: '52px',
      fontSize: '22px',
      fontWeight: 'bold',
      background: isPlaced ? THEME.cardLight : isRevealed ? THEME.success : TILE_COLORS[index % TILE_COLORS.length],
      color: isPlaced ? THEME.textMuted : '#FFFFFF',
      border: 'none',
      borderRadius: '12px',
      cursor: disabled || isPlaced ? 'default' : 'pointer',
      transition: 'all 0.15s ease',
      transform: isPlaced ? 'scale(0.85)' : 'scale(1)',
      boxShadow: isPlaced ? 'none' : '0 4px 12px rgba(0,0,0,0.3)',
      opacity: isPlaced ? 0.4 : 1,
    }}
  >
    {letter}
  </button>
);

const AnswerSlot = ({ letter, onClick, isCorrect, isWrong, isRevealed }) => {
  let borderColor = THEME.cardLight;
  let bgColor = THEME.card;
  if (letter) { borderColor = THEME.primary; bgColor = THEME.cardLight; }
  if (isCorrect) { borderColor = THEME.success; bgColor = '#064E3B'; }
  if (isWrong) { borderColor = THEME.error; bgColor = '#7F1D1D'; }
  
  return (
    <button
      onClick={onClick}
      style={{
        width: '48px',
        height: '48px',
        fontSize: '20px',
        fontWeight: 'bold',
        background: bgColor,
        color: THEME.text,
        border: `3px solid ${borderColor}`,
        borderRadius: '10px',
        cursor: letter && !isRevealed ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
      }}
    >
      {letter || ''}
    </button>
  );
};

const Timer = ({ seconds, isWarning }) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      background: isWarning ? '#7F1D1D' : THEME.cardLight,
      borderRadius: '24px',
      fontWeight: 'bold',
      fontSize: '18px',
      color: isWarning ? '#FCA5A5' : THEME.text,
      animation: isWarning ? 'pulse 0.5s infinite' : 'none',
    }}>
      <span>⏱️</span>
      <span>{mins}:{secs.toString().padStart(2, '0')}</span>
    </div>
  );
};

const PlayerCard = ({ player, isCurrentPlayer, score, isReady }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: isCurrentPlayer ? `${THEME.primary}30` : THEME.cardLight,
    borderRadius: '12px',
    border: isCurrentPlayer ? `2px solid ${THEME.primary}` : '2px solid transparent',
  }}>
    <span style={{ fontSize: '28px' }}>{player.avatar}</span>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 'bold', color: THEME.text }}>{player.name}</div>
      <div style={{ fontSize: '14px', color: THEME.textMuted }}>
        {score !== undefined ? `${score} pts` : isReady ? '✅ Ready' : '⏳ Waiting'}
      </div>
    </div>
  </div>
);

const CategoryCard = ({ category, data, selected, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '16px',
      background: selected ? `${data.color}30` : THEME.card,
      border: `2px solid ${selected ? data.color : 'transparent'}`,
      borderRadius: '16px',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 0.15s ease',
      width: '100%',
    }}
  >
    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{data.emoji}</div>
    <div style={{ fontWeight: 'bold', color: THEME.text }}>{data.name}</div>
  </button>
);

// ═══════════════════════════════════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════════════════════════════════

const ProfileSetupScreen = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  
  const handleSubmit = () => {
    if (name.trim().length >= 2) {
      onComplete({ id: generatePlayerId(), name: name.trim(), avatar });
    }
  };
  
  return (
    <div style={{ minHeight: '100vh', background: THEME.background, padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: THEME.text, marginBottom: '8px' }}>🎮 Word Scramble</h1>
      <p style={{ color: THEME.textMuted, marginBottom: '40px' }}>Create your profile to start playing</p>
      
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: THEME.textMuted, marginBottom: '8px', fontSize: '14px' }}>Your Name</label>
          <Input
            value={name}
            onChange={setName}
            placeholder="Enter your name"
            maxLength={16}
          />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: THEME.textMuted, marginBottom: '12px', fontSize: '14px' }}>Choose Avatar</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px' }}>
            {AVATARS.map((a) => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                style={{
                  fontSize: '24px',
                  padding: '8px',
                  background: avatar === a ? THEME.primary : THEME.cardLight,
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        
        <Button onClick={handleSubmit} disabled={name.trim().length < 2} style={{ width: '100%' }} size="lg">
          Continue →
        </Button>
      </Card>
    </div>
  );
};

const HomeScreen = ({ profile, onCreateGame, onJoinGame, onSoloPlay, onQuickMatch }) => (
  <div style={{ minHeight: '100vh', background: THEME.background, padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
      <span style={{ fontSize: '40px' }}>{profile.avatar}</span>
      <div>
        <div style={{ color: THEME.textMuted, fontSize: '14px' }}>Welcome back,</div>
        <div style={{ color: THEME.text, fontSize: '24px', fontWeight: 'bold' }}>{profile.name}</div>
      </div>
    </div>
    
    <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: THEME.text, marginBottom: '8px', textAlign: 'center' }}>
      🎮 Word Scramble
    </h1>
    <p style={{ color: THEME.textMuted, marginBottom: '48px', textAlign: 'center' }}>
      Challenge your friends or play solo!
    </p>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '320px' }}>
      <Button onClick={onCreateGame} size="lg" style={{ width: '100%' }}>
        🎯 Create Game
      </Button>
      <Button onClick={onJoinGame} variant="secondary" size="lg" style={{ width: '100%' }}>
        🔗 Join Game
      </Button>
      <Button onClick={onQuickMatch} variant="success" size="lg" style={{ width: '100%' }}>
        ⚡ Quick Match
      </Button>
      <Button onClick={onSoloPlay} variant="ghost" size="lg" style={{ width: '100%' }}>
        👤 Solo Practice
      </Button>
    </div>
  </div>
);

const GameSetupScreen = ({ profile, isHost, roomCode, players, onStart, onBack, onCopyCode }) => {
  const [category, setCategory] = useState('countries');
  const [difficulty, setDifficulty] = useState('medium');
  const [rounds, setRounds] = useState(5);
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}?join=${roomCode}`;
  
  const handleCopy = () => {
    navigator.clipboard?.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const canStart = players.length >= 1;
  
  return (
    <div style={{ minHeight: '100vh', background: THEME.background, padding: '24px 20px' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: THEME.textMuted, fontSize: '18px', cursor: 'pointer', marginBottom: '20px' }}>
        ← Back
      </button>
      
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {/* Room Code & QR */}
        <Card style={{ marginBottom: '20px', textAlign: 'center' }}>
          <div style={{ color: THEME.textMuted, marginBottom: '8px' }}>Room Code</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: THEME.primary, letterSpacing: '4px', marginBottom: '16px' }}>
            {roomCode}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ padding: '12px', background: 'white', borderRadius: '12px' }}>
              <QRCode value={shareUrl} size={160} />
            </div>
          </div>
          
          <Button onClick={handleCopy} variant="secondary" size="sm">
            {copied ? '✅ Copied!' : '📋 Copy Code'}
          </Button>
          
          <p style={{ color: THEME.textMuted, fontSize: '13px', marginTop: '12px' }}>
            Share this code or scan QR to invite players
          </p>
        </Card>
        
        {/* Players */}
        <Card style={{ marginBottom: '20px' }}>
          <div style={{ color: THEME.textMuted, marginBottom: '12px', fontSize: '14px' }}>
            Players ({players.length}/8)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {players.map((p) => (
              <PlayerCard key={p.id} player={p} isCurrentPlayer={p.id === profile.id} isReady={true} />
            ))}
          </div>
        </Card>
        
        {/* Game Settings (Host Only) */}
        {isHost && (
          <>
            {/* Category Selection */}
            <Card style={{ marginBottom: '20px' }}>
              <div style={{ color: THEME.textMuted, marginBottom: '12px', fontSize: '14px' }}>Category</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {Object.entries(CATEGORIES).map(([key, data]) => (
                  <CategoryCard
                    key={key}
                    category={key}
                    data={data}
                    selected={category === key}
                    onClick={() => setCategory(key)}
                  />
                ))}
              </div>
            </Card>
            
            {/* Difficulty */}
            <Card style={{ marginBottom: '20px' }}>
              <div style={{ color: THEME.textMuted, marginBottom: '12px', fontSize: '14px' }}>Difficulty</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key)}
                    style={{
                      padding: '12px',
                      background: difficulty === key ? `${THEME.primary}30` : THEME.cardLight,
                      border: `2px solid ${difficulty === key ? THEME.primary : 'transparent'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{config.emoji}</div>
                    <div style={{ fontWeight: 'bold', color: THEME.text }}>{config.label}</div>
                    <div style={{ fontSize: '12px', color: THEME.textMuted }}>{config.desc}</div>
                  </button>
                ))}
              </div>
            </Card>
            
            {/* Rounds */}
            <Card style={{ marginBottom: '24px' }}>
              <div style={{ color: THEME.textMuted, marginBottom: '12px', fontSize: '14px' }}>Rounds</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[3, 5, 7, 10].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRounds(r)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: rounds === r ? THEME.primary : THEME.cardLight,
                      color: THEME.text,
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </Card>
            
            <Button
              onClick={() => onStart({ category, difficulty, rounds })}
              disabled={!canStart}
              size="lg"
              style={{ width: '100%' }}
            >
              {canStart ? '🚀 Start Game' : 'Waiting for players...'}
            </Button>
          </>
        )}
        
        {!isHost && (
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <div style={{ color: THEME.text, fontWeight: 'bold', marginBottom: '8px' }}>Waiting for host</div>
            <div style={{ color: THEME.textMuted, fontSize: '14px' }}>The host will start the game soon</div>
          </Card>
        )}
      </div>
    </div>
  );
};

const JoinGameScreen = ({ profile, onJoin, onBack }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  
  const handleJoin = () => {
    if (code.length === 6) {
      onJoin(code.toUpperCase());
    } else {
      setError('Please enter a valid 6-character code');
    }
  };
  
  return (
    <div style={{ minHeight: '100vh', background: THEME.background, padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button onClick={onBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: THEME.textMuted, fontSize: '18px', cursor: 'pointer', marginBottom: '40px' }}>
        ← Back
      </button>
      
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: THEME.text, marginBottom: '32px' }}>Join Game</h2>
      
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: THEME.textMuted, marginBottom: '8px', fontSize: '14px' }}>Enter Room Code</label>
          <Input
            value={code}
            onChange={(v) => { setCode(v.toUpperCase()); setError(''); }}
            placeholder="ABC123"
            maxLength={6}
            style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '4px', textTransform: 'uppercase' }}
          />
          {error && <div style={{ color: THEME.error, fontSize: '14px', marginTop: '8px' }}>{error}</div>}
        </div>
        
        <Button onClick={handleJoin} disabled={code.length !== 6} style={{ width: '100%' }} size="lg">
          Join Room
        </Button>
      </Card>
    </div>
  );
};

const GameScreen = ({ settings, profile, players, onComplete, onQuit, isSolo }) => {
  const { category, difficulty, rounds } = settings;
  const config = DIFFICULTY_CONFIG[difficulty];
  const categoryData = CATEGORIES[category];
  
  const [currentRound, setCurrentRound] = useState(1);
  const [word, setWord] = useState('');
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [answerSlots, setAnswerSlots] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(config.timeLimit);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [roundComplete, setRoundComplete] = useState(false);
  const [roundCorrect, setRoundCorrect] = useState(false);
  const [scores, setScores] = useState(players.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {}));
  const [showWrong, setShowWrong] = useState(false);
  const [botSolved, setBotSolved] = useState({});
  
  // Initialize round
  useEffect(() => {
    const newWord = getRandomWord(category, difficulty);
    const scrambled = scrambleWord(newWord);
    setWord(newWord);
    setScrambledLetters(scrambled.split('').map((letter, i) => ({ letter, originalIndex: i, isPlaced: false, isRevealed: false })));
    setAnswerSlots(new Array(newWord.length).fill(null));
    setTimeRemaining(config.timeLimit);
    setHintsUsed(0);
    setRoundComplete(false);
    setRoundCorrect(false);
    setBotSolved({});
  }, [currentRound, category, difficulty]);
  
  // Simulate bot players solving the puzzle
  useEffect(() => {
    if (roundComplete || isSolo) return;
    
    const botTimers = [];
    players.forEach((p) => {
      if (p.isBot && !botSolved[p.id]) {
        // Bots solve at random times between 30-90% of the time limit
        const solveTime = Math.random() * (config.timeLimit * 0.6) + (config.timeLimit * 0.3);
        const willSolve = Math.random() > 0.2; // 80% chance to solve
        
        const timer = setTimeout(() => {
          if (!roundComplete && willSolve) {
            const botTime = config.timeLimit - solveTime;
            const botHints = Math.floor(Math.random() * (config.hints + 1));
            const botScore = calculateScore(Math.max(0, botTime), botHints, config);
            
            setScores(s => ({ ...s, [p.id]: s[p.id] + botScore }));
            setBotSolved(bs => ({ ...bs, [p.id]: true }));
          }
        }, solveTime * 1000);
        
        botTimers.push(timer);
      }
    });
    
    return () => botTimers.forEach(clearTimeout);
  }, [currentRound, roundComplete, isSolo, players, config]);
  
  // Timer
  useEffect(() => {
    if (roundComplete) return;
    const interval = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 1) {
          clearInterval(interval);
          endRound(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [roundComplete, currentRound]);
  
  const endRound = (correct) => {
    setRoundComplete(true);
    setRoundCorrect(correct);
    if (correct) {
      const roundScore = calculateScore(timeRemaining, hintsUsed, config);
      setScores((s) => ({ ...s, [profile.id]: s[profile.id] + roundScore }));
    }
  };
  
  const placeLetter = (letterIndex) => {
    if (roundComplete) return;
    const firstEmpty = answerSlots.findIndex((s) => s === null);
    if (firstEmpty === -1) return;
    setScrambledLetters((letters) => letters.map((l, i) => (i === letterIndex ? { ...l, isPlaced: true } : l)));
    setAnswerSlots((slots) => {
      const newSlots = [...slots];
      newSlots[firstEmpty] = { ...scrambledLetters[letterIndex], originalIndex: letterIndex };
      return newSlots;
    });
  };
  
  const removeFromSlot = (slotIndex) => {
    const slot = answerSlots[slotIndex];
    if (!slot || slot.isRevealed || roundComplete) return;
    setScrambledLetters((letters) => letters.map((l, i) => (i === slot.originalIndex ? { ...l, isPlaced: false } : l)));
    setAnswerSlots((slots) => { const newSlots = [...slots]; newSlots[slotIndex] = null; return newSlots; });
  };
  
  const clearAll = () => {
    if (roundComplete) return;
    setScrambledLetters((letters) => letters.map((l) => l.isRevealed ? l : { ...l, isPlaced: false }));
    setAnswerSlots((slots) => slots.map((s) => s?.isRevealed ? s : null));
  };
  
  const useHint = () => {
    if (hintsUsed >= config.hints || roundComplete) return;
    for (let i = 0; i < answerSlots.length; i++) {
      if (!answerSlots[i] || answerSlots[i].letter !== word[i]) {
        if (answerSlots[i] && !answerSlots[i].isRevealed) {
          const letterIdx = answerSlots[i].originalIndex;
          setScrambledLetters((letters) => letters.map((l, idx) => (idx === letterIdx ? { ...l, isPlaced: false } : l)));
        }
        const correctLetter = word[i];
        const availableIdx = scrambledLetters.findIndex((l) => l.letter === correctLetter && !l.isPlaced);
        if (availableIdx !== -1) {
          setScrambledLetters((letters) => letters.map((l, idx) => idx === availableIdx ? { ...l, isPlaced: true, isRevealed: true } : l));
          setAnswerSlots((slots) => { const newSlots = [...slots]; newSlots[i] = { ...scrambledLetters[availableIdx], originalIndex: availableIdx, isRevealed: true }; return newSlots; });
        }
        setHintsUsed((h) => h + 1);
        break;
      }
    }
  };
  
  const checkAnswer = () => {
    if (answerSlots.some((s) => s === null) || roundComplete) return;
    const answer = answerSlots.map((s) => s.letter).join('');
    if (answer === word) {
      endRound(true);
    } else {
      setShowWrong(true);
      setTimeout(() => setShowWrong(false), 500);
    }
  };
  
  const nextRound = () => {
    if (currentRound >= rounds) {
      onComplete(scores);
    } else {
      setCurrentRound((r) => r + 1);
    }
  };
  
  const allFilled = answerSlots.every((s) => s !== null);
  
  return (
    <div style={{ minHeight: '100vh', background: THEME.background, padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={onQuit} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: THEME.textMuted }}>✕</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: categoryData.color, fontWeight: 'bold' }}>{categoryData.emoji} {categoryData.name}</div>
          <div style={{ color: THEME.textMuted, fontSize: '14px' }}>Round {currentRound} of {rounds}</div>
        </div>
        <Timer seconds={timeRemaining} isWarning={timeRemaining <= 10} />
      </div>
      
      {/* Scoreboard */}
      {!isSolo && players.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', padding: '4px' }}>
          {players.map((p) => (
            <div key={p.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: p.id === profile.id ? `${THEME.primary}30` : botSolved[p.id] ? `${THEME.success}20` : THEME.cardLight,
              borderRadius: '10px',
              whiteSpace: 'nowrap',
              border: botSolved[p.id] ? `2px solid ${THEME.success}` : '2px solid transparent',
              transition: 'all 0.3s ease',
            }}>
              <span>{p.avatar}</span>
              <div>
                <span style={{ color: THEME.text, fontWeight: 'bold', display: 'block', fontSize: '14px' }}>{scores[p.id]}</span>
                {botSolved[p.id] && <span style={{ fontSize: '10px', color: THEME.success }}>✓ Solved</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Answer Slots */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        animation: showWrong ? 'shake 0.5s ease' : 'none',
      }}>
        {answerSlots.map((slot, i) => (
          <AnswerSlot
            key={i}
            letter={slot?.letter}
            onClick={() => removeFromSlot(i)}
            isCorrect={roundComplete && roundCorrect}
            isWrong={showWrong}
            isRevealed={slot?.isRevealed}
          />
        ))}
      </div>
      
      {/* Round Complete Overlay */}
      {roundComplete && (
        <Card style={{ marginBottom: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>{roundCorrect ? '🎉' : '😢'}</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: THEME.text, marginBottom: '8px' }}>
            {roundCorrect ? 'Correct!' : `The word was: ${word}`}
          </div>
          {roundCorrect && (
            <div style={{ color: THEME.success, fontWeight: 'bold' }}>
              +{calculateScore(timeRemaining, hintsUsed, config)} points
            </div>
          )}
          <Button onClick={nextRound} style={{ marginTop: '16px' }}>
            {currentRound >= rounds ? 'See Results' : 'Next Round →'}
          </Button>
        </Card>
      )}
      
      {/* Letter Tiles */}
      {!roundComplete && (
        <>
          <Card style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {scrambledLetters.map((l, i) => (
                <LetterTile
                  key={i}
                  letter={l.letter}
                  index={i}
                  onClick={() => placeLetter(i)}
                  isPlaced={l.isPlaced}
                  isRevealed={l.isRevealed}
                  disabled={roundComplete}
                />
              ))}
            </div>
          </Card>
          
          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Button onClick={clearAll} variant="secondary">🔄 Clear</Button>
            <Button onClick={useHint} variant="secondary" disabled={hintsUsed >= config.hints}>
              💡 Hint ({config.hints - hintsUsed})
            </Button>
            <Button onClick={checkAnswer} disabled={!allFilled}>✓ Check</Button>
          </div>
        </>
      )}
      
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      `}</style>
    </div>
  );
};

const ResultsScreen = ({ players, scores, profile, onPlayAgain, onHome }) => {
  const sortedPlayers = [...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));
  const winner = sortedPlayers[0];
  const isWinner = winner?.id === profile.id;
  
  return (
    <div style={{ minHeight: '100vh', background: THEME.background, padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: '72px', marginBottom: '16px' }}>{isWinner ? '🏆' : '👏'}</div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: THEME.text, marginBottom: '8px' }}>
        {players.length > 1 ? (isWinner ? 'You Won!' : `${winner?.name} Wins!`) : 'Game Over!'}
      </h1>
      <p style={{ color: THEME.textMuted, marginBottom: '32px' }}>
        {players.length > 1 ? 'Final standings' : `Your score: ${scores[profile.id] || 0} points`}
      </p>
      
      <Card style={{ width: '100%', maxWidth: '400px', marginBottom: '32px' }}>
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              background: index === 0 ? `${THEME.secondary}20` : 'transparent',
              borderRadius: '12px',
              marginBottom: index < sortedPlayers.length - 1 ? '8px' : 0,
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: index === 0 ? THEME.secondary : THEME.cardLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: index === 0 ? THEME.background : THEME.text,
            }}>
              {index + 1}
            </div>
            <span style={{ fontSize: '28px' }}>{player.avatar}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', color: THEME.text }}>{player.name}</div>
              {player.id === profile.id && <div style={{ fontSize: '12px', color: THEME.textMuted }}>You</div>}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: index === 0 ? THEME.secondary : THEME.text }}>
              {scores[player.id] || 0}
            </div>
          </div>
        ))}
      </Card>
      
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button onClick={onPlayAgain}>🔄 Play Again</Button>
        <Button onClick={onHome} variant="secondary">🏠 Home</Button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// BOT SIMULATION
// ═══════════════════════════════════════════════════════════════════════════

const BOT_NAMES = ['Alex', 'Jordan', 'Sam', 'Riley', 'Morgan', 'Taylor', 'Casey', 'Quinn', 'Avery', 'Charlie'];

const createBot = () => ({
  id: generatePlayerId(),
  name: BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)],
  avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
  isBot: true,
});

// ═══════════════════════════════════════════════════════════════════════════
// QUICK MATCH SCREEN
// ═══════════════════════════════════════════════════════════════════════════

const QuickMatchScreen = ({ profile, onMatchFound, onCancel }) => {
  const [status, setStatus] = useState('searching');
  const [players, setPlayers] = useState([profile]);
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 500);
    return () => clearInterval(dotInterval);
  }, []);
  
  useEffect(() => {
    // Simulate finding players
    const timers = [];
    const addPlayer = (delay) => {
      timers.push(setTimeout(() => {
        setPlayers(p => {
          if (p.length < 4) return [...p, createBot()];
          return p;
        });
      }, delay));
    };
    
    addPlayer(1500);
    addPlayer(3000);
    addPlayer(4500);
    
    // Auto-start after finding enough players
    timers.push(setTimeout(() => {
      setStatus('ready');
    }, 5500));
    
    timers.push(setTimeout(() => {
      onMatchFound(players);
    }, 7000));
    
    return () => timers.forEach(clearTimeout);
  }, []);
  
  useEffect(() => {
    if (status === 'ready' && players.length >= 2) {
      setTimeout(() => onMatchFound(players), 1500);
    }
  }, [status, players]);
  
  return (
    <div style={{ minHeight: '100vh', background: THEME.background, padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '24px', animation: 'pulse 1s infinite' }}>🔍</div>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: THEME.text, marginBottom: '8px' }}>
        {status === 'searching' ? `Finding Players${dots}` : 'Match Found!'}
      </h2>
      <p style={{ color: THEME.textMuted, marginBottom: '32px' }}>
        {status === 'searching' ? 'Looking for opponents near your skill level' : 'Starting game...'}
      </p>
      
      <Card style={{ width: '100%', maxWidth: '400px', marginBottom: '32px' }}>
        <div style={{ color: THEME.textMuted, marginBottom: '16px', fontSize: '14px' }}>
          Players Found ({players.length}/4)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {players.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: THEME.cardLight,
              borderRadius: '12px',
              animation: i > 0 ? 'fadeIn 0.3s ease' : 'none',
            }}>
              <span style={{ fontSize: '24px' }}>{p.avatar}</span>
              <span style={{ color: THEME.text, fontWeight: 'bold' }}>{p.name}</span>
              {p.id === profile.id && <span style={{ fontSize: '12px', color: THEME.primary, marginLeft: 'auto' }}>You</span>}
            </div>
          ))}
          {Array(4 - players.length).fill(0).map((_, i) => (
            <div key={`empty-${i}`} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: THEME.cardLight,
              borderRadius: '12px',
              opacity: 0.4,
            }}>
              <span style={{ fontSize: '24px' }}>👤</span>
              <span style={{ color: THEME.textMuted }}>Searching...</span>
            </div>
          ))}
        </div>
      </Card>
      
      <Button onClick={onCancel} variant="ghost">Cancel</Button>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════

export default function WordScrambleMultiplayer() {
  const [screen, setScreen] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [gameSettings, setGameSettings] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [scores, setScores] = useState({});
  
  // Simulate bots joining the room
  useEffect(() => {
    if (screen === 'setup' && isHost && roomCode !== 'SOLO') {
      const timers = [];
      const addBot = (delay) => {
        timers.push(setTimeout(() => {
          setPlayers(p => {
            if (p.length < 4) return [...p, createBot()];
            return p;
          });
        }, delay));
      };
      
      // Randomly add 1-2 bots after delays
      addBot(2500 + Math.random() * 2000);
      if (Math.random() > 0.4) addBot(5000 + Math.random() * 2000);
      
      return () => timers.forEach(clearTimeout);
    }
  }, [screen, isHost, roomCode]);
  
  // Profile setup complete
  const handleProfileComplete = (newProfile) => {
    setProfile(newProfile);
    setScreen('home');
  };
  
  // Create new game
  const handleCreateGame = () => {
    const code = generateRoomCode();
    setRoomCode(code);
    setPlayers([profile]);
    setIsHost(true);
    setScreen('setup');
  };
  
  // Join existing game
  const handleJoinGame = (code) => {
    // Simulate joining a room with existing players
    setRoomCode(code);
    const hostBot = createBot();
    hostBot.name = 'Host_' + hostBot.name;
    setPlayers([hostBot, profile]);
    setIsHost(false);
    setGameSettings({ category: 'countries', difficulty: 'medium', rounds: 5 });
    setScreen('setup');
  };
  
  // Start solo game
  const handleSoloPlay = () => {
    setRoomCode('SOLO');
    setPlayers([profile]);
    setIsHost(true);
    setScreen('setup');
  };
  
  // Quick match
  const handleQuickMatch = () => {
    setScreen('quickmatch');
  };
  
  // Quick match found
  const handleMatchFound = (matchedPlayers) => {
    setRoomCode(generateRoomCode());
    setPlayers(matchedPlayers);
    setIsHost(true);
    setGameSettings({ category: Object.keys(CATEGORIES)[Math.floor(Math.random() * Object.keys(CATEGORIES).length)], difficulty: 'medium', rounds: 5 });
    setScores(matchedPlayers.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {}));
    setScreen('game');
  };
  
  // Start the game
  const handleStartGame = (settings) => {
    setGameSettings(settings);
    setScores(players.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {}));
    setScreen('game');
  };
  
  // Game complete
  const handleGameComplete = (finalScores) => {
    setScores(finalScores);
    setScreen('results');
  };
  
  // Play again
  const handlePlayAgain = () => {
    if (roomCode === 'SOLO') {
      setScreen('setup');
    } else {
      // Reset scores and go back to setup
      setScores({});
      setScreen('setup');
    }
  };
  
  // Go home
  const handleHome = () => {
    setRoomCode('');
    setPlayers([]);
    setGameSettings(null);
    setIsHost(false);
    setScores({});
    setScreen('home');
  };
  
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", minHeight: '100vh' }}>
      {screen === 'profile' && (
        <ProfileSetupScreen onComplete={handleProfileComplete} />
      )}
      
      {screen === 'home' && profile && (
        <HomeScreen
          profile={profile}
          onCreateGame={handleCreateGame}
          onJoinGame={() => setScreen('join')}
          onSoloPlay={handleSoloPlay}
          onQuickMatch={handleQuickMatch}
        />
      )}
      
      {screen === 'join' && (
        <JoinGameScreen
          profile={profile}
          onJoin={handleJoinGame}
          onBack={handleHome}
        />
      )}
      
      {screen === 'quickmatch' && (
        <QuickMatchScreen
          profile={profile}
          onMatchFound={handleMatchFound}
          onCancel={handleHome}
        />
      )}
      
      {screen === 'setup' && (
        <GameSetupScreen
          profile={profile}
          isHost={isHost}
          roomCode={roomCode}
          players={players}
          onStart={handleStartGame}
          onBack={handleHome}
        />
      )}
      
      {screen === 'game' && gameSettings && (
        <GameScreen
          settings={gameSettings}
          profile={profile}
          players={players}
          onComplete={handleGameComplete}
          onQuit={handleHome}
          isSolo={roomCode === 'SOLO'}
        />
      )}
      
      {screen === 'results' && (
        <ResultsScreen
          players={players}
          scores={scores}
          profile={profile}
          onPlayAgain={handlePlayAgain}
          onHome={handleHome}
        />
      )}
    </div>
  );
}
