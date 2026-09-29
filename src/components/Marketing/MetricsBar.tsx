import React from 'react';
import { Building2, Calendar, Pill, Zap } from 'lucide-react';

export const MetricsBar: React.FC = () => {
  const metrics = [
    {
      value: '2,840',
      label: 'PHCs Connected',
      description: '100% real-time telemetry coverage across rural dispensaries and regional referral hospitals.',
      icon: Building2,
      badge: 'National Coverage',
      color: 'text-blue-600',
    },
    {
      value: '14.2 Days',
      label: 'Average Forecast Horizon',
      description: 'Early epidemiological outbreak warning ahead of symptomatic acute inpatient surges.',
      icon: Calendar,
      badge: 'Predictive Horizon',
      color: 'text-emerald-600',
    },
    {
      value: '94.6%',
      label: 'Medicine Availability Index',
      description: 'Maintained above statutory baseline (>92%) across all 47 sovereign health zones.',
      icon: Pill,
      badge: 'Stock Resilience',
      color: 'text-blue-600',
    },
    {
      value: '< 90 Sec',
      label: 'Decision Latency',
      description: 'Autonomous multi-agent algorithmic proposals from telemetry packet ingestion to sign-off.',
      icon: Zap,
      badge: 'Edge Consensus',
      color: 'text-emerald-600',
    },
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/60 rounded-xl p-5 border border-slate-200/90 hover:border-blue-300 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {item.badge}
                    </span>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>

                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {item.value}
                  </div>

                  <div className="text-xs font-bold text-slate-800 mt-1">
                    {item.label}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 mt-3 leading-relaxed border-t border-slate-200/60 pt-2.5">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
