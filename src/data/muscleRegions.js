import { SVG_REGION_TO_MUSCLE } from '../muscleRegionConfig';

export const REGION_TO_MUSCLE = SVG_REGION_TO_MUSCLE;

export const MUSCLE_TO_REGIONS = Object.entries(REGION_TO_MUSCLE).reduce((acc, [regionId, muscle]) => {
  if (!muscle) return acc;
  if (!acc[muscle]) acc[muscle] = [];
  acc[muscle].push(regionId);
  return acc;
}, {});

export function getRegionSide(regionId) {
  return regionId.startsWith('back-') ? 'back' : 'front';
}

