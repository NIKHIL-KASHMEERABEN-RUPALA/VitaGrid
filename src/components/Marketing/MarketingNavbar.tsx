import React from 'react';
import { Plus, ArrowRight, ShieldCheck, ChevronRight, Activity, Terminal, Cpu } from 'lucide-react';

interface MarketingNavbarProps {
  onOpenConsole: (targetModule?: string) => void;
  onOpenLogin?: () => void;
  onRequestAccess: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const MarketingNavbar: React.FC<MarketingNavbarProps> = ({
  onOpenConsole,
  onOpenLogin,
  onRequestAccess,
  onNavigateSection,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/90 shadow-2xs">
      {/* Top Sovereign Status Strip */}
      <div className="w-full bg-slate-900 text-slate-300 px-4 py-1.5 text-[11px] font-mono flex items-center justify-between border-b border-slate-800 overflow-x-auto whitespace-nowrap gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-subtle"></span>
            DEFCON LEVEL 4 OPERATIONAL
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">2,840 PHCs Logged</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">Consensus Integrity 99.4%</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">Zero PII Egress Verified</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-semibold">ISO-27001 SECURED</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onOpenConsole()}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors font-medium cursor-pointer group"
          >
            <span>Live Command Center</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-500/20">
            <Plus className="w-5 h-5 stroke-[3]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-900 text-lg tracking-tight">VitaGrid</span>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-blue-200">
              PUBLIC SECTOR
            </span>
          </div>
        </div>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => scrollTo('platform-section')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Platform
          </button>
          <button
            onClick={() => scrollTo('capabilities-section')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Solutions
          </button>
          <button
            onClick={() => scrollTo('platform-section')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Architecture
          </button>
          <button
            onClick={() => scrollTo('pillars-section')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Intelligence Layers
          </button>
          <button
            onClick={() => scrollTo('impact-section')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Impact
          </button>
          <button
            onClick={() => scrollTo('compliance-section')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Resources
          </button>
          <button
            onClick={() => onOpenConsole('ml-models')}
            className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold transition-colors cursor-pointer bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 px-2.5 py-1 rounded border border-purple-200 dark:border-purple-800"
            title="Open Interactive AI/ML Laboratory & Sovereign Jupyter Notebook"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Lab &amp; Notebook</span>
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onRequestAccess}
            className="px-3.5 py-2 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-semibold transition-all shadow-2xs cursor-pointer"
          >
            Request National Access
          </button>

          <button
            onClick={() => {
              if (onOpenLogin) onOpenLogin();
              else onOpenConsole();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-xs font-semibold shadow-xs shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            title="Sign in to VitaGrid GOV National Health Gateway"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
