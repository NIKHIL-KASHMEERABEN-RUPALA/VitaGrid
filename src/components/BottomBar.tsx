import React from 'react';

export const BottomBar: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-[#0B1120] border-t border-slate-200/80 dark:border-slate-800 px-4 lg:px-6 py-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2 shrink-0 transition-colors">
      {/* Left: Security and Consensus Telemetry */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse-subtle"></span>
        <span className="font-medium text-slate-700 dark:text-slate-300">Consensus Integrity: 99.4%</span>
        <span>•</span>
        <span className="text-slate-600 dark:text-slate-400">Zero PII Egress Verified</span>
        <span>•</span>
        <span className="font-mono text-slate-500 dark:text-slate-500">Latency: 14ms</span>
      </div>

      {/* Right: Build & Ministry Identity */}
      <div className="flex items-center gap-2 tracking-wide font-mono text-[10px] text-slate-500 dark:text-slate-400">
        <span>SYSTEM BUILD v4.14.0-SEC (FEDRAMP HIGH)</span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="font-sans font-medium text-slate-600 dark:text-slate-300">
          MINISTRY OF HEALTH &amp; FAMILY WELFARE
        </span>
      </div>
    </footer>
  );
};
