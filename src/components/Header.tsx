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
  ChevronDown,
  Shield,
  UserCheck,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { useRbac } from '../context/RbacContext';
import { NotificationDropdown } from './Notifications/NotificationDropdown';
import { UserRole, ROLE_CONFIGS } from '../types/rbac';

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
  activeModule = 'command-center',
  setActiveModule,
  onOpenAiAssist,
  pendingApprovalsCount = 2,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount, showToast } = useNotifications();
  const { currentRole, currentRoleConfig, switchRole } = useRbac();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const userInitials = currentRoleConfig.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleRoleSelect = (roleKey: UserRole) => {
    switchRole(roleKey);
    setIsRoleDropdownOpen(false);
    showToast(`Role switched to ${ROLE_CONFIGS[roleKey].title} (${ROLE_CONFIGS[roleKey].clearanceBadge.split('•')[0].trim()})`, 'info');
  };

  return (
    <header className="sticky top-0 z-30 w-full flex flex-col shadow-xs bg-white dark:bg-[#0B1120] border-b border-slate-200/90 dark:border-slate-800 transition-colors">
      {/* 1. PRIMARY TOP HEADER BAR */}
      <div className="w-full h-14 lg:h-15 px-4 lg:px-6 bg-white dark:bg-[#0B1120] flex items-center justify-between gap-3 sm:gap-6 border-b border-slate-200/90 dark:border-slate-800/80">
        {/* Left Section: App Logo / Icon + App Name */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 shrink-0">
            <Plus className="w-5 h-5 stroke-[3]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight leading-none">
                VitaGrid
              </span>
              <span className="bg-blue-600 text-white font-extrabold text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded leading-none shadow-2xs">
                GOV
              </span>
              {onBackToMarketing && (
                <button
                  onClick={onBackToMarketing}
                  className="hidden xl:inline-flex items-center text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 transition-colors ml-1 cursor-pointer"
                  title="Return to Public Overview Portal"
                >
                  &larr; Overview
                </button>
              )}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-none mt-1">
              HEALTH INTELLIGENCE NETWORK
            </span>
          </div>
        </div>

        {/* Center Section: Search Input */}
        <div className="flex-1 max-w-xl mx-auto px-2 hidden md:block">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facilities, commodities, protocols, alerts..."
              className="w-full bg-slate-50/90 dark:bg-slate-900 hover:bg-slate-100/60 dark:hover:bg-slate-850 focus:bg-white dark:focus:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg pl-9 pr-14 py-1.5 lg:py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-cyan-500 shadow-2xs transition-all"
            />
            <div className="absolute right-2.5 flex items-center gap-1.5">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs px-1 cursor-pointer"
                  title="Clear search"
                >
                  &#x2715;
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
                &#x2318;K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Section: Actions + Theme + Notifications + User/Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Primary Action Button ("AI Assist") */}
          <button
            onClick={onOpenAiAssist}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="Open AI Decision Copilot Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span className="hidden sm:inline">AI Assist</span>
          </button>

          {/* Status Indicator Group */}
          <div className="hidden lg:flex items-center gap-2 text-xs px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">Sentinel Grid</span>
            <span className="text-slate-300 dark:text-slate-700">&#8226;</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              {syncSecondsAgo === 0 ? 'Synced now' : `${syncSecondsAgo}s ago`}
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Sovereign Light Mode' : 'Switch to Sovereign Night Command Theme'}
            aria-label="Toggle visual theme"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-180 duration-200" />
            )}
          </button>

          {/* Notifications Bell with Live Badge & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              aria-label="View notifications and alerts"
              title="View critical alerts"
              className="relative p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center px-1 ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <NotificationDropdown
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
              onNavigateModule={(mod) => {
                if (setActiveModule) setActiveModule(mod);
              }}
            />
          </div>

          {/* User / RBAC Clearance Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200/90 dark:border-slate-800 transition-colors cursor-pointer text-left"
              title={`Active Clearance: ${currentRoleConfig.clearanceBadge}`}
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 dark:bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs select-none">
                {userInitials}
              </div>
              <div className="hidden xl:flex flex-col leading-tight">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {currentRoleConfig.name}
                </span>
                <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-mono font-semibold truncate max-w-[120px]">
                  L{currentRoleConfig.clearanceLevel} • {currentRoleConfig.title.split(' ')[0]}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            </button>

            {/* RBAC Role Selection Dropdown Menu */}
            {isRoleDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsRoleDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl z-50 overflow-hidden p-2 text-xs space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 dark:text-slate-500">
                      SWITCH ACTIVE CLEARANCE ROLE (DEMO)
                    </span>
                    <div className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">
                      {currentRoleConfig.department}
                    </div>
                  </div>

                  {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((rKey) => {
                    const r = ROLE_CONFIGS[rKey];
                    const isSelected = currentRole === rKey;
                    return (
                      <button
                        key={rKey}
                        onClick={() => handleRoleSelect(rKey)}
                        className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-cyan-200 border border-blue-200 dark:border-blue-900'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs flex items-center gap-1.5">
                            <span>{r.name}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              L{r.clearanceLevel}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                            {r.title}
                          </div>
                        </div>
                        {isSelected && <UserCheck className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}

                  {onSignOut && (
                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={onSignOut}
                        className="w-full p-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Command Session</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. SECONDARY HORIZONTAL NAVIGATION BAR */}
      <nav
        aria-label="Secondary Command Strip"
        className="w-full bg-[#F8FAFC] dark:bg-[#070B14] border-b border-slate-200/90 dark:border-slate-800 px-3 sm:px-4 lg:px-6 shadow-2xs transition-colors"
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
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/70 dark:hover:bg-slate-800/80'
                }`}
                title={item.label}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.shortLabel}</span>
                {badgeCount !== undefined && badgeCount > 0 && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shrink-0 ml-0.5 ${
                      isActive
                        ? 'bg-white text-blue-700'
                        : 'bg-red-600 text-white'
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
