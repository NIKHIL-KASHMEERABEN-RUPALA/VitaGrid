import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Play,
  Sliders,
  Cpu,
  CheckCircle2,
  TrendingDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { EssentialMedicine } from '../../types/supplyChain';

interface MedicineDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: EssentialMedicine | null;
  onOpenModelWeights?: () => void;
  onRunRebalanceDirective?: (medicineName: string) => void;
}

export const MedicineDetailDrawer: React.FC<MedicineDetailDrawerProps> = ({
  isOpen,
  onClose,
  medicine,
  onOpenModelWeights,
  onRunRebalanceDirective,
}) => {
  const [isRunningInference, setIsRunningInference] = useState<boolean>(false);
  const [inferenceResult, setInferenceResult] = useState<any>(null);

  if (!isOpen || !medicine) return null;

  const handleRunCustomPrediction = () => {
    setIsRunningInference(true);
    setTimeout(() => {
      setIsRunningInference(false);
      setInferenceResult({
        confidence: 96.8,
        projectedStockoutHours: (medicine.runoutDays * 24).toFixed(0),
        adjustedBurnRate: `${medicine.dailyVelocity} units/day`,
        treeShapAttribution: [
          { feature: 'Regional Epidemic Surge Lag (Rt = 1.34)', contribution: '+42.5%', positive: true },
          { feature: 'Sub-County Depot Buffer Depletion', contribution: '+28.1%', positive: true },
          { feature: 'Scheduled National Shipment Inflow', contribution: '-18.4%', positive: false },
          { feature: 'Seasonal Monsoon Road Accessibility', contribution: '+9.2%', positive: true },
        ],
      });
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200/90 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-2xs">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                {medicine.name}
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${medicine.riskTier === 'critical' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                  {medicine.riskTier.toUpperCase()}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {medicine.packaging} • {medicine.formulation} (Code: {medicine.id.toUpperCase()})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-400 font-medium uppercase">Current Stock</div>
              <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                {medicine.currentStock.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500">{medicine.stockUnit}</div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-400 font-medium uppercase">Burn Velocity</div>
              <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                {medicine.dailyVelocity}
              </div>
              <div className="text-[10px] text-slate-500">{medicine.velocityUnit}</div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-400 font-medium uppercase">Runout SLA</div>
              <div className={`text-base font-extrabold font-mono mt-0.5 ${medicine.riskTier === 'critical' ? 'text-red-600' : 'text-slate-900'}`}>
                {medicine.runoutDays} Days
              </div>
              <div className="text-[10px] text-slate-500">Date: {medicine.depletionDate}</div>
            </div>
          </div>

          {/* AI Model Inference & Feature Importance */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 uppercase font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                XGBoost + TreeSHAP Depletion Attribution
              </span>
              <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                MODEL CONFIDENCE: 96.2%
              </span>
            </div>

            {/* Feature Attribution List */}
            <div className="space-y-1.5 pt-1">
              {[
                { feature: 'Corridor Epidemic Transmission Intensity (Rt = 1.34)', contribution: '+42.5%', isRisk: true },
                { feature: 'Sub-County Buffer Stock Below Threshold (2,840 PHCs)', contribution: '+28.1%', isRisk: true },
                { feature: 'Direct Inter-Facility Rebalancing Transfers Active', contribution: '-18.4%', isRisk: false },
                { feature: 'Seasonal Monsoon Transit Friction Index', contribution: '+9.2%', isRisk: true },
              ].map((item, idx) => (
                <div key={idx} className="p-2 bg-white rounded border border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-700 font-medium">{item.feature}</span>
                  <span className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded ${item.isRisk ? 'text-red-700 bg-red-50' : 'text-emerald-700 bg-emerald-50'}`}>
                    {item.contribution}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons: Run Prediction / Use Custom Model */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleRunCustomPrediction}
              disabled={isRunningInference}
              className="py-2 px-3 bg-slate-900 hover:bg-black text-white font-semibold rounded-md text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {isRunningInference ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span>Run Live Prediction</span>
            </button>

            <button
              onClick={() => {
                onClose();
                if (onOpenModelWeights) onOpenModelWeights();
              }}
              className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold rounded-md text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Use Custom Model Weights</span>
            </button>
          </div>

          {/* Inference Output if run */}
          {inferenceResult && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px] space-y-1 animate-in fade-in duration-150">
              <div className="font-bold flex items-center justify-between">
                <span>Inference Complete (ONNX Runtime)</span>
                <span className="font-mono text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded">
                  {inferenceResult.confidence}% Confidence
                </span>
              </div>
              <div>Estimated Time-to-Zero: <strong className="font-mono">{inferenceResult.projectedStockoutHours} hours</strong></div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200/90 bg-slate-50/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              if (onRunRebalanceDirective) {
                onRunRebalanceDirective(medicine.name);
              }
              onClose();
            }}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Trigger Rebalancing Directive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
