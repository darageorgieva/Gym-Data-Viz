import React from 'react';

const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

export default function TrainingHeatmap({ muscleDates, color, colorLight }) {
  const dateSet = new Set(muscleDates);

  // Build calendar from Oct 1 2024 to Mar 31 2025
  const start = new Date('2024-10-01');
  const end = new Date('2025-03-31');

  // Build weeks
  const weeks = [];
  let current = new Date(start);
  // Align to Monday
  const dayOfWeek = current.getDay(); // 0=Sun
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  current.setDate(current.getDate() + offset);

  while (current <= end) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = current.toISOString().split('T')[0];
      const inRange = current >= start && current <= end;
      week.push({
        date: dateStr,
        inRange,
        trained: inRange && dateSet.has(dateStr),
        month: current.getMonth(),
        dayOfMonth: current.getDate(),
      });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  const cellSize = 13;
  const gap = 3;
  const step = cellSize + gap;

  // Month label positions
  const monthLabels = [];
  let prevMonth = null;
  weeks.forEach((week, wi) => {
    const firstInRange = week.find(d => d.inRange);
    if (firstInRange && firstInRange.month !== prevMonth) {
      monthLabels.push({ x: wi * step, month: firstInRange.month });
      prevMonth = firstInRange.month;
    }
  });

  const dayLabels = ['M', 'W', 'F'];
  const dayIndices = [0, 2, 4]; // Mon, Wed, Fri in week array

  const svgWidth = weeks.length * step + 24;
  const svgHeight = 7 * step + 28;

  const trainedCount = muscleDates.length;
  const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
  const frequency = Math.round((trainedCount / totalDays) * 7 * 10) / 10;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1C1917' }}>Training Consistency</h3>
        <span style={{ fontSize: '13px', color: '#78716C' }}>
          {trainedCount} sessions · ~{frequency}x/week
        </span>
      </div>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <svg width={svgWidth} height={svgHeight}>
        {/* Month labels */}
        {monthLabels.map(({ x, month }) => (
          <text key={month} x={x + 24} y={12} fontSize="11" fill="#78716C" fontFamily="Arial">
            {MONTHS[month - 9 < 0 ? month - 9 + 12 : month - 9]}
          </text>
        ))}
        {/* Day labels */}
        {dayLabels.map((label, i) => (
          <text key={label} x={6} y={20 + dayIndices[i] * step + cellSize * 0.75} fontSize="10" fill="#78716C" fontFamily="Arial">
            {label}
          </text>
        ))}
        {/* Cells */}
        {weeks.map((week, wi) =>
          week.map((day, di) => (
            <rect
              key={day.date}
              x={wi * step + 24}
              y={di * step + 18}
              width={cellSize}
              height={cellSize}
              rx={3}
              fill={!day.inRange ? 'transparent' : day.trained ? color : colorLight}
              opacity={day.inRange ? 1 : 0}
            />
          ))
        )}
      </svg>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
        <span style={{ fontSize: '11px', color: '#78716C' }}>Less</span>
        {[colorLight, color].map((c, i) => (
          <rect key={i} />
        ))}
        <svg width="44" height="14">
          <rect x="0" y="1" width="12" height="12" rx="2" fill={colorLight} />
          <rect x="16" y="1" width="12" height="12" rx="2" fill={color} opacity="0.6" />
          <rect x="32" y="1" width="12" height="12" rx="2" fill={color} />
        </svg>
        <span style={{ fontSize: '11px', color: '#78716C' }}>More</span>
      </div>
    </div>
  );
}
