import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MUSCLE_CONFIG } from '../config';
import {
  SVG_REGION_TO_MUSCLE,
  getMuscleForRegion,
  isKnownSvgRegion,
} from '../muscleRegionConfig';

const MODEL_SVG_URL = process.env.PUBLIC_URL + '/model.svg';

function findRegionId(target) {
  const region = target.closest?.('path[id]');
  if (!region) return null;

  return isKnownSvgRegion(region.id) ? region.id : null;
}

function interpolateHeatmapColor(intensity) {
  const start = [255, 255, 255];
  const end = [33, 115, 70];
  const rgb = start.map((channel, index) => (
    Math.round(channel + (end[index] - channel) * intensity)
  ));

  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function buildRegionColorRulesForMode(displayMode, muscleHeatmapValues) {
  const maxValue = Math.max(0, ...Object.values(muscleHeatmapValues || {}));

  return Object.entries(SVG_REGION_TO_MUSCLE).map(([regionId, muscle]) => {
    const config = muscle ? MUSCLE_CONFIG[muscle] : null;
    const heatmapValue = muscle ? (muscleHeatmapValues?.[muscle] || 0) : 0;

    let fill = '#FFFFFF';
    let opacity = '0.22';

    if (displayMode === 'heatmap') {
      const intensity = maxValue > 0 ? heatmapValue / maxValue : 0;
      fill = interpolateHeatmapColor(intensity);
      opacity = '1';
    } else {
      fill = config?.color || '#D6D3D1';
      opacity = config ? '0.72' : '0.22';
    }

    return `
        .body-model-svg #Click-regions path[id="${regionId}"] {
          fill: ${fill} !important;
          fill-opacity: ${opacity} !important;
        }`;
  }).join('\n');
}

function getRegionSide(regionId) {
  return regionId.startsWith('back-') ? 'back' : 'front';
}

function getRegionGroupKey(regionId) {
  const muscle = getMuscleForRegion(regionId);
  if (!muscle) return null;

  return `${getRegionSide(regionId)}:${muscle}`;
}

function setRegionHighlight(regionIdToMatch, enabled) {
  const muscle = getMuscleForRegion(regionIdToMatch);
  const side = getRegionSide(regionIdToMatch);
  if (!muscle) return;

  Object.entries(SVG_REGION_TO_MUSCLE).forEach(([regionId, mappedMuscle]) => {
    if (mappedMuscle !== muscle) return;
    if (getRegionSide(regionId) !== side) return;

    const region = document.getElementById(regionId);
    if (!region) return;

    region.classList.toggle('is-group-hovered', enabled);
  });
}

function formatVolume(value) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

export default function BodySVG({ onMuscleClick, displayMode = 'simple', muscleHeatmapValues = {} }) {
  const [svgMarkup, setSvgMarkup] = useState('');
  const [loadError, setLoadError] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const containerRef = React.useRef(null);
  const regionColorRules = useMemo(
    () => buildRegionColorRulesForMode(displayMode, muscleHeatmapValues),
    [displayMode, muscleHeatmapValues]
  );

  useEffect(() => {
    let cancelled = false;

    fetch(MODEL_SVG_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${MODEL_SVG_URL}`);
        }
        return response.text();
      })
      .then((markup) => {
        if (!cancelled) setSvgMarkup(markup);
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!svgMarkup || !containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (svgEl) {
      svgEl.setAttribute('viewBox', '0 68 210 165');
      svgEl.removeAttribute('width');
      svgEl.removeAttribute('height');
    }
  }, [svgMarkup]);

  const hoveredMuscle = hoveredRegion ? getMuscleForRegion(hoveredRegion) : null;
  const hoveredConfig = hoveredMuscle ? MUSCLE_CONFIG[hoveredMuscle] : null;
  const hoveredHeatmapValue = hoveredMuscle ? (muscleHeatmapValues[hoveredMuscle] || 0) : 0;
  const hoveredHeatmapColor = interpolateHeatmapColor(
    Math.max(0, ...Object.values(muscleHeatmapValues || {})) > 0
      ? hoveredHeatmapValue / Math.max(1, ...Object.values(muscleHeatmapValues || {}))
      : 0
  );

  const handleMouseMove = useCallback((event) => {
    const regionId = findRegionId(event.target);
    setHoveredRegion((current) => {
      if (current === regionId) return current;

      const currentGroup = current ? getRegionGroupKey(current) : null;
      const nextGroup = regionId ? getRegionGroupKey(regionId) : null;

      if (current && currentGroup !== nextGroup) {
        setRegionHighlight(current, false);
      }

      if (regionId && currentGroup !== nextGroup) {
        setRegionHighlight(regionId, true);
      }

      return regionId;
    });
  }, []);

  const clearHover = useCallback(() => {
    if (hoveredRegion) setRegionHighlight(hoveredRegion, false);
    setHoveredRegion(null);
  }, [hoveredRegion]);

  const handleClick = useCallback((event) => {
    const regionId = findRegionId(event.target);
    if (!regionId) return;

    const muscle = getMuscleForRegion(regionId);
    if (muscle) onMuscleClick(muscle);
  }, [onMuscleClick]);

  if (loadError) {
    return (
      <div style={{ color: '#78716C', fontSize: '14px' }}>
        {loadError}
      </div>
    );
  }

  if (!svgMarkup) {
    return (
      <div style={{ color: '#78716C', fontSize: '14px' }}>
        Loading body model...
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: 'min(920px, 100%)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <style>{`
        .body-model-svg svg {
          display: block;
          width: 100%;
          height: auto;
          max-height: 760px;
        }

        .body-model-svg #Reference {
          pointer-events: none;
        }

        .body-model-svg #Click-regions path {
          cursor: pointer;
          transition: fill-opacity 120ms ease, stroke 120ms ease, stroke-width 120ms ease;
        }

        ${regionColorRules}

        .body-model-svg #Click-regions path:hover,
        .body-model-svg #Click-regions path.is-group-hovered {
          fill-opacity: 0.95 !important;
          stroke: #1C1917 !important;
          stroke-width: 0.45 !important;
        }
      `}</style>

      <div
        ref={containerRef}
        className="body-model-svg"
        onMouseMove={handleMouseMove}
        onMouseLeave={clearHover}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />

      {hoveredRegion && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: displayMode === 'heatmap'
            ? hoveredHeatmapColor
            : (hoveredConfig?.color || '#E7E5E0'),
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
          {displayMode === 'heatmap'
            ? `${hoveredMuscle || hoveredRegion} · ${formatVolume(hoveredHeatmapValue)} kg`
            : (hoveredMuscle
              ? `${hoveredMuscle} · ${hoveredConfig?.exercise}`
              : `Unmapped region · ${hoveredRegion}`)}
        </div>
      )}
    </div>
  );
}
