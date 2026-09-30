import React from 'react';
import {
  BookOpen,
  Cpu,
  Compass,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  AlertTriangle,
  Layers,
} from 'lucide-react';

interface ModuleViewProps {
  moduleId: string;
  onActionClick?: (msg: string) => void;
  onOpenBriefing?: () => void;
  onReturnToCommand?: () => void;
}

export const ModuleFallbackView: React.FC<ModuleViewProps> = ({
  moduleId,
  onActionClick,
  onOpenBriefing,
  onReturnToCommand,
}) => {
  if (moduleId === 'knowledge-system') {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-[#0F172A] p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
                SOVEREIGN CLINICAL PROTOCOLS &amp; SOPS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              National Health Knowledge System
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Accredited treatment guidelines, standard operating procedures, and biological preservation directives.
            </p>
          </div>
          <button
            onClick={() => onActionClick && onActionClick('Exported Sovereign Clinical Protocols Index (PDF)')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download All Directives</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#0F172A] p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-blue-900/60">
              SOP-MOH-AMX-2025
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">National Pediatric Pneumonia &amp; Severe Infection Antimicrobial Protocol</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Mandates Amoxicillin 250mg dispersible tablets as the sovereign first-line regimen (25mg/kg twice daily for 5 days). Triggers autonomous rebalancing when facility stock drops below 5-day burn velocity.
            </p>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">Authority: Ministry of Health • Version 3.4-2025</div>
          </div>

          <div className="bg-white dark:bg-[#0F172A] p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
              SOP-MOH-MAL-2026
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">National Malaria Surveillance &amp; Vector Control Guidelines</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Triggers automated alert when county R_t exceeds 1.15 for two consecutive reporting cycles. Mandates ministerial sign-off before aerial biological larvicide deployment.
            </p>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">Authority: National Malaria Elimination Program • Version 5.1-2026</div>
          </div>

          <div className="bg-white dark:bg-[#0F172A] p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
              SOP-MOH-COLD-2025
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Vaccine Cold-Chain Integrity &amp; Thermal Excursion Protocol</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Mandates +2°C to +8°C continuous thermal window. Temperature excursions &gt;8.0°C exceeding 4 continuous hours require immediate quarantine tag and Shake Test verification.
            </p>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">Authority: Expanded Programme on Immunization • Version 4.0-2025</div>
          </div>

          <div className="bg-white dark:bg-[#0F172A] p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-900/60">
              SOP-MOH-LOG-2026
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Inter-County Health Resource Sharing &amp; Mutual Aid Mandate</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Section 44 of National Health Sovereignty Act authorizes cross-border asset reallocation (oxygen, medicine, ICU nurses) when localized facility load exceeds 85% capacity.
            </p>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">Authority: Council of Governors &amp; Disaster Council • Version 2.2-2026</div>
          </div>
        </div>
      </div>
    );
  }

  if (moduleId === 'ml-models') {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-[#0F172A] p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
              SOVEREIGN MODEL REGISTRY &amp; INFERENCE ENGINE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Machine Learning Models &amp; Algorithmic Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Production algorithms executing across sovereign edge nodes and ministerial command servers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#0F172A] p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 dark:text-cyan-400 uppercase font-mono">Cori Bayesian R_t Estimator</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                ACTIVE • 12ms
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Instantaneous reproduction number estimation with Gamma serial interval distribution (&mu;=4.8d, &sigma;=2.3d).
            </p>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">MAE: 0.038 • 95% Credible Interval Verified</div>
          </div>

          <div className="bg-white dark:bg-[#0F172A] p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 dark:text-cyan-400 uppercase font-mono">SARIMA Stockout Velocity Forecaster</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                ACTIVE • 24ms
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Depletion velocity modeling across 340 essential medicines with non-linear epidemiological surge multipliers.
            </p>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">WAPE: 0.22% • Run-out Error: &plusmn;0.02d</div>
          </div>

          <div className="bg-white dark:bg-[#0F172A] p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 dark:text-cyan-400 uppercase font-mono">Multi-Echelon Transport Simplex</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                ACTIVE • 18ms
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Linear programming optimizer minimizing Haversine transit cost and unmet clinical demand penalty.
            </p>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Primal-Dual Simplex • 100% Constraints Met</div>
          </div>
        </div>
      </div>
    );
  }

  if (moduleId === 'cross-district') {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-[#0F172A] p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
              INTER-COUNTY LOGISTICS CORRIDORS
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Cross-District Mutual Aid &amp; Fleet Planner
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Inter-county emergency corridors connecting Central Medical Stores, 4 Regional Strategic Hubs, and 47 County Referral Centers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#0F172A] p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">A109 Northern Coastal Freight Corridor</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Connects Coast Regional Hub (Mombasa) to Machakos Referral &amp; Nairobi CMS. Monitored for monsoon washouts and cold-chain truck battery integrity.
            </p>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800 font-mono">
              <span className="text-slate-500 dark:text-slate-400">Active Trucks: 8</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">All Corridors Clear</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0F172A] p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Lake Victoria Regional Supply Arc</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Connects Kisumu Hub to Siaya, Homa Bay, and Migori Level 4-5 hospitals with rapid emergency vaccine boat delivery options.
            </p>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800 font-mono">
              <span className="text-slate-500 dark:text-slate-400">Active Watercraft: 3</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">All Nodes Connected</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
