import React from 'react';
import { motion } from 'motion/react';
import {
  Radio,
  Activity,
  Cpu,
  Share2,
  ShieldCheck,
  Network,
  CheckCircle2,
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const CapabilitiesGrid: React.FC = () => {
  const capabilities = [
    {
      id: 'telemetry',
      icon: Radio,
      title: 'Real-time Telemetry',
      description:
        'Continuous synchronization across 2,840 primary health centers, dispensaries, and regional depots. Ingests stock levels, temperature logs, and patient volume over lightweight cellular and satellite links.',
      badge: 'Edge Sync',
    },
    {
      id: 'predictive-warning',
      icon: Activity,
      title: 'Predictive Early Warning',
      description:
        'Multi-horizon SARIMA and neural spatio-temporal forecasting flags impending medicine stock-outs and vector-borne epidemic spikes 14 days before clinical triage saturation.',
      badge: '14-Day Horizon',
    },
    {
      id: 'multi-agent',
      icon: Cpu,
      title: 'Multi-Agent Coordination',
      description:
        'Decentralized autonomous AI agents representing supply depots, clinic demand, transport fleets, and clinical staffing continuously solve resource optimization without manual paperwork.',
      badge: 'Autonomous Mesh',
    },
    {
      id: 'redistribution',
      icon: Share2,
      title: 'Cross-District Redistribution',
      description:
        'Dynamic peer-to-peer inventory rebalancing that routes surplus medicines from regional warehouses to vulnerable rural facilities via optimized ground transport and autonomous medical drone corridors.',
      badge: 'Zero Waste',
    },
    {
      id: 'human-approvals',
      icon: ShieldCheck,
      title: 'Human-in-the-Loop Approvals',
      description:
        'Constitutional governance gates ensure that high-impact supply transfers and clinical reassignments require verified cryptographic digital sign-off from authorized Health Directors.',
      badge: 'Constitutional Gate',
    },
    {
      id: 'privacy-preserving-ml',
      icon: Network,
      title: 'Decentralized Machine Learning',
      description:
        'Epidemiological models and demand curves train collaboratively across sovereign district nodes. Zero personally identifiable health information (PII) ever leaves domestic institutional firewalls.',
      badge: 'Zero PII Egress',
    },
  ];

  return (
    <section id="capabilities-section" className="py-20 bg-white border-b border-slate-200/90 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 pulse-dot-blue" />
            <span>ENTERPRISE PLATFORM ATTRIBUTES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for National Scale
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Engineered to operate reliably in sovereign, low-bandwidth, and mission-critical environments
            connecting thousands of distributed healthcare touchpoints.
          </p>
        </ScrollReveal>

        {/* Grid of 6 Feature Cards (2 rows of 3) with Sequential Scroll Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08, // Sequential flow delay
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-slate-50/70 rounded-xl p-6 border border-slate-200/80 hover:bg-white glow-card transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Subtle top indicator line on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs group-hover:border-blue-200 transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-medium text-emerald-700">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Sovereign Production Grade</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">0{idx + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
