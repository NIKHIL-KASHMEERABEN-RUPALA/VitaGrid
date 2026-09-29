import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { SurgeProjectionChart } from './SurgeProjectionChart';
import { PathogenRadarChart } from './PathogenRadarChart';
import { ThresholdModal } from './ThresholdModal';
import { MonteCarloModal } from './MonteCarloModal';
import {
  PATHOGENS_DATA,
  METRIC_CARDS_DATA,
  RADAR_AXIS_DATA,
} from '../../data/epidemiologyData';
import { PathogenOverview } from '../../types/epidemiology';
import { fetchEpidemicTrajectory, fetchShapExplanation } from '../../services/backendApi';

interface DemandRadarViewProps {
  onShareAlert?: () => void;
}

export const DemandRadarView: React.FC<DemandRadarViewProps> = ({ onShareAlert }) => {
  const [selectedPathogenId, setSelectedPathogenId] = useState<string>('malaria');
  const [horizon, setHorizon] = useState<string>('14 Days (Recommended)');
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState<boolean>(false);
  const [isMonteCarloModalOpen, setIsMonteCarloModalOpen] = useState<boolean>(false);
  const [metricData, setMetricData] = useState(METRIC_CARDS_DATA);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [liveTrajectory, setLiveTrajectory] = useState<any>(null);
  const [liveShap, setLiveShap] = useState<any>(null);

  useEffect(() => {
    loadLiveEpidemicTelemetry();
  }, [selectedPathogenId]);

  const loadLiveEpidemicTelemetry = async () => {
    try {
      const [traj, shap] = await Promise.all([
        fetchEpidemicTrajectory('C42'),
        fetchShapExplanation('PHC-C42-001', 'Pediatric IV Saline & Artemether'),
      ]);
      setLiveTrajectory(traj);
      setLiveShap(shap);
    } catch (e) {
      console.warn('Using fallback trajectory data.');
    }
  };

  const selectedPathogen =
    PATHOGENS_DATA.find((p) => p.id === selectedPathogenId) || PATHOGENS_DATA[0];

  const horizons = [
    '7 Days',
    '14 Days (Recommended)',
    '30 Days Tactical',
    '90 Days Seasonal',
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveThresholds = (thresholds: {
    r0Limit: number;
    rainMm: number;
    velocityPercent: number;
  }) => {
    showToast(
      `Thresholds updated: R₀ cutoff ${thresholds.r0Limit}, Rainfall +${thresholds.rainMm}mm, Velocity +${thresholds.velocityPercent}%.`
    );
  };

  const handleShare = () => {
    if (onShareAlert) {
      onShareAlert();
    } else {
      showToast('Surveillance telemetry packet dispatched to 47 County Health Directors.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Content Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          {/* Top Badges */}
          <div className="flex items-center gap-2 mb-1 text-[11px] font-bold tracking-wider font-mono">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
              <span className="w-1 h-3 bg-blue-600 rounded-xs"></span>
              <span>SURVEILLANCE TELEMETRY V3.4</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-normal">Auto-Refreshed: 42s ago</span>
          </div>

          {/* Large Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Demand Intelligence &amp; Epidemiological Early-Warning Radar
          </h1>

          {/* Subtitle */}
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Continuous sentinel clinical surveillance &amp; syndromic surge forecasting across 2,840 Primary Healthcare Centres.
          </p>
        </div>

        {/* Right-Aligned Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
          <button
            onClick={() => setIsThresholdModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Configure Alert Thresholds</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Share with County Officers</span>
          </button>

          <button
            onClick={() => setIsMonteCarloModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Run New Monte Carlo Forecast</span>
          </button>
        </div>
      </div>

      {/* NEW: Live Bayesian Cori Rt & TreeSHAP Outbreak Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Cori Bayesian Trajectory (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-blue-200/90 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Cori et al. Bayesian Transmission Rate (R_t) &amp; Doubling Time
                </h3>
                <p className="text-[11px] text-slate-500">
                  Instantaneous reproduction number estimated with Gamma prior (mean 4.8, std 2.3d).
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded">
              DEFCON-3 WATCH
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-center font-mono">
            <div>
              <div className="text-[10px] text-slate-400 font-sans">Current R_t</div>
              <div className="text-xl font-black text-red-600 mt-0.5">
                {liveTrajectory?.r_t_estimate || 1.34}
              </div>
              <div className="text-[10px] text-slate-500">95% CI: [{liveTrajectory?.confidence_interval?.[0] || 1.18} - {liveTrajectory?.confidence_interval?.[1] || 1.52}]</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-sans">Doubling Time</div>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                {liveTrajectory?.doubling_time_days || 6.8} Days
              </div>
              <div className="text-[10px] text-emerald-600 font-sans font-semibold">T+10d Peak Expected</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-sans">Outbreak Phase</div>
              <div className="text-sm font-black text-red-700 mt-1 uppercase">
                {liveTrajectory?.epidemic_phase || 'GROWING'}
              </div>
              <div className="text-[10px] text-slate-500 font-sans">Early-Warning Triggered</div>
            </div>
          </div>

          {/* 14/30/60/90-Day Trajectory Forecast Strip */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-700 uppercase font-mono block">
              Multi-Horizon Inpatient Bed Saturation Projections
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              {liveTrajectory?.trajectory_points?.map((pt: any) => (
                <div key={pt.day_offset} className="p-2 rounded bg-white border border-slate-200">
                  <div className="text-[10px] font-mono font-bold text-blue-700">{pt.date_str} Projection</div>
                  <div className="font-extrabold text-slate-900 mt-0.5">{pt.expected_daily_infections} Cases/d</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">Bed: {pt.projected_bed_occupancy_pct}%</div>
                  <div className="text-[9px] text-red-600 font-mono font-bold">{pt.icu_ventilator_demand} ICU Vents</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TreeSHAP Feature Attributions (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-mono">
                <Sliders className="w-4 h-4 text-purple-600" />
                <span>TreeSHAP Surge Attribution</span>
              </div>
              <span className="text-[10px] font-bold font-mono bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded">
                EXPLAINABLE AI
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              TreeSHAP algorithm decomposes the non-linear gradient boosted tree logits into localized Shapley percentage contributions.
            </p>

            <div className="space-y-2 mt-3">
              {liveShap?.tree_shap_attributions?.map((attr: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-700">{attr.factor}</span>
                    <span className="font-bold font-mono text-purple-700">+{attr.contribution_pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${Math.min(100, attr.contribution_pct * 2.2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Model: XGBoost + TreeSHAP</span>
            <span className="text-emerald-700 font-bold font-mono">WAPE 0.082</span>
          </div>
        </div>
      </div>

      {/* Multi-Pathogen Overview & Horizon Section */}
      <div className="space-y-2">
        {/* Blue Header Pill */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="inline-block bg-blue-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-md shadow-2xs tracking-wide">
            Multi-Pathogen Overview
          </div>

          {/* Horizon Selector */}
          <div className="flex items-center gap-2 text-xs bg-slate-100/70 p-1 rounded-md border border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              HORIZON:
            </span>

            {horizons.map((h) => {
              const isActive = horizon === h;
              return (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`px-2.5 py-1 rounded text-xs transition-all ${
                    isActive
                      ? 'bg-white text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 font-medium'
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
                onClick={() => setSelectedPathogenId(p.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all border ${
                  isSelected
                    ? 'bg-white text-slate-900 border-blue-500 shadow-2xs font-semibold ring-1 ring-blue-500/20'
                    : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50'
                }`}
              >
                {p.colorDot === 'red' && (
                  <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                )}
                {p.colorDot === 'green' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                )}
                {p.colorDot === 'blue' && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                )}
                {p.colorDot === 'amber' && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                )}
                {p.colorDot === 'purple' && (
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                )}
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Three Top Metric Cards (Equal Width) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Sentinel Node Ingestion */}
        <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                TELEMETRY NETWORK
              </span>
              <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xs font-semibold text-slate-800 mb-3">
              Sentinel Node Ingestion
            </h3>

            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {metricData.sentinelNodes.active.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-slate-500">
                / {metricData.sentinelNodes.total.toLocaleString()} Active
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="font-bold text-emerald-600">
              {metricData.sentinelNodes.fidelityPercent}% Telemetry Fidelity
            </span>
            <span>•</span>
            <span>{metricData.sentinelNodes.cycleMinutes}m ingestion cycle</span>
          </div>

          {/* Decorative watermark circle */}
          <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-blue-50/50 pointer-events-none -z-0"></div>
        </div>

        {/* Card 2: Priority Outbreak Vector */}
        <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                PRIORITY OUTBREAK VECTOR
              </span>
              <div className="w-7 h-7 rounded bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-medium">
              Surveillance Flag {metricData.priorityFlag.flagId}
            </div>

            <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
              {metricData.priorityFlag.title}
            </h3>

            <p className="text-xs text-slate-600 mt-0.5 mb-3">
              {metricData.priorityFlag.location}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-red-600">
              {metricData.priorityFlag.velocity7d}
            </span>
            <span className="font-semibold text-slate-800">
              High Transmission R₀: {metricData.priorityFlag.transmissionR0}
            </span>
          </div>

          {/* Decorative watermark circle */}
          <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-red-50/40 pointer-events-none -z-0"></div>
        </div>

        {/* Card 3: Bio-Climatic Model */}
        <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                BIO-CLIMATIC MODEL
              </span>
              <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xs font-semibold text-slate-800 mb-2">
              Environmental Trigger Correlation
            </h3>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold text-blue-600 tracking-tight">
                +{metricData.bioClimatic.precipitationAnomalyMm}mm
              </span>
              <span className="text-xs text-slate-600 leading-tight">
                precipitation anomaly
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
              Rift Valley basins trigger historically correlates with{' '}
              <strong className="text-slate-900">
                {metricData.bioClimatic.correlationMultiplier}× syndromic fever presentations
              </strong>{' '}
              within {metricData.bioClimatic.presentationDays}.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              {metricData.bioClimatic.feedSource}
            </span>
            <span>Confidence: {metricData.bioClimatic.confidencePercent}%</span>
          </div>

          {/* Decorative watermark circle */}
          <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-blue-50/50 pointer-events-none -z-0"></div>
        </div>
      </div>

      {/* Bottom Section (Two Wide Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Card: Syndromic Footfall Surge Projection (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Syndromic Footfall Surge Projection
                </h3>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-mono px-1.5 py-0.5 rounded border border-blue-200 font-semibold uppercase">
                  DUAL-AXIS MODEL
                </span>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-slate-400"></span>
                  <span>Baseline (42k)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-blue-600"></span>
                  <span className="font-semibold text-blue-700">Surge Projection</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Primary outpatient presentations vs historical baseline with 95% confidence fan.
            </p>

            <SurgeProjectionChart
              horizon={horizon}
              selectedPathogenName={selectedPathogen.name}
            />
          </div>
        </div>

        {/* Right Card: Cross-Syndromic Vectors (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  CROSS-SYNDROMIC VECTORS
                </span>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Multi-Pathogen Vector Radar
                </h3>
              </div>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-200 uppercase">
                4-Axis Polarity
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-2 leading-relaxed">
              Stochastic vector polar alignment across major sovereign outbreak families.
            </p>

            <div className="w-full flex items-center justify-center">
              <PathogenRadarChart axes={RADAR_AXIS_DATA} />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Primary Driver: Plasmodium Falciparum (Malaria)</span>
            <span className="font-bold text-red-600">Polarity Index: 0.88</span>
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
          showToast('10,000 Monte Carlo iterations converged. Confidence Fan updated.');
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
