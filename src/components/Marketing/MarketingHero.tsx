import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Send,
  Radio,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface MarketingHeroProps {
  onRequestAccess: () => void;
  onOpenConsole: () => void;
  onAuthorizeProposal?: () => void;
}

export const MarketingHero: React.FC<MarketingHeroProps> = ({
  onRequestAccess,
  onOpenConsole,
  onAuthorizeProposal,
}) => {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-[#F8F9FB] to-white border-b border-slate-100">
      {/* Background Subtle Grid */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none cyber-grid-pattern"
        style={{
          backgroundPosition: '0 0, 16px 16px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Kicker Pill with Motion */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold tracking-wider font-mono uppercase mb-6 shadow-2xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 pulse-dot-blue"></span>
          <span>REPUBLIC HEALTH GRID • SOVEREIGN EPIDEMIOLOGICAL WATCH</span>
        </motion.div>

        {/* Large Bold Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.12]"
        >
          National Intelligence for Resilient Health Systems
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal"
        >
          Real-time visibility, epidemiological forecasting, and cross-district resource redistribution for national primary healthcare networks.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
        >
          <button
            onClick={onRequestAccess}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-lg shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
          >
            <span>Request National Access</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenConsole}
            className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs sm:text-sm px-6 py-3 rounded-lg shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-slate-400"
          >
            <span>Explore the Platform</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </motion.div>

        {/* Trust Badges Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Trusted by National Health Ministries</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>Zero PII Egress Architecture</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Consensus Integrity: 99.4%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ISO-27001 Certified Infrastructure</span>
          </div>
        </motion.div>

        {/* ============================================================== */}
        {/* INTERACTIVE HERO PLATFORM PREVIEW WINDOW (Matches Reference)   */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 max-w-5xl mx-auto rounded-xl border border-slate-200/90 bg-white shadow-2xl overflow-hidden text-left relative glow-card"
        >
          {/* Mock Window Top Bar */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="terminal-dot bg-red-400"></span>
                <span className="terminal-dot bg-amber-400"></span>
                <span className="terminal-dot bg-emerald-400"></span>
              </div>
              <span className="font-mono text-[11px] text-slate-500 ml-2 font-medium">
                VITAGRID GOV SECURE v4.12 • REPUBLIC SOVEREIGN HEALTH GRID
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot"></span>
              <span>Live Sentinel Ingestion (UTC+3)</span>
            </div>
          </div>

          {/* Window Body Grid: Left KPIs + Right Map Preview */}
          <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch bg-slate-50/40">
            {/* Left Column: Key Operational Metric Cards */}
            <div className="lg:col-span-4 space-y-2.5">
              {/* Metric 1: Availability */}
              <div className="bg-white rounded-lg p-3 border border-slate-200/90 shadow-2xs">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <span>AVAILABILITY INDEX</span>
                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold border border-emerald-200">
                    Optimal
                  </span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 mt-1">94.6%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Target: &gt;92.0% • 47 Counties Logged
                </div>
              </div>

              {/* Metric 2: Surge Bed ICU */}
              <div className="bg-white rounded-lg p-3 border border-slate-200/90 shadow-2xs">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <span>SURGE BED CAPACITY</span>
                  <span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-semibold border border-slate-200">
                    Nominal
                  </span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 mt-1">78.2%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  1,420 / 1,815 ICU Beds In-Use
                </div>
              </div>

              {/* Metric 3: Clinician Live */}
              <div className="bg-white rounded-lg p-3 border border-slate-200/90 shadow-2xs">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <span>CLINICIAN ROSTERING</span>
                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold border border-emerald-200">
                    Stable
                  </span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 mt-1">98.4%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  14,920 On-shift Live Telemetry
                </div>
              </div>

              {/* Metric 4: Critical Alerts */}
              <div className="bg-white rounded-lg p-3 border border-slate-200/90 shadow-2xs">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-red-600 tracking-wider">
                  <span>ACTIVE CRITICAL ALERTS</span>
                  <span className="text-red-700 bg-red-50 px-1.5 py-0.5 rounded font-bold border border-red-200">
                    Immediate
                  </span>
                </div>
                <div className="text-xl font-extrabold text-red-600 mt-1">03</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  2 Stockouts imminent • 1 Vector surge
                </div>
              </div>
            </div>

            {/* Right Column: Live Map Telemetry Visualization */}
            <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-slate-900">
                      National Healthcare Density &amp; Facility Vulnerability Index
                    </h3>
                    <span className="bg-blue-50 text-blue-700 text-[9px] font-mono px-1 py-0.2 rounded font-semibold">
                      EPSG:3857
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Continuous autonomous feed across 2,840 Level 2-4 Primary Care Facilities.
                  </p>
                </div>

                <button
                  onClick={onOpenConsole}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                >
                  <span>Full Map</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Vector Graphic Map Area */}
              <div className="relative w-full h-44 bg-slate-50 rounded border border-slate-200/70 overflow-hidden flex items-center justify-center p-2">
                <svg viewBox="100 40 500 360" className="w-full h-full max-h-[160px]">
                  {/* Subtle polygons */}
                  <polygon
                    points="370,120 480,135 520,225 435,260 380,210"
                    fill="#fef3c7"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                  />
                  <polygon
                    points="160,190 230,175 250,240 180,265 145,225"
                    fill="#fee2e2"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                  />
                  <polygon
                    points="270,210 375,190 385,275 285,290"
                    fill="#e0f2fe"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                  />
                  <polygon
                    points="395,290 480,295 465,410 385,395"
                    fill="#ffe4e6"
                    stroke="#dc2626"
                    strokeWidth="1.5"
                  />

                  {/* Connecting dashed corridor */}
                  <path
                    d="M 330 245 Q 380 200 440 195"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />

                  {/* Nairobi Hub */}
                  <circle cx="330" cy="245" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                  <text x="330" y="260" textAnchor="middle" fill="#1e40af" fontSize="9" fontWeight="bold">
                    NAIROBI HUB
                  </text>

                  {/* Garissa Node */}
                  <circle cx="440" cy="195" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <text x="440" y="185" textAnchor="middle" fill="#b45309" fontSize="9" fontWeight="bold">
                    GARISSA [WATCH]
                  </text>

                  {/* Kilifi Node */}
                  <circle cx="430" cy="350" r="5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                  <text x="430" y="368" textAnchor="middle" fill="#991b1b" fontSize="9" fontWeight="bold">
                    KILIFI [CRITICAL]
                  </text>

                  {/* Active Drone in flight */}
                  <g transform="translate(390, 215)">
                    <circle cx="0" cy="0" r="8" fill="#2563eb" fillOpacity="0.2" />
                    <circle cx="0" cy="0" r="3" fill="#2563eb" />
                  </g>
                </svg>

                {/* Floating Card: Garissa Sub-County Drone Resupply */}
                <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-2xs p-2 rounded shadow-sm border border-slate-200 text-[10px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-800">Garissa Sub-County</span>
                    <span className="bg-emerald-50 text-emerald-700 font-bold px-1 rounded">
                      CLUSTER 14
                    </span>
                  </div>
                  <div className="text-slate-600 mt-0.5">89.2% Stability • Cold chain +4.1°C</div>
                  <div className="bg-blue-50 text-blue-900 rounded p-1 mt-1 flex items-center gap-1 font-semibold">
                    <Send className="w-2.5 h-2.5 text-blue-600" />
                    <span>2 Autonomous Drone Resupplies in Transit (ETA 34m)</span>
                  </div>
                </div>
              </div>

              {/* Bottom Rebalance Directive Callout */}
              <div className="mt-3 bg-blue-50/80 border border-blue-200/90 rounded-lg p-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 leading-tight">
                      Autonomous Stock Transfer Proposal #842 Ready
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Transfer 3,200 units Amoxicillin from Mombasa Depot → Kilifi PHC-08.
                    </div>
                  </div>
                </div>

                <button
                  onClick={onAuthorizeProposal || onOpenConsole}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1.5 rounded shadow-2xs transition-colors shrink-0 cursor-pointer"
                >
                  Authorize Sovereign Rebalance
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
