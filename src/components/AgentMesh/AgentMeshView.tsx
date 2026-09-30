import React, { useState } from 'react';
import { Share2, Cpu, ShieldCheck, Activity, Radio, CheckCircle2, Zap } from 'lucide-react';
import { MultiAgentCoordination } from './MultiAgentCoordination';
import { MESH_AGENTS_DATA, RECENT_AGENT_MESSAGES } from '../../data/agentMeshData';
import { MeshAgent, MeshAgentMessage } from '../../types/agentMesh';
import { useNotifications } from '../../context/NotificationContext';

interface AgentMeshViewProps {
  onNavigateModule?: (moduleId: string) => void;
  onShowToast?: (msg: string) => void;
  onReturnToMarketing?: () => void;
}

export const AgentMeshView: React.FC<AgentMeshViewProps> = ({
  onNavigateModule = () => {},
  onShowToast,
  onReturnToMarketing,
}) => {
  const [agents, setAgents] = useState<MeshAgent[]>(MESH_AGENTS_DATA);
  const [messages, setMessages] = useState<MeshAgentMessage[]>(RECENT_AGENT_MESSAGES);
  const { showToast } = useNotifications();

  const handleTriggerSignal = (signalType: string) => {
    if (signalType === 'SURGE_ALERT') {
      const newMsg: MeshAgentMessage = {
        id: `MSG-${Date.now()}`,
        fromAgent: 'AGENT #01-DEMAND',
        toAgent: 'AGENT #02-SUPPLY',
        topic: 'telemetry.epidemiology.surge_alert',
        summary: 'Synthesized malaria transmission vector spike in Lake Victoria Basin; +34% pediatric buffer allocated.',
        latencyMs: 12.1,
        status: 'delivered',
        timestamp: new Date().toLocaleTimeString('en-GB', { timeZone: 'UTC' }) + ' UTC',
      };
      setMessages((prev) => [newMsg, ...prev]);
      showToast('Simulated Outbreak Surge signal routed across Autonomous Agent Bus.', 'success');
    } else {
      const newMsg: MeshAgentMessage = {
        id: `MSG-${Date.now()}`,
        fromAgent: 'AGENT #02-SUPPLY',
        toAgent: 'AGENT #03-LOGISTICS',
        topic: 'inventory.cold_chain.temperature_nominal',
        summary: 'Emergency cold-box route RL-09 staged with verified +4.2°C temperature payload.',
        latencyMs: 14.4,
        status: 'routed',
        timestamp: new Date().toLocaleTimeString('en-GB', { timeZone: 'UTC' }) + ' UTC',
      };
      setMessages((prev) => [newMsg, ...prev]);
      showToast('Simulated Rebalance Directive staged across Autonomous Logistics corridor.', 'success');
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 animate-pulse-subtle"></span>
            <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
              SOVEREIGN MULTI-AGENT COORDINATION NETWORK
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Intelligence Mesh &amp; Autonomous Multi-Agent Network
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Decentralized multi-agent coordination layer resolving supply chain rebalancing, surge epidemiology, and logistics routing across national health zones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Zero PII Egress Verified</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 rounded-lg text-xs font-semibold text-blue-700 dark:text-cyan-300">
            <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span>5 Agents Synchronized</span>
          </div>
        </div>
      </div>

      {/* Quick Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#0F172A] p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold">ACTIVE AGENTS</div>
          <div className="text-xl font-mono font-extrabold text-slate-900 dark:text-white mt-0.5">5 Autonomous</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">All agents operational</div>
        </div>

        <div className="bg-white dark:bg-[#0F172A] p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold">RPC LATENCY</div>
          <div className="text-xl font-mono font-extrabold text-blue-600 dark:text-cyan-400 mt-0.5">14.8 ms</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Sub-20ms target</div>
        </div>

        <div className="bg-white dark:bg-[#0F172A] p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold">EVENT THROUGHPUT</div>
          <div className="text-xl font-mono font-extrabold text-slate-900 dark:text-white mt-0.5">8,230 / min</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">32% cluster headroom</div>
        </div>

        <div className="bg-white dark:bg-[#0F172A] p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold">SOVEREIGN BOUNDARY</div>
          <div className="text-xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">0.00 B Egress</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Domestic data residency</div>
        </div>
      </div>

      {/* Multi-Agent Coordination Interactive Canvas */}
      <MultiAgentCoordination
        agents={agents}
        recentMessages={messages}
        onTriggerAgentSignal={handleTriggerSignal}
      />
    </div>
  );
};
