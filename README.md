# Gym Data Viz — ITU Data Visualization Semester Project

A personal data visualization web app tracking 6 months of gym training (October 2024 – March 2025).
Built with React + Recharts. Submitted as part of the ITU Data Visualization course exam (deadline: 29 May).

**Entry point:** Animated anatomy diagram → per-muscle dashboard

---

## Dataset

`public/gym_data.csv` — self-recorded workout log with one row per exercise per session.

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

### Landing page — body heatmap

An interactive SVG anatomy diagram that encodes weekly training volume across all 12 muscle groups simultaneously. The primary encoding is spatial (muscle region on the body); color is a secondary, redundant signal for volume change relative to the selected reference.

**Time controls:**
- Week slider (week 1 → N, one week per data point) with play/pause animation at 850 ms per step
- Current week label (e.g. "12 Jan '25") shown live next to the slider

**Comparison modes (pill buttons):**

| Mode | What it computes |
|---|---|
| vs. Month Ago | Current week's volume vs. the same week 4 weeks prior |
| 4-Week Rolling | 4-week rolling average vs. the rolling average 4 weeks prior |
| vs. Starting Point | 4-week rolling average vs. the first 4 training weeks (baseline) |

**Color scale** — sequential warm terracotta, light → dark (5 bins):

| Bin | Range | Meaning |
|---|---|---|
| Much less | ≤ −30% | |
| Less | −30% to −10% | |
| Similar | ±10% | |
| More | +10% to +30% | |
| Much more | ≥ +30% | |

Stone gray (`#E7E5E0`) signals "no comparison available" — e.g. muscle had zero volume 4 weeks ago so the reference week doesn't exist. Absence of data is not the same as a low-training week and must not look like one.

**Interaction:** hover shows a floating tooltip with muscle name and ±% value; click navigates to the per-muscle dashboard.

**Routing:** `?muscle=Biceps` query param preserves browser history so back/forward and direct links work correctly.

---

### Per-muscle dashboard (`MuscleDashboard`)

Each muscle group has its own dashboard with stats and five charts. Navigation uses `pushState` / `popstate` so the back button returns to the body diagram naturally.

**Stats row:**

| Stat | Description |
|---|---|
| Personal Record | Max weight lifted (kg), accented in the muscle's color |
| Starting Weight → Total Gain | First session weight, arrow, gain since start (colored) |
| Sessions | Raw session count |

**Charts:**

| Chart | Type | Encodes |
|---|---|---|
| Weight Progression | Line chart | Weight (kg) over time |
| Training Consistency | Calendar heatmap | Session presence Oct 2024 – Mar 2025 |
| Training Volume | Bar chart | `weight × reps` per session |
| Reps in Reserve (RIR) | Line chart + dashed reference | Proximity to max effort; 0 = max effort line |
| Training Intensity (RPE) | Bar chart | Perceived exertion (1–10) |

RIR and RPE are labeled **ADVANCED** in the UI with one-line explanations — they require domain knowledge to interpret correctly.

---

## Tech stack

| Library | Purpose |
|---|---|
| React 18.2 | UI framework |
| Recharts 2.8 | Line and bar charts |
| PapaParse 5.4 | CSV parsing |
| Custom SVG | Anatomy diagram (click regions layer) |

No CSS framework — all styles are inline React. Fonts: Space Grotesk (landing page), DM Sans (dashboard).

---

## Color system

Three-layer architecture defined in `src/config.js`:

**Layer 1 — Functional anchors**
- Terracotta `#B5451B` — gains, PRs, play button, heatmap dark end
- Terracotta tint `#FAE8DF` — heatmap light end, active pill background
- These are the only warm hues with semantic meaning in the app

**Layer 2 — 12 muscle categorical hues**
Spread ~22° apart across the hue wheel, avoiding the warm-red and blue-slate zones owned by the terracotta accent to prevent channel collision with the body heatmap. Each muscle has a primary color and a light tint (used for chart bar fills and calendar cells).

**Layer 3 — Stone neutrals**
All structural UI — backgrounds (`#FAFAF7`), borders (`#E7E5E0`), text (`#1C1917`, `#78716C`). Zero hue on furniture. Source: Tufte (1983) data-ink ratio; Few (2008).

**Data-ink applied to color (dashboard):** The accent color appears in exactly four places per dashboard — the identity dot, the PR number, the Total Gain value, and all chart data ink (line strokes, bar fills, heatmap cells, tooltip border, RIR reference line). Header backgrounds, card surfaces, axis labels, arrows, and badges are stone neutral. Every instance of the accent color encodes data; none is decoration. Source: Tufte (1983); Cairo (2016).

The full evidence-based rationale with citations is in `color_theory_evidence.md`.

---

## Cairo's five qualities — applied here

**Truthful** — data is self-recorded and unprocessed; no smoothing or normalization is applied to weight or volume. The body heatmap shows volume relative to a comparison reference, not an absolute score, so the viewer always knows what the number means. RPE and RIR are subjective metrics; this is acknowledged in the chart subtitles.

**Functional** — chart type is chosen for the data shape. Weight over time uses a line (continuous progression). Volume per session uses bars (discrete events). The calendar heatmap uses a grid because the temporal pattern — which days of the week, which weeks — is itself meaningful. The anatomy SVG uses spatial position as the primary encoder so color is redundant reinforcement, not the sole signal.

**Beautiful** — warm, minimal palette anchored in terracotta. Each muscle has a distinct hue that stays readable at small sizes. The anatomy diagram is a non-standard but immediately legible entry point for a fitness dataset.

**Insightful** — the RIR chart is the most insightful: it reveals whether effort was increasing even when weight plateaued, a pattern invisible in the weight progression chart alone. The animated body heatmap makes cross-muscle periodization visible as a time-lapse — you can see which muscles received emphasis in each training block.

**Enlightening** — the "data selfie" framing (Cairo 2016): this is one person's body, one person's effort, visualized as a story arc across six months. The anatomy diagram makes the subject matter immediately legible to a non-specialist.

---

## Design decisions

**Sequential warm scale (not diverging) for the body heatmap**
A diverging scale (cold ↔ warm) encodes a value judgment: blue end = bad, warm end = good. But lower volume week-over-week is not failure — it may be a deload, recovery, or life happening. A sequential warm scale (light → dark terracotta) says "you trained less / more" without implying you went backwards. Stone gray for no-data is distinct from the warm scale so "can't compare" reads differently from "trained less." Source: Brewer (1996); Cairo (2016) on framing honesty.

**12 color categories**
Cairo recommends ≤7 categories for rapid color discrimination (Healey 1996 finds ~7 for preattentive discrimination). Mitigation: on the landing page, spatial position on the anatomical diagram is the primary encoder and color is secondary reinforcement. Colors are never compared across muscles on a single chart — each dashboard shows only one muscle's accent color against stone neutrals. Discrimination limits apply most strictly when color is the sole channel.

**Line chart for weight progression**
A line implies continuous change between measurements; gym sessions are discrete events. The choice was deliberate: the trend (are you getting stronger?) is more important than session-by-session comparison, and a line communicates trend more clearly than a scatter or bar. Defensible trade-off, not an oversight.

**Bar chart for volume**
Volume (`weight × reps`) is a derived metric. Using bars (discrete, atomic) signals correctly that each session stands alone — there is no meaningful interpolation between two volume measurements.

**Three comparison modes on the body heatmap**
Week-vs-month catches recent momentum shifts. 4-week rolling smooths out noisy individual weeks. Vs. starting point shows the full training arc. All three use the same color scale; switching modes does not require re-learning the legend. The mode buttons are pill-shaped toggles rather than a dropdown so both options are always visible at a glance.

**Interactive anatomy vs. dropdown**
A dropdown with 12 muscle names is cognitively equivalent to reading a list. The anatomy SVG reduces lookup cost by letting the user point at their own body — spatial memory replaces label scanning. Trade-off: implementation complexity and the need to map SVG regions to muscle groups precisely.

**URL-based navigation**
`?muscle=Biceps` means browser back/forward works naturally and a specific dashboard can be bookmarked. Small implementation cost for a significant UX improvement.

---

## Next steps (prioritized for exam value)

### 1. Scatter plot: Volume vs RPE per session — HIGH PRIORITY

**What it shows:** Plot total volume (y-axis) against RPE (x-axis) for every session. Reveals whether you work harder *and* more, or whether high-effort sessions are actually lower volume (fatigue-driven).

**Why it matters for Cairo:** The most *insightful* chart the dataset supports. It encodes a relationship, not just a trend — the only chart type that can show whether two variables move together.

**Implementation notes:**
- Add `getScatterData()` to `useGymData.js` returning `{ volume, rpe, date, muscle }` per session
- New `VolumeRPEScatter.js` using Recharts `ScatterChart`
- One point per session, colored by `MUSCLE_CONFIG[muscle].color`

---

### 2. Small multiples: Weight progression for all muscles — HIGH PRIORITY

**What it shows:** 12 mini line charts on one screen, all on the same time axis. Makes cross-muscle comparison immediate — which muscles improved fastest, which plateaued.

**Why it matters for Cairo:** Small multiples eliminate the need for interaction to compare, making the comparison itself the visualization.

**Implementation notes:**
- New `SmallMultiplesView` component in a 3×4 or 4×3 CSS grid
- Normalize y-axis to percentage of PR so all charts are comparable across muscles with different weight ranges

---

### 3. Bump/rank chart: Monthly training focus — MEDIUM PRIORITY

**What it shows:** For each month (Oct–Mar), rank muscles by session count. Show rank shifts as connected lines per muscle.

**Why it matters for Cairo:** Uses position (rank) as the primary encoding rather than length or color. Surfaces periodization.

**Implementation notes:**
- `getRankingByMonth()` in `useGymData.js`
- Draw with SVG lines or approximate with `LineChart` on an inverted y-axis

---

### 4. Rest interval chart — MEDIUM PRIORITY

**What it shows:** For a given muscle, bars showing days since the last session. Shows whether recovery time was consistent or erratic.

**Why it matters for Cairo:** Adds a dimension none of the current charts address — the *gap* between sessions. The heatmap shows where you trained; this shows where you didn't.

**Implementation notes:**
- `getRestIntervals(muscleGroup)` in `useGymData.js` — sort session dates, compute `date[i] - date[i-1]` in days
- Bar chart added inside `MuscleDashboard` near the heatmap

---

### 5. Heatmap: volume intensity shading — LOWER PRIORITY

**What it shows:** Change the Training Consistency heatmap from binary presence/absence to continuous volume encoding.

**Why it matters for Cairo:** More truthful — a 60-minute high-volume session and a 20-minute light session look identical in the current binary implementation.

**Implementation notes:**
- `getVolumeByDate(muscleGroup)` — extend `getVolumeBySession` to return a date-keyed map
- Map volume to an opacity or lightness scale using the existing `color`/`colorLight` pairs

---

## Paper structure suggestion

Max 4 physical pages: 1 text + 3 visualization pages.

**Page 1 — Text**
- Dataset: personal gym log, 6 months, 12 muscles, 8 variables per session; data selfie framing
- Design philosophy: Cairo's 5 qualities with specific app examples
- Color system: 3-layer architecture, sequential warm scale rationale, data-ink applied to color
- Honest limitation: RPE and RIR are subjective; single subject; no statistical inference possible

**Page 2 — Spatial + temporal**
- Screenshot of the landing page body heatmap (animated; show one week with visible contrast)
- One muscle's calendar heatmap (Training Consistency)
- Discussion: spatial encoding, sequential vs diverging scale choice, animation as a temporal dimension

**Page 3 — Progression + relationship**
- Weight progression line chart (one muscle, annotated with PR)
- Scatter plot: volume vs RPE (once built)
- Discussion: continuous vs discrete encoding, relational vs trend charts

**Page 4 — Comparison across muscles**
- Small multiples view (once built) or bump/rank chart
- Discussion: small multiples vs multi-series chart, what cross-muscle comparison reveals

---

## Running the project

```bash
npm install
npm start
```

Runs on `http://localhost:3000`.
