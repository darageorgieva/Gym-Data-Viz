import { MUSCLE_CONFIG } from '../config';

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

function startOfWeek(dateValue) {
  const date = new Date(dateValue);
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utc.getUTCDay();
  const diff = (day + 6) % 7;
  utc.setUTCDate(utc.getUTCDate() - diff);
  return utc;
}

function toWeekKey(dateValue) {
  return startOfWeek(dateValue).toISOString().slice(0, 10);
}

function addWeeks(weekKey, count) {
  const date = new Date(`${weekKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + count * 7);
  return date.toISOString().slice(0, 10);
}

function buildAllWeekKeys(minWeekKey, maxWeekKey) {
  if (!minWeekKey || !maxWeekKey) return [];

  const weeks = [];
  let current = minWeekKey;
  while (current <= maxWeekKey) {
    weeks.push(current);
    current = addWeeks(current, 1);
  }
  return weeks;
}

function calculateWeekNumber(minWeekKey, weekKey) {
  const start = new Date(`${minWeekKey}T00:00:00Z`).getTime();
  const current = new Date(`${weekKey}T00:00:00Z`).getTime();
  return Math.floor((current - start) / MS_PER_WEEK) + 1;
}

export function createMuscleTimeSeries(rows) {
  const filteredRows = rows.filter((row) => row.date && row.muscle_group);
  if (!filteredRows.length) {
    return {
      weekLabels: [],
      muscleTimeSeries: {},
      availableWeeks: [],
      maxWeek: 0,
    };
  }

  const rowsByWeekAndMuscle = {};
  let minWeekKey = null;
  let maxWeekKey = null;

  filteredRows.forEach((row) => {
    const weekKey = toWeekKey(row.date);
    minWeekKey = !minWeekKey || weekKey < minWeekKey ? weekKey : minWeekKey;
    maxWeekKey = !maxWeekKey || weekKey > maxWeekKey ? weekKey : maxWeekKey;

    if (!rowsByWeekAndMuscle[weekKey]) rowsByWeekAndMuscle[weekKey] = {};
    if (!rowsByWeekAndMuscle[weekKey][row.muscle_group]) {
      rowsByWeekAndMuscle[weekKey][row.muscle_group] = 0;
    }

    rowsByWeekAndMuscle[weekKey][row.muscle_group] += (row.weight_kg || 0) * (row.reps || 0) * (row.sets || 1);
  });

  const weekKeys = buildAllWeekKeys(minWeekKey, maxWeekKey);
  const muscleTimeSeries = Object.keys(MUSCLE_CONFIG).reduce((acc, muscle) => {
    acc[muscle] = weekKeys.map((weekKey) => ({
      week: calculateWeekNumber(minWeekKey, weekKey),
      weekKey,
      volumeKg: rowsByWeekAndMuscle[weekKey]?.[muscle] || 0,
    }));
    return acc;
  }, {});

  const weekLabels = weekKeys.map((weekKey) => ({
    week: calculateWeekNumber(minWeekKey, weekKey),
    weekKey,
    label: new Date(`${weekKey}T00:00:00Z`).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    }),
  }));

  return {
    weekLabels,
    muscleTimeSeries,
    availableWeeks: weekLabels.map((item) => item.week),
    maxWeek: weekLabels.length,
  };
}

export function calculateBaseline(series, baselineWeeks = 4) {
  const available = (series || []).filter((point) => point.volumeKg > 0).slice(0, baselineWeeks);
  if (!available.length) return null;

  const baseline = available.reduce((sum, point) => sum + point.volumeKg, 0) / available.length;
  return baseline > 0 ? baseline : null;
}

export function calculateRollingVolume(series, selectedWeek, windowSize = 4) {
  if (!series?.length || selectedWeek == null) return null;

  const selectedIndex = series.findIndex((point) => point.week === selectedWeek);
  if (selectedIndex === -1) return null;

  const startIndex = Math.max(0, selectedIndex - windowSize + 1);
  const window = series.slice(startIndex, selectedIndex + 1);
  if (!window.length) return null;

  return window.reduce((sum, point) => sum + point.volumeKg, 0) / window.length;
}

export function calculateProgressPercent(series, selectedWeek) {
  const baseline = calculateBaseline(series);
  if (!baseline) return 0;

  const rollingVolume = calculateRollingVolume(series, selectedWeek);
  if (rollingVolume == null) return 0;

  return (100 * (rollingVolume - baseline)) / baseline;
}

export function getMuscleProgressByWeek(muscleTimeSeries, selectedWeek) {
  return Object.entries(muscleTimeSeries || {}).reduce((acc, [muscle, series]) => {
    acc[muscle] = calculateProgressPercent(series, selectedWeek);
    return acc;
  }, {});
}

