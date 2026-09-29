import React from 'react';
import { Radio, Activity, GitFork, Send, ShieldCheck, Cpu } from 'lucide-react';

export const PlatformCapabilities: React.FC = () => {
  const steps = [
    {
      step: 'STEP 01',
      title: 'Continuous Edge Data Ingestion',
      subtitle: 'PHC electronic records, cold chain IoT, syndromic reports',
      description: 'Distributed sentinel nodes ingest dispensary consumption logs, cold chain IoT telemetry, and syndromic records with local edge summarization.',
      icon: Radio,
    },
    {
      step: 'STEP 02',
      title: 'Predictive AI & Optimization',
      subtitle: 'SARIMA demand curves, linear programming rebalancing',
      description: 'Stochastic models forecast acute vector surges (R₀ 1.48) and pediatric antibiotic runouts 14 days ahead of clinical crisis using linear programming.',
      icon: Activity,
    },
    {
      step: 'STEP 03',
      title: 'Pre-emptive Action & Human Approval',
      subtitle: 'Automated transfer orders, director-level signoff',
      description: 'Identifies optimal donor depots to generate digital transfer proposals requiring Director-level cryptographic authorization before dispatch.',
      icon: GitFork,
    },
    {
      step: 'STEP 04',
      title: 'Sovereign Verification & Audit',
      subtitle: 'Cryptographic consensus, zero-PII egress',
      description: 'Multi-agent consensus network verifies strict zero personal data egress while committing immutable audit trails to the sovereign health ledger.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="capabilities-section" className="py-20 bg-white border-b border-slate-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-blue-700 block mb-1">
            END-TO-END PIPELINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            From Bio-Signal to Drone Dispatch
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
            Autonomous multi-agent execution that transforms remote clinical anomalies into physical logistics mitigation without latency.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 rounded-xl p-5 border border-slate-200/80 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {item.step}
                    </span>
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    {item.title}
                  </h3>

                  <div className="text-[11px] font-semibold text-slate-700 mb-2 leading-tight">
                    {item.subtitle}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-[10px] font-mono text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Sovereign SLA Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
