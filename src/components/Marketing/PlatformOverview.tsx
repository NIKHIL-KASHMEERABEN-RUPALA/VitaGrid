import React, { useState } from 'react';
import {
  Monitor,
  Activity,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Radio,
  ArrowRight,
  Send,
  Cpu,
  BarChart3,
  Server,
  Sparkles,
} from 'lucide-react';

interface PlatformOverviewProps {
  onOpenConsole: () => void;
  onRequestAccess: () => void;
}

export const PlatformOverview: React.FC<PlatformOverviewProps> = ({
  onOpenConsole,
  onRequestAccess,
}) => {
  const [activeTab, setActiveTab] = useState<'command' | 'radar' | 'mesh'>('command');

  return (
    <section id="platform-section" className="py-20 bg-white border-b border-slate-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse-subtle" />
            <span>PLATFORM OVERVIEW &amp; NATIONAL ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            The Sovereign Operating System for Health System Resilience
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            VitaGrid integrates decentralized primary care telemetry, multi-echelon pharmaceutical
            supply chains, and predictive epidemiological radar into a single unified national command canvas.
            Built exclusively for sovereign health ministries and enterprise public health authorities.
          </p>
        </div>

        {/* Big Visual Layout: Text Highlights on Left / Large Command Center Visual on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Key Platform Capabilities Highlights */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Continuous Telemetry Fabric
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connects 2,840 remote primary health centers, rural dispensaries, and regional hospitals.
                Ingests stock levels, cold-chain temperature logs, and patient admissions without latency.
              </p>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Autonomous Multi-Agent Mesh
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specialized AI agents monitor consumption burn rates, calculate epidemic acceleration
                curves, and negotiate peer-to-peer resource transfers across district boundaries.
              </p>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Constitutional Sovereign Gates
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                No autonomous dispatch occurs without explicit ministerial human authorization. Zero
                personally identifiable patient data ever leaves domestic sovereign data borders.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenConsole}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 px-4 rounded-lg shadow-xs shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch National Command Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Large Generated Modern National Health Command Center Visual Display */}
          <div className="lg:col-span-8">
            <div className="rounded-xl border border-slate-300/80 bg-slate-900 shadow-2xl overflow-hidden text-white">
              {/* Command Center Bezel Header */}
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-subtle"></div>
                  <span className="font-mono text-slate-200 font-bold tracking-wider text-[11px]">
                    NATIONAL COMMAND CENTER • SOVEREIGN TELEMETRY FEED
                  </span>
                </div>

                {/* Sub-view switcher */}
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800 text-[11px] font-mono">
                  <button
                    onClick={() => setActiveTab('command')}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      activeTab === 'command'
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Ops Center
                  </button>
                  <button
                    onClick={() => setActiveTab('radar')}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      activeTab === 'radar'
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    GIS Grid
                  </button>
                  <button
                    onClick={() => setActiveTab('mesh')}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      activeTab === 'mesh'
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Agent Mesh
                  </button>
                </div>
              </div>

              {/* Video Wall Multi-Display Canvas */}
              <div className="p-5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
                {/* Top Status Indicators inside Command Center Screen */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-slate-800/80 rounded border border-slate-700/60 p-2.5">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      PHCs ONLINE
                    </div>
                    <div className="text-xl font-mono font-extrabold text-white mt-0.5">
                      2,840 / 2,840
                    </div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      100% Signal Synced
                    </div>
                  </div>

                  <div className="bg-slate-800/80 rounded border border-slate-700/60 p-2.5">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      MEDICINE AVAILABILITY
                    </div>
                    <div className="text-xl font-mono font-extrabold text-blue-400 mt-0.5">
                      94.6%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Above 92.0% Threshold
                    </div>
                  </div>

                  <div className="bg-slate-800/80 rounded border border-slate-700/60 p-2.5">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      ACTIVE ICU OCCUPANCY
                    </div>
                    <div className="text-xl font-mono font-extrabold text-amber-400 mt-0.5">
                      78.2%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      395 Surge Beds Free
                    </div>
                  </div>

                  <div className="bg-slate-800/80 rounded border border-slate-700/60 p-2.5">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      AGENT MESH CYCLES
                    </div>
                    <div className="text-xl font-mono font-extrabold text-emerald-400 mt-0.5">
                      &lt; 90 Sec
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Consensus: 99.4%
                    </div>
                  </div>
                </div>

                {/* Central Command Wall Display (Interactive Simulation) */}
                <div className="relative rounded-lg bg-slate-950 border border-slate-800 p-4 overflow-hidden min-h-[260px] flex flex-col justify-between">
                  {/* Subtle Grid Overlay */}
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />

                  {activeTab === 'command' && (
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
                      {/* Left: GIS Map with glowing hubs */}
                      <div className="md:col-span-7 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-mono text-[11px] text-blue-400 font-bold uppercase">
                            TERRITORIAL REDISTRIBUTION RADAR
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            SECTOR 08-EAST • NAIROBI / MOMBASA / KILIFI
                          </span>
                        </div>

                        {/* Interactive SVG Display */}
                        <div className="relative h-44 bg-slate-900/90 rounded border border-slate-800 p-2 flex items-center justify-center">
                          <svg viewBox="100 60 480 300" className="w-full h-full max-h-[160px]">
                            {/* District Outlines */}
                            <path
                              d="M 120 180 L 220 140 L 290 200 L 240 280 L 150 260 Z"
                              fill="#1e293b"
                              stroke="#3b82f6"
                              strokeWidth="1.2"
                              strokeDasharray="2 2"
                            />
                            <path
                              d="M 290 200 L 400 160 L 460 230 L 370 310 L 280 270 Z"
                              fill="#0f172a"
                              stroke="#0284c7"
                              strokeWidth="1.2"
                            />
                            <path
                              d="M 370 310 L 460 230 L 520 290 L 480 370 L 390 350 Z"
                              fill="#1e1b4b"
                              stroke="#6366f1"
                              strokeWidth="1.2"
                              strokeDasharray="3 2"
                            />

                            {/* Rebalance Corridor Line */}
                            <path
                              d="M 240 210 Q 340 180 430 250"
                              fill="none"
                              stroke="#38bdf8"
                              strokeWidth="2.5"
                              strokeDasharray="6 4"
                            />

                            {/* Primary Hub: Nairobi Central */}
                            <circle cx="240" cy="210" r="7" fill="#2563eb" stroke="#93c5fd" strokeWidth="2" />
                            <circle cx="240" cy="210" r="14" fill="#2563eb" fillOpacity="0.2" className="animate-ping" />
                            <text x="240" y="235" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="bold" fontFamily="monospace">
                              CENTRAL DEPOT [SURPLUS]
                            </text>

                            {/* Secondary Node: Mombasa Port */}
                            <circle cx="380" cy="310" r="6" fill="#10b981" stroke="#a7f3d0" strokeWidth="2" />
                            <text x="380" y="330" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontWeight="bold" fontFamily="monospace">
                              MOMBASA HUB
                            </text>

                            {/* Destination Node: Kilifi Rural PHC */}
                            <circle cx="430" cy="250" r="6" fill="#ef4444" stroke="#fca5a5" strokeWidth="2" />
                            <text x="430" y="270" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="bold" fontFamily="monospace">
                              KILIFI PHC-08 [LOW STOCK]
                            </text>

                            {/* Autonomous Drone in Flight */}
                            <g transform="translate(330, 205)">
                              <circle cx="0" cy="0" r="4" fill="#38bdf8" />
                              <text x="0" y="-8" textAnchor="middle" fill="#38bdf8" fontSize="7" fontWeight="bold" fontFamily="monospace">
                                DRONE-14 (ETA 28m)
                              </text>
                            </g>
                          </svg>

                          {/* Live overlay tag */}
                          <div className="absolute bottom-2 left-2 bg-slate-950/90 border border-slate-700 px-2 py-1 rounded text-[9px] font-mono text-emerald-400">
                            AUTONOMOUS FLEET: 12 DRONES ACTIVE • 34 VEHICLES MONITORED
                          </div>
                        </div>
                      </div>

                      {/* Right: Live Copilot Recommendation & Telemetry Alerts */}
                      <div className="md:col-span-5 flex flex-col justify-between space-y-2">
                        <div className="bg-slate-900 rounded p-3 border border-slate-800">
                          <div className="flex items-center gap-1.5 text-blue-400 text-[10px] font-mono font-bold uppercase mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                            <span>AI DECISION COPILOT • PROPOSAL #842</span>
                          </div>
                          <div className="text-xs font-semibold text-slate-200">
                            Transfer 3,200 units Amoxicillin 250mg
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                            Source: Mombasa Regional Depot &rarr; Kilifi Maternal PHC. Stock-out averted 72 hrs before critical depletion.
                          </p>
                          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-emerald-400">
                              Confidence: 97.8% • Impact: +1,200 Pt Days
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-300 text-[9px] font-mono font-bold">
                              PENDING SIGN-OFF
                            </span>
                          </div>
                        </div>

                        {/* Telemetry Stream Snippet */}
                        <div className="bg-slate-900 rounded p-2.5 border border-slate-800 font-mono text-[10px] space-y-1">
                          <div className="text-slate-400 flex items-center justify-between text-[9px]">
                            <span>TELEMETRY INGESTION STREAM</span>
                            <span className="text-emerald-400">4,200 PKT/SEC</span>
                          </div>
                          <div className="text-slate-300 truncate">
                            [08:34:12] GARISSA_PHC_03: Cold chain locked at +4.1°C [NOMINAL]
                          </div>
                          <div className="text-slate-300 truncate">
                            [08:34:10] NAIROBI_ICU: Bed occupancy 78.2% (-1.2% D-1)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'radar' && (
                    <div className="relative z-10 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-blue-400 font-bold uppercase text-[11px]">
                          EPIDEMIOLOGICAL SURVEILLANCE &amp; CLIMATE RADAR
                        </span>
                        <span className="font-mono text-emerald-400 text-[10px]">
                          COPERNICUS METEOROLOGY SYNCED
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-slate-900 p-3 rounded border border-slate-800">
                          <div className="text-[10px] font-mono text-slate-400">PATHOGEN ACCELERATION</div>
                          <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">R₀ = 1.48</div>
                          <div className="text-[10px] text-slate-400 mt-1">Malaria acceleration detected in flood basin</div>
                        </div>
                        <div className="bg-slate-900 p-3 rounded border border-slate-800">
                          <div className="text-[10px] font-mono text-slate-400">RAINFALL ANOMALY</div>
                          <div className="text-lg font-bold text-blue-400 font-mono mt-0.5">+42% 14-Day</div>
                          <div className="text-[10px] text-slate-400 mt-1">Coast Region stagnant water index elevated</div>
                        </div>
                        <div className="bg-slate-900 p-3 rounded border border-slate-800">
                          <div className="text-[10px] font-mono text-slate-400">PREEMPTIVE ACT STOCKING</div>
                          <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">99.1% Ready</div>
                          <div className="text-[10px] text-slate-400 mt-1">45,000 courses pre-positioned in district hubs</div>
                        </div>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[11px] text-slate-300 font-mono">
                        SURVEILLANCE MODEL: Multi-horizon spatial diffusion model predicting clinic presentations 14 days in advance with 92.4% validation accuracy.
                      </div>
                    </div>
                  )}

                  {activeTab === 'mesh' && (
                    <div className="relative z-10 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-blue-400 font-bold uppercase text-[11px]">
                          MULTI-AGENT COORDINATION MESH STATUS
                        </span>
                        <span className="font-mono text-emerald-400 text-[10px]">
                          LATENCY: 42ms • ROUND-ROBIN
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center">
                        <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                          <div className="text-xs font-bold text-blue-400">Demand Agent</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-1">SARIMA Modeling</div>
                          <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono">ACTIVE</span>
                        </div>
                        <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                          <div className="text-xs font-bold text-indigo-400">Supply Agent</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-1">Inventory Rebalance</div>
                          <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono">ACTIVE</span>
                        </div>
                        <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                          <div className="text-xs font-bold text-amber-400">Logistics Agent</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-1">Drone &amp; Road Fleet</div>
                          <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono">ACTIVE</span>
                        </div>
                        <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                          <div className="text-xs font-bold text-purple-400">Governor Agent</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-1">Statutory Gatekeeper</div>
                          <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded font-mono">GUARDED</span>
                        </div>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[11px] text-slate-300 font-mono">
                        GOVERNANCE PROTOCOL: Autonomous multi-agent coordination operates under strict Zero-PII Egress and Statutory Rule A-42 constitutional limits.
                      </div>
                    </div>
                  )}

                  {/* Visual Footer Inside Display */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <div>HARDWARE LOCK: SECURE ENCLAVE ACTIVE (TPM 2.0)</div>
                    <div className="flex items-center gap-1.5 text-blue-400">
                      <Server className="w-3 h-3" />
                      <span>ON-SOIL NATIONAL DATA CENTER DEPLOYED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
