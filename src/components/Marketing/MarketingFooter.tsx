import React from 'react';
import { Plus, ShieldCheck, Lock, ExternalLink } from 'lucide-react';

interface MarketingFooterProps {
  onOpenConsole: () => void;
  onRequestAccess: () => void;
  onSelectModule: (moduleId: string) => void;
}

export const MarketingFooter: React.FC<MarketingFooterProps> = ({
  onOpenConsole,
  onRequestAccess,
  onSelectModule,
}) => {
  return (
    <footer className="bg-white border-t border-slate-200/90 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Plus className="w-5 h-5 stroke-[3]" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-base tracking-tight">VitaGrid</span>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-blue-200">
                  SOVEREIGN
                </span>
              </div>
            </div>

            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              Sovereign national health intelligence and autonomous multi-agent logistics platform for primary care resilience, predictive stockout prevention, and epidemic early warning.
            </p>

            {/* Sovereign Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ISO-27001 CERTIFIED
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                HIPAA COMPLIANT
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-mono font-bold">
                SOVEREIGN DATA RESIDENCY
              </span>
            </div>
          </div>

          {/* Col 2: Platform Modules */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectModule('command-center')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  National Command Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectModule('supply-chain')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Supply Chain Intelligence
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectModule('outbreak-radar')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Demand &amp; Outbreak Radar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectModule('resource-intel')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Resource Intelligence
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectModule('agent-mesh')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Multi-Agent Mesh
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Solutions */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onRequestAccess} className="hover:text-blue-600 transition-colors text-left">
                  National Health Ministries
                </button>
              </li>
              <li>
                <button onClick={onRequestAccess} className="hover:text-blue-600 transition-colors text-left">
                  Regional CDC &amp; Surveillance
                </button>
              </li>
              <li>
                <button onClick={onRequestAccess} className="hover:text-blue-600 transition-colors text-left">
                  Primary Health Networks
                </button>
              </li>
              <li>
                <button onClick={onRequestAccess} className="hover:text-blue-600 transition-colors text-left">
                  Cold-Chain Vertiports
                </button>
              </li>
              <li>
                <button onClick={onRequestAccess} className="hover:text-blue-600 transition-colors text-left">
                  Emergency Stockpiling
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Governance */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Governance</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-500 hover:text-slate-700 cursor-default">Statutory Rule A-42</span>
              </li>
              <li>
                <span className="text-slate-500 hover:text-slate-700 cursor-default">Data Sovereignty Charter</span>
              </li>
              <li>
                <span className="text-slate-500 hover:text-slate-700 cursor-default">Consensus Protocol Spec</span>
              </li>
              <li>
                <span className="text-slate-500 hover:text-slate-700 cursor-default">Human Sign-off Protocols</span>
              </li>
              <li>
                <span className="text-slate-500 hover:text-slate-700 cursor-default">Audit &amp; Compliance Logs</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Resources */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onRequestAccess} className="hover:text-blue-600 transition-colors text-left">
                  Technical Whitepaper
                </button>
              </li>
              <li>
                <button onClick={onRequestAccess} className="hover:text-blue-600 transition-colors text-left">
                  SARIMA Modeling Docs
                </button>
              </li>
              <li>
                <button onClick={onRequestAccess} className="hover:text-blue-600 transition-colors text-left">
                  Sentinel Node Setup Guide
                </button>
              </li>
              <li>
                <button onClick={onRequestAccess} className="hover:text-blue-600 transition-colors text-left">
                  Deployment Case Studies
                </button>
              </li>
              <li>
                <button onClick={onOpenConsole} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
                  <span>Interactive Console</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-12 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <div className="flex items-center gap-2 font-mono">
            <span>SYSTEM BUILD v4.12.8-SEC</span>
            <span className="text-slate-300">•</span>
            <span className="font-sans font-medium text-slate-700">
              MINISTRY OF HEALTH &amp; FAMILY WELFARE
            </span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} VitaGrid Sovereign Health Intelligence. All sovereign rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
