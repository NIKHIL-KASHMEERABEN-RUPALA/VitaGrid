import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Sparkles,
  Sun,
  Moon,
  LogOut,
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
  Network,
} from 'lucide-react';

export interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  syncSecondsAgo: number;
  unreadAlertCount: number;
  onNotificationClick: () => void;
  onBackToMarketing?: () => void;
  onOpenArchitecture?: () => void;
  onSignOut?: () => void;
  currentUser?: { name: string; role: string; email: string };
  activeModule?: string;
  setActiveModule?: (module: string) => void;
  onOpenAiAssist?: () => void;
  pendingApprovalsCount?: number;
}

export const SECONDARY_NAV_ITEMS = [
  { id: 'command-center', label: 'National Command Center', shortLabel: 'National Command', icon: LayoutDashboard },
  { id: 'architecture-stack', label: 'Multi-Agent Architecture & AI Stack', shortLabel: 'Architecture & AI Stack', icon: Network },
  { id: 'supply-chain', label: 'Supply Chain Intelligence', shortLabel: 'Supply Chain', icon: Truck },
  { id: 'outbreak-radar', label: 'Demand & Outbreak Radar', shortLabel: 'Outbreak Radar', icon: Activity },
  { id: 'resource-intel', label: 'Resource Intelligence', shortLabel: 'Resource Intel', icon: Layers },
  { id: 'agent-mesh', label: 'Intelligence Mesh', shortLabel: 'Intelligence Mesh', icon: Share2 },
  { id: 'decision-copilot', label: 'AI Decision Copilot', shortLabel: 'AI Copilot', icon: Bot },
  { id: 'human-approvals', label: 'Human Approvals', shortLabel: 'Human Approvals', icon: ClipboardCheck, badge: 2 },
  { id: 'preemptive-staging', label: 'Pre-emptive Staging', shortLabel: 'Pre-emptive Staging', icon: PackageCheck },
  { id: 'knowledge-system', label: 'Knowledge System', shortLabel: 'Knowledge & SOPs', icon: BookOpen },
  { id: 'ml-models', label: 'ML Models & Hub', shortLabel: 'ML Models & Hub', icon: Cpu },
  { id: 'cross-district', label: 'Cross-District Planner', shortLabel: 'Cross-District', icon: Compass },
  { id: 'briefings', label: 'Executive Briefings', shortLabel: 'Briefings (PDF)', icon: FileText },
];

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  syncSecondsAgo,
  unreadAlertCount,
  onNotificationClick,
  onBackToMarketing,
  onOpenArchitecture,
  onSignOut,
  currentUser = { name: 'Dr. V. Rao', role: 'National Director', email: 'dr.rao@vitagrid.gov' },
  activeModule = 'command-center',
  setActiveModule,
  onOpenAiAssist,
  pendingApprovalsCount = 2,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const userInitials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 w-full flex flex-col shadow-xs bg-white">
      {/* 1. PRIMARY TOP HEADER BAR (Full-width, fixed height) */}
      <div className="w-full h-14 lg:h-15 px-4 lg:px-6 bg-white border-b border-slate-200/90 flex items-center justify-between gap-3 sm:gap-6">
        {/* Left Section: App Logo / Icon + App Name + Secondary Tagline Label */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 shrink-0">
            <Plus className="w-5 h-5 stroke-[3]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-base tracking-tight leading-none">
                VitaGrid
              </span>
              <span className="bg-blue-600 text-white font-extrabold text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded leading-none shadow-2xs">
                GOV
              </span>
              {onBackToMarketing && (
                <button
                  onClick={onBackToMarketing}
                  className="hidden xl:inline-flex items-center text-[10px] font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-200 transition-colors ml-1 cursor-pointer"
                  title="Return to Public Overview Portal"
                >
                  ← Overview
                </button>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mt-1">
              HEALTH INTELLIGENCE NETWORK
            </span>
          </div>
        </div>

        {/* Center Section: Large, Centered Search Input with Search Icon and ⌘K badge */}
        <div className="flex-1 max-w-xl mx-auto px-2 hidden md:block">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facilities, commodities, protocols, alerts..."
              className="w-full bg-slate-50/90 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-lg pl-9 pr-14 py-1.5 lg:py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-2xs"
            />
            <div className="absolute right-2.5 flex items-center gap-1.5">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 text-xs px-1 cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Section: Far Right Alignment, Horizontal Row with Consistent Spacing */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Primary Action Button ("AI Assist") */}
          <button
            onClick={onOpenAiAssist}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md text-xs font-semibold shadow-xs hover:shadow-blue-500/20 transition-all cursor-pointer"
            title="Open AI Decision Copilot Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span className="hidden sm:inline">AI Assist</span>
          </button>

          {/* Status Indicator Group (Dot + Status Text + Timestamp) */}
          <div className="hidden lg:flex items-center gap-2 text-xs px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/80 text-slate-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-800 text-[11px]">Sentinel Grid</span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] text-slate-500 font-mono">
              {syncSecondsAgo === 0 ? 'Synced now' : `${syncSecondsAgo}s ago`}
            </span>
          </div>

          {/* Utility Icon: Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle visual theme"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Utility Icon: Notifications with Badge */}
          <button
            onClick={onNotificationClick}
            aria-label="View notifications and alerts"
            title="View critical alerts"
            className="relative p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center px-1 ring-2 ring-white">
                {unreadAlertCount}
              </span>
            )}
          </button>

          {/* User Avatar / Initials Circle */}
          <div
            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100 shadow-2xs cursor-pointer select-none"
            title={`${currentUser.name} • ${currentUser.role}`}
          >
            {userInitials}
          </div>

          {/* Logout / Exit Icon */}
          {onSignOut && (
            <button
              onClick={onSignOut}
              title="Sign Out to VitaGrid GOV Gateway"
              aria-label="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. SECONDARY HORIZONTAL NAVIGATION BAR (Directly below primary header, full-width) */}
      <nav
        aria-label="Secondary Command & Operational Strip"
        className="w-full bg-[#F8FAFC] border-b border-slate-200/90 px-3 sm:px-4 lg:px-6 shadow-2xs"
      >
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1.5">
          {SECONDARY_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            const badgeCount = item.id === 'human-approvals' ? pendingApprovalsCount : item.badge;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (setActiveModule) {
                    setActiveModule(item.id);
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 active:bg-slate-200'
                }`}
                title={item.label}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.shortLabel}</span>
                {badgeCount !== undefined && badgeCount > 0 && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shrink-0 ml-0.5 ${
                      isActive ? 'bg-white text-blue-700' : 'bg-red-600 text-white'
                    }`}
                  >
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
