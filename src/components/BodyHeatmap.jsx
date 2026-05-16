import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { APP_COLORS } from '../config';
import { REGION_TO_MUSCLE, MUSCLE_TO_REGIONS } from '../data/muscleRegions';
import { getProgressColor } from '../utils/colorScale';
import { getMuscleProgressByWeek } from '../utils/muscleProgress';
import { useIsMobile } from '../useIsMobile';
import TimeControls from './TimeControls';
import HeatmapLegend from './HeatmapLegend';

const MODEL_SVG_URL = process.env.PUBLIC_URL + '/model.svg';
const PLAY_INTERVAL_MS = 850;

function findRegionId(target) {
  const region = target.closest?.('path[id]');
  if (!region) return null;
  return Object.prototype.hasOwnProperty.call(REGION_TO_MUSCLE, region.id) ? region.id : null;
}

function formatPercent(value) {
  if (value == null || Number.isNaN(value)) return '0%';
  return `${value > 0 ? '+' : ''}${Math.round(value)}%`;
}

export default function BodyHeatmap({
  muscleTimeSeries,
  weekLabels,
  onMuscleSelect,
}) {
  const isMobile = useIsMobile();
  const [svgMarkup, setSvgMarkup] = useState('');
  const [loadError, setLoadError] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [comparisonMode, setComparisonMode] = useState('week-vs-month');
  const [hoveredMuscle, setHoveredMuscle] = useState(null);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const containerRef = useRef(null);

  const maxWeek = weekLabels.length;

  useEffect(() => {
    setSelectedWeek((current) => Math.min(Math.max(1, current), Math.max(1, maxWeek)));
  }, [maxWeek]);

  useEffect(() => {
    let cancelled = false;

    fetch(MODEL_SVG_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${MODEL_SVG_URL}`);
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

  useEffect(() => {
    if (!isPlaying || maxWeek <= 1) return undefined;

    const timer = window.setInterval(() => {
      setSelectedWeek((current) => {
        if (current >= maxWeek) return 1;
        return current + 1;
      });
    }, PLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isPlaying, maxWeek]);

  const progressByMuscle = useMemo(
    () => getMuscleProgressByWeek(muscleTimeSeries, selectedWeek, comparisonMode),
    [muscleTimeSeries, selectedWeek, comparisonMode]
  );

  const currentWeekLabel = weekLabels.find((item) => item.week === selectedWeek)?.label || '';
  const highlightedMuscle = hoveredMuscle || selectedMuscle;
  const highlightedRegions = highlightedMuscle ? (MUSCLE_TO_REGIONS[highlightedMuscle] || []) : [];

  const regionColorRules = useMemo(() => (
    Object.entries(REGION_TO_MUSCLE).map(([regionId, muscle]) => {
      if (!muscle) {
        return `
          .body-heatmap-svg #Click-regions path[id="${regionId}"] {
            fill: #ececef !important;
            fill-opacity: 1 !important;
          }`;
      }
      return `
        .body-heatmap-svg #Click-regions path[id="${regionId}"] {
          fill: ${getProgressColor(progressByMuscle[muscle])} !important;
          fill-opacity: 1 !important;
        }`;
    }).join('\n')
  ), [progressByMuscle]);

  const highlightRules = useMemo(() => (
    highlightedRegions.map((regionId) => `
      .body-heatmap-svg #Click-regions path[id="${regionId}"] {
        stroke: ${selectedMuscle === highlightedMuscle ? '#111111' : '#2f2f33'} !important;
        stroke-width: ${selectedMuscle === highlightedMuscle ? '0.75' : '0.55'} !important;
        opacity: 1 !important;
      }`).join('\n')
  ), [highlightedRegions, highlightedMuscle, selectedMuscle]);

  const handleMouseMove = useCallback((event) => {
    const regionId = findRegionId(event.target);
    setHoveredMuscle(regionId ? REGION_TO_MUSCLE[regionId] : null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredMuscle(null);
  }, []);

  const handleClick = useCallback((event) => {
    const regionId = findRegionId(event.target);
    if (!regionId) return;
    const muscle = REGION_TO_MUSCLE[regionId];
    if (!muscle) return;
    setSelectedMuscle(muscle);
    if (onMuscleSelect) onMuscleSelect(muscle);
  }, [onMuscleSelect]);

  const hoveredProgress = hoveredMuscle ? progressByMuscle[hoveredMuscle] : null;

  if (loadError) {
    return <div style={{ color: APP_COLORS.textLight }}>{loadError}</div>;
  }

  if (!svgMarkup) {
    return <div style={{ color: APP_COLORS.textLight }}>Loading body heatmap...</div>;
  }

  return (
    <div style={{ width: 'min(1100px, 100%)' }}>
      <TimeControls
        selectedWeek={selectedWeek}
        maxWeek={maxWeek}
        isPlaying={isPlaying}
        onWeekChange={setSelectedWeek}
        onTogglePlay={() => setIsPlaying((current) => !current)}
        currentWeekLabel={currentWeekLabel}
        comparisonMode={comparisonMode}
        onModeChange={setComparisonMode}
      />

      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '40px',
        alignItems: 'flex-start',
      }}>
        {/* SVG — left column, bigger */}
        <div style={{ flex: '0 0 62%', position: 'relative' }}>
          <style>{`
            .body-heatmap-svg svg {
              display: block;
              width: 100%;
              height: auto;
              max-height: 900px;
            }

            .body-heatmap-svg #Reference {
              pointer-events: none;
            }

            .body-heatmap-svg #Click-regions path {
              cursor: pointer;
              fill: #ececef !important;
              transition: fill 180ms ease, stroke 180ms ease, opacity 180ms ease, stroke-width 180ms ease;
              stroke: rgba(28, 25, 23, 0.18);
              stroke-width: 0.22;
            }

            ${regionColorRules}
            ${highlightRules}
          `}</style>

          <div
            ref={containerRef}
            className="body-heatmap-svg"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        </div>

        {/* Legend — right column */}
        <div style={{ flex: 1, paddingTop: isMobile ? '0' : '8px' }}>
          <HeatmapLegend comparisonMode={comparisonMode} />
        </div>
      </div>

      {hoveredMuscle && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: APP_COLORS.text,
          color: '#fff',
          padding: '10px 18px',
          borderRadius: '999px',
          fontSize: '13px',
          fontWeight: '600',
          pointerEvents: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
          whiteSpace: 'nowrap',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          {hoveredMuscle} · {formatPercent(hoveredProgress)}
        </div>
      )}
    </div>
  );
}
