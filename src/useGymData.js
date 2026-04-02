import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export function useGymData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse(process.env.PUBLIC_URL + '/gym_data.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        setData(results.data.filter(row => row.date));
        setLoading(false);
      },
    });
  }, []);

  function getMuscleData(muscleGroup) {
    return data.filter(row => row.muscle_group === muscleGroup);
  }

  function getSessionsForMuscle(muscleGroup) {
    const muscleRows = getMuscleData(muscleGroup);
    const byDate = {};
    muscleRows.forEach(row => {
      if (!byDate[row.date]) {
        byDate[row.date] = {
          date: row.date,
          weight_kg: row.weight_kg,
          reps: row.reps,
          rpe: row.rpe,
          rir: row.rir,
          session_duration_minutes: row.session_duration_minutes,
        };
      }
    });
    return Object.values(byDate).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  function getVolumeBySession(muscleGroup) {
    const muscleRows = getMuscleData(muscleGroup);
    const byDate = {};
    muscleRows.forEach(row => {
      if (!byDate[row.date]) byDate[row.date] = { date: row.date, volume: 0 };
      byDate[row.date].volume += row.weight_kg * row.reps;
    });
    return Object.values(byDate).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  function getPersonalRecord(muscleGroup) {
    const sessions = getSessionsForMuscle(muscleGroup);
    if (!sessions.length) return null;
    return Math.max(...sessions.map(s => s.weight_kg));
  }

  function getAllTrainingDates() {
    const dates = [...new Set(data.map(r => r.date))];
    return dates.sort();
  }

  function getMuscleDates(muscleGroup) {
    const muscleRows = getMuscleData(muscleGroup);
    return [...new Set(muscleRows.map(r => r.date))];
  }

  return {
    data,
    loading,
    getSessionsForMuscle,
    getVolumeBySession,
    getPersonalRecord,
    getAllTrainingDates,
    getMuscleDates,
  };
}
