import React, { useCallback, useEffect, useRef, useState } from 'react';
import LandingPage from './components/LandingPage';
import MuscleDashboard from './components/MuscleDashboard';
import { MUSCLE_CONFIG } from './config';
import { useGymData } from './useGymData';

function getMuscleFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const muscle = params.get('muscle');

  return muscle && MUSCLE_CONFIG[muscle] ? muscle : null;
}

function getUrlForMuscle(muscle) {
  const url = new URL(window.location.href);

  if (muscle) {
    url.searchParams.set('muscle', muscle);
  } else {
    url.searchParams.delete('muscle');
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

export default function App() {
  const [selectedMuscle, setSelectedMuscle] = useState(getMuscleFromUrl);
  const hasInAppHistoryRef = useRef(false);
  const { loading, getSessionsForMuscle, getVolumeBySession, getMuscleDates } = useGymData();

  useEffect(() => {
    window.history.replaceState({ muscle: getMuscleFromUrl() }, '', getUrlForMuscle(getMuscleFromUrl()));

    const handlePopState = () => {
      setSelectedMuscle(getMuscleFromUrl());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToMuscle = useCallback((muscle, { replace = false } = {}) => {
    const url = getUrlForMuscle(muscle);
    const state = { muscle };

    if (replace) {
      window.history.replaceState(state, '', url);
    } else {
      hasInAppHistoryRef.current = true;
      window.history.pushState(state, '', url);
    }

    setSelectedMuscle(muscle);
  }, []);

  const handleDashboardBack = useCallback(() => {
    if (hasInAppHistoryRef.current) {
      window.history.back();
      return;
    }

    navigateToMuscle(null, { replace: true });
  }, [navigateToMuscle]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FAFAF7',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        color: '#78716C',
      }}>
        Loading your training data...
      </div>
    );
  }

  if (selectedMuscle) {
    return (
      <MuscleDashboard
        muscle={selectedMuscle}
        sessions={getSessionsForMuscle(selectedMuscle)}
        volumeData={getVolumeBySession(selectedMuscle)}
        muscleDates={getMuscleDates(selectedMuscle)}
        onBack={handleDashboardBack}
      />
    );
  }

  return <LandingPage onMuscleClick={(muscle) => navigateToMuscle(muscle)} />;
}
