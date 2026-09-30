import React, { useState } from 'react';
import { Send, Plus, Minus, ShieldAlert, Thermometer, Box, Radio } from 'lucide-react';
import { MapRegion, TransitPath } from '../types/dashboard';

interface MapSectionProps {
  regions: MapRegion[];
  transitPaths: TransitPath[];
  onSelectRegion: (region: MapRegion) => void;
}

export const MapSection: React.FC<MapSectionProps> = ({
  regions,
  transitPaths,
  onSelectRegion,
}) => {
  const [timeHorizon, setTimeHorizon] = useState<'Live' | 'T+24h' | 'T+7d'>('Live');
  const [selectedLayer, setSelectedLayer] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [activePinRegionId, setActivePinRegionId] = useState<string>('garissa');

  const activeRegion = regions.find((r) => r.id === activePinRegionId) || regions[0];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.85));

  // Determine styling based on selected layer
  const getRegionHighlight = (region: MapRegion) => {
    if (selectedLayer === 'surge' && region.id !== 'kisumu') return 'opacity-35';
    if (selectedLayer === 'cold-chain' && region.id !== 'garissa' && region.id !== 'wajir') return 'opacity-35';
    if (selectedLayer === 'border' && region.id !== 'garissa' && region.id !== 'wajir') return 'opacity-35';
    return 'opacity-100';
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              National Healthcare Density &amp; Facility Vulnerability Index
            </h2>
            <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900/60 font-medium">
              EPSG:3857
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            2,840 Level 2-4 Primary Healthcare Facilities telemetry layer • Continuous autonomous feed
          </p>
        </div>

        {/* Time Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg self-start md:self-auto border border-slate-200/60 dark:border-slate-700 text-xs">
          {(['Live', 'T+24h', 'T+7d'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeHorizon(tab)}
              className={`px-3 py-1 font-medium rounded-md transition-all cursor-pointer ${
                timeHorizon === tab
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Filter Chips and Legend */}
      <div className="px-4 py-2.5 bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-500 dark:text-slate-400 font-medium mr-1 text-[11px]">Layer:</span>

          <button
            onClick={() => setSelectedLayer('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              selectedLayer === 'all'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            All 47 Counties
          </button>

          <button
            onClick={() => setSelectedLayer('surge')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              selectedLayer === 'surge'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            High-Surge Zones
          </button>

          <button
            onClick={() => setSelectedLayer('cold-chain')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              selectedLayer === 'cold-chain'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            Cold-Chain Vulnerable
          </button>

          <button
            onClick={() => setSelectedLayer('border')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              selectedLayer === 'border'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            Border Corridors
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Optimal Buffer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Low Buffer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>Stockout Imminent</span>
          </div>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-[400px] lg:h-[450px] bg-[#F8FAFC] dark:bg-[#070B14] overflow-hidden select-none transition-colors">
        {/* Subtle Map Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.15]"
          style={{
            backgroundImage:
              'radial-gradient(#94a3b8 0.75px, transparent 0.75px), radial-gradient(#94a3b8 0.75px, transparent 0.75px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        {/* Scalable SVG Map Area */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="100 30 500 400"
            className="w-full h-full max-w-[650px] max-h-[440px] drop-shadow-xs"
          >
            <defs>
              <linearGradient id="surgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0.10" />
              </linearGradient>
              <linearGradient id="watchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.10" />
              </linearGradient>
              <linearGradient id="optimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.20" />
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="criticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b91c1c" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#991b1b" stopOpacity="0.12" />
              </linearGradient>
            </defs>

            {/* Background County Boundaries */}
            <g stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" fill="none">
              <polygon points="120,80 230,90 280,150 200,180" />
              <polygon points="230,90 380,50 395,115 270,160" />
              <polygon points="180,265 250,240 285,290 200,340" />
              <polygon points="200,340 310,360 270,410 180,390" />
              <polygon points="465,410 520,380 540,290 480,295" />
              <polygon points="480,135 550,110 580,200 520,225" />
            </g>

            {/* Regional Polygons with Status Colors */}
            {regions.map((region) => {
              const isSelected = activePinRegionId === region.id;
              const isHovered = hoveredRegionId === region.id;
              const layerClass = getRegionHighlight(region);

              let fillColor = 'url(#optimalGradient)';
              let strokeColor = '#3b82f6';
              let strokeWidth = '1.5';

              if (region.id === 'kisumu') {
                fillColor = 'url(#surgeGradient)';
                strokeColor = '#ef4444';
                strokeWidth = isSelected ? '2.5' : '1.8';
              } else if (region.id === 'garissa') {
                fillColor = 'url(#watchGradient)';
                strokeColor = '#f59e0b';
                strokeWidth = isSelected ? '2.5' : '1.8';
              } else if (region.id === 'kilifi') {
                fillColor = 'url(#criticalGradient)';
                strokeColor = '#dc2626';
                strokeWidth = isSelected ? '2.5' : '1.8';
              } else if (region.id === 'nairobi') {
                fillColor = 'url(#optimalGradient)';
                strokeColor = '#2563eb';
                strokeWidth = isSelected ? '2.5' : '1.8';
              }

              return (
                <g
                  key={region.id}
                  className={`cursor-pointer transition-all duration-200 ${layerClass}`}
                  onClick={() => {
                    setActivePinRegionId(region.id);
                    onSelectRegion(region);
                  }}
                  onMouseEnter={() => setHoveredRegionId(region.id)}
                  onMouseLeave={() => setHoveredRegionId(null)}
                >
                  <polygon
                    points={region.points}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    className="hover:filter hover:brightness-110 transition-all"
                  />
                  {/* Region Centroid Label */}
                  <text
                    x={region.centroid.x}
                    y={region.centroid.y + (region.id === 'garissa' ? 18 : 12)}
                    textAnchor="middle"
                    className="text-[9px] font-bold tracking-wider uppercase select-none pointer-events-none font-mono"
                    fill={
                      region.id === 'kisumu'
                        ? '#ef4444'
                        : region.id === 'kilifi'
                        ? '#dc2626'
                        : region.id === 'garissa'
                        ? '#f59e0b'
                        : '#38bdf8'
                    }
                  >
                    {region.label}
                  </text>
                </g>
              );
            })}

            {/* Network Transit Corridors (Dashed Lines) */}
            {transitPaths.map((path) => (
              <g key={path.id}>
                <path
                  d={path.path}
                  fill="none"
                  stroke={path.id === 'tp-1' ? '#38bdf8' : '#64748b'}
                  strokeWidth="1.75"
                  className={path.status === 'active' ? 'animate-flight-dash' : ''}
                  strokeDasharray="4 3"
                />
              </g>
            ))}

            {/* Regional Hub Nodes & Pulse Rings */}
            {regions.map((region) => {
              const isSelected = activePinRegionId === region.id;
              let dotColor = '#10b981';
              if (region.status === 'watch') dotColor = '#f59e0b';
              if (region.status === 'critical') dotColor = '#ef4444';
              if (region.id === 'nairobi') dotColor = '#2563eb';

              return (
                <g
                  key={`node-${region.id}`}
                  className="cursor-pointer"
                  onClick={() => {
                    setActivePinRegionId(region.id);
                    onSelectRegion(region);
                  }}
                >
                  {(region.status === 'critical' || region.id === 'garissa') && (
                    <circle
                      cx={region.centroid.x}
                      cy={region.centroid.y}
                      r="9"
                      fill="none"
                      stroke={dotColor}
                      strokeWidth="1.5"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {isSelected && (
                    <circle
                      cx={region.centroid.x}
                      cy={region.centroid.y}
                      r="8"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                  )}

                  <circle
                    cx={region.centroid.x}
                    cy={region.centroid.y}
                    r="4.5"
                    fill={dotColor}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}

            {/* Autonomous Drone Representation */}
            <g transform="translate(398, 218)">
              <circle cx="0" cy="0" r="10" fill="#38bdf8" fillOpacity="0.2" />
              <circle cx="0" cy="0" r="3.5" fill="#38bdf8" />
              <line x1="-5" y1="-5" x2="5" y2="5" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="-5" y1="5" x2="5" y2="-5" stroke="#38bdf8" strokeWidth="1.5" />
            </g>
          </svg>
        </div>

        {/* Floating Detailed Inspection Card */}
        <div className="absolute top-4 left-4 z-20 max-w-xs sm:max-w-sm w-full bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-md p-3.5 transition-all">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <span>{activeRegion.name}</span>
            </h3>
            <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/60 uppercase tracking-wide font-mono">
              PHC CLUSTER 14
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 mb-2.5 font-mono">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {activeRegion.stabilityIndex}% Stability Index
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-blue-500 dark:text-cyan-400" />
              <span>Cold chain: <strong>{activeRegion.coldChainTemp}</strong></span>
            </span>
          </div>

          {/* Autonomous Drone Resupply Inner Highlight Banner */}
          <div className="bg-blue-50/70 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/50 rounded-lg p-2 flex items-center gap-2.5 text-blue-900 dark:text-cyan-200 text-xs">
            <div className="w-6 h-6 rounded-lg bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Send className="w-3.5 h-3.5" />
            </div>
            <div className="text-[11px] leading-tight">
              <span className="font-semibold text-blue-900 dark:text-white">
                2 Autonomous Drone Resupplies in Transit
              </span>{' '}
              <span className="text-blue-700 dark:text-cyan-300 font-medium font-mono">(ETA 34m)</span>
            </div>
          </div>
        </div>

        {/* Map Zoom Controls */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1 bg-white dark:bg-slate-900 rounded-lg shadow-xs border border-slate-200/80 dark:border-slate-800 p-0.5">
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded transition-colors cursor-pointer"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <div className="h-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded transition-colors cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
