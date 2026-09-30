import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Bot,
  Activity,
  Layers,
  Truck,
  Cpu,
} from 'lucide-react';

interface AgentSimulationFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulationType: 'SURGE_ALERT' | 'REBALANCE_PROTOCOL';
}

interface SimStep {
  agentName: string;
  agentRole: string;
  agentCode: string;
  icon: any;
  action: string;
  payload: string;
  latencyMs: number;
}

const SURGE_STEPS: SimStep[] = [
  {
    agentName: 'Sentinel Data Ingestion Agent',
    agentRole: 'Edge IoT & Clinical Ingestion',
    agentCode: 'AGENT #01-INGEST',
    icon: Activity,
    action: 'Telemetry Packet Ingested & Cleansed',
    payload: 'Detected +34mm precipitation anomaly and +41.2% pediatric febrile presentations across 18 Lake Basin PHCs.',
    latencyMs: 8.2,
  },
  {
    agentName: 'Epidemiological Surveillance Agent',
    agentRole: 'Bayesian Trajectory Modeler',
    agentCode: 'AGENT #02-EPIDEM',
    icon: Cpu,
    action: 'Bayesian Cori Transmission Rate Solved',
    payload: 'Estimated R_t = 1.48 (95% CI [1.32, 1.64]), doubling time 6.8 days. Outbreak phase escalated to EXPONENTIAL SURGE.',
    latencyMs: 14.1,
  },
  {
    agentName: 'Supply Chain Depletion Agent',
    agentRole: 'SARIMA Inventory Forecaster',
    agentCode: 'AGENT #03-SUPPLY',
    icon: Layers,
    action: 'Stockout Velocity Alert Triggered',
    payload: 'Amoxicillin 250mg DT stock in Likoni projected to deplete in 1.8 days under surge velocity. Critical deficit flagged.',
    latencyMs: 11.5,
  },
  {
    agentName: 'Multi-Echelon Optimization Agent',
    agentRole: 'Primal-Dual Linear Programming',
    agentCode: 'AGENT #04-OPTIM',
    icon: Sparkles,
    action: 'Primal-Dual Simplex Rebalance Solved',
    payload: 'Computed optimal transport vector: 3,200 units from Mombasa Central Depot via A109 corridor. Transit cost minimized with 0% deficit penalty.',
    latencyMs: 18.4,
  },
  {
    agentName: 'Consensus & Zero-Knowledge Verifier',
    agentRole: 'Cryptographic Security & HITL',
    agentCode: 'AGENT #05-CONSENSUS',
    icon: ShieldCheck,
    action: 'Multi-Agent Consensus Verified & Docket Minted',
    payload: 'Verified zero-PII egress boundary and zero-knowledge validity proof. Action Docket #842 drafted for Ministerial ECDSA sign-off.',
    latencyMs: 9.8,
  },
  {
    agentName: 'Autonomous Logistics Fleet Agent',
    agentRole: 'Dispatch & Cold-Chain Tracking',
    agentCode: 'AGENT #06-LOGISTICS',
    icon: Truck,
    action: 'Autonomous Convoy Staged & Ready',
    payload: 'Fleet Convoy Unit #RL-09 staged at Mombasa Depot with active +4.2°C temperature payload. Awaiting ECDSA release.',
    latencyMs: 12.3,
  },
];

const REBALANCE_STEPS: SimStep[] = [
  {
    agentName: 'Digital Twin Telemetry Agent',
    agentRole: 'Hospital Bed & Staff Monitor',
    agentCode: 'AGENT #01-TWIN',
    icon: Layers,
    action: 'Critical Acuity Imbalance Flagged',
    payload: 'Lodwar PHC nurse-to-patient ratio reached 1:28 (safe ceiling 1:12). Oxygen manifold reserve dropped to 1.2 days.',
    latencyMs: 7.9,
  },
  {
    agentName: 'Clinician Fatigue Modeler',
    agentRole: 'Shift Exhaustion Analytics',
    agentCode: 'AGENT #02-FATIGUE',
    icon: Activity,
    action: 'Burnout Index Trigger Activated',
    payload: 'Clinical burnout score reached 0.78 (Severe). Mutual-aid float staffing trigger enacted under National Health Act §44.',
    latencyMs: 12.4,
  },
  {
    agentName: 'Resource Intelligence Allocator',
    agentRole: 'Regional Asset Rebalancing',
    agentCode: 'AGENT #03-ALLOC',
    icon: Sparkles,
    action: 'Mutual Aid Package Formulated',
    payload: 'Allocated 4 Pediatric MDs + 2 Oxygen Concentrator Pods from Regional Buffer Hub with zero degradation to source facility.',
    latencyMs: 15.6,
  },
  {
    agentName: 'Spatial Corridor Security Agent',
    agentRole: 'PostGIS Route Planner',
    agentCode: 'AGENT #04-ROUTER',
    icon: Cpu,
    action: 'A1 Highway Route Cleared',
    payload: '234 km transit verified. Bridge loads confirmed. Estimated transit duration: 1.8 hours.',
    latencyMs: 10.2,
  },
  {
    agentName: 'Sovereign Audit Ledger Notary',
    agentRole: 'Immutable State Machine',
    agentCode: 'AGENT #05-LEDGER',
    icon: ShieldCheck,
    action: 'Pre-Authorization Token Generated',
    payload: 'Cryptographic token #DIR-LOD-01 stamped with SHA-256 state seal. Queued for human approval execution.',
    latencyMs: 8.6,
  },
];

export const AgentSimulationFlowModal: React.FC<AgentSimulationFlowModalProps> = ({
  isOpen,
  onClose,
  simulationType,
}) => {
  const steps = simulationType === 'SURGE_ALERT' ? SURGE_STEPS : REBALANCE_STEPS;
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1800);

  useEffect(() => {
    if (!isOpen) {
      setActiveStepIndex(0);
      setIsPlaying(true);
      return;
    }

    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, playbackSpeed);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, steps.length, playbackSpeed]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0F172A] w-full max-w-3xl rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 dark:bg-cyan-600 flex items-center justify-center text-white shadow-xs">
              {simulationType === 'SURGE_ALERT' ? <Sparkles className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                INTER-AGENT ZERO-KNOWLEDGE BUS SIMULATION
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {simulationType === 'SURGE_ALERT'
                  ? 'Autonomous Outbreak Surge Multi-Agent Bus'
                  : 'Autonomous Rebalance & Mutual Aid Protocol'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Playback Controls & Network Visualizer Bar */}
        <div className="px-6 py-3 bg-slate-100/70 dark:bg-slate-950/60 border-b border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Agent Nodes Visual Strip */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
            {steps.map((st, i) => {
              const isPast = i < activeStepIndex;
              const isCurrent = i === activeStepIndex;
              return (
                <React.Fragment key={st.agentCode}>
                  <button
                    onClick={() => {
                      setActiveStepIndex(i);
                      setIsPlaying(false);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-2xs scale-105'
                        : isPast
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-850 text-slate-500 border border-slate-200 dark:border-slate-750 opacity-60'
                    }`}
                  >
                    <span>{st.agentCode.split('-')[1]}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <ArrowRight className={`w-3 h-3 shrink-0 ${isPast ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={() => {
                setActiveStepIndex(0);
                setIsPlaying(true);
              }}
              className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
              title="Reset Simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value={2400}>0.75x</option>
              <option value={1800}>1.0x</option>
              <option value={1000}>1.8x</option>
            </select>
          </div>
        </div>

        {/* Scrollable Timeline */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {steps.map((st, i) => {
            const Icon = st.icon;
            const isPast = i < activeStepIndex;
            const isCurrent = i === activeStepIndex;
            const isFuture = i > activeStepIndex;

            return (
              <div
                key={st.agentCode}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-400 dark:border-cyan-500 shadow-sm ring-1 ring-blue-500/20'
                    : isPast
                    ? 'bg-white dark:bg-[#0F172A] border-emerald-200 dark:border-emerald-900/50'
                    : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/60 opacity-40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isPast
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {st.agentCode}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {st.agentName}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <span className="text-slate-400 dark:text-slate-500">RPC {st.latencyMs}ms</span>
                        {isPast && (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                            COMMITTED
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-blue-700 dark:text-cyan-400 font-bold bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-800 animate-pulse">
                            ACTIVE
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] font-semibold text-blue-700 dark:text-cyan-400 mb-1">
                      {st.action}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans bg-white dark:bg-slate-900/70 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      {st.payload}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero-Knowledge Proof Verified • Zero PII Egress</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
          >
            Close &amp; Return to Mesh
          </button>
        </div>
      </div>
    </div>
  );
};
