import React, { useState } from 'react';
import { MUSCLE_CONFIG } from '../config';

export default function BodySVG({ onMuscleClick }) {
  const [hovered, setHovered] = useState(null);

  const getColor = (muscle) => {
    const config = MUSCLE_CONFIG[muscle];
    if (!config) return '#E0DDD8';
    if (hovered === muscle) return config.color;
    return config.colorLight;
  };

  const getStroke = (muscle) => {
    return hovered === muscle ? MUSCLE_CONFIG[muscle]?.color : '#C8C4BC';
  };

  const muscleProps = (muscle) => ({
    fill: getColor(muscle),
    stroke: getStroke(muscle),
    strokeWidth: hovered === muscle ? 2 : 1,
    style: { cursor: 'pointer', transition: 'all 0.2s ease' },
    onMouseEnter: () => setHovered(muscle),
    onMouseLeave: () => setHovered(null),
    onClick: () => onMuscleClick(muscle),
  });

  return (
    <div style={{ display: 'flex', gap: '60px', alignItems: 'flex-start', justifyContent: 'center' }}>
      {/* FRONT VIEW */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#78716C', marginBottom: '8px', fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Anterior</p>
        <svg width="180" height="420" viewBox="0 0 180 420">
          {/* Body outline */}
          {/* Head */}
          <ellipse cx="90" cy="28" rx="22" ry="26" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />
          {/* Neck */}
          <rect x="81" y="50" width="18" height="18" rx="4" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />

          {/* SHOULDERS */}
          <ellipse cx="55" cy="85" rx="20" ry="14" {...muscleProps('Shoulders')} />
          <ellipse cx="125" cy="85" rx="20" ry="14" {...muscleProps('Shoulders')} />

          {/* CHEST */}
          <path d="M68 72 Q90 68 112 72 Q118 88 112 100 Q90 106 68 100 Q62 88 68 72Z" {...muscleProps('Chest')} />

          {/* BICEPS */}
          <path d="M42 100 Q34 110 33 128 Q38 135 46 132 Q52 115 54 100Z" {...muscleProps('Biceps')} />
          <path d="M138 100 Q146 110 147 128 Q142 135 134 132 Q128 115 126 100Z" {...muscleProps('Biceps')} />

          {/* ABS */}
          <path d="M70 102 Q90 98 110 102 L112 155 Q90 160 68 155Z" {...muscleProps('Abs')} />

          {/* Forearms - neutral */}
          <path d="M30 132 Q26 150 28 168 Q33 172 38 168 Q40 150 44 132Z" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />
          <path d="M150 132 Q154 150 152 168 Q147 172 142 168 Q140 150 136 132Z" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />

          {/* Hands */}
          <ellipse cx="33" cy="178" rx="9" ry="13" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />
          <ellipse cx="147" cy="178" rx="9" ry="13" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />

          {/* TRICEPS front visible */}
          <path d="M54 100 Q58 118 56 132 Q50 135 44 132 Q42 115 46 100Z" {...muscleProps('Triceps')} />
          <path d="M126 100 Q122 118 124 132 Q130 135 136 132 Q138 115 134 100Z" {...muscleProps('Triceps')} />

          {/* Hip area */}
          <path d="M68 155 Q90 160 112 155 L116 175 Q90 182 64 175Z" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />

          {/* QUADS */}
          <path d="M64 175 Q72 178 76 195 L74 240 Q66 245 60 238 Q56 215 58 190Z" {...muscleProps('Quads')} />
          <path d="M104 175 Q112 178 122 190 Q124 215 120 238 Q114 245 106 240 L104 195 Q108 178 104 175Z" {...muscleProps('Quads')} />

          {/* Inner quads */}
          <path d="M76 195 Q84 192 88 195 L88 240 Q82 244 76 240Z" {...muscleProps('Quads')} />
          <path d="M92 195 Q96 192 104 195 L104 240 Q98 244 92 240Z" {...muscleProps('Quads')} />

          {/* Knees */}
          <ellipse cx="70" cy="248" rx="14" ry="12" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />
          <ellipse cx="110" cy="248" rx="14" ry="12" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />

          {/* Shins */}
          <path d="M58 258 Q62 280 63 310 Q68 316 73 310 Q76 280 78 258Z" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />
          <path d="M102 258 Q104 280 107 310 Q112 316 117 310 Q118 280 122 258Z" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />

          {/* CALVES front visible */}
          <path d="M63 310 Q68 330 66 355 Q60 358 56 352 Q54 330 58 310Z" {...muscleProps('Calves')} />
          <path d="M117 310 Q122 330 124 352 Q120 358 114 355 Q112 330 107 310Z" {...muscleProps('Calves')} />

          {/* Feet */}
          <ellipse cx="63" cy="365" rx="14" ry="8" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />
          <ellipse cx="117" cy="365" rx="14" ry="8" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />
        </svg>
      </div>

      {/* BACK VIEW */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#78716C', marginBottom: '8px', fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Posterior</p>
        <svg width="180" height="420" viewBox="0 0 180 420">
          {/* Head */}
          <ellipse cx="90" cy="28" rx="22" ry="26" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />
          {/* Neck */}
          <rect x="81" y="50" width="18" height="18" rx="4" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />

          {/* TRAPS */}
          <path d="M68 60 Q90 54 112 60 Q118 72 112 80 Q90 76 68 80 Q62 72 68 60Z" {...muscleProps('Traps')} />

          {/* REAR DELTS */}
          <ellipse cx="52" cy="85" rx="20" ry="13" {...muscleProps('Rear Delts')} />
          <ellipse cx="128" cy="85" rx="20" ry="13" {...muscleProps('Rear Delts')} />

          {/* LATS */}
          <path d="M66 80 Q56 100 58 130 Q68 138 78 132 Q82 110 80 85Z" {...muscleProps('Lats')} />
          <path d="M114 80 Q124 100 122 130 Q112 138 102 132 Q98 110 100 85Z" {...muscleProps('Lats')} />

          {/* TRICEPS back */}
          <path d="M42 98 Q34 115 35 132 Q40 138 46 134 Q50 118 52 100Z" {...muscleProps('Triceps')} />
          <path d="M138 98 Q146 115 145 132 Q140 138 134 134 Q130 118 128 100Z" {...muscleProps('Triceps')} />

          {/* Forearms */}
          <path d="M32 132 Q28 150 30 168 Q35 172 40 168 Q42 150 44 134Z" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />
          <path d="M148 132 Q152 150 150 168 Q145 172 140 168 Q138 150 136 134Z" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />

          {/* Hands */}
          <ellipse cx="35" cy="178" rx="9" ry="13" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />
          <ellipse cx="145" cy="178" rx="9" ry="13" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />

          {/* Lower back */}
          <path d="M78 132 Q90 136 102 132 L106 158 Q90 164 74 158Z" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />

          {/* GLUTES */}
          <path d="M64 158 Q72 162 88 164 L88 200 Q76 205 62 196 Q56 180 60 165Z" {...muscleProps('Glutes')} />
          <path d="M92 164 Q108 162 116 158 Q120 165 124 196 Q110 205 92 200Z" {...muscleProps('Glutes')} />

          {/* HAMSTRINGS */}
          <path d="M62 196 Q66 215 68 240 Q62 248 56 242 Q52 220 56 198Z" {...muscleProps('Hamstrings')} />
          <path d="M118 196 Q122 215 124 240 Q118 248 112 242 Q108 220 110 198Z" {...muscleProps('Hamstrings')} />

          {/* Inner hamstrings */}
          <path d="M76 200 Q84 198 88 200 L88 240 Q82 246 76 242Z" {...muscleProps('Hamstrings')} />
          <path d="M92 200 Q96 198 104 200 L104 242 Q98 246 92 240Z" {...muscleProps('Hamstrings')} />

          {/* Knees */}
          <ellipse cx="70" cy="248" rx="14" ry="12" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />
          <ellipse cx="110" cy="248" rx="14" ry="12" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />

          {/* CALVES */}
          <path d="M58 258 Q56 280 57 308 Q62 318 68 312 Q72 285 72 258Z" {...muscleProps('Calves')} />
          <path d="M108 258 Q108 285 112 312 Q118 318 123 308 Q124 280 122 258Z" {...muscleProps('Calves')} />

          {/* Achilles / lower leg */}
          <path d="M57 308 Q60 330 61 350 Q66 356 70 350 Q70 330 68 312Z" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />
          <path d="M123 308 Q121 330 120 350 Q114 356 110 350 Q110 330 112 312Z" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />

          {/* Feet */}
          <ellipse cx="63" cy="360" rx="13" ry="8" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />
          <ellipse cx="117" cy="360" rx="13" ry="8" fill="#D4C5B8" stroke="#C0B0A4" strokeWidth="1" />
        </svg>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: MUSCLE_CONFIG[hovered]?.color,
          color: '#1C1917',
          padding: '8px 20px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          pointerEvents: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          letterSpacing: '0.02em',
        }}>
          {hovered} — {MUSCLE_CONFIG[hovered]?.exercise}
        </div>
      )}
    </div>
  );
}
