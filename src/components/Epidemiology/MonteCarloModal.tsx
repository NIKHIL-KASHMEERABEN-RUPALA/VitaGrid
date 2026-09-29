import React, { useState, useEffect } from 'react';
import { X, Cpu, Check, Activity } from 'lucide-react';

interface MonteCarloModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const MonteCarloModal: React.FC<MonteCarloModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [stage, setStage] = useState<string>('Initializing Bayesian priors...');

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setStage('Initializing Bayesian priors...');
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStage('10,000 iterations completed. 95% Confidence Fan synced.');
          return 100;
        }
        if (prev === 25) setStage('Sampling 2,840 sentinel nodes & climate rasters...');
        if (prev === 65) setStage('Computing transmission stochastic differential equations...');
        if (prev === 85) setStage('Evaluating hospital surge footprint...');
        return prev + 5;
      });
    }, 75);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Monte Carlo Epidemiological Forecast
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="text-slate-600 leading-relaxed">
            Running <strong>10,000 stochastic simulations</strong> across 47 sovereign counties incorporating precipitation anomalies, vector density, and real-time clinical footfall.
          </div>

          <div className="space-y-2">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-slate-600 font-medium">{stage}</span>
              <span className="font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {progress === 100 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <strong>Simulation Converged:</strong> Lake Basin Malaria peak revised to +41.2% at Day T+10 with 91.8% bio-climatic confidence.
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex justify-end">
          <button
            onClick={() => {
              onComplete();
              onClose();
            }}
            disabled={progress < 100}
            className={`px-4 py-1.5 rounded text-xs font-semibold shadow-xs transition-colors ${
              progress === 100
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Apply Forecast Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
