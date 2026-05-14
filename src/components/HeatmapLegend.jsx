import React from 'react';
import { APP_COLORS } from '../config';
import { PROGRESS_BINS } from '../utils/colorScale';

const MODE_DESCRIPTIONS = {
  'week-vs-month': 'Each week compared against the same week one month earlier.',
  'rolling': '4-week rolling average compared against the previous 4-week rolling average.',
  'baseline': '4-week rolling average compared against your first 4 weeks of training.',
};

export default function HeatmapLegend({ comparisonMode = 'week-vs-month' }) {
  return (
    <div style={{
      width: 'min(920px, 100%)',
      background: '#F0EDE8',
      border: `1px solid ${APP_COLORS.border}`,
      borderRadius: '18px',
      padding: '18px',
      marginTop: '18px',
    }}>
      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1C1917', marginBottom: '8px' }}>
        Progress Legend
      </div>
      <div style={{ color: '#78716C', fontSize: '13px', marginBottom: '14px' }}>
        {MODE_DESCRIPTIONS[comparisonMode]}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '10px',
      }}>
        {PROGRESS_BINS.map((bin) => (
          <div
            key={bin.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#FAFAF7',
              borderRadius: '12px',
              padding: '10px 12px',
            }}
          >
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '6px',
              background: bin.color,
              flexShrink: 0,
            }} />
            <span style={{ fontSize: '12px', color: '#1C1917', fontWeight: '600' }}>
              {bin.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

