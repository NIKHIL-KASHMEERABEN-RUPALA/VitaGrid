import React, { useState } from 'react';
import {
  Radio,
  Activity,
  Cpu,
  ShieldCheck,
  Send,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
  Lock,
  LucideIcon,
} from 'lucide-react';

interface StepItem {
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  badge: string;
}

export const WorkflowSection: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number>(1);

  const steps: StepItem[] = [
    {
      stepNumber: '01',
      title: 'Continuous Edge Ingestion',
      subtitle: 'Continuous telemetry capture from rural clinics and depots',
      description:
        'Dispensary stock counts, automated cold-chain IoT temperature packets, and syndromic triage logs stream continuously via lightweight MQTT protocols with edge data summarization.',
      icon: Radio,
      badge: 'Edge Capture',
    },
    {
      stepNumber: '02',
      title: 'Predictive Modeling',
      subtitle: 'Epidemiological forecast & stock-out risk assessment',
      description:
        'Neural spatio-temporal forecasting correlates clinic presentation trends with bioclimatic satellite rainfall data to identify upcoming stock-outs and vector outbreaks 14 days in advance.',
      icon: Activity,
      badge: 'SARIMA + Satellite',
    },
    {
      stepNumber: '03',
      title: 'Multi-Agent Negotiation',
      subtitle: 'Algorithmic route & inventory rebalance proposals',
      description:
        'Specialized Supply, Demand, and Logistics AI agents negotiate inventory allocations, minimizing transport costs and cold-chain exposure while eliminating local supply deficits.',
      icon: Cpu,
      badge: 'Autonomous Mesh',
    },
    {
      stepNumber: '04',
      title: 'Human-in-the-Loop Gate',
      subtitle: 'Director-level review and cryptographic authorization',
      description:
        'Every rebalancing proposal is surfaced with full mathematical explainability, risk-to-impact scoring, and simulation curves for one-click verification by designated Health Directors.',
      icon: ShieldCheck,
      badge: 'Statutory Rule A-42',
    },
    {
      stepNumber: '05',
      title: 'Verifiable Dispatch',
      subtitle: 'Ground fleet and autonomous medical drone execution',
      description:
        'Approved waybills trigger dispatch via regional cold-chain transport trucks and autonomous drones, recording every temperature reading and handover to the immutable sovereign audit ledger.',
      icon: Send,
      badge: 'Chain of Custody',
    },
  ];

  return (
    <section id="workflow-section" className="py-20 bg-[#F8F9FB] border-b border-slate-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
            <span>OPERATIONAL PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How It Works: End-to-End Decision Flow
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            From remote dispensary bio-signal anomalies to physical cold-chain resupply,
            VitaGrid operates with sovereign accountability at every milestone.
          </p>
        </div>

        {/* Step-by-Step Flow Cards (5 Steps) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-14">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = selectedStep === idx + 1;
            return (
              <div
                key={item.stepNumber}
                onClick={() => setSelectedStep(idx + 1)}
                className={`rounded-xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white/80 border-slate-200/90 hover:bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.stepNumber}
                    </span>
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-[11px] font-semibold text-slate-600 mb-2 leading-tight">
                    {item.subtitle}
                  </p>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400">{item.badge}</span>
                  <span className={isSelected ? 'text-blue-600 font-bold' : 'text-slate-400'}>
                    Phase {idx + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Supporting System Architecture & Decision Flow Diagram */}
        <div id="architecture-section" className="rounded-xl border border-slate-300/80 bg-slate-900 text-white p-6 shadow-xl scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span className="font-mono font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                SYSTEM ARCHITECTURE &amp; GOVERNANCE PIPELINE
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE PIPELINE • ZERO LATENCY
              </span>
              <span>SLO: &lt; 90 SEC</span>
            </div>
          </div>

          {/* Architecture Pipeline Visual Layout */}
          <div className="py-6 grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
            {/* Stage 1 */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center relative">
              <div className="w-8 h-8 rounded-full bg-blue-900/50 text-blue-400 border border-blue-700/50 flex items-center justify-center mx-auto mb-2">
                <Radio className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white">Edge Layer</div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                2,840 Primary Clinics + IoT Cold Boxes
              </div>
              <div className="mt-2 text-[9px] bg-slate-900 text-blue-300 px-1.5 py-0.5 rounded font-mono border border-slate-800">
                MQTT / LTE-M
              </div>
            </div>

            {/* Stage 2 */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center relative">
              <div className="w-8 h-8 rounded-full bg-emerald-900/50 text-emerald-400 border border-emerald-700/50 flex items-center justify-center mx-auto mb-2">
                <Activity className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white">Prediction Engine</div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                SARIMA + Copernicus Climate Spatio-Temporal
              </div>
              <div className="mt-2 text-[9px] bg-slate-900 text-emerald-300 px-1.5 py-0.5 rounded font-mono border border-slate-800">
                14-Day Horizon
              </div>
            </div>

            {/* Stage 3 */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center relative">
              <div className="w-8 h-8 rounded-full bg-indigo-900/50 text-indigo-400 border border-indigo-700/50 flex items-center justify-center mx-auto mb-2">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white">Multi-Agent Mesh</div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                Supply, Demand &amp; Transport Consensus
              </div>
              <div className="mt-2 text-[9px] bg-slate-900 text-indigo-300 px-1.5 py-0.5 rounded font-mono border border-slate-800">
                Linear Optimization
              </div>
            </div>

            {/* Stage 4 */}
            <div className="bg-slate-950 p-4 rounded-lg border border-blue-500/50 text-center relative ring-1 ring-blue-500/30">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white">Director Gate</div>
              <div className="text-[10px] text-slate-300 mt-1 font-mono">
                Cryptographic Human Authorization
              </div>
              <div className="mt-2 text-[9px] bg-blue-600/30 text-blue-200 px-1.5 py-0.5 rounded font-mono border border-blue-400/40">
                Constitutional Gate
              </div>
            </div>

            {/* Stage 5 */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center relative">
              <div className="w-8 h-8 rounded-full bg-emerald-900/50 text-emerald-400 border border-emerald-700/50 flex items-center justify-center mx-auto mb-2">
                <Send className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white">Logistics Fleet</div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                Refrigerated Trucks &amp; Autonomous Drones
              </div>
              <div className="mt-2 text-[9px] bg-slate-900 text-emerald-300 px-1.5 py-0.5 rounded font-mono border border-slate-800">
                Ledger Confirmed
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>SOVEREIGN AIR-GAPPED READY • ZERO DEPENDENCE ON FOREIGN PUBLIC CLOUD</span>
            </div>
            <div className="text-slate-500">
              ISO/IEC 27001 • ENCLAVE SECURED • AUDIT TRAIL v4.12
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
