export const MUSCLE_CONFIG = {
  Shoulders: {
    color: '#89B4C7',
    colorLight: '#C4DCE8',
    exercise: 'Shoulder Press',
    label: 'Shoulders',
  },
  Chest: {
    color: '#E8A598',
    colorLight: '#F4D4CE',
    exercise: 'Pec Deck',
    label: 'Chest',
  },
  Biceps: {
    color: '#7FB5A0',
    colorLight: '#BFDAD2',
    exercise: 'Dumbbell Curl',
    label: 'Biceps',
  },
  Abs: {
    color: '#F2C879',
    colorLight: '#F9E4BC',
    exercise: 'Cable Crunch',
    label: 'Abs',
  },
  Quads: {
    color: '#B8A9D4',
    colorLight: '#DCD4EC',
    exercise: 'Leg Extension',
    label: 'Quads',
  },
  Triceps: {
    color: '#E8C4A0',
    colorLight: '#F4E2CE',
    exercise: 'Tricep Pushdown',
    label: 'Triceps',
  },
  Traps: {
    color: '#C4B89A',
    colorLight: '#E2DCCC',
    exercise: 'Chest Supported Row',
    label: 'Traps',
  },
  Lats: {
    color: '#94B8A0',
    colorLight: '#CADCD2',
    exercise: 'Lat Pulldown',
    label: 'Lats',
  },
  'Rear Delts': {
    color: '#A8C4D4',
    colorLight: '#D4E2EC',
    exercise: 'Rear Delt Pec Deck',
    label: 'Rear Delts',
  },
  Glutes: {
    color: '#E8B4C0',
    colorLight: '#F4DAE0',
    exercise: 'Hip Thrust',
    label: 'Glutes',
  },
  Hamstrings: {
    color: '#D4A574',
    colorLight: '#EACFB2',
    exercise: 'Seated Leg Curl',
    label: 'Hamstrings',
  },
  Calves: {
    color: '#B4C4A8',
    colorLight: '#DAE2D4',
    exercise: 'Calf Raise',
    label: 'Calves',
  },
};

const BASE_WEIGHT_URL = 'https://flo.uri.sh/visualisation/28962149/embed';

export const FLOURISH_URLS = {
  Shoulders:    { weight: `${BASE_WEIGHT_URL}#muscle=Shoulder+Press`,       heatmap: null, rir: null, volume: null, rpe: null },
  Chest:        { weight: `${BASE_WEIGHT_URL}#muscle=Pec+Deck`,             heatmap: null, rir: null, volume: null, rpe: null },
  Biceps:       { weight: `${BASE_WEIGHT_URL}#muscle=Dumbbell+Curl`,        heatmap: null, rir: null, volume: null, rpe: null },
  Abs:          { weight: `${BASE_WEIGHT_URL}#muscle=Cable+Crunch`,         heatmap: null, rir: null, volume: null, rpe: null },
  Quads:        { weight: `${BASE_WEIGHT_URL}#muscle=Leg+Extension`,        heatmap: null, rir: null, volume: null, rpe: null },
  Triceps:      { weight: `${BASE_WEIGHT_URL}#muscle=Tricep+Pushdown`,      heatmap: null, rir: null, volume: null, rpe: null },
  Traps:        { weight: `${BASE_WEIGHT_URL}#muscle=Chest+Supported+Row`,  heatmap: null, rir: null, volume: null, rpe: null },
  Lats:         { weight: `${BASE_WEIGHT_URL}#muscle=Lat+Pulldown`,         heatmap: null, rir: null, volume: null, rpe: null },
  'Rear Delts': { weight: `${BASE_WEIGHT_URL}#muscle=Rear+Delt+Pec+Deck`,  heatmap: null, rir: null, volume: null, rpe: null },
  Glutes:       { weight: `${BASE_WEIGHT_URL}#muscle=Hip+Thrust`,           heatmap: null, rir: null, volume: null, rpe: null },
  Hamstrings:   { weight: `${BASE_WEIGHT_URL}#muscle=Seated+Leg+Curl`,      heatmap: null, rir: null, volume: null, rpe: null },
  Calves:       { weight: `${BASE_WEIGHT_URL}#muscle=Calf+Raise`,           heatmap: null, rir: null, volume: null, rpe: null },
};

export const APP_COLORS = {
  background: '#FAFAF7',
  cardBackground: '#F0EDE8',
  text: '#1C1917',
  textLight: '#78716C',
  border: '#E7E5E0',
};
