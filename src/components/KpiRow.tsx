import React from 'react';
import { ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { KpiMetric } from '../types/dashboard';

interface KpiRowProps {
  metrics: KpiMetric[];
  onCardClick?: (metricId: string) => void;
  defconLevel?: number;
}

export const KpiRow: React.FC<KpiRowProps> = ({ metrics, onCardClick, defconLevel = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 mb-4">
      {metrics.map((metric) => {
        const isCritical = metric.id === 'critical_alerts';

        // Dynamic adjustment based on DEFCON level
        let displayValue = metric.value;
        let displayStatus = metric.statusBadge;
        let isDefconStressed = defconLevel <= 2;

        if (metric.id === 'availability' && defconLevel <= 2) {
          displayValue = '89.2%';
          displayStatus = 'SURGE STRAIN';
        } else if (metric.id === 'surge_bed' && defconLevel <= 2) {
          displayValue = '93.4%';
          displayStatus = 'ICU CAPACITY WARNING';
        } else if (metric.id === 'critical_alerts' && defconLevel <= 2) {
          displayValue = '8 Active';
          displayStatus = 'DEFCON RED WATCH';
        }

        return (
          <div
            key={metric.id}
            onClick={() => onCardClick && onCardClick(metric.id)}
            className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-2xs hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between"
          >
            {/* Top row: Title and Badge */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[11px] font-bold tracking-wider uppercase font-mono ${
                    isCritical
                      ? 'text-red-700 dark:text-red-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {metric.title}
                </span>

                {metric.statusType === 'optimal' && (
                  <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/60 font-mono">
                    {displayStatus}
                  </span>
                )}

                {metric.statusType === 'nominal' && (
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 font-mono">
                    {displayStatus}
                  </span>
                )}

                {metric.statusType === 'stable' && (
                  <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/60 font-mono">
                    {displayStatus}
                  </span>
                )}

                {metric.statusType === 'critical' && (
                  <span className="bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900/60 font-mono">
                    {displayStatus}
                  </span>
                )}
              </div>

              {/* Large Metric Value */}
              <div
                className={`text-3xl font-extrabold tracking-tight mb-2 font-mono ${
                  isCritical
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {displayValue}
              </div>

              {/* Sub-row with trend / detailed counts & mini SVG Sparkline */}
              <div className="flex items-center justify-between gap-2 mb-3 min-h-[32px]">
                {metric.id === 'availability' && (
                  <>
                    <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>{defconLevel <= 2 ? '-4.2% under surge' : metric.trendText}</span>
                    </div>
                    {/* SVG Sparkline */}
                    <div className="w-20 h-6">
                      <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                        <path
                          d="M 0,22 Q 25,20 45,14 T 75,8 T 100,2"
                          fill="none"
                          stroke={defconLevel <= 2 ? '#ef4444' : '#10b981'}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </>
                )}

                {metric.id === 'surge_bed' && (
                  <>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5 font-mono">
                      <span className="text-slate-400 font-mono">—</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {defconLevel <= 2 ? '1,695 / 1,815' : '1,420 / 1,815'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-sans">Beds ICU</span>
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
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="font-semibold text-slate-900 dark:text-white font-mono">
                        {defconLevel <= 2 ? '15,840' : '14,920'}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">On-shift live</span>
                    </div>
                    {/* SVG Sparkline */}
                    <div className="w-20 h-6">
                      <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                        <path
                          d="M 0,24 Q 25,22 50,16 T 80,10 T 100,4"
                          fill="none"
                          stroke="#10b981"
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
                      <div className="flex items-center gap-1.5 text-red-700 dark:text-red-400 font-semibold leading-tight">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
                        <span>{defconLevel <= 2 ? '4 Stockouts imminent' : '2 Stockouts imminent (<48h)'}</span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-[11px] pl-3 leading-tight">
                        {defconLevel <= 2 ? '2 Lake Basin + 1 Delta vector surge' : '1 Lake Basin vector surge'}
                      </div>
                    </div>
                    <div className="p-1 rounded bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/60 shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer with subtle divider */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-normal">
              {metric.id === 'critical_alerts' ? (
                <div>
                  <span>Triage Protocol: Active • </span>
                  <span className="text-red-600 dark:text-red-400 font-semibold">
                    SLAs Pending ({defconLevel <= 2 ? 4 : 2})
                  </span>
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
