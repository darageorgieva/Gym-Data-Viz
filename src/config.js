export const MUSCLE_CONFIG = {
  Shoulders: {
    color: '#4F9DBD',
    colorLight: '#AAD4E6',
    exercise: 'Shoulder Press',
    label: 'Shoulders',
  },
  Chest: {
    color: '#E8705E',
    colorLight: '#F5BAB2',
    exercise: 'Pec Deck',
    label: 'Chest',
  },
  Biceps: {
    color: '#45AA8E',
    colorLight: '#A6D5CA',
    exercise: 'Dumbbell Curl',
    label: 'Biceps',
  },
  Abs: {
    color: '#F4B620',
    colorLight: '#FADE80',
    exercise: 'Cable Crunch',
    label: 'Abs',
  },
  Quads: {
    color: '#9080CE',
    colorLight: '#C8BCE8',
    exercise: 'Leg Extension',
    label: 'Quads',
  },
  Triceps: {
    color: '#E89040',
    colorLight: '#F5CCA0',
    exercise: 'Tricep Pushdown',
    label: 'Triceps',
  },
  Traps: {
    color: '#B09860',
    colorLight: '#D8C8A0',
    exercise: 'Chest Supported Row',
    label: 'Traps',
  },
  Lats: {
    color: '#44A870',
    colorLight: '#A2D4BA',
    exercise: 'Lat Pulldown',
    label: 'Lats',
  },
  'Rear Delts': {
    color: '#58A8CE',
    colorLight: '#ACD4E6',
    exercise: 'Rear Delt Pec Deck',
    label: 'Rear Delts',
  },
  Glutes: {
    color: '#E87090',
    colorLight: '#F5B8C8',
    exercise: 'Hip Thrust',
    label: 'Glutes',
  },
  Hamstrings: {
    color: '#D47840',
    colorLight: '#ECBCA0',
    exercise: 'Seated Leg Curl',
    label: 'Hamstrings',
  },
  Calves: {
    color: '#7CB860',
    colorLight: '#BED8B0',
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
  background: '#FFFFFF',
  cardBackground: '#FFFFFF',
  text: '#0D0D0D',
  textLight: '#6B7280',
  border: '#E5E7EB',
  accent: '#FF5C3A',
  cardShadow: '0 2px 12px rgba(0,0,0,0.07)',
};
