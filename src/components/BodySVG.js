import React, { useState } from 'react';
import { MUSCLE_CONFIG } from '../config';

// Image is 1536x1024. Front body: left half, Back body: right half.
// We display each half separately at a fixed display height.
// Coordinates below are in image-space (0-768 for front, 768-1536 for back, 0-1024 tall)
// and will be scaled to display size via SVG viewBox.

const FRONT_W = 768;
const FRONT_H = 1024;
const BACK_OFFSET_X = 768; // back starts at x=768 in the full image

// Each region: { muscle, points: [[x,y],...] } in image coordinates
const FRONT_REGIONS = [
  // Shoulders (orange area, both sides)
  { muscle: 'Shoulders', points: [[155,185],[120,215],[108,270],[130,310],[165,295],[185,250],[185,210]] },
  { muscle: 'Shoulders', points: [[490,185],[530,215],[545,270],[520,310],[490,295],[475,250],[475,210]] },

  // Chest (pink pec area)
  { muscle: 'Chest', points: [[220,210],[320,195],[380,210],[370,300],[320,325],[220,300],[200,265]] },
  { muscle: 'Chest', points: [[320,195],[430,210],[460,265],[440,300],[380,325],[320,300]] },

  // Biceps (yellow-green upper arm front)
  { muscle: 'Biceps', points: [[138,295],[110,360],[118,420],[155,435],[175,390],[175,310]] },
  { muscle: 'Biceps', points: [[510,295],[540,360],[530,420],[495,435],[475,390],[475,310]] },

  // Triceps (darker area back of upper arm, visible from front)
  { muscle: 'Triceps', points: [[108,305],[80,370],[88,430],[118,440],[118,420],[110,360],[138,295]] },
  { muscle: 'Triceps', points: [[550,305],[570,370],[562,430],[530,440],[530,420],[540,360],[510,295]] },

  // Abs (green segmented area)
  { muscle: 'Abs', points: [[255,330],[320,315],[390,330],[400,490],[370,530],[320,545],[270,530],[240,490]] },

  // Quads (large blue area thighs)
  { muscle: 'Quads', points: [[195,545],[175,560],[155,640],[160,730],[200,760],[250,755],[280,700],[285,620],[265,560]] },
  { muscle: 'Quads', points: [[265,560],[285,620],[280,700],[320,730],[355,700],[350,630],[330,560]] },
  { muscle: 'Quads', points: [[330,560],[350,630],[355,700],[395,760],[440,755],[470,720],[460,640],[440,570],[400,545]] },

  // Calves (purple lower leg front)
  { muscle: 'Calves', points: [[190,800],[185,870],[200,940],[240,955],[265,930],[260,855],[250,800]] },
  { muscle: 'Calves', points: [[380,800],[375,855],[380,930],[415,950],[450,940],[460,870],[455,800]] },
];

const BACK_REGIONS = [
  // Traps (dark red center upper back) - coords relative to full image (x starts at 768)
  { muscle: 'Traps', points: [[870,155],[960,175],[1050,155],[1060,230],[960,265],[860,230]] },

  // Rear Delts (orange shoulder area)
  { muscle: 'Rear Delts', points: [[780,195],[820,220],[855,285],[835,320],[795,300],[768,250]] },
  { muscle: 'Rear Delts', points: [[1140,195],[1100,220],[1065,285],[1085,320],[1125,300],[1152,250]] },

  // Lats (olive/brown large back area)
  { muscle: 'Lats', points: [[828,275],[870,265],[960,285],[1050,265],[1092,275],[1085,400],[1040,450],[960,470],[880,450],[835,400]] },

  // Triceps (yellow-green back of arm)
  { muscle: 'Triceps', points: [[768,255],[795,300],[810,370],[790,430],[760,440],[740,380],[745,295]] },
  { muscle: 'Triceps', points: [[1152,255],[1125,300],[1110,370],[1130,430],[1160,440],[1180,380],[1175,295]] },

  // Glutes (teal/blue round area)
  { muscle: 'Glutes', points: [[855,490],[870,480],[960,475],[1050,480],[1065,490],[1075,590],[1020,640],[960,655],[900,640],[845,590]] },

  // Hamstrings (blue-purple thighs back)
  { muscle: 'Hamstrings', points: [[845,660],[870,645],[950,660],[950,770],[920,810],[870,815],[840,775]] },
  { muscle: 'Hamstrings', points: [[970,660],[1050,645],[1075,660],[1080,775],[1050,815],[1000,810],[970,770]] },

  // Calves (purple lower legs back)
  { muscle: 'Calves', points: [[845,835],[848,920],[870,965],[910,970],[935,940],[930,855],[905,835]] },
  { muscle: 'Calves', points: [[985,835],[990,855],[985,940],[1010,970],[1050,965],[1072,920],[1075,835]] },

  // Traps upper portion
  { muscle: 'Traps', points: [[900,130],[960,118],[1020,130],[1050,155],[960,175],[870,155]] },
];

const DISPLAY_HEIGHT = 480;
const SCALE = DISPLAY_HEIGHT / FRONT_H; // scale factor
const DISPLAY_FRONT_W = FRONT_W * SCALE;
const DISPLAY_BACK_W = FRONT_W * SCALE; // same width

export default function BodySVG({ onMuscleClick }) {
  const [hovered, setHovered] = useState(null);

  const regionProps = (muscle) => ({
    fill: hovered === muscle ? MUSCLE_CONFIG[muscle]?.color + 'CC' : 'transparent',
    stroke: MUSCLE_CONFIG[muscle]?.color || '#fff',
    strokeWidth: hovered === muscle ? 2.5 : 1.5,
    strokeOpacity: hovered === muscle ? 1 : 0.5,
    style: { cursor: 'pointer', transition: 'all 0.18s ease' },
    onMouseEnter: () => setHovered(muscle),
    onMouseLeave: () => setHovered(null),
    onClick: () => onMuscleClick(muscle),
  });

  const toPoints = (pts, offsetX = 0) =>
    pts.map(([x, y]) => `${(x - offsetX) * SCALE},${y * SCALE}`).join(' ');

  return (
    <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', justifyContent: 'center' }}>

      {/* FRONT */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#78716C', marginBottom: '8px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Anterior</p>
        <div style={{ position: 'relative', width: DISPLAY_FRONT_W, height: DISPLAY_HEIGHT, overflow: 'hidden' }}>
          <img
            src={process.env.PUBLIC_URL + '/body.png'}
            alt="Female body front"
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: DISPLAY_FRONT_W * 2, // full image width scaled
              height: DISPLAY_HEIGHT,
              objectFit: 'cover',
              objectPosition: 'left center',
              pointerEvents: 'none',
            }}
          />
          <svg
            width={DISPLAY_FRONT_W}
            height={DISPLAY_HEIGHT}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {FRONT_REGIONS.map((region, i) => (
              <polygon
                key={i}
                points={toPoints(region.points)}
                {...regionProps(region.muscle)}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* BACK */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#78716C', marginBottom: '8px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Posterior</p>
        <div style={{ position: 'relative', width: DISPLAY_BACK_W, height: DISPLAY_HEIGHT, overflow: 'hidden' }}>
          <img
            src={process.env.PUBLIC_URL + '/body.png'}
            alt="Female body back"
            style={{
              position: 'absolute',
              top: 0,
              left: -DISPLAY_FRONT_W, // shift image left to show right half
              width: DISPLAY_FRONT_W * 2,
              height: DISPLAY_HEIGHT,
              pointerEvents: 'none',
            }}
          />
          <svg
            width={DISPLAY_BACK_W}
            height={DISPLAY_HEIGHT}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {BACK_REGIONS.map((region, i) => (
              <polygon
                key={i}
                points={toPoints(region.points, BACK_OFFSET_X)}
                {...regionProps(region.muscle)}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: MUSCLE_CONFIG[hovered]?.color,
          color: '#1C1917',
          padding: '10px 24px',
          borderRadius: '24px',
          fontSize: '14px',
          fontWeight: '600',
          pointerEvents: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
        }}>
          {hovered} · {MUSCLE_CONFIG[hovered]?.exercise}
        </div>
      )}
    </div>
  );
}
