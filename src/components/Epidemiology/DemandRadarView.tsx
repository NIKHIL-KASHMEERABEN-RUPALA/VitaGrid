import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Share2,
  Cpu,
  Radio,
  AlertTriangle,
  Droplets,
  CheckCircle2,
  Activity,
  Sliders,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { SurgeProjectionChart } from './SurgeProjectionChart';
import { PathogenRadarChart } from './PathogenRadarChart';
import { ThresholdModal } from './ThresholdModal';
import { MonteCarloModal } from './MonteCarloModal';
import {
  PATHOGENS_DATA,
  PATHOGEN_PROFILES,
} from '../../data/epidemiologyData';
import { useNotifications } from '../../context/NotificationContext';
import { useRbac } from '../../context/RbacContext';

interface DemandRadarViewProps {
  onShareAlert?: () => void;
}

export const DemandRadarView: React.FC<DemandRadarViewProps> = ({ onShareAlert }) => {
  const [selectedPathogenId, setSelectedPathogenId] = useState<string>('malaria');
  const [horizon, setHorizon] = useState<string>('14 Days (Recommended)');
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState<boolean>(false);
  const [isMonteCarloModalOpen, setIsMonteCarloModalOpen] = useState<boolean>(false);

  const { showToast } = useNotifications();
  const { verifyPermissionOrPrompt } = useRbac();

  const profile = PATHOGEN_PROFILES[selectedPathogenId] || PATHOGEN_PROFILES.malaria;
  const horizonData = profile.horizons[horizon] || profile.horizons['14 Days (Recommended)'];

  const horizons = [
    '7 Days',
    '14 Days (Recommended)',
    '30 Days Tactical',
    '90 Days Seasonal',
  ];

  const handleSaveThresholds = (thresholds: {
    r0Limit: number;
    rainMm: number;
    velocityPercent: number;
  }) => {
    showToast(
      `Thresholds updated: R₀ cutoff ${thresholds.r0Limit}, Rainfall +${thresholds.rainMm}mm, Velocity +${thresholds.velocityPercent}%.`,
      'success'
    );
  };

  const handleShare = () => {
    if (onShareAlert) {
      onShareAlert();
    } else {
      showToast(
        `Surveillance telemetry packet for ${profile.name} dispatched to 47 County Health Directors.`,
        'success'
      );
    }
  };

  const handleOpenThresholds = () => {
    if (verifyPermissionOrPrompt('canConfigureThresholds', 'Configure Epidemiological Alert Thresholds')) {
      setIsThresholdModalOpen(true);
    }
  };

  const handleOpenMonteCarlo = () => {
    if (verifyPermissionOrPrompt('canRunWhatIf', 'Execute 10,000 Monte Carlo Iteration Forecast')) {
      setIsMonteCarloModalOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Content Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          {/* Top Badges */}
          <div className="flex items-center gap-2 mb-1 text-[11px] font-bold tracking-wider font-mono">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-blue-900/60 uppercase">
              <span className="w-1 h-3 bg-blue-600 dark:bg-cyan-400 rounded-xs"></span>
              <span>SURVEILLANCE TELEMETRY V3.4 • BAYESIAN ENGINE</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-500 dark:text-slate-400 font-normal">
              Active Focus: <strong className="text-slate-900 dark:text-white">{profile.name}</strong> ({profile.icdCode})
            </span>
          </div>

          {/* Large Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Demand Intelligence &amp; Epidemiological Early-Warning Radar
          </h1>

          {/* Subtitle */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Continuous sentinel clinical surveillance &amp; syndromic surge forecasting across 2,840 Primary Healthcare Centres. Real-time Bayesian reproduction estimates and TreeSHAP root-cause attributions.
          </p>
        </div>

        {/* Right-Aligned Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
          <button
            onClick={handleOpenThresholds}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Configure Alert Thresholds</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Share with County Officers</span>
          </button>

          <button
            onClick={handleOpenMonteCarlo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Run Monte Carlo Forecast</span>
          </button>
        </div>
      </div>

      {/* Live Bayesian Cori Rt & TreeSHAP Outbreak Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Cori Bayesian Trajectory (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] rounded-xl border border-blue-200/90 dark:border-slate-800 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white shadow-2xs">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                  Cori et al. Bayesian Transmission Rate (R_t) &amp; Doubling Time • {profile.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Instantaneous reproduction number estimated with Gamma prior (mean 4.8, std 2.3d).
                </p>
              </div>
            </div>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                profile.riskLevel === 'critical'
                  ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-900/60'
                  : profile.riskLevel === 'high'
                  ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900/60'
                  : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/60'
              }`}
            >
              {profile.defconRecommendation} WATCH
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-900/80 rounded-lg border border-slate-200/80 dark:border-slate-800 text-center font-mono">
            <div>
              <div className="text-[10px] text-slate-400 font-sans">Current R_t</div>
              <div className="text-xl font-black text-red-600 dark:text-red-400 mt-0.5">
                {profile.r0}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                95% CI: [{profile.confidenceInterval[0]} - {profile.confidenceInterval[1]}]
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-sans">Doubling Time</div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {profile.doublingDays} Days
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans font-semibold">
                Apex: {horizonData.peakOffset}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-sans">Outbreak Phase</div>
              <div
                className={`text-xs font-black mt-1 uppercase ${
                  profile.riskLevel === 'critical'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {profile.epidemicPhase}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">
                {profile.velocity7d} 7-day velocity
              </div>
            </div>
          </div>

          {/* Multi-Horizon Inpatient Bed Saturation Projections Strip */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase font-mono block">
              Multi-Horizon Inpatient Bed Saturation Projections
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              {['7 Days', '14 Days (Recommended)', '30 Days Tactical', '90 Days Seasonal'].map((hz) => {
                const hData = profile.horizons[hz];
                const isActive = horizon === hz;
                return (
                  <button
                    key={hz}
                    type="button"
                    onClick={() => setHorizon(hz)}
                    className={`p-2 rounded border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 dark:border-cyan-500 ring-1 ring-blue-500/20'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold text-blue-700 dark:text-cyan-400 truncate">
                      {hz.split(' ')[0]} {hz.includes('Recommended') ? 'Rec.' : ''}
                    </div>
                    <div className="font-extrabold text-slate-900 dark:text-white mt-0.5 text-xs">
                      {hData.peakValue}k Peak
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      Bed: {hData.bedOccupancyPct}%
                    </div>
                    <div className="text-[9px] text-red-600 dark:text-red-400 font-mono font-bold">
                      +{hData.icuVentDemand} ICU Vents
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* TreeSHAP Feature Attributions (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white font-mono">
                <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>TreeSHAP Surge Attribution • {profile.name.split(' ')[0]}</span>
              </div>
              <span className="text-[10px] font-bold font-mono bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900 px-1.5 py-0.5 rounded">
                EXPLAINABLE AI
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Decomposes non-linear tree logits into localized Shapley feature contributions driving localized transmission velocity.
            </p>

            <div className="space-y-2 mt-3">
              {profile.treeShapFactors.map((attr, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{attr.factor}</span>
                    <span className="font-bold font-mono text-purple-700 dark:text-purple-400">
                      +{attr.contribution_pct}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 dark:bg-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, attr.contribution_pct * 2.2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span>Model: XGBoost + TreeSHAP (v3.2)</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">WAPE 0.076</span>
          </div>
        </div>
      </div>

      {/* Multi-Pathogen Overview & Horizon Selector Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 bg-blue-600 dark:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-2xs tracking-wide">
            <Activity className="w-3.5 h-3.5" />
            <span>Multi-Pathogen Overview (Select Pathogen to Update Radar)</span>
          </div>

          {/* Horizon Selector */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-100/90 dark:bg-slate-900 p-1 rounded-lg border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 font-mono">
              HORIZON:
            </span>

            {horizons.map((h) => {
              const isActive = horizon === h;
              return (
                <button
                  key={h}
                  onClick={() => {
                    setHorizon(h);
                    showToast(`Time horizon shifted to ${h}. Projections synchronized.`);
                  }}
                  className={`px-2.5 py-1 rounded text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-cyan-400 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                  }`}
                >
                  {h}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pathogen Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {PATHOGENS_DATA.map((p) => {
            const isSelected = selectedPathogenId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPathogenId(p.id);
                  showToast(`Outbreak Radar switched to ${p.name}. Recalculating R₀ & TreeSHAP.`);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-blue-500 dark:border-cyan-400 shadow-2xs font-bold ring-2 ring-blue-500/20 dark:ring-cyan-500/20'
                    : 'bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                {p.colorDot === 'red' && <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>}
                {p.colorDot === 'green' && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>}
                {p.colorDot === 'blue' && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>}
                {p.colorDot === 'amber' && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>}
                {p.colorDot === 'purple' && <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>}
                {p.colorDot === 'cyan' && <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>}
                <span>{p.name}</span>
                <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                  R₀ {p.r0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Three Top Metric Cards (Equal Width, fully dynamic per pathogen) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Sentinel Node Ingestion */}
        <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                TELEMETRY NETWORK
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Sentinel Node Clinical Surveillance
            </h3>

            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
                2,840
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                / 2,840 Active PHCs
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Active Focus Zone: <strong className="text-slate-800 dark:text-slate-200">{profile.affectedClusters}</strong>
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              100% Telemetry Fidelity
            </span>
            <span>•</span>
            <span>12m ingestion cycle</span>
          </div>
        </div>

        {/* Card 2: Priority Outbreak Vector */}
        <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider font-mono">
                ACTIVE OUTBREAK VECTOR
              </span>
              <div className="w-7 h-7 rounded bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-100 dark:border-red-900/60">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Surveillance Flag {profile.priorityFlag.flagId}
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 leading-snug">
              {profile.priorityFlag.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 mb-3">
              {profile.priorityFlag.location}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-red-600 dark:text-red-400 font-mono">
              {profile.priorityFlag.velocity7d}
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
              Transmission R₀: {profile.priorityFlag.transmissionR0}
            </span>
          </div>
        </div>

        {/* Card 3: Bio-Climatic Model */}
        <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                BIO-CLIMATIC MODEL
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Environmental Trigger Correlation
            </h3>

            <div className="flex items-baseline gap-2 mb-2 font-mono">
              <span className="text-3xl font-extrabold text-blue-600 dark:text-cyan-400 tracking-tight">
                {profile.bioClimatic.precipitationAnomalyMm > 0 ? `+${profile.bioClimatic.precipitationAnomalyMm}` : profile.bioClimatic.precipitationAnomalyMm}mm
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
                environmental anomaly
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Correlates with{' '}
              <strong className="text-slate-900 dark:text-white">
                {profile.bioClimatic.correlationMultiplier}× syndromic admissions
              </strong>{' '}
              within {profile.bioClimatic.presentationDays}.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              {profile.bioClimatic.feedSource}
            </span>
            <span className="font-mono">Confidence: {profile.bioClimatic.confidencePercent}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Surge Projection + Vector Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Card: Dynamic Surge Projection (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  Syndromic Footfall Surge Projection • {profile.name}
                </h3>
                <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900 font-semibold uppercase">
                  {horizon}
                </span>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-slate-400"></span>
                  <span>Baseline ({profile.baselineCases / 1000}k)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-blue-600 dark:bg-cyan-400"></span>
                  <span className="font-semibold text-blue-700 dark:text-cyan-400">Surge Curve</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              Outpatient presentation trajectory vs historical baseline with 95% confidence fan. Hover over data nodes for detailed incidence values.
            </p>

            <SurgeProjectionChart
              horizon={horizon}
              selectedPathogenId={selectedPathogenId}
              selectedPathogenName={profile.name}
            />
          </div>
        </div>

        {/* Right Card: Multi-Pathogen Vector Radar (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                  CROSS-SYNDROMIC VECTORS
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  Multi-Pathogen Vector Radar
                </h3>
              </div>
              <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900 font-mono uppercase">
                6-Axis Polarity
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
              Stochastic vector polar alignment across major sovereign outbreak families. Hover over nodes to inspect transmission polarity index.
            </p>

            <div className="w-full flex items-center justify-center">
              <PathogenRadarChart
                axes={profile.radarValues}
                selectedPathogenId={selectedPathogenId}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Primary Focus: <strong className="text-slate-800 dark:text-slate-200">{profile.name}</strong></span>
            <span className="font-bold font-mono text-red-600 dark:text-red-400">
              Polarity: {profile.radarValues.find(v => v.axis.toLowerCase().includes(selectedPathogenId))?.value || 0.88}
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ThresholdModal
        isOpen={isThresholdModalOpen}
        onClose={() => setIsThresholdModalOpen(false)}
        onSave={handleSaveThresholds}
      />

      <MonteCarloModal
        isOpen={isMonteCarloModalOpen}
        onClose={() => setIsMonteCarloModalOpen(false)}
        onComplete={() => {
          showToast('10,000 Monte Carlo iterations converged. Confidence Fan updated.', 'success');
        }}
      />
    </div>
  );
};
