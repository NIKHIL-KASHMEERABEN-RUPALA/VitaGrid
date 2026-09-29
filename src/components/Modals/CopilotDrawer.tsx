import React from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { CopilotRecommendation } from '../../types/dashboard';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: CopilotRecommendation[];
  onApplyAction: (actionId: string) => void;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  recommendations,
  onApplyAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-2xs">
      <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-blue-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-blue-100" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">AI Decision Copilot</h2>
              <p className="text-[11px] text-slate-500">
                Autonomous multi-agent intelligence recommendations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="text-xs text-slate-500 font-medium leading-relaxed">
            VitaGrid Multi-Agent Mesh has computed 3 high-impact intervention vectors based on real-time epidemiological feeds and inventory telemetry.
          </div>

          <div className="space-y-3">
            {recommendations.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border transition-all ${
                  item.status === 'applied'
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-white border-slate-200 shadow-2xs hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      item.priority === 'Immediate'
                        ? 'bg-red-100 text-red-700'
                        : item.priority === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                  {item.status === 'applied' && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Applied
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-[11px] text-slate-600 leading-normal mb-2.5">
                  {item.description}
                </p>

                <div className="bg-slate-50 p-2 rounded text-[11px] text-slate-700 mb-3 border border-slate-100">
                  <strong className="text-slate-800">Projected Impact:</strong> {item.projectedImpact}
                </div>

                {item.status !== 'applied' && (
                  <button
                    onClick={() => onApplyAction(item.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-1.5 px-3 rounded flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Human-in-the-Loop Protocol:</strong> All automated proposals conform to Sovereign Rule #A-42 and require verified Director cryptographic token to finalize logistics dispatch.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Model: VitaGrid-HealthMesh v4</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-medium transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
