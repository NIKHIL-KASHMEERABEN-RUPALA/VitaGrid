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
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs flex flex-col overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              National Healthcare Density &amp; Facility Vulnerability Index
            </h2>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-mono px-1.5 py-0.5 rounded border border-blue-200 font-medium">
              EPSG:3857
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            2,840 Level 2-4 Primary Healthcare Facilities telemetry layer • Continuous autonomous feed
          </p>
        </div>

        {/* Time Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md self-start md:self-auto border border-slate-200/60 text-xs">
          {(['Live', 'T+24h', 'T+7d'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeHorizon(tab)}
              className={`px-3 py-1 font-medium rounded transition-all ${
                timeHorizon === tab
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Filter Chips and Legend */}
      <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-500 font-medium mr-1 text-[11px]">Layer:</span>

          <button
            onClick={() => setSelectedLayer('all')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              selectedLayer === 'all'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All 47 Counties
          </button>

          <button
            onClick={() => setSelectedLayer('surge')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              selectedLayer === 'surge'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            High-Surge Zones
          </button>

          <button
            onClick={() => setSelectedLayer('cold-chain')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              selectedLayer === 'cold-chain'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Cold-Chain Vulnerable
          </button>

          <button
            onClick={() => setSelectedLayer('border')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              selectedLayer === 'border'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Border Corridors
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-600">
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
      <div className="relative w-full h-[400px] lg:h-[450px] bg-[#F8FAFC] overflow-hidden select-none">
        {/* Subtle Map Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'radial-gradient(#94a3b8 0.75px, transparent 0.75px), radial-gradient(#94a3b8 0.75px, #F8FAFC 0.75px)',
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
              {/* Region fills */}
              <linearGradient id="surgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fee2e2" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fecaca" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="watchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="optimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="criticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffe4e6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fecdd3" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Background County Boundaries (Subtle gray lines) */}
            <g stroke="#e2e8f0" strokeWidth="1" fill="none">
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
              let strokeColor = '#94a3b8';
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
                strokeColor = '#3b82f6';
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
                    className="hover:filter hover:brightness-95 transition-all"
                  />
                  {/* Region Centroid Label */}
                  <text
                    x={region.centroid.x}
                    y={region.centroid.y + (region.id === 'garissa' ? 18 : 12)}
                    textAnchor="middle"
                    className="text-[9px] font-bold tracking-wider uppercase select-none pointer-events-none"
                    fill={
                      region.id === 'kisumu'
                        ? '#b91c1c'
                        : region.id === 'kilifi'
                        ? '#991b1b'
                        : region.id === 'garissa'
                        ? '#b45309'
                        : '#475569'
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
                  stroke={path.id === 'tp-1' ? '#2563EB' : '#94a3b8'}
                  strokeWidth="1.75"
                  className={path.status === 'active' ? 'animate-flight-dash' : ''}
                  strokeDasharray="4 3"
                />
              </g>
            ))}

            {/* Regional Hub Nodes & Pulse Rings */}
            {regions.map((region) => {
              const isSelected = activePinRegionId === region.id;
              let dotColor = '#10b981'; // optimal green
              if (region.status === 'watch') dotColor = '#f59e0b'; // amber
              if (region.status === 'critical') dotColor = '#ef4444'; // red
              if (region.id === 'nairobi') dotColor = '#2563eb'; // blue hub

              return (
                <g
                  key={`node-${region.id}`}
                  className="cursor-pointer"
                  onClick={() => {
                    setActivePinRegionId(region.id);
                    onSelectRegion(region);
                  }}
                >
                  {/* Ping Ring for Critical or Watch Nodes */}
                  {(region.status === 'critical' || region.id === 'garissa') && (
                    <circle
                      cx={region.centroid.x}
                      cy={region.centroid.y}
                      r="9"
                      fill="none"
                      stroke={dotColor}
                      strokeWidth="1.5"
                      opacity="0.5"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle
                      cx={region.centroid.x}
                      cy={region.centroid.y}
                      r="8"
                      fill="none"
                      stroke="#1e40af"
                      strokeWidth="2"
                    />
                  )}

                  {/* Core Node Circle */}
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

            {/* Autonomous Drone in Flight Representation between Nairobi & Garissa */}
            <g transform="translate(398, 218)">
              <circle cx="0" cy="0" r="10" fill="#2563eb" fillOpacity="0.15" />
              <circle cx="0" cy="0" r="3.5" fill="#2563eb" />
              {/* Drone wings */}
              <line x1="-5" y1="-5" x2="5" y2="5" stroke="#2563eb" strokeWidth="1.5" />
              <line x1="-5" y1="5" x2="5" y2="-5" stroke="#2563eb" strokeWidth="1.5" />
            </g>
          </svg>
        </div>

        {/* Floating Detailed Inspection Card (Garissa Sub-County / Active Region) */}
        <div className="absolute top-4 left-4 z-20 max-w-xs sm:max-w-sm w-full bg-white/95 backdrop-blur-xs rounded-lg border border-slate-200/90 shadow-md p-3.5 transition-all">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>{activeRegion.name}</span>
            </h3>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wide">
              PHC CLUSTER 14
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-600 mb-2.5">
            <span className="font-semibold text-emerald-700">
              {activeRegion.stabilityIndex}% Stability Index
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-slate-600">
              <Thermometer className="w-3 h-3 text-blue-500" />
              Cold chain: <strong className="text-slate-800">{activeRegion.coldChainTemp}</strong>
            </span>
          </div>

          {/* Autonomous Drone Resupply Inner Highlight Banner */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-md p-2 flex items-center gap-2.5 text-blue-900 text-xs">
            <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Send className="w-3.5 h-3.5" />
            </div>
            <div className="text-[11px] leading-tight">
              <span className="font-semibold text-blue-900">
                2 Autonomous Drone Resupplies in Transit
              </span>{' '}
              <span className="text-blue-700 font-medium">(ETA 34m)</span>
            </div>
          </div>
        </div>

        {/* Map Zoom Controls in Bottom Right */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1 bg-white rounded-md shadow-xs border border-slate-200/80 p-0.5">
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded transition-colors"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <div className="h-px bg-slate-200 mx-1"></div>
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded transition-colors"
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
