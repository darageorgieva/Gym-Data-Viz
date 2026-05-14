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
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ fontSize: '13px', fontWeight: '700', color: APP_COLORS.text, marginBottom: '6px' }}>
        Progress Legend
      </div>
      <div style={{ color: APP_COLORS.textLight, fontSize: '13px', marginBottom: '16px', lineHeight: 1.5 }}>
        {MODE_DESCRIPTIONS[comparisonMode]}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {PROGRESS_BINS.map((bin) => (
          <div
            key={bin.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '4px',
              background: bin.color,
              flexShrink: 0,
            }} />
            <span style={{ fontSize: '13px', color: APP_COLORS.text, fontWeight: '500' }}>
              {bin.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
