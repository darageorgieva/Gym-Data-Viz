import React, { useMemo } from 'react';
import { MUSCLE_CONFIG, APP_COLORS, FLOURISH_URLS } from '../config';
import { useIsMobile } from '../useIsMobile';

const cardStyle = {
  background: APP_COLORS.cardBackground,
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '20px',
};

function PRBadge({ value, color }) {
  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: color,
      borderRadius: '16px',
      padding: '20px 32px',
      minWidth: '140px',
    }}>
      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1C1917', opacity: 0.7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Personal Record</span>
      <span style={{ fontSize: '48px', fontWeight: '800', color: '#1C1917', lineHeight: 1.1 }}>{value}</span>
      <span style={{ fontSize: '16px', fontWeight: '500', color: '#1C1917', opacity: 0.7 }}>kg</span>
    </div>
  );
}

function ChartCard({ title, url }) {
  return (
    <div style={cardStyle}>
      <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#1C1917' }}>{title}</h3>
      {url ? (
        <iframe
          src={url}
          style={{ width: '100%', height: '450px', border: 'none', display: 'block' }}
          allowFullScreen
          title={title}
        />
      ) : (
        <div style={{ height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '14px', color: APP_COLORS.textLight }}>Visualization coming soon</span>
        </div>
      )}
    </div>
  );
}

export default function MuscleDashboard({ muscle, sessions, onBack }) {
  const isMobile = useIsMobile();
  const config = MUSCLE_CONFIG[muscle];
  const { color, colorLight, exercise, label } = config;
  const urls = FLOURISH_URLS[muscle] || {};

  const pr = useMemo(() => Math.max(...sessions.map(s => s.weight_kg)), [sessions]);
  const startWeight = sessions[0]?.weight_kg || 0;
  const totalGain = pr - startWeight;

  return (
    <div style={{
      minHeight: '100vh',
      background: APP_COLORS.background,
      padding: '0 0 60px 0',
      fontFamily: "'Arial', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: color,
        padding: isMobile ? '16px 16px 14px' : '28px 40px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.4)',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 18px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1C1917',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← Back
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{exercise}</div>
          <div style={{ fontSize: isMobile ? '22px' : '32px', fontWeight: '800', color: '#1C1917' }}>{label}</div>
        </div>
        <div style={{ width: '80px' }} />
      </div>

      <div style={{ padding: isMobile ? '16px 12px' : '28px 32px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Stats row */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', marginBottom: '20px' }}>
          <PRBadge value={pr} color={color} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ ...cardStyle, marginBottom: 0, display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#78716C', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Starting Weight</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#1C1917' }}>{startWeight} <span style={{ fontSize: '14px', color: '#78716C' }}>kg</span></div>
              </div>
              <div style={{ fontSize: '28px', color: colorLight }}>→</div>
              <div>
                <div style={{ fontSize: '12px', color: '#78716C', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Gain</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: color }}>+{totalGain.toFixed(2)} <span style={{ fontSize: '14px', color: '#78716C' }}>kg</span></div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#78716C', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sessions</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#1C1917' }}>{sessions.length}</div>
              </div>
            </div>
          </div>
        </div>

        <ChartCard title="Weight Progression" url={urls.weight} />
        <ChartCard title="Training Consistency" url={urls.heatmap} />
        <ChartCard title="Reps in Reserve (RIR)" url={urls.rir} />
        <ChartCard title="Training Volume" url={urls.volume} />
        <ChartCard title="Training Intensity (RPE)" url={urls.rpe} />

      </div>
    </div>
  );
}
