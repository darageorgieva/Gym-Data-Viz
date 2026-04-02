import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ReferenceLine,
} from 'recharts';
import { MUSCLE_CONFIG, APP_COLORS } from '../config';
import TrainingHeatmap from './TrainingHeatmap';

const cardStyle = {
  background: APP_COLORS.cardBackground,
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '20px',
};

function PRBadge({ value, color }) {
  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: color,
      borderRadius: '16px',
      padding: '20px 32px',
      minWidth: '140px',
    }}>
      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1C1917', opacity: 0.7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Personal Record</span>
      <span style={{ fontSize: '48px', fontWeight: '800', color: '#1C1917', lineHeight: 1.1 }}>{value}</span>
      <span style={{ fontSize: '16px', fontWeight: '500', color: '#1C1917', opacity: 0.7 }}>kg</span>
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
        color: '#1C1917',
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
  const config = MUSCLE_CONFIG[muscle];
  const { color, colorLight, exercise, label } = config;

  const pr = useMemo(() => Math.max(...sessions.map(s => s.weight_kg)), [sessions]);
  const startWeight = sessions[0]?.weight_kg || 0;
  const totalGain = pr - startWeight;

  // Thin out x-axis labels
  const tickCount = 6;
  const step = Math.floor(sessions.length / tickCount);
  const ticks = sessions.filter((_, i) => i % step === 0).map(s => s.date);

  return (
    <div style={{
      minHeight: '100vh',
      background: APP_COLORS.background,
      padding: '0 0 60px 0',
      fontFamily: "'Arial', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: color,
        padding: '28px 40px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.4)',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 18px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1C1917',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← Back
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{exercise}</div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#1C1917' }}>{label}</div>
        </div>
        <div style={{ width: '80px' }} />
      </div>

      <div style={{ padding: '28px 32px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <PRBadge value={pr} color={color} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ ...cardStyle, marginBottom: 0, display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#78716C', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Starting Weight</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#1C1917' }}>{startWeight} <span style={{ fontSize: '14px', color: '#78716C' }}>kg</span></div>
              </div>
              <div style={{ fontSize: '28px', color: colorLight }}>→</div>
              <div>
                <div style={{ fontSize: '12px', color: '#78716C', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Gain</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: color }}>+{totalGain.toFixed(2)} <span style={{ fontSize: '14px', color: '#78716C' }}>kg</span></div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#78716C', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sessions</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#1C1917' }}>{sessions.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weight Progression */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#1C1917' }}>Weight Progression</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={sessions} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={APP_COLORS.border} vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDate} ticks={ticks} tick={{ fontSize: 11, fill: '#78716C' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#78716C' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} unit="kg" />
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
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#1C1917' }}>
            Training Volume
            <span style={{ fontSize: '12px', fontWeight: '400', color: '#78716C', marginLeft: '8px' }}>weight × reps per session</span>
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={volumeData} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={APP_COLORS.border} vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDate} ticks={ticks} tick={{ fontSize: 11, fill: '#78716C' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#78716C' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip color={color} />} />
              <Bar dataKey="volume" fill={colorLight} stroke={color} strokeWidth={1} radius={[4, 4, 0, 0]} name="Volume" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RIR Progression — Premium */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1C1917' }}>Reps in Reserve (RIR)</h3>
            <span style={{
              background: color,
              borderRadius: '8px',
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: '700',
              color: '#1C1917',
              letterSpacing: '0.04em',
            }}>ADVANCED</span>
          </div>
          <p style={{ fontSize: '12px', color: '#78716C', margin: '0 0 12px' }}>
            How many more reps you could have done. Lower = harder effort. Approaching 0 means maximum intensity.
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={sessions} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={APP_COLORS.border} vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDate} ticks={ticks} tick={{ fontSize: 11, fill: '#78716C' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#78716C' }} axisLine={false} tickLine={false} domain={[0, 4]} ticks={[0,1,2,3,4]} />
              <Tooltip content={<CustomTooltip color={color} />} />
              <ReferenceLine y={0} stroke={color} strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Max effort', position: 'right', fontSize: 10, fill: color }} />
              <Line type="monotone" dataKey="rir" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="RIR" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RPE / Intensity */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1C1917' }}>Training Intensity (RPE)</h3>
            <span style={{
              background: color,
              borderRadius: '8px',
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: '700',
              color: '#1C1917',
              letterSpacing: '0.04em',
            }}>ADVANCED</span>
          </div>
          <p style={{ fontSize: '12px', color: '#78716C', margin: '0 0 12px' }}>
            Rate of Perceived Exertion on a 1–10 scale. Consistently high RPE reflects a high-intensity training approach.
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={sessions} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={APP_COLORS.border} vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDate} ticks={ticks} tick={{ fontSize: 11, fill: '#78716C' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#78716C' }} axisLine={false} tickLine={false} domain={[0, 10]} ticks={[0,5,10]} />
              <Tooltip content={<CustomTooltip color={color} />} />
              <Bar dataKey="rpe" fill={color} opacity={0.7} radius={[3, 3, 0, 0]} name="RPE" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
