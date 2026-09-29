import React from 'react';
import { ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { KpiMetric } from '../types/dashboard';

interface KpiRowProps {
  metrics: KpiMetric[];
  onCardClick?: (metricId: string) => void;
}

export const KpiRow: React.FC<KpiRowProps> = ({ metrics, onCardClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 mb-4">
      {metrics.map((metric) => {
        const isCritical = metric.id === 'critical_alerts';

        return (
          <div
            key={metric.id}
            onClick={() => onCardClick && onCardClick(metric.id)}
            className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer flex flex-col justify-between"
          >
            {/* Top row: Title and Badge */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[11px] font-bold tracking-wider uppercase ${
                    isCritical ? 'text-red-700' : 'text-slate-500'
                  }`}
                >
                  {metric.title}
                </span>

                {metric.statusType === 'optimal' && (
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                    {metric.statusBadge}
                  </span>
                )}

                {metric.statusType === 'nominal' && (
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-200">
                    {metric.statusBadge}
                  </span>
                )}

                {metric.statusType === 'stable' && (
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                    {metric.statusBadge}
                  </span>
                )}

                {metric.statusType === 'critical' && (
                  <span className="bg-red-50 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-red-200">
                    {metric.statusBadge}
                  </span>
                )}
              </div>

              {/* Large Metric Value */}
              <div
                className={`text-3xl font-extrabold tracking-tight mb-2 ${
                  isCritical ? 'text-red-600' : 'text-slate-900'
                }`}
              >
                {metric.value}
              </div>

              {/* Sub-row with trend / detailed counts & mini SVG Sparkline */}
              <div className="flex items-center justify-between gap-2 mb-3 min-h-[32px]">
                {metric.id === 'availability' && (
                  <>
                    <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>{metric.trendText}</span>
                    </div>
                    {/* SVG Sparkline */}
                    <div className="w-20 h-6">
                      <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                        <path
                          d="M 0,22 Q 25,20 45,14 T 75,8 T 100,2"
                          fill="none"
                          stroke="#16a34a"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </>
                )}

                {metric.id === 'surge_bed' && (
                  <>
                    <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                      <span className="text-slate-400 font-mono">—</span>
                      <span className="font-semibold text-slate-800">1,420 / 1,815</span>
                      <span className="text-[11px] text-slate-500">Beds ICU</span>
                    </div>
                    {/* SVG Sparkline */}
                    <div className="w-20 h-6">
                      <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                        <path
                          d="M 0,16 Q 30,12 50,18 T 80,10 T 100,14"
                          fill="none"
                          stroke="#64748b"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </>
                )}

                {metric.id === 'clinician' && (
                  <>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-900">14,920</span>
                      <span className="text-[11px] text-slate-500">On-shift live</span>
                    </div>
                    {/* SVG Sparkline */}
                    <div className="w-20 h-6">
                      <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                        <path
                          d="M 0,24 Q 25,22 50,16 T 80,10 T 100,4"
                          fill="none"
                          stroke="#16a34a"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </>
                )}

                {metric.id === 'critical_alerts' && (
                  <div className="flex items-start justify-between w-full">
                    <div className="text-xs space-y-0.5">
                      <div className="flex items-center gap-1.5 text-red-700 font-semibold leading-tight">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
                        <span>2 Stockouts imminent (&lt;48h)</span>
                      </div>
                      <div className="text-slate-600 text-[11px] pl-3 leading-tight">
                        1 Lake Basin vector surge
                      </div>
                    </div>
                    <div className="p-1 rounded bg-red-50 text-red-600 border border-red-100 shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer with subtle divider */}
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-normal">
              {metric.id === 'critical_alerts' ? (
                <div>
                  <span>Triage Protocol: Active • </span>
                  <span className="text-red-600 font-semibold">SLAs Pending (2)</span>
                </div>
              ) : (
                <span>{metric.footerText}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
