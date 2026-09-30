import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Send, Activity, Sparkles, ChevronRight, ShieldAlert } from 'lucide-react';
import { NationalAlert, AlertCategory } from '../types/dashboard';

interface AlertStreamProps {
  alerts: NationalAlert[];
  onReviewTransfer: (proposalId?: string) => void;
  onViewProtocol: (protocolId?: string) => void;
  onOpenCopilot: () => void;
  defconLevel?: number;
}

export const AlertStream: React.FC<AlertStreamProps> = ({
  alerts,
  onReviewTransfer,
  onViewProtocol,
  onOpenCopilot,
  defconLevel = 4,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<AlertCategory>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedFilter === 'all') return true;
    return alert.category === selectedFilter;
  });

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col h-full relative overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Live National Alert Stream
          </h2>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono ${
            defconLevel <= 2
              ? 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950/80 dark:text-red-400 dark:border-red-900 animate-pulse'
              : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-900/60'
          }`}
        >
          {defconLevel <= 2 ? 'DEFCON-2 SURGE: 24 ACTIVE' : '18 ACTIVE'}
        </span>
      </div>

      {/* DEFCON Emergency Banner if Defcon <= 2 */}
      {defconLevel <= 2 && (
        <div className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>STATUTORY PRIORITY: High alert posture active across all 5 logistics echelons.</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
        <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-200/60 dark:bg-slate-800 rounded-lg text-[11px]">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`py-1 rounded-md font-medium transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedFilter('critical')}
            className={`py-1 rounded-md font-medium transition-all cursor-pointer ${
              selectedFilter === 'critical'
                ? 'bg-white dark:bg-slate-700 text-red-700 dark:text-red-400 shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Critical (3)
          </button>
          <button
            onClick={() => setSelectedFilter('logistics')}
            className={`py-1 rounded-md font-medium transition-all cursor-pointer ${
              selectedFilter === 'logistics'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Logistics (8)
          </button>
          <button
            onClick={() => setSelectedFilter('clinical')}
            className={`py-1 rounded-md font-medium transition-all cursor-pointer ${
              selectedFilter === 'clinical'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Clinical (7)
          </button>
        </div>
      </div>

      {/* Scrollable Alerts List */}
      <div className="p-3.5 space-y-3 overflow-y-auto max-h-[500px] flex-1 pb-16">
        {filteredAlerts.map((alert) => {
          return (
            <div
              key={alert.id}
              className={`rounded-xl border p-3 transition-all ${
                alert.type === 'critical'
                  ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200/90 dark:border-red-900/40'
                  : alert.type === 'surge'
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/90 dark:border-amber-900/40'
                  : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800'
              }`}
            >
              {/* Alert Tag & Timestamp */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide font-mono ${
                    alert.type === 'critical'
                      ? 'bg-red-600 text-white'
                      : alert.type === 'surge'
                      ? 'bg-amber-500 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {alert.type === 'critical' && <AlertCircle className="w-3 h-3" />}
                  {alert.type === 'surge' && <AlertTriangle className="w-3 h-3" />}
                  {alert.type === 'transit' && <Send className="w-3 h-3" />}
                  {alert.type === 'telemetry' && <Activity className="w-3 h-3" />}
                  <span>{alert.badgeText}</span>
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{alert.timestamp}</span>
              </div>

              {/* Title */}
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1 leading-snug">
                {alert.title}
              </h3>

              {/* Description */}
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-2.5">
                {alert.id === 'alt-01' ? (
                  <>
                    Amoxicillin 250mg runout projected in <strong className="text-red-700 dark:text-red-400 font-bold">1.8 days</strong>. Rebalance proposal #842 ready for sign-off.
                  </>
                ) : alert.id === 'alt-02' ? (
                  <>
                    Pediatric rotavirus and malaria syndromic admissions <strong className="text-amber-700 dark:text-amber-400 font-bold">+18% wk/wk</strong>. Automated IV fluid pre-allocation ready.
                  </>
                ) : (
                  alert.description
                )}
              </p>

              {/* Footer / Action */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 font-mono">{alert.metaLeft}</span>

                {alert.actionType === 'review-transfer' && (
                  <button
                    onClick={() => onReviewTransfer(alert.transferProposalId)}
                    className="bg-red-700 hover:bg-red-800 text-white font-medium text-xs px-2.5 py-1 rounded-md transition-colors shadow-2xs cursor-pointer"
                  >
                    {alert.actionText}
                  </button>
                )}

                {alert.actionType === 'view-protocol' && (
                  <button
                    onClick={() => onViewProtocol(alert.protocolId)}
                    className="text-blue-700 dark:text-cyan-400 hover:text-blue-900 dark:hover:text-cyan-300 font-semibold text-xs transition-colors underline decoration-blue-300 underline-offset-2 cursor-pointer"
                  >
                    {alert.actionText}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom AI Decision Copilot Pill Button */}
      <div className="absolute bottom-3 left-0 right-0 px-4 flex justify-center pointer-events-none">
        <button
          onClick={onOpenCopilot}
          className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-102 active:scale-98 border border-blue-400/40 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-blue-200" />
          <span>AI Decision Copilot</span>
          <span className="w-1 h-1 rounded-full bg-blue-300"></span>
          <span className="text-[11px] font-normal text-blue-100">3 Actions Recommended</span>
        </button>
      </div>
    </div>
  );
};
