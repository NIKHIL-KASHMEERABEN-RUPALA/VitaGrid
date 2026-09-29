import React from 'react';
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
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  pendingApprovalsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  setActiveModule,
  pendingApprovalsCount = 2,
}) => {
  const modules = [
    { id: 'command-center', label: 'National Command Center', icon: LayoutDashboard },
    { id: 'supply-chain', label: 'Supply Chain Intelligence', icon: Truck },
    { id: 'outbreak-radar', label: 'Demand & Outbreak Radar', icon: Activity },
    { id: 'resource-intel', label: 'Resource Intelligence', icon: Layers },
    { id: 'agent-mesh', label: 'Intelligence Mesh', icon: Share2 },
    { id: 'decision-copilot', label: 'AI Decision Copilot', icon: Bot },
    { id: 'human-approvals', label: 'Human Approvals', icon: ClipboardCheck, badge: pendingApprovalsCount },
    { id: 'preemptive-staging', label: 'Pre-emptive Staging', icon: PackageCheck },
    { id: 'knowledge-system', label: 'Knowledge System', icon: BookOpen },
    { id: 'ml-models', label: 'ML Models & Hub', icon: Cpu },
    { id: 'cross-district', label: 'Cross-District Planner', icon: Compass },
    { id: 'briefings', label: 'Executive Briefings', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 min-h-[calc(100vh-57px)]">
      {/* Top Modules List */}
      <div className="p-3">
        <div className="px-3 pt-2 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          OPERATIONAL MODULES
        </div>

        <nav className="space-y-0.5">
          {modules.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white text-blue-600'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Consensus Box */}
      <div className="p-3 border-t border-slate-100">
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
              CONSENSUS ENGINE
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-[11px] font-medium text-slate-700 leading-tight">
            Active Sentinel Node #7702 (Zone-Alpha)
          </div>
        </div>
      </div>
    </aside>
  );
};
