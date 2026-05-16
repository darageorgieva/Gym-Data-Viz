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
      fontFamily: "'Space Grotesk', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: isMobile ? '28px 16px 48px' : '48px 24px 80px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <h1 style={{ fontSize: isMobile ? '26px' : '36px', fontWeight: '800', color: APP_COLORS.text, margin: '0 0 10px' }}>
          Gym Progress Atlas
        </h1>
        <p style={{ fontSize: '14px', color: APP_COLORS.textLight, margin: 0, maxWidth: '420px' }}>
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
