import React, { useState } from 'react';
import { Sliders, Sparkles, CheckCircle2, RotateCw, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { runWhatIfSimulation, WhatIfResult } from '../../services/backendApi';

interface WhatIfSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetFacilityId?: string;
}

export const WhatIfSimulatorModal: React.FC<WhatIfSimulatorModalProps> = ({
  isOpen,
  onClose,
  targetFacilityId = 'PHC-C01-002',
}) => {
  const [interventionType, setInterventionType] = useState<'STOCK_INJECTION' | 'STAFF_AUGMENTATION'>('STOCK_INJECTION');
  const [units, setUnits] = useState<number>(3200);
  const [clinicians, setClinicians] = useState<number>(8);
  const [facility, setFacility] = useState<string>(targetFacilityId);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<WhatIfResult | null>(null);

  if (!isOpen) return null;

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const res = await runWhatIfSimulation(
        facility,
        interventionType,
        interventionType === 'STOCK_INJECTION' ? { units, commodity: 'Amoxicillin 250mg Dispersible' } : { clinicians }
      );
      setSimulationResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Counterfactual "What-If" Policy Simulator</h3>
              <p className="text-[11px] text-slate-500">
                Run deep-cloned sandbox simulations before creating or authorizing ministerial orders.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Intervention Type Tabs */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5 text-xs">Select Intervention Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInterventionType('STOCK_INJECTION')}
                className={`p-2.5 rounded-lg border text-left font-medium transition-all cursor-pointer ${
                  interventionType === 'STOCK_INJECTION'
                    ? 'border-blue-600 bg-blue-50/60 text-blue-900 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold">1. Emergency Stock Injection</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Transfer medicine buffer stock to avert imminent stockout</div>
              </button>

              <button
                type="button"
                onClick={() => setInterventionType('STAFF_AUGMENTATION')}
                className={`p-2.5 rounded-lg border text-left font-medium transition-all cursor-pointer ${
                  interventionType === 'STAFF_AUGMENTATION'
                    ? 'border-blue-600 bg-blue-50/60 text-blue-900 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold">2. Clinician Surge Deployment</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Reallocate emergency nurses/physicians to relieve burnout</div>
              </button>
            </div>
          </div>

          {/* Parameters Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Target Facility Enclave</label>
              <select
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="PHC-C01-002">Likoni Subcounty Hospital (Mombasa C01)</option>
                <option value="PHC-C42-001">Kisumu County Referral Hospital (C42)</option>
                <option value="PHC-C47-001">Mbagathi Level 5 Hospital (Nairobi C47)</option>
              </select>
            </div>

            {interventionType === 'STOCK_INJECTION' ? (
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Amoxicillin Units to Inject: <span className="font-bold text-blue-700">{units.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="500"
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                />
              </div>
            ) : (
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Surge Clinicians to Deploy: <span className="font-bold text-blue-700">{clinicians}</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="25"
                  step="1"
                  value={clinicians}
                  onChange={(e) => setClinicians(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                />
              </div>
            )}
          </div>

          {/* Run Action */}
          <div className="flex justify-end">
            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {isSimulating ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Execute Counterfactual Simulation</span>
            </button>
          </div>

          {/* Output Card */}
          {simulationResult && (
            <div className="p-4 bg-emerald-50/60 rounded-lg border border-emerald-200 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 uppercase font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Simulation Verdict: {simulationResult.recommendation_verdict}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  Risk Reduction: -{simulationResult.projected_risk_reduction_pct}%
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {simulationResult.outcome_summary}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
