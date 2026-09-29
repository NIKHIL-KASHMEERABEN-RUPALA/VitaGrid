import React from 'react';
import { X, Building2, Thermometer, ShieldCheck, Activity, Users, Send } from 'lucide-react';
import { MapRegion } from '../../types/dashboard';

interface CountyDetailModalProps {
  region: MapRegion | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CountyDetailModal: React.FC<CountyDetailModalProps> = ({
  region,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !region) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-500 font-bold">
                CLUSTER CODE: {region.code}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  region.status === 'optimal'
                    ? 'bg-emerald-100 text-emerald-800'
                    : region.status === 'watch'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {region.status.toUpperCase()} STATUS
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">{region.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                Active Facilities
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {region.facilityCount} Level 2-4 PHCs
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-blue-500" />
                Cold Chain Temp
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {region.coldChainTemp}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                Stability Index
              </span>
              <span className="font-bold text-slate-900">{region.stabilityIndex}%</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                Live Frontline Clinicians
              </span>
              <span className="font-bold text-slate-900">{region.cliniciansLive} on-shift</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                Surge Bed Capacity
              </span>
              <span className="font-bold text-slate-900">{region.bedsIcu}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                <Send className="w-3.5 h-3.5 text-blue-600" />
                Autonomous Drone Missions
              </span>
              <span className="font-bold text-slate-900">
                {region.droneDeliveries} active in corridor
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-100/70 text-slate-700 text-[11px] leading-relaxed">
            <strong>Stockout Vulnerability Status:</strong> {region.stockoutRisk}. Telemetry packets streaming from sovereign edge node every 4 seconds.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
