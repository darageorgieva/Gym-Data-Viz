import React from 'react';
import BodySVG from './BodySVG';
import { MUSCLE_CONFIG, APP_COLORS } from '../config';
import { useIsMobile } from '../useIsMobile';

export default function LandingPage({ onMuscleClick }) {
  const isMobile = useIsMobile();

  return (
    <div style={{
      minHeight: '100vh',
      background: APP_COLORS.background,
      fontFamily: "'Arial', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: isMobile ? '28px 16px 48px' : '48px 24px 80px',
    }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#78716C', marginBottom: '8px' }}>
          Data Selfie · 6 Month Journey
        </div>
        <h1 style={{ fontSize: isMobile ? '26px' : '36px', fontWeight: '800', color: '#1C1917', margin: '0 0 10px' }}>
          My Training Progress
        </h1>
        <p style={{ fontSize: '14px', color: '#78716C', margin: 0, maxWidth: '420px' }}>
          Click on a muscle to explore your 6-month progression, consistency, and intensity data.
        </p>
      </div>

      {/* Muscle legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
        maxWidth: '520px',
        marginBottom: '36px',
      }}>
        {Object.entries(MUSCLE_CONFIG).map(([muscle, config]) => (
          <button
            key={muscle}
            onClick={() => onMuscleClick(muscle)}
            style={{
              background: config.colorLight,
              border: `1.5px solid ${config.color}`,
              borderRadius: '20px',
              padding: '5px 14px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#1C1917',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.target.style.background = config.color;
            }}
            onMouseLeave={e => {
              e.target.style.background = config.colorLight;
            }}
          >
            {muscle}
          </button>
        ))}
      </div>

      {/* Body SVG */}
      <BodySVG onMuscleClick={onMuscleClick} />

      {/* Footer hint */}
      <p style={{ marginTop: '40px', fontSize: '13px', color: '#A8A29E', textAlign: 'center' }}>
        Hover to preview · Click to explore
      </p>
    </div>
  );
}
