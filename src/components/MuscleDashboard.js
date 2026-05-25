// ─────────────────────────────────────────────────────────────
// MULTI-MUSCLE DASHBOARD
//
// One full-screen Tableau dashboard, two view modes:
//   Normal   → Weight Progression + Training Consistency
//   Advanced → Reps in Reserve + Training Intensity (RPE)
//
// Muscle multi-select: user toggles any subset of muscles on/off
// to compare them across the charts. The selection is passed into
// Tableau via a viz-filter on the "Muscle Group" field.
//
// Stats cards stay (one per selected muscle) so the qualitative
// outcome — PR, total gain, sessions — is always visible next to
// the charts. When the user lands here from the body map, the
// clicked muscle is pre-selected; they can add more from the
// toggle bar.
//
// The single accent color rule from the original dashboard still
// applies: each muscle's color appears only on its identity dot,
// PR number, and total-gain value. Furniture stays stone-neutral.
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useMemo, useState } from 'react';
import { MUSCLE_CONFIG, APP_COLORS } from '../config';
import { useIsMobile } from '../useIsMobile';

// ── Tableau URLs — REPLACE with published workbook URLs ───────
// See TABLEAU_BUILD.md for how to build and publish these.
const TABLEAU_VIEWS = {
  normal:   'https://public.tableau.com/views/gym_normal/Normal?:language=en-GB&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link',
  advanced: 'https://public.tableau.com/views/gym_advanced/Advanced?:language=en-GB&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link',
};

const cardStyle = {
  background: APP_COLORS.cardBackground,
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '20px',
};

function MuscleStatsCard({ muscle, sessions }) {
  const config = MUSCLE_CONFIG[muscle];
  if (!config || !sessions.length) return null;
  const { color, label, exercise } = config;
  const pr = Math.max(...sessions.map(s => s.weight_kg));
  const startWeight = sessions[0]?.weight_kg || 0;
  const totalGain = pr - startWeight;

  return (
    <div style={{
      background: APP_COLORS.cardBackground,
      borderRadius: '14px',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      minWidth: '220px',
      flex: '1 1 220px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />
        <div style={{ fontSize: '15px', fontWeight: '700', color: APP_COLORS.text }}>{label}</div>
        <div style={{ fontSize: '11px', color: APP_COLORS.textLight, marginLeft: 'auto' }}>{exercise}</div>
      </div>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '10px', color: APP_COLORS.textLight, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>PR</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color, lineHeight: 1.1 }}>
            {pr}<span style={{ fontSize: '11px', color: APP_COLORS.textLight, marginLeft: '3px' }}>kg</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: APP_COLORS.textLight, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Gain</div>
          <div style={{ fontSize: '22px', fontWeight: '700', color, lineHeight: 1.1 }}>
            +{totalGain.toFixed(1)}<span style={{ fontSize: '11px', color: APP_COLORS.textLight, marginLeft: '3px' }}>kg</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: APP_COLORS.textLight, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sessions</div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: APP_COLORS.text, lineHeight: 1.1 }}>{sessions.length}</div>
        </div>
      </div>
    </div>
  );
}

function MuscleTogglePills({ allMuscles, selectedMuscles, onToggle }) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '20px',
    }}>
      {allMuscles.map(muscle => {
        const config = MUSCLE_CONFIG[muscle];
        const isSelected = selectedMuscles.has(muscle);
        return (
          <button
            key={muscle}
            onClick={() => onToggle(muscle)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              border: `1.5px solid ${isSelected ? config.color : APP_COLORS.border}`,
              background: isSelected ? config.color : APP_COLORS.cardBackground,
              color: isSelected ? '#FFFFFF' : APP_COLORS.text,
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 120ms ease',
            }}
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isSelected ? '#FFFFFF' : config.color,
            }} />
            {config.label}
          </button>
        );
      })}
    </div>
  );
}

function ViewToggle({ view, onChange }) {
  const isNormal = view === 'normal';
  const baseBtn = {
    border: 'none',
    cursor: 'pointer',
    padding: '8px 18px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '0.04em',
    transition: 'all 120ms ease',
  };
  return (
    <div style={{
      display: 'inline-flex',
      background: APP_COLORS.cardBackground,
      border: `1px solid ${APP_COLORS.border}`,
      borderRadius: '10px',
      padding: '4px',
    }}>
      <button
        onClick={() => onChange('normal')}
        style={{
          ...baseBtn,
          background: isNormal ? APP_COLORS.text : 'transparent',
          color: isNormal ? '#FFFFFF' : APP_COLORS.textLight,
        }}
      >
        NORMAL
      </button>
      <button
        onClick={() => onChange('advanced')}
        style={{
          ...baseBtn,
          background: !isNormal ? APP_COLORS.text : 'transparent',
          color: !isNormal ? '#FFFFFF' : APP_COLORS.textLight,
        }}
      >
        ADVANCED
      </button>
    </div>
  );
}

export default function MuscleDashboard({ initialMuscle, getSessionsForMuscle, onBack }) {
  const isMobile = useIsMobile();
  const allMuscles = useMemo(() => Object.keys(MUSCLE_CONFIG), []);
  const [selectedMuscles, setSelectedMuscles] = useState(
    () => new Set(initialMuscle ? [initialMuscle] : [])
  );
  const [view, setView] = useState('normal');

  useEffect(() => {
    if (document.querySelector('script[data-tableau-embed]')) return;
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
    script.setAttribute('data-tableau-embed', '');
    document.head.appendChild(script);
  }, []);

  const toggleMuscle = (muscle) => {
    setSelectedMuscles(prev => {
      const next = new Set(prev);
      if (next.has(muscle)) next.delete(muscle);
      else next.add(muscle);
      return next;
    });
  };

  const selectedList = useMemo(
    () => allMuscles.filter(m => selectedMuscles.has(m)),
    [allMuscles, selectedMuscles]
  );

  const filterValue = selectedList.join(',');
  const tableauSrc = TABLEAU_VIEWS[view];

  return (
    <div style={{
      minHeight: '100vh',
      background: APP_COLORS.background,
      padding: '0 0 60px 0',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        background: APP_COLORS.background,
        borderBottom: `1px solid ${APP_COLORS.border}`,
        padding: isMobile ? '16px 16px 14px' : '24px 40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={onBack}
          style={{
            background: APP_COLORS.cardBackground,
            border: `1px solid ${APP_COLORS.border}`,
            borderRadius: '10px',
            padding: '8px 18px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: APP_COLORS.text,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← Back
        </button>

        <div style={{ textAlign: 'center', flex: 1, minWidth: '200px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: APP_COLORS.textLight,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '2px',
          }}>
            Compare Muscles
          </div>
          <div style={{
            fontSize: isMobile ? '20px' : '26px',
            fontWeight: '800',
            color: APP_COLORS.text,
          }}>
            Training Dashboard
          </div>
        </div>

        <ViewToggle view={view} onChange={setView} />
      </div>

      <div style={{ padding: isMobile ? '16px 12px' : '24px 32px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Muscle multi-select */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: APP_COLORS.textLight,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            Muscles ({selectedList.length} selected)
          </div>
          <MuscleTogglePills
            allMuscles={allMuscles}
            selectedMuscles={selectedMuscles}
            onToggle={toggleMuscle}
          />
        </div>

        {/* Stats per selected muscle */}
        {selectedList.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px',
          }}>
            {selectedList.map(muscle => (
              <MuscleStatsCard
                key={muscle}
                muscle={muscle}
                sessions={getSessionsForMuscle(muscle)}
              />
            ))}
          </div>
        )}

        {/* Tableau dashboard embed */}
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          {selectedList.length === 0 ? (
            <div style={{
              padding: '60px 24px',
              textAlign: 'center',
              color: APP_COLORS.textLight,
              fontSize: '14px',
            }}>
              Select at least one muscle above to view the dashboard.
            </div>
          ) : (
            <tableau-viz
              key={`${view}-${filterValue}`}
              src={tableauSrc}
              width="100%"
              height={isMobile ? '600' : '800'}
              hide-tabs
              toolbar="hidden"
            >
              <viz-filter field="Muscle Group" value={filterValue} />
            </tableau-viz>
          )}
        </div>

      </div>
    </div>
  );
}
