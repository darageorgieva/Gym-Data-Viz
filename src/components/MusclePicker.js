import React, { useEffect, useRef, useState } from 'react';
import { MUSCLE_CONFIG, APP_COLORS } from '../config';

export default function MusclePicker({ muscle, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const config = MUSCLE_CONFIG[muscle];
  const color = config ? config.color : APP_COLORS.textFaint;

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <div
      ref={rootRef}
      style={{ position: 'relative', fontFamily: "'DM Sans', sans-serif" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 10px 6px 12px',
          background: APP_COLORS.background,
          border: `1px solid ${APP_COLORS.border}`,
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          color: APP_COLORS.text,
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: APP_COLORS.textFaint,
        }}>Muscle</span>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
        <span>{config ? config.label : muscle}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" style={{ marginLeft: 2 }} aria-hidden>
          <path d="M2 3.5 L5 6.5 L8 3.5" stroke={APP_COLORS.textLight} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9 }} />
          <div
            role="listbox"
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 6,
              background: APP_COLORS.background,
              border: `1px solid ${APP_COLORS.border}`,
              borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
              padding: 4,
              minWidth: 180,
              zIndex: 10,
              maxHeight: 360,
              overflowY: 'auto',
            }}
          >
            {Object.keys(MUSCLE_CONFIG).map((m) => {
              const mc = MUSCLE_CONFIG[m].color;
              const active = m === muscle;
              return (
                <button
                  key={m}
                  onClick={() => { onChange(m); setOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '7px 10px',
                    border: 'none',
                    background: active ? APP_COLORS.cardBackground : 'transparent',
                    cursor: 'pointer',
                    borderRadius: 5,
                    fontSize: 12.5,
                    fontWeight: active ? 700 : 500,
                    color: APP_COLORS.text,
                    textAlign: 'left',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: mc }} />
                  {MUSCLE_CONFIG[m].label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
