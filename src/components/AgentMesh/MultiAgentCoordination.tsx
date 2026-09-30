import React, { useState } from 'react';
import {
  Cpu,
  Bot,
  Activity,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  Radio,
  Sparkles,
} from 'lucide-react';
import { MeshAgent, MeshAgentMessage } from '../../types/agentMesh';
import { AgentSimulationFlowModal } from './AgentSimulationFlowModal';

interface MultiAgentCoordinationProps {
  agents: MeshAgent[];
  recentMessages: MeshAgentMessage[];
  onTriggerAgentSignal: (signalType: string) => void;
}

export const MultiAgentCoordination: React.FC<MultiAgentCoordinationProps> = ({
  agents,
  recentMessages,
  onTriggerAgentSignal,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [activeSimulation, setActiveSimulation] = useState<'SURGE_ALERT' | 'REBALANCE_PROTOCOL' | null>(null);

  const handleSimulate = (type: 'SURGE_ALERT' | 'REBALANCE_PROTOCOL') => {
    setActiveSimulation(type);
    onTriggerAgentSignal(type);
  };

  return (
    <>
      <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
        {/* Top Header of Section */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 animate-pulse-subtle"></span>
              <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
                AUTONOMOUS INTER-AGENT CONSENSUS BUS
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Multi-Agent Coordination Layer
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              5 specialized sovereign agents communicating across a zero-knowledge event bus to resolve supply, demand, and transport logistics.
            </p>
          </div>

          {/* Interactive Event Trigger Simulation */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSimulate('SURGE_ALERT')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-blue-900/60 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Outbreak Surge Bus</span>
            </button>

            <button
              onClick={() => handleSimulate('REBALANCE_PROTOCOL')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/60 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Rebalance Protocol</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {agents.map((agent) => {
              const isSelected = selectedAgentId === agent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgentId(isSelected ? null : agent.id)}
                  className={`rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-500 dark:border-cyan-400 ring-2 ring-blue-100 dark:ring-cyan-900/40 bg-white dark:bg-slate-850 shadow-xs'
                      : 'bg-slate-50/70 hover:bg-white dark:bg-slate-900/70 dark:hover:bg-slate-850/80 border-slate-200/90 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {agent.code}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase font-mono ${
                          agent.status === 'coordinating'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                        }`}
                      >
                        {agent.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">
                        {agent.name}
                      </h3>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">{agent.role}</p>

                    <div className="mt-3 bg-white dark:bg-slate-800/90 p-2 rounded-lg border border-slate-200/80 dark:border-slate-700/80 text-[10px] text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {agent.currentTask}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400 dark:text-slate-500">Load</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{agent.loadPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          agent.loadPercent > 60 ? 'bg-amber-500' : 'bg-blue-600 dark:bg-cyan-400'
                        }`}
                        style={{ width: `${agent.loadPercent}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      <span>Latency: {agent.latencyMs}ms</span>
                      <span>Q: {agent.queueDepth}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Message Flow & Bottleneck Indicators Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left 2 Cols: Live Message Stream */}
            <div className="lg:col-span-2 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4">
              <div className="flex items-center justify-between mb-3 border-b border-slate-200/70 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Live Inter-Agent Cryptographic RPC Stream
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  ZERO-KNOWLEDGE BUS • SUB-15MS DISPATCH
                </span>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-white dark:bg-[#0F172A] p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className="font-bold text-blue-700 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-900/60">
                          {msg.fromAgent}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700">
                          {msg.toAgent}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                        <span>{msg.latencyMs}ms</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1 rounded border border-emerald-200 dark:border-emerald-800">
                          {msg.status.toUpperCase()}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{msg.topic}</div>
                    <p className="text-slate-800 dark:text-slate-300 text-[11px] leading-relaxed">{msg.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Bottleneck & Latency Detection */}
            <div className="bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200/70 dark:border-slate-800 pb-2.5">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Bottleneck &amp; Queue Telemetry
                </h4>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="bg-white dark:bg-[#0F172A] p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Max Inter-Agent Jitter</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">1.8ms</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">Threshold &lt; 5.0ms (Nominal)</div>
                </div>

                <div className="bg-white dark:bg-[#0F172A] p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Deadlock Prevention Protocol</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">ACTIVE</span>
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Two-phase commit locking enabled</div>
                </div>

                <div className="bg-white dark:bg-[#0F172A] p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Throughput Capacity</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">8,230 msgs/min</span>
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Operating at 32% cluster headroom</div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-[11px] flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    No agent pipeline bottlenecks detected across all 5 active coordination domains.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Modal */}
      {activeSimulation && (
        <AgentSimulationFlowModal
          isOpen={!!activeSimulation}
          onClose={() => setActiveSimulation(null)}
          simulationType={activeSimulation}
        />
      )}
    </>
  );
};
