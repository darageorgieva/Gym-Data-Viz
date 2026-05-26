// ─────────────────────────────────────────────────────────────
// MUSCLE DASHBOARD — Direction A · "Instrument"
//
// Single-muscle deep readout. One muscle in focus, sourced from
// the URL (?muscle=...). The body-map click on the landing page
// is the primary entry; the MusclePicker in the rule bar lets
// the user page through the other 11 muscles without losing
// their place in browser history.
//
// Layout, top to bottom:
//   3px accent rule  →  rule bar  →  hero  →  KPI strip
//                                 →  view tabs (Normal / Advanced)
//                                 →  Tableau viewport
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useMemo, useState } from 'react';
import { MUSCLE_CONFIG, APP_COLORS } from '../config';
import { useIsMobile } from '../useIsMobile';
import MusclePicker from './MusclePicker';

const TABLEAU_VIEWS = {
  normal:   'https://public.tableau.com/views/gym_normal/Normal?:language=en-GB&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link',
  advanced: 'https://public.tableau.com/views/gym_advanced/Advanced?:language=en-GB&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link',
  gems:     'https://public.tableau.com/views/hidden-gems_17798292209230/Sheet1?:language=en-GB&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link',
};

const VIEW_OPTIONS = [
  { id: 'normal',   label: 'NORMAL' },
  { id: 'advanced', label: 'ADVANCED' },
  { id: 'gems',     label: 'GEMS' },
];

const VIEW_TITLES = {
  normal:   'Weight progression & training consistency',
  advanced: 'Proximity to failure',
  gems:     'Hidden gems — progress without weight increase',
};

const FONT_SANS = "'DM Sans', sans-serif";
const FONT_MONO = "'DM Mono', 'JetBrains Mono', monospace";

function Eyebrow({ children, color, style }) {
  return (
    <div style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: color || APP_COLORS.textFaint,
      fontFamily: FONT_SANS,
      ...style,
    }}>{children}</div>
  );
}

function MonoNum({ children, style }) {
  return (
    <span style={{
      fontFamily: FONT_MONO,
      fontVariantNumeric: 'tabular-nums',
      ...style,
    }}>{children}</span>
  );
}

function VRule({ height, color }) {
  return <div style={{ width: 1, height, background: color || APP_COLORS.border }} />;
}

function KPI({ label, value, unit, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <Eyebrow>{label}</Eyebrow>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: color || APP_COLORS.text,
          lineHeight: 1,
        }}>
          <MonoNum>{value}</MonoNum>
        </span>
        {unit && (
          <span style={{ fontSize: 10, color: APP_COLORS.textFaint, fontWeight: 600 }}>{unit}</span>
        )}
      </div>
    </div>
  );
}

function ViewToggle({ view, onChange }) {
  const baseBtn = {
    border: 'none',
    cursor: 'pointer',
    padding: '8px 18px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.04em',
    transition: 'all 120ms ease',
    fontFamily: FONT_SANS,
  };
  return (
    <div style={{
      display: 'inline-flex',
      background: APP_COLORS.background,
      border: `1px solid ${APP_COLORS.border}`,
      borderRadius: 10,
      padding: 4,
    }}>
      {VIEW_OPTIONS.map((opt) => {
        const active = view === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            style={{
              ...baseBtn,
              background: active ? APP_COLORS.text : 'transparent',
              color: active ? '#FFFFFF' : APP_COLORS.textLight,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// A session is a "hidden gem" if, at the same weight bucket (±0.5kg)
// as a previous session, it scored either more work (reps × sets) or
// a meaningfully lower RIR. The PR itself never qualifies.
function computeHiddenGems(sessions) {
  if (!sessions.length) return [];
  const pr = Math.max(...sessions.map((s) => s.weight_kg || 0));
  const bestByWeight = new Map();
  const gems = [];
  sessions.forEach((s, i) => {
    const key = Math.round((s.weight_kg || 0) * 2) / 2;
    const work = (s.reps || 0) * (s.sets || 1);
    const isPR = s.weight_kg === pr;
    const prev = bestByWeight.get(key);
    if (prev && !isPR) {
      const repsBetter = work > prev.work;
      const rirBetter = s.rir != null && prev.rir != null && s.rir < prev.rir - 0.3;
      if (repsBetter) gems.push({ index: i, session: s, reason: 'reps' });
      else if (rirBetter) gems.push({ index: i, session: s, reason: 'rir' });
    }
    if (!prev || work > prev.work) {
      bestByWeight.set(key, { work, rir: s.rir });
    }
  });
  return gems;
}

function formatDateMonShort(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function formatRangeLabel(start, end) {
  const fmt = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return `${fmt(start)} → ${fmt(end)}`;
}

function pickNumber(value, digits = 0) {
  if (value == null || isNaN(value)) return '—';
  return Number.isInteger(value) ? String(value) : value.toFixed(digits);
}

export default function MuscleDashboard({ initialMuscle, getSessionsForMuscle, navigateToMuscle, onBack }) {
  const isMobile = useIsMobile();
  const muscle = initialMuscle;
  const config = MUSCLE_CONFIG[muscle];
  const color = config ? config.color : APP_COLORS.text;

  const [view, setView] = useState('normal');

  useEffect(() => {
    if (document.querySelector('script[data-tableau-embed]')) return;
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
    script.setAttribute('data-tableau-embed', '');
    document.head.appendChild(script);
  }, []);

  const sessions = useMemo(
    () => (muscle && getSessionsForMuscle ? getSessionsForMuscle(muscle) : []),
    [muscle, getSessionsForMuscle]
  );

  const derived = useMemo(() => {
    if (!sessions.length) {
      return {
        pr: 0, start: 0, gain: 0, gainPct: 0,
        sessionsCount: 0, weeksCount: 0,
        topSets: 0, topReps: 0,
        totalVolume: 0, meanRpe: 0,
        prSession: null, prDateLabel: '—',
        rangeStart: null, rangeEnd: null,
        rangeLabel: '—',
        gemCount: 0, repsGems: 0, rirGems: 0,
      };
    }
    const pr = Math.max(...sessions.map((s) => s.weight_kg || 0));
    const start = sessions[0].weight_kg || 0;
    const gain = pr - start;
    const gainPct = start > 0 ? Math.round((gain / start) * 100) : 0;
    const totalVolume = sessions.reduce(
      (a, s) => a + (s.weight_kg || 0) * (s.reps || 0) * (s.sets || 1),
      0
    );
    const rpeValues = sessions.map((s) => s.rpe).filter((v) => v != null && !isNaN(v));
    const meanRpe = rpeValues.length ? rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length : 0;
    const prSession = sessions.find((s) => s.weight_kg === pr) || null;
    const rangeStart = new Date(sessions[0].date);
    const rangeEnd = new Date(sessions[sessions.length - 1].date);
    const weeksCount = Math.max(
      1,
      Math.round((rangeEnd - rangeStart) / (1000 * 60 * 60 * 24 * 7))
    );
    const gems = computeHiddenGems(sessions);
    return {
      pr,
      start,
      gain,
      gainPct,
      sessionsCount: sessions.length,
      weeksCount,
      topSets: prSession?.sets ?? 0,
      topReps: prSession?.reps ?? 0,
      totalVolume,
      meanRpe,
      prSession,
      prDateLabel: formatDateMonShort(prSession?.date),
      rangeStart,
      rangeEnd,
      rangeLabel: formatRangeLabel(rangeStart, rangeEnd),
      gemCount: gems.length,
      repsGems: gems.filter((g) => g.reason === 'reps').length,
      rirGems: gems.filter((g) => g.reason === 'rir').length,
    };
  }, [sessions]);

  if (!config) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: APP_COLORS.background,
        fontFamily: FONT_SANS,
        color: APP_COLORS.textLight,
      }}>
        Unknown muscle.
      </div>
    );
  }

  const handlePickMuscle = (next) => {
    if (next === muscle) return;
    if (navigateToMuscle) navigateToMuscle(next);
  };

  const exerciseLower = config.exercise.toLowerCase();

  return (
    <div style={{
      minHeight: '100vh',
      background: APP_COLORS.background,
      color: APP_COLORS.text,
      fontFamily: FONT_SANS,
      borderTop: `3px solid ${color}`,
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* RULE BAR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1px solid ${APP_COLORS.text}`,
        padding: isMobile ? '12px 16px' : '14px 28px',
        gap: 14,
        flexWrap: isMobile ? 'wrap' : 'nowrap',
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: `1px solid ${APP_COLORS.border}`,
            padding: '6px 10px',
            cursor: 'pointer',
            borderRadius: 2,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: APP_COLORS.text,
            fontFamily: FONT_SANS,
          }}
        >
          ← ATLAS
        </button>

        {!isMobile && (
          <>
            <Eyebrow color={APP_COLORS.textLight}>Detail · Gym Progress Atlas</Eyebrow>
            <span style={{ color: APP_COLORS.borderStrong }}>/</span>
            <Eyebrow color={color}>{config.label}</Eyebrow>
          </>
        )}

        <div style={{ flex: 1 }} />

        <MusclePicker muscle={muscle} onChange={handlePickMuscle} />

        {!isMobile && (
          <>
            <VRule height={24} />
            <Eyebrow>Range</Eyebrow>
            <MonoNum style={{ fontSize: 11.5, fontWeight: 600, color: APP_COLORS.text }}>
              {derived.rangeLabel}
            </MonoNum>
          </>
        )}
      </div>

      {/* HERO */}
      <div style={{
        padding: isMobile ? '20px 16px' : '28px 28px 24px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr auto',
        gap: isMobile ? 20 : 28,
        alignItems: 'flex-end',
        borderBottom: `1px solid ${APP_COLORS.text}`,
      }}>
        <div>
          <Eyebrow color={color}>Detail · Single muscle</Eyebrow>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 14,
            marginTop: 4,
            flexWrap: 'wrap',
          }}>
            <h1 style={{
              margin: 0,
              fontSize: isMobile ? 40 : 56,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
              color: APP_COLORS.text,
            }}>
              {config.label}
            </h1>
            <div style={{
              fontSize: 14,
              fontWeight: 600,
              color: APP_COLORS.textLight,
              padding: '4px 10px',
              border: `1px solid ${APP_COLORS.border}`,
              borderRadius: 4,
              background: APP_COLORS.cardBackground,
            }}>
              {config.exercise}
            </div>
          </div>
          <p style={{
            margin: '10px 0 0',
            fontSize: 13,
            color: APP_COLORS.textLight,
            maxWidth: 540,
            lineHeight: 1.5,
          }}>
            Top-set load, session presence, and proximity to true failure — {derived.weeksCount} weeks, {derived.sessionsCount} sessions on {exerciseLower}.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 24,
          flexWrap: 'wrap',
        }}>
          <div>
            <Eyebrow>Personal Record</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
              <span style={{
                fontSize: isMobile ? 56 : 72,
                fontWeight: 800,
                color,
                letterSpacing: '-0.04em',
                lineHeight: 0.85,
              }}>
                <MonoNum>{pickNumber(derived.pr, 1)}</MonoNum>
              </span>
              <span style={{ fontSize: 16, color: APP_COLORS.textLight, fontWeight: 700 }}>kg</span>
            </div>
          </div>
          <VRule height={64} />
          <div>
            <Eyebrow>Total gain</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
              <span style={{
                fontSize: isMobile ? 30 : 38,
                fontWeight: 800,
                color,
                letterSpacing: '-0.03em',
                lineHeight: 0.95,
              }}>
                +<MonoNum>{derived.gainPct}</MonoNum>%
              </span>
              <span style={{ fontSize: 13, color: APP_COLORS.textLight, fontWeight: 700 }}>
                (+{pickNumber(derived.gain, 1)}kg)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI STRIP */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
        rowGap: isMobile ? 16 : 0,
        columnGap: 0,
        padding: isMobile ? '14px 16px' : '14px 28px',
        borderBottom: `1px solid ${APP_COLORS.text}`,
      }}>
        <KPI label="Start" value={pickNumber(derived.start, 1)} unit="kg" />
        <KPI label="Sessions" value={derived.sessionsCount} />
        <KPI label="Top set" value={`${derived.topSets || 0}×${derived.topReps || 0}`} />
        <KPI label="Total volume" value={(derived.totalVolume / 1000).toFixed(1)} unit="·10³ kg" />
        <KPI label="Mean RPE" value={derived.meanRpe.toFixed(1)} />
        <KPI label="PR date" value={derived.prDateLabel} />
      </div>

      {/* TABLEAU VIEWPORT */}
      <div style={{
        flex: 1,
        background: APP_COLORS.cardBackground,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}>
        <div style={{
          flex: 1,
          padding: isMobile ? '14px 16px' : '16px 24px',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}>
            <div>
              <Eyebrow color={color}>tableau · gym_{view} · {muscle.toLowerCase()}</Eyebrow>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>
                {VIEW_TITLES[view]}
              </div>
            </div>
            <ViewToggle view={view} onChange={setView} />
          </div>

          {view === 'gems' && (
            <div style={{
              background: APP_COLORS.background,
              border: `1px solid ${APP_COLORS.border}`,
              borderRadius: 2,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? 18 : 28,
              flexWrap: 'wrap',
            }}>
              <div>
                <Eyebrow color={color}>Hidden gems found</Eyebrow>
                <div style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color,
                  marginTop: 2,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}>
                  <MonoNum>{derived.gemCount}</MonoNum>
                  <span style={{
                    fontSize: 11,
                    color: APP_COLORS.textFaint,
                    fontWeight: 700,
                    marginLeft: 4,
                  }}>of {derived.sessionsCount}</span>
                </div>
              </div>
              <VRule height={40} />
              <div>
                <Eyebrow>Via more reps/sets</Eyebrow>
                <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>
                  <MonoNum>{derived.repsGems}</MonoNum>
                </div>
              </div>
              <VRule height={40} />
              <div>
                <Eyebrow>Via lower RIR</Eyebrow>
                <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>
                  <MonoNum>{derived.rirGems}</MonoNum>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 120 }} />
              <div style={{
                maxWidth: 380,
                fontSize: 12,
                color: APP_COLORS.textLight,
                lineHeight: 1.5,
              }}>
                Sessions where the load stayed flat but the work got better — more reps, more sets, or the same effort at a lower reps-in-reserve. The PR is the trophy; these are the days that built it.
              </div>
            </div>
          )}

          <div style={{
            flex: 1,
            background: APP_COLORS.background,
            border: `1px solid ${APP_COLORS.border}`,
            borderRadius: 2,
            padding: 12,
            minHeight: isMobile ? 480 : 560,
            overflow: 'hidden',
          }}>
            <tableau-viz
              key={`${view}-${muscle}`}
              src={TABLEAU_VIEWS[view]}
              width="100%"
              height={isMobile ? '460' : '720'}
              hide-tabs
              toolbar="hidden"
            >
              <viz-parameter name="pMuscle" value={muscle} />
            </tableau-viz>
          </div>
        </div>
      </div>
    </div>
  );
}
