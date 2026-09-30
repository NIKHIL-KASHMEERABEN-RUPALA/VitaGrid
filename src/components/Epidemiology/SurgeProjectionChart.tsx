import React, { useState } from 'react';
import { PATHOGEN_PROFILES, PathogenHorizonData } from '../../data/epidemiologyData';

interface SurgeProjectionChartProps {
  horizon: string;
  selectedPathogenId?: string;
  selectedPathogenName?: string;
}

export const SurgeProjectionChart: React.FC<SurgeProjectionChartProps> = ({
  horizon,
  selectedPathogenId = 'malaria',
}) => {
  const profile = PATHOGEN_PROFILES[selectedPathogenId] || PATHOGEN_PROFILES.malaria;
  const horizonData: PathogenHorizonData =
    profile.horizons[horizon] || profile.horizons['14 Days (Recommended)'];

  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    label: string;
    value: number;
    ciUpper?: number;
    ciLower?: number;
    isProjected: boolean;
  } | null>(null);

  // Combine historical and projected data
  const allLabels = horizonData.labels;
  const baseline = horizonData.baselineValue;

  // Find min and max for scale
  const allVals = [
    baseline,
    ...horizonData.historical.map((d) => d.value),
    ...horizonData.projected.map((d) => d.ciUpper),
    ...horizonData.projected.map((d) => d.ciLower),
  ];
  const minVal = Math.floor(Math.min(...allVals) * 0.85);
  const maxVal = Math.ceil(Math.max(...allVals) * 1.15);
  const valRange = maxVal - minVal || 1;

  // Chart dimensions
  const width = 520;
  const height = 180;
  const padLeft = 45;
  const padRight = 30;
  const padTop = 25;
  const padBottom = 30;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const getX = (index: number) => padLeft + (index / (allLabels.length - 1)) * plotWidth;
  const getY = (val: number) => padTop + plotHeight - ((val - minVal) / valRange) * plotHeight;

  // Index where TODAY is located
  const todayIndex = allLabels.indexOf('TODAY') >= 0 ? allLabels.indexOf('TODAY') : Math.floor(allLabels.length / 2);
  const todayX = getX(todayIndex);

  // Historical coordinates
  const histPoints = horizonData.historical.map((pt) => {
    const idx = allLabels.indexOf(pt.label);
    return { x: getX(idx >= 0 ? idx : 0), y: getY(pt.value), label: pt.label, value: pt.value };
  });

  const histPath = histPoints.length > 0
    ? histPoints.reduce((acc, curr, i) => (i === 0 ? `M ${curr.x},${curr.y}` : `${acc} L ${curr.x},${curr.y}`), '')
    : '';

  // Projected coordinates
  const projPoints = horizonData.projected.map((pt) => {
    const idx = allLabels.indexOf(pt.label);
    return {
      x: getX(idx >= 0 ? idx : allLabels.length - 1),
      y: getY(pt.value),
      yUpper: getY(pt.ciUpper),
      yLower: getY(pt.ciLower),
      label: pt.label,
      value: pt.value,
      ciUpper: pt.ciUpper,
      ciLower: pt.ciLower,
    };
  });

  const projPath = projPoints.length > 0
    ? projPoints.reduce((acc, curr, i) => (i === 0 ? `M ${curr.x},${curr.y}` : `${acc} L ${curr.x},${curr.y}`), '')
    : '';

  // 95% Confidence Fan Polygon
  const fanUpper = projPoints.map((p) => `${p.x},${p.yUpper}`).join(' ');
  const fanLower = [...projPoints].reverse().map((p) => `${p.x},${p.yLower}`).join(' ');
  const fanPolygon = `${fanUpper} ${fanLower}`;

  // Peak point
  const peakProj = projPoints.reduce(
    (max, curr) => (curr.value > max.value ? curr : max),
    projPoints[0] || { x: 0, y: 0, value: 0, label: '' }
  );

  // Today point
  const todayPoint = histPoints[histPoints.length - 1] || { x: todayX, y: getY(baseline), value: baseline };

  // Y-Axis tick values
  const yTicks = [
    maxVal,
    Math.round(minVal + valRange * 0.66),
    Math.round(minVal + valRange * 0.33),
    minVal,
  ];

  return (
    <div className="w-full flex flex-col justify-between">
      <div className="w-full h-52 bg-slate-50/60 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 p-2.5 relative select-none">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`ciGrad-${selectedPathogenId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.08" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#2563eb" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Grid lines & Y-Axis Labels */}
          {yTicks.map((val, i) => {
            const y = getY(val);
            return (
              <g key={`ytick-${i}`}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800/80"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] font-mono fill-slate-400 dark:fill-slate-500"
                >
                  {val >= 10 ? `${val}k` : `${val.toFixed(1)}k`}
                </text>
              </g>
            );
          })}

          {/* Gray Baseline */}
          <line
            x1={padLeft}
            y1={getY(baseline)}
            x2={width - padRight}
            y2={getY(baseline)}
            stroke="currentColor"
            className="text-slate-400 dark:text-slate-600"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />
          <text
            x={width - padRight}
            y={getY(baseline) - 4}
            textAnchor="end"
            className="text-[8px] font-mono font-bold fill-slate-500 dark:fill-slate-400"
          >
            Baseline ({baseline}k)
          </text>

          {/* Vertical TODAY Line */}
          <line
            x1={todayX}
            y1={padTop - 8}
            x2={todayX}
            y2={height - padBottom + 4}
            stroke="currentColor"
            className="text-blue-400 dark:text-cyan-500"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <text
            x={todayX + 4}
            y={padTop - 2}
            className="text-[9px] font-bold fill-blue-600 dark:fill-cyan-400 font-mono tracking-wider"
          >
            TODAY
          </text>

          {/* 95% Confidence Fan Area */}
          {projPoints.length > 1 && (
            <polygon points={fanPolygon} fill={`url(#ciGrad-${selectedPathogenId})`} />
          )}

          {/* Historical Trend Line (Solid) */}
          <path
            d={histPath}
            fill="none"
            stroke="#2563eb"
            className="dark:stroke-cyan-400"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Projected Surge Curve (Dashed) */}
          <path
            d={projPath}
            fill="none"
            stroke="#1d4ed8"
            className="dark:stroke-blue-400"
            strokeWidth="2.5"
            strokeDasharray="5 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Historical Interactive Point Dots */}
          {histPoints.map((pt, i) => (
            <circle
              key={`hist-dot-${i}`}
              cx={pt.x}
              cy={pt.y}
              r={pt.label === 'TODAY' ? 4.5 : 3}
              fill={pt.label === 'TODAY' ? '#2563eb' : '#3b82f6'}
              stroke="#ffffff"
              strokeWidth="1.5"
              className="cursor-pointer transition-all hover:r-5 hover:fill-blue-700"
              onMouseEnter={() =>
                setHoveredPoint({
                  x: pt.x,
                  y: pt.y,
                  label: pt.label,
                  value: pt.value,
                  isProjected: false,
                })
              }
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* Projected Interactive Point Dots */}
          {projPoints.map((pt, i) => {
            const isPeak = pt.label === peakProj.label;
            return (
              <circle
                key={`proj-dot-${i}`}
                cx={pt.x}
                cy={pt.y}
                r={isPeak ? 5 : 3.5}
                fill={isPeak ? '#dc2626' : '#2563eb'}
                stroke="#ffffff"
                strokeWidth="1.5"
                className="cursor-pointer transition-all hover:r-5"
                onMouseEnter={() =>
                  setHoveredPoint({
                    x: pt.x,
                    y: pt.y,
                    label: pt.label,
                    value: pt.value,
                    ciUpper: pt.ciUpper,
                    ciLower: pt.ciLower,
                    isProjected: true,
                  })
                }
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}

          {/* Peak Callout Badge */}
          {peakProj && (
            <g>
              <circle cx={peakProj.x} cy={peakProj.y} r="7" fill="#dc2626" opacity="0.25" className="animate-ping" />
              <rect
                x={Math.min(peakProj.x - 45, width - padRight - 90)}
                y={Math.max(peakProj.y - 24, padTop - 15)}
                width="90"
                height="16"
                rx="4"
                fill="#dc2626"
              />
              <text
                x={Math.min(peakProj.x - 45, width - padRight - 90) + 45}
                y={Math.max(peakProj.y - 24, padTop - 15) + 11}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="8"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {horizonData.peakLabel}
              </text>
            </g>
          )}

          {/* X-Axis Time Markers */}
          {allLabels.map((lbl, idx) => {
            const x = getX(idx);
            const isToday = lbl === 'TODAY';
            return (
              <text
                key={`xlabel-${idx}`}
                x={x}
                y={height - 10}
                textAnchor="middle"
                className={`text-[8.5px] font-mono ${
                  isToday
                    ? 'font-bold fill-blue-600 dark:fill-cyan-400'
                    : 'fill-slate-400 dark:fill-slate-500'
                }`}
              >
                {lbl}
              </text>
            );
          })}

          {/* Floating Hover Tooltip */}
          {hoveredPoint && (
            <g transform={`translate(${Math.min(Math.max(hoveredPoint.x, 70), width - 80)}, ${Math.max(hoveredPoint.y - 45, 20)})`}>
              <rect
                x="-65"
                y="-15"
                width="130"
                height="34"
                rx="5"
                fill="#0f172a"
                opacity="0.95"
                stroke="#334155"
                strokeWidth="1"
              />
              <text x="0" y="-3" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                {hoveredPoint.label} {hoveredPoint.isProjected ? '(Projected)' : '(Verified)'}
              </text>
              <text x="0" y="10" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                {hoveredPoint.value}k cases
                {hoveredPoint.ciUpper !== undefined && ` [${hoveredPoint.ciLower}k - ${hoveredPoint.ciUpper}k]`}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Sub-strip with dynamic horizon statistics */}
      <div className="flex flex-wrap items-center justify-between text-[11px] pt-2 text-slate-500 dark:text-slate-400 font-mono">
        <span>
          Expected Saturation: <strong className="text-slate-800 dark:text-slate-200">{horizonData.bedOccupancyPct}% ICU Beds</strong>
        </span>
        <span className="text-red-600 dark:text-red-400 font-bold">
          Ventilator Surge: +{horizonData.icuVentDemand} Units
        </span>
        <span>
          Apex Window: <strong className="text-blue-600 dark:text-cyan-400">{horizonData.peakOffset}</strong>
        </span>
      </div>
    </div>
  );
};
