// ─────────────────────────────────────────────────────────────
// COLOR VISION — data-ink minimization applied to muscle color
//
// Each muscle has exactly one accent color (from MUSCLE_CONFIG).
// That color appears in precisely four places:
//   1. The identity dot next to the muscle name in the header
//   2. The PR number — the single most important data point
//   3. The Total Gain value — the outcome of six months of work
//   4. All chart data ink: line stroke, bar fill/stroke,
//      heatmap cells, tooltip border, RIR reference line
//
// Everywhere else — header background, card surfaces, back button,
// arrow, section titles, ADVANCED badges, axis labels — is stone
// neutral. These are structural elements. Giving them the muscle
// color would make color ubiquitous and therefore meaningless.
//
// The principle is Tufte's data-ink ratio applied to color:
// every instance of the accent color should encode something.
// If you can remove a color application without losing information,
// it should be removed. Source: Tufte (1983); Cairo (2016).
//
// The result is that when the viewer's eye lands on the accent
// color anywhere on this page, it is always looking at data —
// never at furniture. Switching muscles updates the charts and
// the three data-ink moments above; the page layout itself
// does not repaint.
// ─────────────────────────────────────────────────────────────

import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ReferenceLine,
} from 'recharts';
import { MUSCLE_CONFIG, APP_COLORS } from '../config';
import TrainingHeatmap from './TrainingHeatmap';
import { useIsMobile } from '../useIsMobile';

const cardStyle = {
  background: APP_COLORS.cardBackground,
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '20px',
};

// PR card: neutral background, muscle color only on the number itself
function PRBadge({ value, color }) {
  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: APP_COLORS.cardBackground,
      borderRadius: '16px',
      padding: '20px 32px',
      minWidth: '140px',
    }}>
      <span style={{
        fontSize: '13px',
        fontWeight: '600',
        color: APP_COLORS.textLight,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}>
        Personal Record
      </span>
      <span style={{ fontSize: '48px', fontWeight: '800', color: color, lineHeight: 1.1 }}>
        {value}
      </span>
      <span style={{ fontSize: '16px', fontWeight: '500', color: APP_COLORS.textLight }}>kg</span>
    </div>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const CustomTooltip = ({ active, payload, label, color }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff',
        border: `1.5px solid ${color}`,
        borderRadius: '10px',
        padding: '10px 16px',
        fontSize: '13px',
        color: APP_COLORS.text,
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      }}>
        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{formatDate(label)}</div>
        {payload.map((p, i) => (
          <div key={i}>{p.name}: <strong>{p.value}{p.unit || ''}</strong></div>
        ))}
      </div>
    );
  }
  return null;
};

export default function MuscleDashboard({ muscle, sessions, volumeData, muscleDates, onBack }) {
  const isMobile = useIsMobile();
  const config = MUSCLE_CONFIG[muscle];
  const { color, colorLight, exercise, label } = config;

  const pr = useMemo(() => Math.max(...sessions.map(s => s.weight_kg)), [sessions]);
  const startWeight = sessions[0]?.weight_kg || 0;
  const totalGain = pr - startWeight;

  const tickCount = 6;
  const step = Math.floor(sessions.length / tickCount);
  const ticks = sessions.filter((_, i) => i % step === 0).map(s => s.date);

  return (
    <div style={{
      minHeight: '100vh',
      background: APP_COLORS.background,
      padding: '0 0 60px 0',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Header — neutral, color only as identity dot */}
      <div style={{
        background: APP_COLORS.background,
        borderBottom: `1px solid ${APP_COLORS.border}`,
        padding: isMobile ? '16px 16px 14px' : '28px 40px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '600',
            color: APP_COLORS.textLight,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}>
            {exercise}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {/* Color dot — the only muscle color in the header */}
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: color,
              flexShrink: 0,
            }} />
            <div style={{
              fontSize: isMobile ? '22px' : '32px',
              fontWeight: '800',
              color: APP_COLORS.text,
            }}>
              {label}
            </div>
          </div>
        </div>

        <div style={{ width: '80px' }} />
      </div>

      <div style={{ padding: isMobile ? '16px 12px' : '28px 32px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Stats row */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', marginBottom: '20px' }}>
          <PRBadge value={pr} color={color} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ ...cardStyle, marginBottom: 0, display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: APP_COLORS.textLight, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Starting Weight</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: APP_COLORS.text }}>
                  {startWeight} <span style={{ fontSize: '14px', color: APP_COLORS.textLight }}>kg</span>
                </div>
              </div>
              {/* Arrow — stone, not muscle color */}
              <div style={{ fontSize: '28px', color: APP_COLORS.textLight }}>→</div>
              <div>
                <div style={{ fontSize: '12px', color: APP_COLORS.textLight, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Gain</div>
                {/* Color on data value only */}
                <div style={{ fontSize: '28px', fontWeight: '700', color: color }}>
                  +{totalGain.toFixed(2)} <span style={{ fontSize: '14px', color: APP_COLORS.textLight }}>kg</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: APP_COLORS.textLight, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sessions</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: APP_COLORS.text }}>{sessions.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weight Progression */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: APP_COLORS.text }}>Weight Progression</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={sessions} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={APP_COLORS.border} vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDate} ticks={ticks} tick={{ fontSize: 11, fill: APP_COLORS.textLight }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: APP_COLORS.textLight }} axisLine={false} tickLine={false} domain={['auto', 'auto']} unit="kg" />
              <Tooltip content={<CustomTooltip color={color} />} />
              <Line type="monotone" dataKey="weight_kg" stroke={color} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: color }} name="Weight" unit="kg" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Heatmap */}
        <div style={cardStyle}>
          <TrainingHeatmap muscleDates={muscleDates} color={color} colorLight={colorLight} />
        </div>

        {/* Volume */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: APP_COLORS.text }}>
            Training Volume
            <span style={{ fontSize: '12px', fontWeight: '400', color: APP_COLORS.textLight, marginLeft: '8px' }}>weight × reps per session</span>
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={volumeData} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={APP_COLORS.border} vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDate} ticks={ticks} tick={{ fontSize: 11, fill: APP_COLORS.textLight }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: APP_COLORS.textLight }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip color={color} />} />
              <Bar dataKey="volume" fill={colorLight} stroke={color} strokeWidth={1} radius={[4, 4, 0, 0]} name="Volume" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RIR */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: APP_COLORS.text }}>Reps in Reserve (RIR)</h3>
            {/* ADVANCED badge — neutral, no muscle color */}
            <span style={{
              background: APP_COLORS.cardBackground,
              border: `1px solid ${APP_COLORS.border}`,
              borderRadius: '8px',
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: '700',
              color: APP_COLORS.textLight,
              letterSpacing: '0.04em',
            }}>
              ADVANCED
            </span>
          </div>
          <p style={{ fontSize: '12px', color: APP_COLORS.textLight, margin: '0 0 12px' }}>
            How many more reps you could have done. Lower = harder effort. Approaching 0 means maximum intensity.
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={sessions} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={APP_COLORS.border} vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDate} ticks={ticks} tick={{ fontSize: 11, fill: APP_COLORS.textLight }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: APP_COLORS.textLight }} axisLine={false} tickLine={false} domain={[0, 4]} ticks={[0,1,2,3,4]} />
              <Tooltip content={<CustomTooltip color={color} />} />
              <ReferenceLine y={0} stroke={color} strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Max effort', position: 'right', fontSize: 10, fill: color }} />
              <Line type="monotone" dataKey="rir" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="RIR" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RPE */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: APP_COLORS.text }}>Training Intensity (RPE)</h3>
            <span style={{
              background: APP_COLORS.cardBackground,
              border: `1px solid ${APP_COLORS.border}`,
              borderRadius: '8px',
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: '700',
              color: APP_COLORS.textLight,
              letterSpacing: '0.04em',
            }}>
              ADVANCED
            </span>
          </div>
          <p style={{ fontSize: '12px', color: APP_COLORS.textLight, margin: '0 0 12px' }}>
            Rate of Perceived Exertion on a 1–10 scale. Consistently high RPE reflects a high-intensity training approach.
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={sessions} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={APP_COLORS.border} vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDate} ticks={ticks} tick={{ fontSize: 11, fill: APP_COLORS.textLight }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: APP_COLORS.textLight }} axisLine={false} tickLine={false} domain={[0, 10]} ticks={[0,5,10]} />
              <Tooltip content={<CustomTooltip color={color} />} />
              <Bar dataKey="rpe" fill={color} opacity={0.7} radius={[3, 3, 0, 0]} name="RPE" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}