import React, { useState, useEffect } from 'react';
import {
  Truck,
  CheckCircle2,
  RotateCw,
  ShieldCheck,
  X,
  ArrowRight,
  BatteryCharging,
  Navigation,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { RebalanceDirective, FacilityLoad } from '../../types/resourceIntel';

interface TransferExecutionFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  directive: RebalanceDirective;
  facility?: FacilityLoad;
  onComplete: () => void;
}

interface Step {
  id: number;
  title: string;
  subtitle: string;
  detail: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    title: 'PostGIS Spatial Corridor Feasibility',
    subtitle: 'Checking road passability, security checkpoints, and bridge ratings',
    detail: 'Corridor A1 verified clear. Haversine route calculated at 234 km via Kitale-Lodwar Highway.',
  },
  {
    id: 2,
    title: 'Biomedical & IoT Cold-Chain Seal',
    subtitle: 'Calibrating oxygen manifold telemetry and pediatric cool-boxes',
    detail: 'Oxygen manifold calibrated at 52.4 PSI. Active cold-chain verified at +4.2°C.',
  },
  {
    id: 3,
    title: 'Cryptographic Dispatch Token Generation',
    subtitle: 'Minting immutable dispatch token with ministerial clearance tag',
    detail: 'Token: 0x9f8c...4e1b signed with SHA-256 dispatch certificate #RL-09.',
  },
  {
    id: 4,
    title: 'Autonomous Fleet Convoy Dispatch',
    subtitle: 'Vehicle RL-09 departing Regional Hub under active satellite beacon',
    detail: 'Fleet Unit RL-09 in transit. GPS: 3.118° N, 35.597° E • Vehicle Battery 94% • Speed 78 km/h.',
  },
  {
    id: 5,
    title: 'Facility Load & Staff Roster Rebalanced',
    subtitle: 'Digital Twin node synchronized and clinical relief staged',
    detail: 'Clinician ratio improved to 1:14. Burnout index reduced by -43.6%.',
  },
];

export const TransferExecutionFlowModal: React.FC<TransferExecutionFlowModalProps> = ({
  isOpen,
  onClose,
  directive,
  facility,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setIsFinished(false);
      return;
    }

    // Step-by-step automated animation
    const timer1 = setTimeout(() => setCurrentStep(2), 1200);
    const timer2 = setTimeout(() => setCurrentStep(3), 2600);
    const timer3 = setTimeout(() => setCurrentStep(4), 4200);
    const timer4 = setTimeout(() => {
      setCurrentStep(5);
      setIsFinished(true);
      onComplete();
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0F172A] w-full max-w-2xl rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white shadow-xs">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                REAL-TIME EXECUTION ORCHESTRATOR
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Autonomous Resource Rebalance Dispatch
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Directive Brief Banner */}
          <div className="bg-blue-50/60 dark:bg-blue-950/30 rounded-xl p-3.5 border border-blue-200/80 dark:border-blue-900/40 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className="font-bold text-blue-900 dark:text-cyan-300 text-sm">
                {directive.title}
              </span>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/70 text-blue-800 dark:text-cyan-200">
                DIRECTIVE #{directive.id}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-blue-200/60 dark:border-blue-900/40 text-[11px] font-mono">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Origin: </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{directive.sourceNode}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Payload: </span>
                <span className="font-bold text-blue-700 dark:text-cyan-300">{directive.transferResource}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Target ETA: </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{directive.eta} Corridor</span>
              </div>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="space-y-3">
            {STEPS.map((step) => {
              const isPast = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isFuture = currentStep < step.id;

              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-400 dark:border-cyan-500 ring-2 ring-blue-500/10'
                      : isPast
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/60'
                      : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/80 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isPast ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 dark:bg-cyan-500 text-white flex items-center justify-center animate-spin">
                          <RotateCw className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] font-bold font-mono">
                          {step.id}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs font-bold leading-tight ${
                            isCurrent
                              ? 'text-blue-900 dark:text-cyan-300'
                              : isPast
                              ? 'text-emerald-900 dark:text-emerald-300'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          Step {step.id}: {step.title}
                        </h4>
                        <span className="text-[10px] font-mono font-semibold">
                          {isPast && <span className="text-emerald-600 dark:text-emerald-400">VERIFIED</span>}
                          {isCurrent && <span className="text-blue-600 dark:text-cyan-400 animate-pulse">PROCESSING...</span>}
                          {isFuture && <span className="text-slate-400">QUEUED</span>}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {step.subtitle}
                      </p>

                      {(isCurrent || isPast) && (
                        <div className="mt-2 text-[11px] font-mono bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                          {step.detail}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final Success Callout */}
          {isFinished && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800 text-xs space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Execution Complete • Live Fleet En Route</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                Logistics Unit #RL-09 successfully departed. Regional health command dispatch logged in sovereign audit ledger. Lodwar Subcounty Hospital staffing status marked nominal.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
            {isFinished ? 'Status: DISPATCHED & ACTIVE' : `Simulating Step ${currentStep} of 5...`}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                isFinished
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
              }`}
            >
              {isFinished ? 'Close & View Grid' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
