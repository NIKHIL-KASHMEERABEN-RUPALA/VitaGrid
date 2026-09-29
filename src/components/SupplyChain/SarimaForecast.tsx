import React, { useState } from 'react';
import { TrendingUp, RefreshCw, CheckCircle2 } from 'lucide-react';
import { EssentialMedicine } from '../../types/supplyChain';

interface SarimaForecastProps {
  selectedMedicine: EssentialMedicine;
}

export const SarimaForecast: React.FC<SarimaForecastProps> = ({ selectedMedicine }) => {
  const [horizon, setHorizon] = useState<'7d' | '14d' | '30d' | '90d'>('14d');
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [retrainSuccess, setRetrainSuccess] = useState<boolean>(false);

  const handleRetrain = () => {
    setIsRetraining(true);
    setRetrainSuccess(false);
    setTimeout(() => {
      setIsRetraining(false);
      setRetrainSuccess(true);
      setTimeout(() => setRetrainSuccess(false), 3000);
    }, 900);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs p-4 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              SARIMA Forecast Curve
            </h3>
          </div>
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
            CONFIDENCE 95%
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
          <div>
            Selected: <strong className="text-slate-900">{selectedMedicine.name}</strong>
          </div>

          {/* Interactive Horizon Selector & Retrain Controls */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center bg-slate-100 rounded-md p-0.5 border border-slate-200">
              {(['7d', '14d', '30d', '90d'] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`px-1.5 py-0.5 text-[10px] font-semibold rounded transition-colors cursor-pointer ${
                    horizon === h
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>

            <button
              onClick={handleRetrain}
              disabled={isRetraining}
              title="Retrain SARIMAX parameters using 90-day DHIS2 empirical series"
              className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] font-semibold border border-blue-200 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${isRetraining ? 'animate-spin' : ''}`} />
              <span>{isRetraining ? 'Fitting...' : retrainSuccess ? 'Fitted' : 'Retrain Model'}</span>
            </button>
          </div>
        </div>

        {/* Timeline split headers */}
        <div className="flex items-center justify-between text-[11px] mb-1 font-medium">
          <span className="text-slate-500">Historical (T-14 to T-0)</span>
          <span className="text-blue-600 font-bold">Projection (T+1 to T+{horizon.toUpperCase()})</span>
        </div>

        {/* High-Fidelity SVG Chart Canvas */}
        <div className="w-full h-36 bg-slate-50/60 rounded-md border border-slate-200/70 relative overflow-hidden select-none p-2">
          <svg viewBox="0 0 340 120" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="forecastBand" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="10" y1="20" x2="330" y2="20" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="10" y1="50" x2="330" y2="50" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="10" y1="80" x2="330" y2="80" stroke="#f1f5f9" strokeWidth="1" />

            {/* Vertical Split Line: TODAY (T-0) */}
            <line
              x1="170"
              y1="10"
              x2="170"
              y2="110"
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text
              x="172"
              y="16"
              fill="#64748b"
              fontSize="7.5"
              fontWeight="600"
              letterSpacing="0.05em"
            >
              TODAY (T-0)
            </text>

            {/* Horizontal Critical Buffer Line */}
            <line
              x1="10"
              y1="88"
              x2="330"
              y2="88"
              stroke="#ef4444"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <text
              x="25"
              y="85"
              fill="#dc2626"
              fontSize="6.5"
              fontWeight="bold"
              letterSpacing="0.06em"
            >
              CRITICAL SAFETY BUFFER ({selectedMedicine.safetyBuffer} UNITS)
            </text>

            {/* Confidence Interval Shaded Area for Forecast (T+1 to T+14) */}
            <polygon
              points="170,72 200,82 240,96 320,112 320,102 240,84 200,72 170,72"
              fill="url(#forecastBand)"
            />

            {/* Historical Curve (Solid Blue) */}
            <path
              d="M 15,22 Q 40,24 70,32 T 120,52 T 170,72"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Today Point (Node) */}
            <circle cx="170" cy="72" r="3" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />

            {/* Projection Curve (Dashed Blue Line Continuing Down) */}
            <path
              d="M 170,72 Q 200,80 230,95 T 280,108 T 320,112"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeLinecap="round"
            />

            {/* Critical Runout Point Marker on the line */}
            <g transform="translate(210, 88)">
              <circle cx="0" cy="0" r="3" fill="#dc2626" stroke="#ffffff" strokeWidth="1" />
              <text
                x="4"
                y="10"
                fill="#dc2626"
                fontSize="7"
                fontWeight="bold"
              >
                Runout: Day {selectedMedicine.runoutDays}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
