import React from 'react';
import { Bed, Users, Activity, AlertTriangle, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { ResourceKpis } from '../../types/resourceIntel';

interface ResourceKpiCardsProps {
  kpis: ResourceKpis;
}

export const ResourceKpiCards: React.FC<ResourceKpiCardsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
      {/* 1. ACUTE BED CAPACITY */}
      <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              ACUTE BED CAPACITY
            </span>
            <div className="text-blue-600">
              <Bed className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {kpis.acuteBeds.used.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              / {kpis.acuteBeds.total.toLocaleString()} beds
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-800">
              {kpis.acuteBeds.percent}% In-Use
            </span>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-200">
              Nominal (State Cap 85%)
            </span>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">
            Available Reserves: <strong className="text-slate-700">{kpis.acuteBeds.reserves}</strong>
          </span>
          <div className="flex items-center gap-0.5 text-emerald-600 font-semibold">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>{kpis.acuteBeds.trend}</span>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE CLINICIANS ON SHIFT */}
      <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              ACTIVE CLINICIANS ON SHIFT
            </span>
            <div className="text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {kpis.clinicians.headcount.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500">Headcount</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-800">
              {kpis.clinicians.attendancePercent}% Attendance
            </span>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200">
              {kpis.clinicians.unexcusedPercent}% Unexcused
            </span>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 truncate">
          <span>{kpis.clinicians.activeDutyMds.toLocaleString()} Active Duty MDs</span>
          <span className="mx-1">•</span>
          <span>{kpis.clinicians.registeredNurses.toLocaleString()} Registered Nurses</span>
        </div>
      </div>

      {/* 3. CRITICAL BIO-MEDICAL UNITS */}
      <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              CRITICAL BIO-MEDICAL UNITS
            </span>
            <div className="text-blue-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {kpis.bioMedical.operationalPercent}%
            </span>
            <span className="text-xs font-semibold text-slate-500">Operational</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-800">
              {kpis.bioMedical.ventilators} Vent / {kpis.bioMedical.pods} Pods
            </span>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-200">
              Cold-Grid Synced
            </span>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 truncate">
          <span>{kpis.bioMedical.underCalibration} Units Under Calibration</span>
          <span className="mx-1">•</span>
          <span>{kpis.bioMedical.coldChainLockPercent}% Cold-Chain Lock</span>
        </div>
      </div>

      {/* 4. FACILITY STRESS INDEX */}
      <div className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
              FACILITY STRESS INDEX
            </span>
            <div className="text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-extrabold text-red-600 tracking-tight">
              {kpis.stressIndex.criticalSites}
            </span>
            <span className="text-xs font-semibold text-red-700">Critical Sites</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-800">
              {kpis.stressIndex.strainedTier} In Strained Tier
            </span>
            <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">
              Action Required
            </span>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">
            Immediate Staff Deficit: <strong className="text-red-700">{kpis.stressIndex.immediateStaffDeficit}</strong>
          </span>
          <div className="flex items-center gap-0.5 text-red-600 font-semibold font-mono">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{kpis.stressIndex.deltaFrom0400} from 04:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};
