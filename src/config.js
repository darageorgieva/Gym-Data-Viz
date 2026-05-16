// ─────────────────────────────────────────────────────────────
// COLOR SYSTEM — 3-layer architecture
//
// Layer 1 — Functional anchors
//   Terracotta #B5451B  →  gains, PRs, brand, heatmap dark end
//   No cold anchor. The heatmap is sequential warm only —
//   light-to-dark terracotta. This avoids encoding a value
//   judgment (cold = bad) and keeps the full app warm/energetic.
//   Source: Bartram et al. 2017; Cairo 2016 (framing honesty).
//
// Layer 2 — 12 muscle categorical hues
//   Spread ~22° apart across the hue wheel.
//   No warm-red or blue-slate zones used — those are owned
//   by the terracotta accent and are avoided to prevent
//   channel collision with the heatmap.
//   Source: Healey 1996; Cairo 2016.
//
// Layer 3 — Stone neutrals
//   All structural UI. Zero hue on furniture.
//   Source: Tufte 1983; Few 2008.
// ─────────────────────────────────────────────────────────────

// Layer 1 — Functional accent
export const FUNCTIONAL_COLORS = {
  accent:      '#B5451B',  // terracotta — gains, PRs, play button, heatmap dark end
  accentLight: '#FAE8DF',  // terracotta tint — heatmap light end, button bg
};

// Layer 1 — Sequential warm heatmap scale (light → dark terracotta)
// Labels are qualitative, not numeric — the viewer reads intent,
// not a threshold they have to decode. Source: Cairo 2016.
// Matches PROGRESS_BINS in colorScale.js exactly.
export const PROGRESS_SCALE = [
  { label: 'Much less', color: '#FAE8DF' },
  { label: 'Less',      color: '#F0C4A8' },
  { label: 'Similar',   color: '#E09060' },
  { label: 'More',      color: '#C86030' },
  { label: 'Much more', color: '#B5451B' },
];

// No-data color for the heatmap — stone gray, distinct from the
// warm scale so "can't compare" reads differently from "trained less".
export const NO_DATA_COLOR = '#D4D2CC';

// Layer 2 — Muscle categorical hues
// Hue wheel positions: 38, 66, 94, 122, 150, 178, 230, 250, 270, 290, 310, 330
// Adjacent muscles in this list alternate halves of the available
// wheel arc so neighbouring items in the dropdown are visually distant.
export const MUSCLE_CONFIG = {
  Shoulders: {
    color:      '#C2913D',  // H=38°  gold
    colorLight: '#E8D4A8',
    exercise: 'Shoulder Press',
    label: 'Shoulders',
  },
  Chest: {
    color:      '#596AC0',  // H=230° periwinkle
    colorLight: '#B4BDE0',
    exercise: 'Pec Deck',
    label: 'Chest',
  },
  Biceps: {
    color:      '#A2AE3D',  // H=66°  yellow-green
    colorLight: '#D8E0A8',
    exercise: 'Dumbbell Curl',
    label: 'Biceps',
  },
  Abs: {
    color:      '#6756BD',  // H=250° blue-violet
    colorLight: '#BEBADE',
    exercise: 'Cable Crunch',
    label: 'Abs',
  },
  Quads: {
    color:      '#71AE42',  // H=94°  grass green
    colorLight: '#C0DCA4',
    exercise: 'Leg Extension',
    label: 'Quads',
  },
  Triceps: {
    color:      '#8551B8',  // H=270° purple
    colorLight: '#C8B8DA',
    exercise: 'Tricep Pushdown',
    label: 'Triceps',
  },
  Traps: {
    color:      '#46AF49',  // H=122° green
    colorLight: '#A8DCAC',
    exercise: 'Chest Supported Row',
    label: 'Traps',
  },
  Lats: {
    color:      '#A554B6',  // H=290° orchid
    colorLight: '#D4B8DA',
    exercise: 'Lat Pulldown',
    label: 'Lats',
  },
  'Rear Delts': {
    color:      '#46AF7A',  // H=150° sea green
    colorLight: '#A8DCCA',
    exercise: 'Rear Delt Pec Deck',
    label: 'Rear Delts',
  },
  Glutes: {
    color:      '#B851A7',  // H=310° magenta
    colorLight: '#DCBAD8',
    exercise: 'Hip Thrust',
    label: 'Glutes',
  },
  Hamstrings: {
    color:      '#47AEAA',  // H=178° cyan
    colorLight: '#A8D8D6',
    exercise: 'Seated Leg Curl',
    label: 'Hamstrings',
  },
  Calves: {
    color:      '#BC4E85',  // H=330° rose
    colorLight: '#DCB8CC',
    exercise: 'Calf Raise',
    label: 'Calves',
  },
};

// Layer 3 — Stone neutrals (structural only, no hue)
export const APP_COLORS = {
  background:     '#FFFFFF',
  cardBackground: '#FAFAF7',
  text:           '#1C1917',
  textLight:      '#78716C',
  border:         '#E7E5E0',
  cardShadow:     '0 2px 12px rgba(0,0,0,0.07)',
};