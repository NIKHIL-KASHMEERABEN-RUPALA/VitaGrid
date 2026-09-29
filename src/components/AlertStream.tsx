import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Send, Activity, Sparkles, ChevronRight } from 'lucide-react';
import { NationalAlert, AlertCategory } from '../types/dashboard';

interface AlertStreamProps {
  alerts: NationalAlert[];
  onReviewTransfer: (proposalId?: string) => void;
  onViewProtocol: (protocolId?: string) => void;
  onOpenCopilot: () => void;
}

export const AlertStream: React.FC<AlertStreamProps> = ({
  alerts,
  onReviewTransfer,
  onViewProtocol,
  onOpenCopilot,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<AlertCategory>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedFilter === 'all') return true;
    return alert.category === selectedFilter;
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs flex flex-col h-full relative overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Live National Alert Stream
          </h2>
        </div>
        <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
          18 ACTIVE
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/60">
        <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-200/60 rounded-md text-[11px]">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`py-1 rounded font-medium transition-all ${
              selectedFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedFilter('critical')}
            className={`py-1 rounded font-medium transition-all ${
              selectedFilter === 'critical'
                ? 'bg-white text-red-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Critical (3)
          </button>
          <button
            onClick={() => setSelectedFilter('logistics')}
            className={`py-1 rounded font-medium transition-all ${
              selectedFilter === 'logistics'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Logistics (8)
          </button>
          <button
            onClick={() => setSelectedFilter('clinical')}
            className={`py-1 rounded font-medium transition-all ${
              selectedFilter === 'clinical'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
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
              className={`rounded-lg border p-3 transition-all ${
                alert.type === 'critical'
                  ? 'bg-red-50/40 border-red-200/90'
                  : alert.type === 'surge'
                  ? 'bg-amber-50/40 border-amber-200/90'
                  : 'bg-slate-50/60 border-slate-200/90'
              }`}
            >
              {/* Alert Tag & Timestamp */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
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
                <span className="text-[11px] text-slate-400 font-normal">{alert.timestamp}</span>
              </div>

              {/* Title */}
              <h3 className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                {alert.title}
              </h3>

              {/* Description */}
              <p className="text-[11px] text-slate-600 leading-relaxed mb-2.5">
                {alert.id === 'alt-01' ? (
                  <>
                    Amoxicillin 250mg runout projected in <strong className="text-red-700 font-bold">1.8 days</strong>. Rebalance proposal #842 ready for sign-off.
                  </>
                ) : alert.id === 'alt-02' ? (
                  <>
                    Pediatric rotavirus and malaria syndromic admissions <strong className="text-amber-700 font-bold">+18% wk/wk</strong>. Automated IV fluid pre-allocation ready.
                  </>
                ) : (
                  alert.description
                )}
              </p>

              {/* Footer / Action */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                <span className="text-slate-500">{alert.metaLeft}</span>

                {alert.actionType === 'review-transfer' && (
                  <button
                    onClick={() => onReviewTransfer(alert.transferProposalId)}
                    className="bg-red-700 hover:bg-red-800 text-white font-medium text-xs px-2.5 py-1 rounded transition-colors shadow-2xs"
                  >
                    {alert.actionText}
                  </button>
                )}

                {alert.actionType === 'view-protocol' && (
                  <button
                    onClick={() => onViewProtocol(alert.protocolId)}
                    className="text-blue-700 hover:text-blue-900 font-semibold text-xs transition-colors underline decoration-blue-300 underline-offset-2"
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
          className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-102 active:scale-98 border border-blue-400/40"
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
