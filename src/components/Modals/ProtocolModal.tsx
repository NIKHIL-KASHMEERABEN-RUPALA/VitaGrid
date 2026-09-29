import React, { useState } from 'react';
import { X, Activity, Check, ShieldAlert } from 'lucide-react';
import { VectorProtocol } from '../../types/dashboard';

interface ProtocolModalProps {
  protocol: VectorProtocol;
  isOpen: boolean;
  onClose: () => void;
  onExecute: (protocolId: string) => void;
}

export const ProtocolModal: React.FC<ProtocolModalProps> = ({
  protocol,
  isOpen,
  onClose,
  onExecute,
}) => {
  const [executed, setExecuted] = useState(protocol.status === 'executed');

  if (!isOpen) return null;

  const handleExecute = () => {
    setExecuted(true);
    onExecute(protocol.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-amber-50/60 border-b border-amber-200/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  EPIDEMIOLOGICAL PROTOCOL
                </span>
                <span className="font-mono text-xs text-slate-500">#{protocol.id}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Lake Basin Vector Surge Response
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-amber-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Affected Cluster</div>
            <div className="font-bold text-slate-900">{protocol.cluster}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50/50 p-3 rounded border border-amber-200">
              <div className="text-[10px] text-amber-800 uppercase font-bold">Weekly Surge Rate</div>
              <div className="text-sm font-extrabold text-amber-900 mt-0.5">{protocol.surgeRateWeek}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Predicted Peak</div>
              <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                T+{protocol.predictedPeakDays} Days
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-3.5 space-y-2 bg-slate-50/30">
            <div className="text-[11px] font-bold text-slate-700 uppercase">Pathogen Profile</div>
            <div className="flex flex-wrap gap-1.5">
              {protocol.pathogens.map((p, idx) => (
                <span
                  key={idx}
                  className="bg-white border border-slate-200 px-2 py-1 rounded text-[11px] text-slate-700 font-medium"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-blue-900 space-y-1">
            <div className="font-bold text-xs">Automated Staging Recommendation:</div>
            <p className="text-[11px] text-blue-800">
              Dispatch <strong>{protocol.recommendedIVAllocation.toLocaleString()} units</strong> of pediatric Ringer’s Lactate and 0.9% Normal Saline from Nakuru Regional Depot.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>

          {executed ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
              <Check className="w-4 h-4" />
              Protocol Executed &amp; Supply Queued
            </div>
          ) : (
            <button
              onClick={handleExecute}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              Authorize IV Allocation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
