import React from 'react';
import { RadarAxisPoint } from '../../types/epidemiology';

interface PathogenRadarChartProps {
  axes: RadarAxisPoint[];
  selectedPathogenId?: string;
}

export const PathogenRadarChart: React.FC<PathogenRadarChartProps> = ({
  axes,
}) => {
  // 5-point radar polygon calculation on 300x240 viewbox
  const cx = 150;
  const cy = 115;
  const maxRadius = 78;
  const numPoints = axes.length;

  const getCoordinates = (index: number, valRadius: number) => {
    // Start at top (-90 degrees)
    const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
    const x = cx + valRadius * Math.cos(angle);
    const y = cy + valRadius * Math.sin(angle);
    return { x, y };
  };

  // Generate concentric polygon grid rings (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const ringPolygons = gridLevels.map((lvl) => {
    return Array.from({ length: numPoints })
      .map((_, i) => {
        const { x, y } = getCoordinates(i, maxRadius * lvl);
        return `${x},${y}`;
      })
      .join(' ');
  });

  // Calculate polygon points for the actual data
  const dataPolygon = axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(i, maxRadius * axis.value);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none">
      <svg viewBox="0 0 300 230" className="w-full h-full max-h-[200px] overflow-visible">
        <defs>
          <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Concentric Grid Polygons */}
        {ringPolygons.map((poly, idx) => (
          <polygon
            key={idx}
            points={poly}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={idx === gridLevels.length - 1 ? '1.5' : '1'}
            strokeDasharray={idx === gridLevels.length - 1 ? undefined : '2 2'}
          />
        ))}

        {/* Axis Spokes from center to edge */}
        {axes.map((_, i) => {
          const { x, y } = getCoordinates(i, maxRadius);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Shape */}
        <polygon
          points={dataPolygon}
          fill="url(#radarFill)"
          stroke="#2563eb"
          strokeWidth="2"
        />

        {/* Vertex Dots */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(i, maxRadius * axis.value);
          const isMalaria = axis.axis.includes('MALARIA');

          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="3.5"
                fill={isMalaria ? '#dc2626' : '#2563eb'}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          );
        })}

        {/* Axis Labels */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(i, maxRadius + 14);
          const isMalaria = axis.axis.includes('MALARIA');

          return (
            <text
              key={`label-${i}`}
              x={x}
              y={y + (y > cy ? 5 : -2)}
              textAnchor="middle"
              className="text-[8px] font-bold tracking-wider select-none font-mono"
              fill={isMalaria ? '#b91c1c' : '#475569'}
            >
              {axis.axis}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
