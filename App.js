import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import MuscleDashboard from './components/MuscleDashboard';
import { useGymData } from './useGymData';

export default function App() {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const { loading, getSessionsForMuscle, getVolumeBySession, getMuscleDates } = useGymData();

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
        onBack={() => setSelectedMuscle(null)}
      />
    );
  }

  return <LandingPage onMuscleClick={setSelectedMuscle} />;
}
