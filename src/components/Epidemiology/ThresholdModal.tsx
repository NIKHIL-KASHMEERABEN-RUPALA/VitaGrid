import React, { useState } from 'react';
import { X, Sliders, Check, ShieldAlert } from 'lucide-react';

interface ThresholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (thresholds: { r0Limit: number; rainMm: number; velocityPercent: number }) => void;
}

export const ThresholdModal: React.FC<ThresholdModalProps> = ({ isOpen, onClose, onSave }) => {
  const [r0Limit, setR0Limit] = useState<number>(1.25);
  const [rainMm, setRainMm] = useState<number>(30);
  const [velocityPercent, setVelocityPercent] = useState<number>(35);
  const [saved, setSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      onSave({ r0Limit, rainMm, velocityPercent });
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Epidemiological Alert Thresholds
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
          <div>
            <div className="flex justify-between mb-1 font-semibold text-slate-800">
              <span>Transmission R₀ Alert Cutoff</span>
              <span className="text-blue-600 font-mono font-bold">{r0Limit}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.05"
              value={r0Limit}
              onChange={(e) => setR0Limit(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1 font-semibold text-slate-800">
              <span>Bio-Climatic Precipitation Anomaly (mm)</span>
              <span className="text-blue-600 font-mono font-bold">+{rainMm}mm</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              step="2"
              value={rainMm}
              onChange={(e) => setRainMm(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1 font-semibold text-slate-800">
              <span>7-Day Velocity Spike Threshold (%)</span>
              <span className="text-blue-600 font-mono font-bold">+{velocityPercent}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="70"
              step="1"
              value={velocityPercent}
              onChange={(e) => setVelocityPercent(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-[11px] text-slate-600">
            Automated alerts propagate instantly to District Epidemiologists and pre-allocate cold chain stockpiles.
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-200 rounded text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Updated
              </>
            ) : (
              'Save Sovereign Thresholds'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
