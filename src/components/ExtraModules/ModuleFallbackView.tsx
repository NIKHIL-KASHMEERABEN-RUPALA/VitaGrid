import React from 'react';
import {
  PackageCheck,
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
  if (moduleId === 'preemptive-staging') {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase font-mono">
                SOVEREIGN PRE-EMPTIVE LOGISTICS
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Pre-emptive Staging &amp; Strategic Buffer Reserves
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated forward-deployment of critical antibiotics, vaccines, and IV fluids prior to predicted syndromic peaks.
            </p>
          </div>
          <button
            onClick={() => onActionClick && onActionClick('Pre-emptive dispatch manifest generated for 4 regional depots.')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Generate Forward-Deployment Manifest</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lake Basin Malaria Staging</span>
            <div className="text-2xl font-black text-slate-900 mt-2">15,000 Courses</div>
            <p className="text-xs text-slate-500 mt-1">Artemether/Lumefantrine + 5,000 mRDTs staged at Kisumu Strategic Depot.</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Forward buffer active (28 days)</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Coast Pediatric Antimicrobials</span>
            <div className="text-2xl font-black text-slate-900 mt-2">8,400 Packs</div>
            <p className="text-xs text-slate-500 mt-1">Amoxicillin 250mg DT staged at Mombasa Hub to buffer Kilifi &amp; Kwale clinics.</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Fleet RL-09 in transit (ETA 48m)</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Northern Vertiport Solar Cold Enclave</span>
            <div className="text-2xl font-black text-slate-900 mt-2">3,200 Doses</div>
            <p className="text-xs text-slate-500 mt-1">Measles-Rubella &amp; BCG vaccines staged at Garissa airstrip islanded microgrid.</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Thermal range +4.1°C nominal</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (moduleId === 'knowledge-system') {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase font-mono">
                SOVEREIGN CLINICAL PROTOCOLS &amp; SOPS
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              National Health Knowledge System
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Accredited treatment guidelines, standard operating procedures, and biological preservation directives.
            </p>
          </div>
          <button
            onClick={() => onActionClick && onActionClick('Exported Sovereign Clinical Protocols Index (PDF)')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download All Directives</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              SOP-MOH-AMX-2025
            </span>
            <h3 className="text-sm font-bold text-slate-900">National Pediatric Pneumonia &amp; Severe Infection Antimicrobial Protocol</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mandates Amoxicillin 250mg dispersible tablets as the sovereign first-line regimen (25mg/kg twice daily for 5 days). Triggers autonomous rebalancing when facility stock drops below 5-day burn velocity.
            </p>
            <div className="text-[11px] text-slate-400">Authority: Ministry of Health • Version 3.4-2025</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              SOP-MOH-MAL-2026
            </span>
            <h3 className="text-sm font-bold text-slate-900">National Malaria Surveillance &amp; Vector Control Guidelines</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Triggers automated alert when county R_t exceeds 1.15 for two consecutive reporting cycles. Mandates ministerial sign-off before aerial biological larvicide deployment.
            </p>
            <div className="text-[11px] text-slate-400">Authority: National Malaria Elimination Program • Version 5.1-2026</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              SOP-MOH-COLD-2025
            </span>
            <h3 className="text-sm font-bold text-slate-900">Vaccine Cold-Chain Integrity &amp; Thermal Excursion Protocol</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mandates +2°C to +8°C continuous thermal window. Temperature excursions &gt;8.0°C exceeding 4 continuous hours require immediate quarantine tag and Shake Test verification.
            </p>
            <div className="text-[11px] text-slate-400">Authority: Expanded Programme on Immunization • Version 4.0-2025</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
              SOP-MOH-LOG-2026
            </span>
            <h3 className="text-sm font-bold text-slate-900">Inter-County Health Resource Sharing &amp; Mutual Aid Mandate</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Section 44 of National Health Sovereignty Act authorizes cross-border asset reallocation (oxygen, medicine, ICU nurses) when localized facility load exceeds 85% capacity.
            </p>
            <div className="text-[11px] text-slate-400">Authority: Council of Governors &amp; Disaster Council • Version 2.2-2026</div>
          </div>
        </div>
      </div>
    );
  }

  if (moduleId === 'ml-models') {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase font-mono">
              SOVEREIGN MODEL REGISTRY &amp; INFERENCE ENGINE
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Machine Learning Models &amp; Algorithmic Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Production algorithms executing across sovereign edge nodes and ministerial command servers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 uppercase">Cori Bayesian R_t Estimator</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE • 12ms
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Instantaneous reproduction number estimation with Gamma serial interval distribution (μ=4.8d, σ=2.3d).
            </p>
            <div className="text-[11px] font-mono text-slate-500">MAE: 0.038 • 95% Credible Interval Verified</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 uppercase">SARIMA Stockout Velocity Forecaster</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE • 24ms
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Depletion velocity modeling across 340 essential medicines with non-linear epidemiological surge multipliers.
            </p>
            <div className="text-[11px] font-mono text-slate-500">WAPE: 0.22% • Run-out Error: ±0.02d</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 uppercase">Multi-Echelon Transportation Simplex</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE • 18ms
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Linear programming optimizer minimizing Haversine transit cost and unmet clinical demand penalty.
            </p>
            <div className="text-[11px] font-mono text-slate-500">Primal-Dual Simplex • 100% Constraints Met</div>
          </div>
        </div>
      </div>
    );
  }

  if (moduleId === 'cross-district') {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase font-mono">
              INTER-COUNTY LOGISTICS CORRIDORS
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Cross-District Mutual Aid &amp; Fleet Planner
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inter-county emergency corridors connecting Central Medical Stores, 4 Regional Strategic Hubs, and 47 County Referral Centers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900">A109 Northern Coastal Freight Corridor</h3>
            <p className="text-xs text-slate-600">
              Connects Coast Regional Hub (Mombasa) to Machakos Referral &amp; Nairobi CMS. Monitored for monsoon washouts and cold-chain truck battery integrity.
            </p>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-500">Active Trucks: 8</span>
              <span className="font-semibold text-emerald-600">All Corridors Clear</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Lake Victoria Regional Supply Arc</h3>
            <p className="text-xs text-slate-600">
              Connects Kisumu Hub to Siaya, Homa Bay, and Migori Level 4-5 hospitals with rapid emergency vaccine boat delivery options.
            </p>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-500">Active Watercraft: 3</span>
              <span className="font-semibold text-emerald-600">All Nodes Connected</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
