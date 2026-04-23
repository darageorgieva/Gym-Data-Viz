// Region ids come from public/model.svg path ids. Values must match MUSCLE_CONFIG keys.
// Use null for regions that still need a teammate to assign to the correct training group.
// TODO: Replace each null with the MUSCLE_CONFIG key for the exercise group that trains it.
export const SVG_REGION_TO_MUSCLE = {
  'front-right-chest': 'Chest',
  'front-left-chest': 'Chest',
  'left-trap': 'Traps',
  'right-trap': 'Traps',
  'front-left-shoulders': 'Shoulders',
  'front-right-shoulders': 'Shoulders',
  'front-left-biceps': 'Biceps',
  'front-right-biceps': 'Biceps',
  'front-left-side-abs': 'Abs',
  'front-right-side-abs': 'Abs',
  'front-left-lats': 'Lats',
  'front-right-lats': 'Lats',
  'front-left-abs4': 'Abs',
  'front-left-abs3': 'Abs',
  'front-left-abs2': 'Abs',
  'front-left-abs1': 'Abs',
  'front-right-abs4': 'Abs',
  'front-right-abs3': 'Abs',
  'front-right-abs2': 'Abs',
  'front-right-abs1': 'Abs',
  'front-upper-left-forearm': null,
  'front-upper-right-forearm': null,
  'front-lower-right-forearm': null,
  'front-lower-left-forearm': null,
  'front-left-quads': 'Quads',
  'front-right-quads': 'Quads',
  'front-left-inner-thighs': null,
  'front-right-inner-thighs': null,
  'front-left-calf2': 'Calves',
  'front-left-calf1': 'Calves',
  'front-right-calf2': 'Calves',
  'front-right-calf1': 'Calves',
  'back-right-traps': 'Traps',
  'back-left-traps': 'Traps',
  'back-left-rhomboids': null,
  'back-right-rhomboids': null,
  'back-left-shoulders': 'Shoulders',
  'back-right-shoulders': 'Shoulders',
  'back-left-teres': null,
  'back-right-teres': null,
  'back-left-some-muscle': null, // just above the teres
  'back-right-some-muscle': null, // just above the teres
  'back-left-triceps': 'Triceps',
  'back-right-triceps': 'Triceps',
  'back-left-lats': 'Lats',
  'back-right-lats': 'Lats',
  'back-left-oblique': null,
  'back-right-oblique': null,
  'back-left-forearm1': null,
  'back-right-forearm1': null,
  'back-left-forearm2': null,
  'back-right-forearm2': null,
  'back-left-glute2': 'Glutes',
  'back-right-glute2': 'Glutes',
  'back-left-glute1': 'Glutes',
  'back-right-glute1': 'Glutes',
  'back-left-hamstring': 'Hamstrings',
  'back-right-hamstring': 'Hamstrings',
  'back-left-calf': 'Calves',
  'back-right-calf': 'Calves',
};

export function getMuscleForRegion(regionId) {
  return SVG_REGION_TO_MUSCLE[regionId] || null;
}

export function isKnownSvgRegion(regionId) {
  return Object.prototype.hasOwnProperty.call(SVG_REGION_TO_MUSCLE, regionId);
}
