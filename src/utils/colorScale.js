// Sequential warm scale — light to dark terracotta.
//
// Design rationale:
// A diverging scale (cold ↔ warm) encodes a value judgment: blue end = bad,
// red end = good. But lower volume week-over-week is not failure — it may be
// a deload, recovery, or life happening. A sequential warm scale says
// "you trained less / more" without implying you went backwards.
//
// Labels keep the percentage thresholds for truthfulness — the viewer needs
// the number to calibrate the encoding — but pair them with a qualitative
// read so the intent is immediately legible without mental arithmetic.
//
// Null / NaN → stone gray: distinct from the warm scale, signals
// "no comparison available" (e.g. muscle had zero volume 4 weeks ago
// so the reference week doesn't exist). The absence of data is not
// the same as a low-training week and should not look like one.
//
// Bin boundaries match the original colorScale.js to preserve
// continuity. Only colors and labels change.

// we have a hue-sequential palette with a strong monotonic luminance gradient
//  which is generally robust across common forms of color vision deficiency because 
// the encoding depends primarily on lightness rather than hue discrimination.


const NO_DATA      = '#E7E5E0';  // stone — no comparison possible

const MUCH_LESS    = '#F0C4A8';  // ≤ −30%:        much less than before
const LESS         = '#E09060';  // −30% to −10%:  less than before
const SIMILAR      = '#C86030';  // −10% to +10%:  about the same
const MORE         = '#B5451B';  // +10% to +30%:  more than before
const MUCH_MORE    = '#7A2410';  // ≥ +30%:        much more — full terracotta

// const MUCH_LESS = '#FAE8DF';  // H=18, S=60%, L=93% — warm white tint
// const LESS      = '#EDAF90';  // H=20, S=65%, L=74% — light terracotta
// const SIMILAR   = '#D4784A';  // H=18, S=62%, L=55% — true terracotta midpoint
// const MORE      = '#B5451B';  // H=16, S=73%, L=41% — your anchor, classic terracotta
// const MUCH_MORE = '#8C3210';  // H=15, S=70%, L=30% — dark terracotta, still earthy

export const PROGRESS_BINS = [
  { label: '≤ 30% less',  min: Number.NEGATIVE_INFINITY, max: -30, color: MUCH_LESS  },
  { label: '10–30% less',       min: -30,                      max: -10, color: LESS       },
  { label: '±10% (similar)',    min: -10,                      max:  10, color: SIMILAR    },
  { label: '10–30% more',       min:  10,                      max:  30, color: MORE       },
  { label: '≥ 30% more',  min:  30, max: Number.POSITIVE_INFINITY, color: MUCH_MORE  },
];

export function getProgressColor(progressPercent) {
  if (progressPercent == null || Number.isNaN(progressPercent)) return NO_DATA;
  if (progressPercent <= -30) return MUCH_LESS;
  if (progressPercent <= -10) return LESS;
  if (progressPercent <   10) return SIMILAR;
  if (progressPercent <   30) return MORE;
  return MUCH_MORE;
}