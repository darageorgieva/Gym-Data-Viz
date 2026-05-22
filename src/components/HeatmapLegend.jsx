import React, { useState } from 'react';
import { APP_COLORS, FUNCTIONAL_COLORS } from '../config';
import { PROGRESS_BINS, getProgressColor } from '../utils/colorScale';

const MODE_DESCRIPTIONS = {
  'week-vs-month': 'Each week volume compared against the same week one month earlier.',
  'rolling': 'Each week volume compared against the average of the previous 4 weeks.',
};

const MODE_GUIDE = [
  {
    key: 'week-vs-month',
    label: 'This Week vs. 4 Weeks Ago',
    when: 'Structured 4-week cycles - load/deload, push/pull/legs, upper/lower body programs or tracking alongside the menstrual cycle. Compares the same phase across cycles so the result is a pure volume signal.',
  },
  {
    key: 'rolling',
    label: 'This Week vs. 4-Week Average',
    when: 'No fixed program needed. Compares this week against your recent 4-week average, which absorbs weekly variation and answers: am I generally trending up?',
  },
];

function Divider() {
  return <div style={{ borderTop: `1px solid ${APP_COLORS.border}`, margin: '14px 0' }} />;
}

function DisclosureSection({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          width: '100%',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        <span style={{
          fontSize: '11px',
          color: APP_COLORS.textLight,
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 200ms ease',
          display: 'inline-block',
          flexShrink: 0,
        }}>
          ›
        </span>
        <span style={{
          fontSize: '13px',
          fontWeight: '700',
          color: APP_COLORS.text,
        }}>
          {title}
        </span>
      </button>

      <div style={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows 220ms ease',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ paddingTop: '10px' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeatmapLegend({ comparisonMode = 'week-vs-month', hoveredProgress = null }) {
  const activeBinColor = hoveredProgress != null ? getProgressColor(hoveredProgress) : null;
  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ── Always visible: colour scale ── */}
      <div style={{ fontSize: '13px', fontWeight: '700', color: APP_COLORS.text, marginBottom: '6px' }}>
        Progress Legend
      </div>
      <div style={{ color: APP_COLORS.textLight, fontSize: '12px', marginBottom: '14px', lineHeight: 1.6, minHeight: '3em' }}>
        {MODE_DESCRIPTIONS[comparisonMode]}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {PROGRESS_BINS.map((bin) => {
          const active = activeBinColor === bin.color;
          return (
            <div key={bin.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'opacity 150ms ease',
              opacity: activeBinColor && !active ? 0.35 : 1,
            }}>
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '3px',
                background: bin.color,
                flexShrink: 0,
                boxShadow: active ? `0 0 0 2px ${APP_COLORS.text}` : 'none',
                transition: 'box-shadow 150ms ease',
              }} />
              <span style={{
                fontSize: '12px',
                color: APP_COLORS.text,
                fontWeight: active ? '700' : '500',
                transition: 'font-weight 150ms ease',
              }}>
                {bin.label}
              </span>
            </div>
          );
        })}
      </div>

      <Divider />

      {/* ── Disclosure: how progress is calculated ── */}
      <DisclosureSection title="How is progress calculated?">
        <div style={{ fontSize: '12px', color: APP_COLORS.textLight, lineHeight: 1.6 }}>
          Weekly volume ={' '}
          <span style={{ color: APP_COLORS.text, fontWeight: '600' }}>weight × reps × sets</span>. Showing the result as a % change means muscle size doesn't affect the colour.
        </div>
      </DisclosureSection>

      <Divider />

      {/* ── Disclosure: which mode ── */}
      <DisclosureSection title="Which mode is for me?">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MODE_GUIDE.map((mode) => {
            const active = comparisonMode === mode.key;
            return (
              <div
                key={mode.key}
                style={{
                  borderLeft: `3px solid ${active ? FUNCTIONAL_COLORS.accent : APP_COLORS.border}`,
                  paddingLeft: '10px',
                  transition: 'border-color 200ms ease',
                }}
              >
                <div style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: active ? FUNCTIONAL_COLORS.accent : APP_COLORS.text,
                  marginBottom: '3px',
                  transition: 'color 200ms ease',
                }}>
                  {mode.label}
                </div>
                <div style={{ fontSize: '11px', color: APP_COLORS.textLight, lineHeight: 1.6 }}>
                  {mode.when}
                </div>
              </div>
            );
          })}
        </div>
      </DisclosureSection>

    </div>
  );
}
