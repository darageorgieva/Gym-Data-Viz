import React from 'react';
import { APP_COLORS, FUNCTIONAL_COLORS } from '../config';

const MODES = [
  { key: 'week-vs-month', label: 'vs. Month Ago' },
  { key: 'rolling',       label: '4-Week Rolling' },
  { key: 'baseline',      label: 'vs. Starting Point' },
];

export default function TimeControls({
  selectedWeek,
  maxWeek,
  isPlaying,
  onWeekChange,
  onTogglePlay,
  currentWeekLabel,
  comparisonMode,
  onModeChange,
}) {
  return (
    <div style={{
      width: 'min(1100px, 100%)',
      marginBottom: '24px',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '12px',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={onTogglePlay}
          style={{
            border: 'none',
            borderRadius: '8px',
            background: FUNCTIONAL_COLORS.accent,
            color: '#fff',
            padding: '10px 22px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            letterSpacing: '0.01em',
          }}
        >
          {isPlaying ? '⏸' : '▶'} {isPlaying ? 'Pause' : 'Play'}
        </button>

        <input
          type="range"
          min={1}
          max={Math.max(1, maxWeek)}
          step={1}
          value={selectedWeek}
          onChange={(event) => onWeekChange(Number(event.target.value))}
          style={{ flex: 1, accentColor: FUNCTIONAL_COLORS.accent, minWidth: '120px' }}
        />

        <div style={{ fontSize: '14px', fontWeight: '700', color: APP_COLORS.text, whiteSpace: 'nowrap' }}>
          Week {selectedWeek}
          <span style={{ color: APP_COLORS.textLight, fontWeight: '500', marginLeft: '8px' }}>
            {currentWeekLabel}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {MODES.map((mode) => (
          <button
            key={mode.key}
            onClick={() => onModeChange(mode.key)}
            style={{
              border: comparisonMode === mode.key
                ? `1.5px solid ${FUNCTIONAL_COLORS.accent}`
                : `1.5px solid ${APP_COLORS.border}`,
              borderRadius: '999px',
              background: comparisonMode === mode.key ? FUNCTIONAL_COLORS.accentLight : 'transparent',
              color: comparisonMode === mode.key ? FUNCTIONAL_COLORS.accent : APP_COLORS.textLight,
              padding: '5px 14px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}
