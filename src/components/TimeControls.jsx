import React from 'react';
import { APP_COLORS } from '../config';

export default function TimeControls({
  selectedWeek,
  maxWeek,
  isPlaying,
  onWeekChange,
  onTogglePlay,
  currentWeekLabel,
}) {
  return (
    <div style={{
      width: 'min(920px, 100%)',
      background: '#F0EDE8',
      border: `1px solid ${APP_COLORS.border}`,
      borderRadius: '18px',
      padding: '18px 18px 14px',
      marginBottom: '20px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '14px',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={onTogglePlay}
          style={{
            border: 'none',
            borderRadius: '999px',
            background: '#1C1917',
            color: '#FAFAF7',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            minWidth: '92px',
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <div style={{ color: '#1C1917', fontSize: '14px', fontWeight: '700' }}>
          Week {selectedWeek}
          <span style={{ color: '#78716C', fontWeight: '500', marginLeft: '8px' }}>
            {currentWeekLabel}
          </span>
        </div>
      </div>

      <input
        type="range"
        min={1}
        max={Math.max(1, maxWeek)}
        step={1}
        value={selectedWeek}
        onChange={(event) => onWeekChange(Number(event.target.value))}
        style={{ width: '100%', accentColor: '#c84c31' }}
      />
    </div>
  );
}

