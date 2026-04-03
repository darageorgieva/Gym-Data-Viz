import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MUSCLE_CONFIG } from '../config';

const HALF_W = 768;
const FULL_H = 1024;
const DISPLAY_HEIGHT = 480;
const DISPLAY_W = Math.round(HALF_W * (DISPLAY_HEIGHT / FULL_H)); // 360

// Approximate RGB values of each muscle region in body.png.
// Used to identify which muscle is under the cursor via color sampling.
const MUSCLE_COLORS = [
  { muscle: 'Shoulders',  rgb: [200, 120,  70] },
  { muscle: 'Chest',      rgb: [195, 130, 115] },
  { muscle: 'Biceps',     rgb: [160, 175,  90] },
  { muscle: 'Triceps',    rgb: [130, 155,  80] },
  { muscle: 'Abs',        rgb: [ 95, 115,  60] },
  { muscle: 'Quads',      rgb: [105, 140, 175] },
  { muscle: 'Calves',     rgb: [110, 100, 148] },
  { muscle: 'Traps',      rgb: [135,  60,  58] },
  { muscle: 'Rear Delts', rgb: [190, 115,  65] },
  { muscle: 'Lats',       rgb: [130, 110,  58] },
  { muscle: 'Glutes',     rgb: [110, 158, 158] },
  { muscle: 'Hamstrings', rgb: [ 98, 112, 158] },
];

const COLOR_THRESHOLD = 55; // max Euclidean RGB distance to count as a match

function nearestMuscle(r, g, b) {
  let best = null;
  let bestDist = COLOR_THRESHOLD;
  for (const { muscle, rgb } of MUSCLE_COLORS) {
    const d = Math.sqrt((r - rgb[0]) ** 2 + (g - rgb[1]) ** 2 + (b - rgb[2]) ** 2);
    if (d < bestDist) { bestDist = d; best = muscle; }
  }
  return best;
}

export default function BodySVG({ onMuscleClick }) {
  const [hovered, setHovered] = useState(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const imgUrl = process.env.PUBLIC_URL + '/body.png';

  // Draw image to hidden canvas once loaded
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = 1536;
      canvas.height = 1024;
      canvas.getContext('2d').drawImage(img, 0, 0);
      imgRef.current = img;
      setImgLoaded(true);
    };
    img.src = imgUrl;
  }, [imgUrl]);

  // Sample pixel at image coordinates and return muscle name (or null)
  const sampleMuscle = useCallback((imgX, imgY) => {
    const canvas = canvasRef.current;
    if (!canvas || !imgLoaded) return null;
    const [r, g, b] = canvas.getContext('2d').getImageData(
      Math.round(imgX), Math.round(imgY), 1, 1
    ).data;
    return nearestMuscle(r, g, b);
  }, [imgLoaded]);

  const handleMouseMove = useCallback((e, xOffset) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const displayX = e.clientX - rect.left;
    const displayY = e.clientY - rect.top;
    // Convert display coords → image coords
    const imgX = xOffset + displayX * (HALF_W / DISPLAY_W);
    const imgY = displayY * (FULL_H / DISPLAY_HEIGHT);
    setHovered(sampleMuscle(imgX, imgY));
  }, [sampleMuscle]);

  const handleClick = useCallback((e, xOffset) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const imgX = xOffset + (e.clientX - rect.left) * (HALF_W / DISPLAY_W);
    const imgY = (e.clientY - rect.top) * (FULL_H / DISPLAY_HEIGHT);
    const muscle = sampleMuscle(imgX, imgY);
    if (muscle) onMuscleClick(muscle);
  }, [sampleMuscle, onMuscleClick]);

  const labelStyle = {
    fontSize: '12px', color: '#78716C', marginBottom: '8px',
    fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase',
  };

  const dividerStyle = {
    position: 'absolute', top: 0, left: 0,
    width: DISPLAY_W, height: DISPLAY_HEIGHT,
    cursor: hovered ? 'pointer' : 'default',
  };

  return (
    <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', justifyContent: 'center' }}>
      {/* Hidden canvas for pixel sampling */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* FRONT */}
      <div style={{ textAlign: 'center' }}>
        <p style={labelStyle}>Anterior</p>
        <div style={{ position: 'relative', width: DISPLAY_W, height: DISPLAY_HEIGHT }}>
          <svg width={DISPLAY_W} height={DISPLAY_HEIGHT} viewBox={`0 0 ${HALF_W} ${FULL_H}`}
            style={{ display: 'block' }}>
            <image href={imgUrl} x="0" y="0" width="1536" height="1024" />
          </svg>
          <div
            style={dividerStyle}
            onMouseMove={(e) => handleMouseMove(e, 0)}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => handleClick(e, 0)}
          />
        </div>
      </div>

      {/* BACK */}
      <div style={{ textAlign: 'center' }}>
        <p style={labelStyle}>Posterior</p>
        <div style={{ position: 'relative', width: DISPLAY_W, height: DISPLAY_HEIGHT }}>
          <svg width={DISPLAY_W} height={DISPLAY_HEIGHT} viewBox={`${HALF_W} 0 ${HALF_W} ${FULL_H}`}
            style={{ display: 'block' }}>
            <image href={imgUrl} x="0" y="0" width="1536" height="1024" />
          </svg>
          <div
            style={dividerStyle}
            onMouseMove={(e) => handleMouseMove(e, HALF_W)}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => handleClick(e, HALF_W)}
          />
        </div>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: 'fixed', bottom: '32px', left: '50%',
          transform: 'translateX(-50%)',
          background: MUSCLE_CONFIG[hovered]?.color,
          color: '#1C1917', padding: '10px 24px', borderRadius: '24px',
          fontSize: '14px', fontWeight: '600', pointerEvents: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
        }}>
          {hovered} · {MUSCLE_CONFIG[hovered]?.exercise}
        </div>
      )}
    </div>
  );
}
