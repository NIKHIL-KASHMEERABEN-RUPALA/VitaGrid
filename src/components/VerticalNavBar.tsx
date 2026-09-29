import React, { useState } from 'react';
import {
  LayoutDashboard,
  Truck,
  Activity,
  Layers,
  Share2,
  Bot,
  ClipboardCheck,
  PackageCheck,
  BookOpen,
  Cpu,
  Compass,
  FileText,
  ShieldCheck,
  Search,
  ChevronDown,
} from 'lucide-react';

export interface ModuleItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  description?: string;
}

interface VerticalNavBarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  pendingApprovalsCount?: number;
  className?: string;
}

export const MODULES_LIST: ModuleItem[] = [
  { id: 'command-center', label: 'National Command Center', icon: LayoutDashboard, description: 'Sovereign Telemetry & Defense Level' },
  { id: 'supply-chain', label: 'Supply Chain Intelligence', icon: Truck, description: 'Essential Medicines & 5 Echelons' },
  { id: 'outbreak-radar', label: 'Demand & Outbreak Radar', icon: Activity, description: 'Early Warning & Syndromic Surges' },
  { id: 'resource-intel', label: 'Resource Intelligence', icon: Layers, description: 'ICU Beds & Clinician Rostering' },
  { id: 'agent-mesh', label: 'Intelligence Mesh', icon: Share2, description: 'Multi-Agent Autonomous Network' },
  { id: 'decision-copilot', label: 'AI Decision Copilot', icon: Bot, description: 'Context-Aware Ministerial Advisory' },
  { id: 'human-approvals', label: 'Human Approvals', icon: ClipboardCheck, badge: 2, description: 'Cryptographic Ministerial Gate' },
  { id: 'preemptive-staging', label: 'Pre-emptive Staging', icon: PackageCheck, description: 'Vaccines & Buffer Stock Rerouting' },
  { id: 'knowledge-system', label: 'Knowledge System', icon: BookOpen, description: 'National Clinical Protocols & SOPs' },
  { id: 'ml-models', label: 'ML Models & Hub', icon: Cpu, description: 'SEIR, R_t & Depletion Pipelines' },
  { id: 'cross-district', label: 'Cross-District Planner', icon: Compass, description: 'Inter-County Mutual Aid Transport' },
  { id: 'briefings', label: 'Executive Briefings', icon: FileText, description: 'Cabinet Dossier & PDF Generation' },
];

export const VerticalNavBar: React.FC<VerticalNavBarProps> = ({
  activeModule,
  setActiveModule,
  pendingApprovalsCount = 2,
  className = '',
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredModules = filterQuery.trim()
    ? MODULES_LIST.filter(
        (m) =>
          m.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
          (m.description && m.description.toLowerCase().includes(filterQuery.toLowerCase()))
      )
    : MODULES_LIST;

  return (
    <nav
      aria-label="Operational Modules Vertical Navigation"
      className={`bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col shrink-0 overflow-hidden ${className}`}
    >
      {/* Top Header of the Vertical Navbar directly below the search bar */}
      <div className="px-3.5 py-3 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-pulse-subtle"></span>
          <span className="text-[11px] font-bold tracking-wider text-slate-800 uppercase font-mono">
            OPERATIONAL MODULES
          </span>
        </div>
        <span className="text-[10px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded font-mono">
          12 ENCLAVES
        </span>
      </div>

      {/* Quick Filter Input */}
      <div className="p-2 border-b border-slate-100 bg-white shrink-0">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Quick filter enclaves…"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-6 py-1.5 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-normal transition-all"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Scrollable list of modules with dedicated vertical scrollbar */}
      <div className="p-2 space-y-1 overflow-y-auto max-h-[460px] lg:max-h-[500px] xl:max-h-[540px] custom-v-scroll pr-1.5">
        {filteredModules.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          const badgeCount = item.id === 'human-approvals' ? pendingApprovalsCount : item.badge;

          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 font-semibold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 border border-transparent'
              }`}
              title={`${item.label}: ${item.description || ''}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200/80 group-hover:text-blue-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="truncate tracking-tight leading-tight">{item.label}</div>
                  {!isActive && item.description && (
                    <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                      {item.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Notification Badge */}
              {badgeCount !== undefined && badgeCount > 0 && (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ml-2 transition-colors ${
                    isActive
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'bg-red-600 text-white shadow-2xs ring-1 ring-red-200'
                  }`}
                >
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}

        {filteredModules.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-400">
            No enclaves match "{filterQuery}"
          </div>
        )}
      </div>

      {/* Bottom Status Info in Vertical Navbar */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70 shrink-0">
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>FIPS 140-3 ACTIVE</span>
          </span>
          <span className="text-slate-400 font-mono">AP-SOV-01</span>
        </div>
        <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center justify-between">
          <span>Scrollable Enclave Dock</span>
          <span className="text-blue-600 font-sans font-semibold">12/12 Verified</span>
        </div>
      </div>
    </nav>
  );
};
