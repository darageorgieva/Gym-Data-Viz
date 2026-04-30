const NEGATIVE_STRONG = '#1f6f8b';
const NEGATIVE_MODERATE = '#6bb7c8';
const NEUTRAL = '#d6d8dc';
const POSITIVE_MODERATE = '#f29f67';
const POSITIVE_STRONG = '#c84c31';

export const PROGRESS_BINS = [
  { label: '<= -30%', min: Number.NEGATIVE_INFINITY, max: -30, color: NEGATIVE_STRONG },
  { label: '-30% to -10%', min: -30, max: -10, color: NEGATIVE_MODERATE },
  { label: '-10% to +10%', min: -10, max: 10, color: NEUTRAL },
  { label: '+10% to +30%', min: 10, max: 30, color: POSITIVE_MODERATE },
  { label: '>= +30%', min: 30, max: Number.POSITIVE_INFINITY, color: POSITIVE_STRONG },
];

export function getProgressColor(progressPercent) {
  if (progressPercent == null || Number.isNaN(progressPercent)) {
    return '#ececef';
  }

  if (progressPercent <= -30) return NEGATIVE_STRONG;
  if (progressPercent <= -10) return NEGATIVE_MODERATE;
  if (progressPercent < 10) return NEUTRAL;
  if (progressPercent < 30) return POSITIVE_MODERATE;
  return POSITIVE_STRONG;
}

