import React, { useState } from 'react';
import { RadarAxisPoint } from '../../types/epidemiology';

interface PathogenRadarChartProps {
  axes: RadarAxisPoint[];
  selectedPathogenId?: string;
}

export const PathogenRadarChart: React.FC<PathogenRadarChartProps> = ({
  axes,
  selectedPathogenId = 'malaria',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 6-point or 5-point radar polygon calculation on 320x240 viewbox
  const cx = 160;
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
    <div className="w-full h-full flex flex-col items-center justify-center select-none py-1">
      <svg viewBox="0 0 320 235" className="w-full h-full max-h-[200px] overflow-visible">
        <defs>
          <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.20" />
          </linearGradient>
        </defs>

        {/* Concentric Grid Polygons */}
        {ringPolygons.map((poly, idx) => (
          <polygon
            key={`ring-${idx}`}
            points={poly}
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth={idx === gridLevels.length - 1 ? '1.5' : '1'}
            strokeDasharray={idx === gridLevels.length - 1 ? undefined : '2 2'}
          />
        ))}

        {/* Axis Spokes from center to edge */}
        {axes.map((_, i) => {
          const { x, y } = getCoordinates(i, maxRadius);
          return (
            <line
              key={`spoke-${i}`}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="currentColor"
              className="text-slate-300 dark:text-slate-700/80"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Shape */}
        <polygon
          points={dataPolygon}
          fill="url(#radarFill)"
          stroke="#2563eb"
          className="dark:stroke-cyan-400"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Vertex Dots with hover interactivity */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(i, maxRadius * axis.value);
          const isSelected =
            axis.axis.toLowerCase().includes(selectedPathogenId.toLowerCase()) ||
            (selectedPathogenId === 'malaria' && axis.axis.includes('MALARIA')) ||
            (selectedPathogenId === 'cholera' && axis.axis.includes('CHOLERA')) ||
            (selectedPathogenId === 'rotavirus' && axis.axis.includes('ROTAVIRUS')) ||
            (selectedPathogenId === 'rsv' && axis.axis.includes('RSV')) ||
            (selectedPathogenId === 'typhoid' && axis.axis.includes('TYPHOID')) ||
            (selectedPathogenId === 'dengue' && axis.axis.includes('DENGUE'));

          return (
            <g
              key={`dot-${i}`}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {isSelected && (
                <circle cx={x} cy={y} r="8" fill="#dc2626" opacity="0.3" className="animate-ping" />
              )}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 5 : 3.5}
                fill={isSelected ? '#dc2626' : '#2563eb'}
                stroke="#ffffff"
                strokeWidth="1.5"
                className="transition-all hover:r-6"
              />
            </g>
          );
        })}

        {/* Axis Labels */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(i, maxRadius + 15);
          const isSelected =
            axis.axis.toLowerCase().includes(selectedPathogenId.toLowerCase()) ||
            (selectedPathogenId === 'malaria' && axis.axis.includes('MALARIA')) ||
            (selectedPathogenId === 'cholera' && axis.axis.includes('CHOLERA')) ||
            (selectedPathogenId === 'rotavirus' && axis.axis.includes('ROTAVIRUS')) ||
            (selectedPathogenId === 'rsv' && axis.axis.includes('RSV')) ||
            (selectedPathogenId === 'typhoid' && axis.axis.includes('TYPHOID')) ||
            (selectedPathogenId === 'dengue' && axis.axis.includes('DENGUE'));

          return (
            <text
              key={`label-${i}`}
              x={x}
              y={y + (y > cy ? 5 : -2)}
              textAnchor="middle"
              className={`text-[8px] font-mono tracking-wider transition-colors ${
                isSelected
                  ? 'font-black fill-red-600 dark:fill-red-400'
                  : 'font-medium fill-slate-500 dark:fill-slate-400'
              }`}
            >
              {axis.axis}
            </text>
          );
        })}

        {/* Hovered node tooltip */}
        {hoveredIndex !== null && (
          <g transform={`translate(${cx}, ${cy - 20})`}>
            <rect
              x="-60"
              y="-14"
              width="120"
              height="28"
              rx="4"
              fill="#0f172a"
              opacity="0.95"
              stroke="#334155"
              strokeWidth="1"
            />
            <text x="0" y="-1" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              {axes[hoveredIndex].axis}
            </text>
            <text x="0" y="9" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">
              {axes[hoveredIndex].label} (Polar: {axes[hoveredIndex].value.toFixed(2)})
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
