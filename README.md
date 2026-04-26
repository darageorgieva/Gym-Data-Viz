# Gym Data Viz - ITU Data Visualization Semester Project

A personal data visualization web app tracking 6 months of gym training (October 2024 – March 2025).
Built with React + Recharts. Submitted as part of the ITU Data Visualization course exam (deadline: 29 May).

**Live entry point:** Interactive anatomy diagram → per-muscle dashboard

---

## Dataset

`public/gym_data.csv` - self-recorded workout log with one row per exercise per session.

| Field | Description |
|---|---|
| `date` | Session date |
| `muscle_group` | One of 12 tracked muscle groups |
| `exercise_name` | Specific exercise performed |
| `weight_kg` | Load lifted |
| `reps` | Repetitions per set |
| `sets` | Number of sets |
| `rpe` | Rate of Perceived Exertion (1–10) |
| `rir` | Reps in Reserve (0 = max effort) |
| `session_duration_minutes` | Total session length |

12 muscle groups: Shoulders, Chest, Biceps, Abs, Quads, Triceps, Traps, Lats, Rear Delts, Glutes, Hamstrings, Calves.

---

## What's built

### Landing page
- Interactive SVG body diagram with clickable muscle regions - spatial encoding maps anatomy to data
- Muscle legend pills (hover highlights, click navigates)
- URL query param routing (`?muscle=Biceps`) preserves browser history

### Per-muscle dashboard (`MuscleDashboard`)
Each muscle group has its own themed dashboard with:

| Chart | Type | Encodes |
|---|---|---|
| Weight Progression | Line chart | Weight (kg) over time |
| Training Consistency | Calendar heatmap | Session presence by date |
| Training Volume | Bar chart | `weight × reps` per session |
| Reps in Reserve (RIR) | Line chart | Proximity to max effort over time |
| Training Intensity (RPE) | Bar chart | Perceived exertion per session |

Stats cards: Personal Record (PR), Starting Weight, Total Gain, Session Count.

---

## Tech stack

| Library | Purpose |
|---|---|
| React 18.2 | UI framework |
| Recharts 2.8 | Line and bar charts |
| PapaParse 5.4 | CSV parsing |
| Custom SVG | Anatomy diagram |

No CSS framework - all styles are inline React. Color system defined in `src/config.js` with 12 muscle-specific color pairs (primary + light tint).

---

## Cairo's five qualities - applied here

Alberto Cairo's *The Truthful Art* defines good visualization along five axes. Here's how each applies:

**Truthful** - data is self-recorded and unprocessed; no smoothing or normalization is applied to weight or volume. The heatmap shows raw session presence, not a derived "consistency score." The one risk: RPE and RIR are subjective metrics - this is acknowledged in the chart subtitles.

**Functional** - chart type is chosen for the data shape. Weight over time uses a line (continuous progression). Volume per session uses bars (discrete events). The heatmap uses a calendar grid because the temporal pattern (which days of the week, which weeks) is itself meaningful.

**Beautiful** - muted, warm palette (beige background `#FAFAF7`, stone text `#1C1917`). Each muscle gets a distinct desaturated hue that stays readable at small sizes. The anatomy diagram serves as a non-standard but intuitive entry point.

**Insightful** - the RIR chart is the most insightful: it reveals whether effort was increasing even when weight plateaued, a pattern invisible in the weight progression chart alone. The heatmap reveals training gaps and frequency shifts across the 6 months.

**Enlightening** - the "data selfie" framing: this is one person's body, one person's effort, visualized as a story arc. The anatomy diagram makes the subject matter immediately legible to anyone.

---

## Design decisions worth discussing at the oral exam

**12 color categories**
Cairo recommends ≤7 categories for color encoding. Here we have 12 muscle groups. Mitigation: colors are only ever compared within a single muscle's dashboard (never all 12 on one chart), so the limit applies to the landing page legend only - where spatial position (the body diagram) carries the primary encoding and color is secondary reinforcement.

**Line chart for weight progression**
A line implies continuous change between measurements. Gym sessions are discrete events. The choice was made deliberately: the trend (are you getting stronger over time?) is more important than session-by-session comparison, and a line communicates trend more clearly than a scatter or bar. This is a defensible trade-off, not an oversight.

**Bar chart for volume**
Volume (`weight × reps`) is a derived metric, not a raw observation. Using bars (discrete, atomic) rather than a line correctly signals that each session stands alone - there's no meaningful interpolation between two volume measurements.

**RPE and RIR as "Advanced" metrics**
Labeled as such in the UI to signal that these require domain knowledge to interpret correctly. The chart subtitles provide one-line explanations. This is a deliberate accessibility choice.

**Interactive anatomy vs. dropdown**
A dropdown with 12 muscle names is cognitively identical to reading a list. The anatomy SVG reduces lookup cost by letting the user point at their own body - spatial memory replaces label scanning. Trade-off: it adds implementation complexity and requires that the SVG regions map correctly to muscle groups.

**URL-based navigation**
`?muscle=Biceps` in the query string means browser back/forward works naturally and a specific muscle dashboard can be bookmarked or linked. Small implementation cost for a significant UX improvement.

---

## Next steps (prioritized for exam value)

Ordered by how much distinct exam material they add.

### 1. Scatter plot: Volume vs RPE per session - HIGH PRIORITY

**What it shows:** Plot total volume (y-axis) against RPE (x-axis) for every session, colored by muscle group. Reveals whether you work harder *and* more, or whether high-effort sessions are actually lower volume (fatigue-driven).

**Why it matters for Cairo:** This is the most *insightful* chart the dataset supports. It encodes a relationship, not just a trend - the only chart type that can show whether two variables move together.

**Oral exam angle:** Why scatter over two separate line charts? What does the cluster shape tell you? Is there a correlation?

**Implementation notes:**
- Add `getScatterData()` to `useGymData.js` - returns `{ volume, rpe, date, muscle }` per session
- New component `VolumeRPEScatter.js` using Recharts `ScatterChart`
- One point per session, colored by `MUSCLE_CONFIG[muscle].color`
- Can live on the landing page as a cross-muscle overview, or per-muscle dashboard

---

### 2. Small multiples: Weight progression for all muscles - HIGH PRIORITY

**What it shows:** 12 mini line charts on a single screen, one per muscle, all on the same time axis. Makes cross-muscle comparison immediate - which muscles improved fastest, which plateaued.

**Why it matters for Cairo:** Small multiples are one of Cairo's most-cited techniques. They eliminate the need for interaction to compare, making the comparison itself the visualization.

**Oral exam angle:** Why small multiples instead of one chart with 12 colored lines? (Answer: 12 lines on one chart is unreadable - color overload and overlapping paths make it impossible to follow any single trend.)

**Implementation notes:**
- New `SmallMultiplesView` component rendered on the landing page or as a toggle view
- Map `MUSCLE_CONFIG` entries, render a `<ResponsiveContainer>` + `<LineChart>` per muscle in a CSS grid (3×4 or 4×3)
- Normalize y-axis to percentage of PR so all charts are comparable across muscles with very different weight ranges

---

### 3. Bump/rank chart: Monthly training focus - MEDIUM PRIORITY

**What it shows:** For each month (Oct–Mar), rank muscles by session count. Show how rankings shift month over month as a "bump chart" - connected rank lines per muscle.

**Why it matters for Cairo:** Uses position (rank) as the primary encoding rather than length or color. Surfaces periodization - did training focus deliberately shift over time?

**Oral exam angle:** When is ranking more honest than raw counts? (Answer: when absolute differences are small but the ordering is meaningful, or when comparing across different scales.)

**Implementation notes:**
- `getRankingByMonth()` in `useGymData.js` - group sessions by month and muscle, count, then rank
- No Recharts primitive for bump charts - draw with SVG lines connecting rank positions across months, or approximate with a `LineChart` where `dataKey` is the rank value (inverted y-axis)

---

### 4. Rest interval chart - MEDIUM PRIORITY

**What it shows:** For a given muscle, bars showing the number of days since the last session. Shows whether recovery time was consistent or erratic over the 6 months.

**Why it matters for Cairo:** Adds a dimension none of the current charts address - the *gap* between sessions, not session presence. The heatmap shows where you trained; this shows where you didn't.

**Oral exam angle:** Why is this more honest than frequency? What does a long bar tell you that the heatmap doesn't? (Answer: the heatmap can look "full" even if the pattern is irregular; rest intervals expose the actual recovery behavior.)

**Implementation notes:**
- `getRestIntervals(muscleGroup)` in `useGymData.js` - sort session dates, compute `date[i] - date[i-1]` in days
- Bar chart added inside `MuscleDashboard`, positioned near the heatmap

---

### 5. Heatmap: volume intensity shading - LOWER PRIORITY

**What it shows:** Currently the heatmap uses binary presence/absence. Change cell color intensity to encode total volume on that day - a true heat map.

**Why it matters for Cairo:** More truthful - "trained" is not binary; a 60-minute high-volume session and a 20-minute light session look identical in the current implementation.

**Implementation notes:**
- `getVolumeByDate(muscleGroup)` - extend the existing `getVolumeBySession` to return a date-keyed map
- Map volume to an opacity scale (0.2–1.0) or lightness scale using the existing `color`/`colorLight` values in `MUSCLE_CONFIG`

---

## Paper structure suggestion

The submission is max 4 physical pages: 1 text + 3 visualization pages.

**Page 1 - Text**
- Dataset: personal gym log, 6 months, 12 muscles, 8 variables per session; framed as a "data selfie"
- Design philosophy: Cairo's 5 qualities applied with specific examples from the app
- Interaction design rationale: anatomy SVG entry point, URL routing, per-muscle theming
- Honest limitation: RPE and RIR are subjective; single subject; no statistical inference possible

**Page 2 - Spatial + temporal**
- Screenshot of the landing page anatomy diagram
- One muscle's calendar heatmap
- Discussion: spatial encoding maps anatomy to data, calendar grid structures time meaningfully

**Page 3 - Progression + relationship**
- Weight progression line chart (one muscle, annotated with PR)
- Scatter plot: volume vs RPE (once built)
- Discussion: continuous vs discrete encoding, relational vs trend charts, why two separate charts are less insightful than a scatter

**Page 4 - Comparison across muscles**
- Small multiples view (once built), or bump/rank chart
- Discussion: small multiples vs single multi-series chart, what cross-muscle comparison reveals about training priorities

---

## Running the project

```bash
npm install
npm start
```

Runs on `http://localhost:3000`.
