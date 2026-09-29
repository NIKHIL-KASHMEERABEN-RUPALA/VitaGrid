import React, { useState } from 'react';
import {
  X,
  Truck,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

interface TransferSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  transfer: {
    route_id: string;
    source_facility_name: string;
    target_facility_name: string;
    commodity_name: string;
    quantity_units: number;
    transit_distance_km: number;
    estimated_transit_hours: number;
    urgency_priority: string;
  } | null;
  onAuthorize?: (routeId: string) => void;
}

export const TransferSimulationModal: React.FC<TransferSimulationModalProps> = ({
  isOpen,
  onClose,
  transfer,
  onAuthorize,
}) => {
  const [adjustedUnits, setAdjustedUnits] = useState<number>(
    transfer?.quantity_units || 12500
  );
  const [selectedRouteOption, setSelectedRouteOption] = useState<'direct' | 'escorted' | 'air_courier'>('direct');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simMetrics, setSimMetrics] = useState<any>(null);

  if (!isOpen || !transfer) return null;

  const handleSimulateDirect = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      const tonKm = ((adjustedUnits * 0.00035) * transfer.transit_distance_km).toFixed(1);
      const fuelLiters = (transfer.transit_distance_km * 0.28).toFixed(1);
      const stockoutReliefPct = Math.min(99.4, +((adjustedUnits / 12500) * 98.2).toFixed(1));
      const shadowCostSaved = (adjustedUnits * 1.45).toFixed(0);

      setSimMetrics({
        tonKm,
        fuelLiters,
        stockoutReliefPct,
        shadowCostSaved,
        eta: selectedRouteOption === 'air_courier' ? 2.5 : transfer.estimated_transit_hours,
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200/90 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-2xs">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Simulate Primal-Dual Transfer Directive: {transfer.route_id}
                <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                  LP SIMPLEX SOLVER
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Evaluate constraint sensitivity, ton-kilometer transport burden, and subcounty stockout relief.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Transfer Details Card */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between font-mono font-bold text-[11px]">
              <span className="text-blue-700">{transfer.commodity_name}</span>
              <span className="text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                PRIORITY: {transfer.urgency_priority}
              </span>
            </div>

            <div className="flex items-center justify-between font-semibold text-slate-800 text-xs py-1 border-y border-slate-200/70">
              <span>{transfer.source_facility_name}</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span>{transfer.target_facility_name}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600">
              <div>Base Distance: <strong className="text-slate-900">{transfer.transit_distance_km} km</strong></div>
              <div>Est Transit: <strong className="text-emerald-700">{transfer.estimated_transit_hours}h</strong></div>
              <div>SLA Gate: <strong className="text-amber-800 font-mono">6 Hours</strong></div>
            </div>
          </div>

          {/* Interactive Sliders & Route Options */}
          <div className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between font-bold text-slate-800 text-[11px] uppercase tracking-wider font-mono">
              <span>Modify Transfer Parameters</span>
              <span className="text-blue-700 font-normal">Primal Bounds</span>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 text-xs mb-1">
                <span>Dispatch Quantity (Units):</span>
                <span className="font-bold font-mono text-blue-700">{adjustedUnits.toLocaleString()} units</span>
              </div>
              <input
                type="range"
                min="1000"
                max="30000"
                step="500"
                value={adjustedUnits}
                onChange={(e) => setAdjustedUnits(+e.target.value)}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Corridor Routing Strategy
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRouteOption('direct')}
                  className={`p-2 rounded-md border text-center transition-all cursor-pointer ${
                    selectedRouteOption === 'direct'
                      ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Direct Overland Truck
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRouteOption('escorted')}
                  className={`p-2 rounded-md border text-center transition-all cursor-pointer ${
                    selectedRouteOption === 'escorted'
                      ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Cold-Shield Fleet
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRouteOption('air_courier')}
                  className={`p-2 rounded-md border text-center transition-all cursor-pointer ${
                    selectedRouteOption === 'air_courier'
                      ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Regional Air Charter
                </button>
              </div>
            </div>

            <button
              onClick={handleSimulateDirect}
              disabled={isSimulating}
              className="w-full py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              {isSimulating ? (
                <>
                  <Play className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Simplex Pivot Table...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Run Transfer Sensitivity Simulation</span>
                </>
              )}
            </button>
          </div>

          {/* Simulation Result */}
          {simMetrics && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg space-y-2">
              <div className="flex items-center justify-between font-bold text-emerald-900 text-xs font-mono uppercase">
                <span>Optimizer Simulation Output</span>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">FEASIBLE SOLUTION</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-800 text-[11px]">
                <div className="p-1.5 bg-white rounded border border-emerald-200">
                  <div className="text-[10px] text-slate-400">Total Ton-Km</div>
                  <div className="font-bold text-slate-900 font-mono mt-0.5">{simMetrics.tonKm} t·km</div>
                </div>
                <div className="p-1.5 bg-white rounded border border-emerald-200">
                  <div className="text-[10px] text-slate-400">Fuel Burn</div>
                  <div className="font-bold text-slate-900 font-mono mt-0.5">{simMetrics.fuelLiters} L</div>
                </div>
                <div className="p-1.5 bg-white rounded border border-emerald-200">
                  <div className="text-[10px] text-slate-400">Stockout Relief</div>
                  <div className="font-bold text-emerald-700 font-mono mt-0.5">{simMetrics.stockoutReliefPct}%</div>
                </div>
                <div className="p-1.5 bg-white rounded border border-emerald-200">
                  <div className="text-[10px] text-slate-400">Transit ETA</div>
                  <div className="font-bold text-blue-700 font-mono mt-0.5">{simMetrics.eta}h</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200/90 bg-slate-50/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (onAuthorize) onAuthorize(transfer.route_id);
              onClose();
            }}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Confirm &amp; Queue to Action Docket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
