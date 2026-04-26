import React, { useCallback, useEffect, useState } from 'react';
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

function buildRegionColorRules() {
  return Object.entries(SVG_REGION_TO_MUSCLE).map(([regionId, muscle]) => {
    const config = muscle ? MUSCLE_CONFIG[muscle] : null;
    const fill = config?.color || '#D6D3D1';
    const opacity = config ? '0.72' : '0.22';

    return `
        .body-model-svg #Click-regions path[id="${regionId}"] {
          fill: ${fill} !important;
          fill-opacity: ${opacity} !important;
        }`;
  }).join('\n');
}

const REGION_COLOR_RULES = buildRegionColorRules();

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

export default function BodySVG({ onMuscleClick }) {
  const [svgMarkup, setSvgMarkup] = useState('');
  const [loadError, setLoadError] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);

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

  const hoveredMuscle = hoveredRegion ? getMuscleForRegion(hoveredRegion) : null;
  const hoveredConfig = hoveredMuscle ? MUSCLE_CONFIG[hoveredMuscle] : null;

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
        width: 'min(760px, 100%)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <style>{`
        .body-model-svg svg {
          display: block;
          width: 100%;
          height: auto;
          max-height: 620px;
        }

        .body-model-svg #Reference {
          pointer-events: none;
        }

        .body-model-svg #Click-regions path {
          cursor: pointer;
          transition: fill-opacity 120ms ease, stroke 120ms ease, stroke-width 120ms ease;
        }

        ${REGION_COLOR_RULES}

        .body-model-svg #Click-regions path:hover,
        .body-model-svg #Click-regions path.is-group-hovered {
          fill-opacity: 0.95 !important;
          stroke: #1C1917 !important;
          stroke-width: 0.45 !important;
        }
      `}</style>

      <div
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
          background: hoveredConfig?.color || '#E7E5E0',
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
          {hoveredMuscle
            ? `${hoveredMuscle} · ${hoveredConfig?.exercise}`
            : `Unmapped region · ${hoveredRegion}`}
        </div>
      )}
    </div>
  );
}
