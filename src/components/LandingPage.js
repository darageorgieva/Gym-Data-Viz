import React from 'react';
import { APP_COLORS } from '../config';
import { useIsMobile } from '../useIsMobile';
import BodyHeatmap from './BodyHeatmap';

export default function LandingPage({ onMuscleClick, muscleTimeSeries, weekLabels }) {
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
          Explore your 6-month training progression across every muscle group.
        </p>
      </div>

      <BodyHeatmap
        muscleTimeSeries={muscleTimeSeries}
        weekLabels={weekLabels}
        onMuscleSelect={onMuscleClick}
      />
    </div>
  );
}
