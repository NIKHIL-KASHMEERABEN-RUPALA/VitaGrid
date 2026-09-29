import React from 'react';

export const BottomBar: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 px-4 lg:px-6 py-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 shrink-0">
      {/* Left: Security and Consensus Telemetry */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse-subtle"></span>
        <span className="font-medium text-slate-700">Consensus Integrity: 99.4%</span>
        <span>•</span>
        <span className="text-slate-600">Zero PII Egress Verified</span>
        <span>•</span>
        <span className="font-mono text-slate-500">Latency: 18ms</span>
      </div>

      {/* Right: Build & Ministry Identity */}
      <div className="flex items-center gap-2 tracking-wide font-mono text-[10px] text-slate-500">
        <span>SYSTEM BUILD v4.12.8-SEC</span>
        <span className="text-slate-300">•</span>
        <span className="font-sans font-medium text-slate-600">
          MINISTRY OF HEALTH &amp; FAMILY WELFARE
        </span>
      </div>
    </footer>
  );
};
