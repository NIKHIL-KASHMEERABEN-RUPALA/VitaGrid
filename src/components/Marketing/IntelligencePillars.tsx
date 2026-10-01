import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Truck,
  Activity,
  Users,
  ArrowRight,
  Thermometer,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
  HeartPulse,
  Building2,
  Calendar,
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface IntelligencePillarsProps {
  onSelectModule: (moduleId: string) => void;
}

export const IntelligencePillars: React.FC<IntelligencePillarsProps> = ({
  onSelectModule,
}) => {
  const [activeTab, setActiveTab] = useState<'supply' | 'epidemiology' | 'workforce'>('supply');

  return (
    <section id="pillars-section" className="py-20 bg-[#F8F9FB] border-b border-slate-200/90 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <ScrollReveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-bold uppercase tracking-wider mb-2 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 pulse-dot-blue" />
              <span>SOVEREIGN ARCHITECTURAL FOUNDATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Three Layers of National Intelligence
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
            Interconnected intelligence layers that synthesize clinical demand, warehouse inventory,
            and facility personnel to ensure zero stock-outs and resilient frontline care.
          </p>
        </ScrollReveal>

        {/* Three Core Intelligence Pillars - Equal Large Cards with Sequential Scroll Reveal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ============================================================== */}
          {/* PILLAR 1: SUPPLY CHAIN INTELLIGENCE                           */}
          {/* ============================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-xl border border-slate-200/90 shadow-2xs glow-card flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <div className="p-6">
              {/* Pillar Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  PILLAR 01 • LOGISTICS
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Supply Chain Intelligence
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Autonomous stock-out early warning, burn-rate velocity tracking, and IoT-monitored cold-chain
                resilience across 340 essential medications and vaccines.
              </p>

              {/* Supporting Visual: Automated Pharmaceutical Cold-Chain Depot & Telemetry */}
              <div className="rounded-lg bg-slate-900 text-white p-3.5 border border-slate-800 space-y-2.5 mb-4">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-blue-400 font-bold flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-emerald-400" />
                    COLD-CHAIN DEPOT 04
                  </span>
                  <span className="text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800">
                    +3.8°C LOCKED
                  </span>
                </div>

                {/* Burn rate graphic simulation */}
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                    <span>AMOXICILLIN 250MG</span>
                    <span className="text-amber-400 font-bold">14.2 Days Stock Left</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '38%' }}></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
                    <span>Current: 3,200 units</span>
                    <span>Burn: 240 units/day</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 pt-1 border-t border-slate-800">
                  <span>Automated Rebalance:</span>
                  <span className="text-blue-300 font-semibold">Mombasa &rarr; Kilifi</span>
                </div>
              </div>

              {/* Feature Highlights */}
              <ul className="space-y-2 mb-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                  <span className="leading-snug">Multi-echelon inventory balancing across central and district tiers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                  <span className="leading-snug">IoT cold-chain sensors with 24/7 automated excursion alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                  <span className="leading-snug">Preemptive redistribution reducing stock-out emergency runs by 41%</span>
                </li>
              </ul>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 mt-auto">
              <button
                onClick={() => onSelectModule('supply-chain')}
                className="w-full mt-4 bg-slate-50 hover:bg-blue-50 text-blue-700 hover:text-blue-800 font-semibold text-xs py-2 px-3 rounded-lg border border-slate-200/90 hover:border-blue-200 transition-colors flex items-center justify-center gap-1.5 group cursor-pointer"
              >
                <span>Explore Supply Chain Intelligence</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* ============================================================== */}
          {/* PILLAR 2: DEMAND & EPIDEMIOLOGICAL INTELLIGENCE               */}
          {/* ============================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-xl border border-slate-200/90 shadow-2xs glow-card flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="p-6">
              {/* Pillar Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-2xs">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  PILLAR 02 • SURVEILLANCE
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Demand &amp; Epidemiological Intelligence
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Real-time syndromic surveillance, pathogen transmission curves, and bioclimatic modeling
                predicting disease surges 14 days before acute clinical presentation.
              </p>

              {/* Supporting Visual: Bio-Climatic Satellite GIS Radar Simulation */}
              <div className="rounded-lg bg-slate-900 text-white p-3.5 border border-slate-800 space-y-2.5 mb-4">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    PATHOGEN RADAR: MALARIA
                  </span>
                  <span className="text-amber-400 font-semibold bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800">
                    R₀ = 1.48 ACCELERATION
                  </span>
                </div>

                {/* Spatial Surge Visualization */}
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                    <span>COPERNICUS PRECIPITATION</span>
                    <span className="text-blue-400 font-bold">+42% Above Normal</span>
                  </div>
                  <div className="h-9 w-full flex items-end gap-1.5 pt-1">
                    <div className="bg-slate-700 h-2 w-full rounded-t"></div>
                    <div className="bg-slate-700 h-3 w-full rounded-t"></div>
                    <div className="bg-blue-600 h-4 w-full rounded-t"></div>
                    <div className="bg-blue-500 h-6 w-full rounded-t"></div>
                    <div className="bg-amber-500 h-8 w-full rounded-t"></div>
                    <div className="bg-red-500 h-9 w-full rounded-t animate-pulse"></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
                    <span>D-14</span>
                    <span>TODAY (SURGE)</span>
                    <span>D+14 FORECAST</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 pt-1 border-t border-slate-800">
                  <span>Preemptive Allocation:</span>
                  <span className="text-emerald-300 font-semibold">+45,000 ACT Courses</span>
                </div>
              </div>

              {/* Feature Highlights */}
              <ul className="space-y-2 mb-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                  <span className="leading-snug">Automated syndromic signals from 2,840 sentinel outpatient dispensaries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                  <span className="leading-snug">Coupled bioclimatic satellite feeds (rainfall, humidity, vector index)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                  <span className="leading-snug">SARIMA stochastic demand curves dynamically updating safety buffers</span>
                </li>
              </ul>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 mt-auto">
              <button
                onClick={() => onSelectModule('outbreak-radar')}
                className="w-full mt-4 bg-slate-50 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 font-semibold text-xs py-2 px-3 rounded-lg border border-slate-200/90 hover:border-emerald-200 transition-colors flex items-center justify-center gap-1.5 group cursor-pointer"
              >
                <span>Explore Demand &amp; Outbreak Radar</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* ============================================================== */}
          {/* PILLAR 3: RESOURCE & WORKFORCE INTELLIGENCE                    */}
          {/* ============================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: 0.27, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-xl border border-slate-200/90 shadow-2xs glow-card flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />
            <div className="p-6">
              {/* Pillar Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-2xs">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  PILLAR 03 • WORKFORCE
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Resource &amp; Workforce Intelligence
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Hospital acute bed capacity tracking, clinical personnel roster optimization, and
                cross-district patient load balancing during regional health emergencies.
              </p>

              {/* Supporting Visual: Hospital Clinical Load & ICU Grid Simulation */}
              <div className="rounded-lg bg-slate-900 text-white p-3.5 border border-slate-800 space-y-2.5 mb-4">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-indigo-400 font-bold flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-indigo-400" />
                    ACUTE BED &amp; CLINIC ROSTER
                  </span>
                  <span className="text-blue-400 font-semibold bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-800">
                    NODE 08-EAST SYNCED
                  </span>
                </div>

                {/* Live load metrics */}
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-400">ACUTE BEDS IN USE:</span>
                    <span className="text-white font-bold">1,420 / 1,815 (78.2%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '78.2%' }}></div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono pt-1">
                    <span className="text-slate-400">CLINICAL STAFF ON SHIFT:</span>
                    <span className="text-emerald-400 font-bold">14,920 (98.4%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 pt-1 border-t border-slate-800">
                  <span>Float Pool Deployment:</span>
                  <span className="text-indigo-300 font-semibold">18 Trauma Nurses Routed</span>
                </div>
              </div>

              {/* Feature Highlights */}
              <ul className="space-y-2 mb-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5"></span>
                  <span className="leading-snug">Real-time acute and surge bed telemetry across all referral hospitals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5"></span>
                  <span className="leading-snug">Automated clinician shift balancing with certified skill-mix tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5"></span>
                  <span className="leading-snug">Cross-facility trauma load diversion preventing hospital bottlenecks</span>
                </li>
              </ul>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 mt-auto">
              <button
                onClick={() => onSelectModule('resource-intel')}
                className="w-full mt-4 bg-slate-50 hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 font-semibold text-xs py-2 px-3 rounded-lg border border-slate-200/90 hover:border-indigo-200 transition-colors flex items-center justify-center gap-1.5 group cursor-pointer"
              >
                <span>Explore Resource Intelligence</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
