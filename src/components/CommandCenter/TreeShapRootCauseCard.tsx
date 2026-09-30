import React, { useState } from 'react';
import { Sliders, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { ShapExplanationResponse } from '../../services/backendApi';

interface TreeShapRootCauseCardProps {
  data: ShapExplanationResponse;
  onOpenWhatIf?: () => void;
  onAuthorizeTransfer?: () => void;
}

export const TreeShapRootCauseCard: React.FC<TreeShapRootCauseCardProps> = ({
  data,
  onOpenWhatIf,
  onAuthorizeTransfer,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-red-200/90 dark:border-red-900/60 shadow-2xs overflow-hidden mb-4 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-3.5 bg-gradient-to-r from-red-50 to-amber-50/40 dark:from-red-950/40 dark:to-amber-950/20 border-b border-red-100 dark:border-red-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-red-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase font-mono px-1.5 py-0.5 rounded bg-red-600 text-white">
                TreeSHAP Root Cause Explanation
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                {data.facility_id} • {data.commodity_name}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
              30-Day Stockout Probability: <span className="font-bold text-red-700 dark:text-red-400">{(data.stockout_probability_30d * 100).toFixed(1)}%</span> • Runway: <span className="font-bold text-red-700 dark:text-red-400">{data.projected_runout_days} days</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3.5 text-xs">
          {/* Plain-Language Ministerial Narrative */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            <span className="font-semibold text-slate-900 dark:text-white block mb-1">Algorithmic Justification (XAI Agent):</span>
            {data.plain_language_narrative}
          </div>

          {/* Horizontal Shapley Contribution Bars */}
          <div>
            <span className="text-[11px] font-bold uppercase font-mono text-slate-500 dark:text-slate-400 block mb-2">
              Top Shapley Factor Contributions (TreeSHAP Weights)
            </span>
            <div className="space-y-2">
              {data.tree_shap_attributions.map((attr, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{attr.factor}</span>
                    <span className="font-bold font-mono text-blue-700 dark:text-cyan-400">+{attr.contribution_pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, attr.contribution_pct * 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Statutory Compliance: FIPS 140-3 Cryptographically Traceable</span>
            </div>

            <div className="flex items-center gap-2">
              {onOpenWhatIf && (
                <button
                  onClick={onOpenWhatIf}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                  <span>Test in What-If Simulator</span>
                </button>
              )}

              {onAuthorizeTransfer && (
                <button
                  onClick={onAuthorizeTransfer}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <span>Authorize Rebalance Docket</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
