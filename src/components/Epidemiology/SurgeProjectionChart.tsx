import React from 'react';
import { TIME_SERIES_CHART } from '../../data/epidemiologyData';

interface SurgeProjectionChartProps {
  horizon: string;
  selectedPathogenName?: string;
}

export const SurgeProjectionChart: React.FC<SurgeProjectionChartProps> = ({
  horizon,
  selectedPathogenName,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Chart Canvas */}
      <div className="w-full h-44 bg-slate-50/50 rounded border border-slate-200/70 p-2 relative select-none">
        <svg viewBox="0 0 460 140" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="ciGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="35" y1="20" x2="445" y2="20" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="35" y1="50" x2="445" y2="50" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="35" y1="80" x2="445" y2="80" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="35" y1="110" x2="445" y2="110" stroke="#f1f5f9" strokeWidth="1" />

          {/* Y-Axis Labels */}
          <text x="30" y="23" textAnchor="end" fill="#94a3b8" fontSize="8" fontFamily="monospace">70k</text>
          <text x="30" y="53" textAnchor="end" fill="#94a3b8" fontSize="8" fontFamily="monospace">60k</text>
          <text x="30" y="83" textAnchor="end" fill="#94a3b8" fontSize="8" fontFamily="monospace">50k</text>
          <text x="30" y="113" textAnchor="end" fill="#94a3b8" fontSize="8" fontFamily="monospace">40k</text>

          {/* Vertical TODAY Line at x=235 */}
          <line
            x1="235"
            y1="10"
            x2="235"
            y2="120"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <text
            x="238"
            y="18"
            fill="#64748b"
            fontSize="8"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            TODAY
          </text>

          {/* Gray Baseline at y=106 (42k) */}
          <line
            x1="35"
            y1="106"
            x2="445"
            y2="106"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <text
            x="440"
            y="102"
            textAnchor="end"
            fill="#64748b"
            fontSize="7.5"
            fontFamily="monospace"
          >
            Baseline (42k)
          </text>

          {/* 95% Confidence Fan Area */}
          <polygon
            points="235,68 280,48 335,28 390,14 445,18 445,64 390,52 335,58 280,62 235,68"
            fill="url(#ciGradient)"
          />

          {/* Historical Trend Line (Solid Blue / dark slate up to TODAY) */}
          <path
            d="M 45,116 Q 95,112 140,105 T 190,88 T 235,68"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Projected Surge Curve (Continuing upwards and peaking) */}
          <path
            d="M 235,68 Q 285,46 340,32 T 400,24 T 445,30"
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="2.5"
            strokeDasharray="5 3"
            strokeLinecap="round"
          />

          {/* Peak Callout Dot */}
          <circle cx="400" cy="24" r="3.5" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
          <text
            x="395"
            y="14"
            textAnchor="middle"
            fill="#dc2626"
            fontSize="7.5"
            fontWeight="bold"
          >
            Peak +41.2% (T+10d)
          </text>

          {/* Today Point Dot */}
          <circle cx="235" cy="68" r="3.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />

          {/* X-Axis Time Markers */}
          <text x="45" y="132" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">T-14</text>
          <text x="140" y="132" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">T-7</text>
          <text x="235" y="132" textAnchor="middle" fill="#2563eb" fontSize="8" fontWeight="bold" fontFamily="monospace">TODAY</text>
          <text x="340" y="132" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">T+7</text>
          <text x="440" y="132" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">T+14</text>
        </svg>
      </div>
    </div>
  );
};
