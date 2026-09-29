import React, { useState } from 'react';
import { LayoutGrid, MapPin, Filter, ArrowRight } from 'lucide-react';
import { FacilityLoad } from '../../types/resourceIntel';

interface FacilityRosterTableProps {
  facilities: FacilityLoad[];
  selectedFacilityId: string;
  onSelectFacility: (facility: FacilityLoad) => void;
  onDispatchAction: (facility: FacilityLoad) => void;
}

export const FacilityRosterTable: React.FC<FacilityRosterTableProps> = ({
  facilities,
  selectedFacilityId,
  onSelectFacility,
  onDispatchAction,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'territorial'>('grid');
  const [filterText, setFilterText] = useState<string>('');

  const filteredFacilities = facilities.filter(
    (f) =>
      filterText === '' ||
      f.name.toLowerCase().includes(filterText.toLowerCase()) ||
      f.district.toLowerCase().includes(filterText.toLowerCase()) ||
      f.level.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Cross-Facility Bed &amp; Clinical Load Roster
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status feed across regional referral hospitals and rural maternal centers.
          </p>
        </div>

        {/* View Toggles & Filter Input */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Toggles */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200/70 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('territorial')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-all ${
                viewMode === 'territorial'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Territorial</span>
            </button>
          </div>

          {/* Filter Input */}
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter county or clinic..."
              className="bg-white border border-slate-200/90 rounded-md pl-8 pr-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs w-44"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto flex-1 mt-2">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
              <th className="py-2.5 px-3">FACILITY &amp; DISTRICT</th>
              <th className="py-2.5 px-2.5 text-center">TOTAL BEDS</th>
              <th className="py-2.5 px-3 text-left">ICU IN-USE</th>
              <th className="py-2.5 px-3 text-center">CLINICIAN : PATIENT</th>
              <th className="py-2.5 px-3 text-center">OXYGEN BUFFER</th>
              <th className="py-2.5 px-2.5 text-center">STATUS</th>
              <th className="py-2.5 px-3 text-right">DISPATCH</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredFacilities.map((fac) => {
              const isSelected = fac.id === selectedFacilityId;
              const isCritical = fac.status === 'Critical Deficit';
              const isStrained = fac.status === 'Strained';

              return (
                <tr
                  key={fac.id}
                  onClick={() => onSelectFacility(fac)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50/70 border-l-2 border-l-blue-600'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Facility & District */}
                  <td className="py-3 px-3 align-middle">
                    <div className="font-bold text-slate-900 leading-tight">
                      {fac.name}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {fac.district} • {fac.level}
                    </div>
                  </td>

                  {/* Total Beds */}
                  <td className="py-3 px-2.5 align-middle text-center font-bold text-slate-800">
                    {fac.totalBeds}
                  </td>

                  {/* ICU In-Use */}
                  <td className="py-3 px-3 align-middle">
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <span className="font-bold text-slate-900">
                        {fac.icuInUse}/{fac.icuTotal}
                      </span>
                      <span
                        className={`font-semibold ${
                          fac.icuPercent === 100 ? 'text-red-600' : 'text-slate-600'
                        }`}
                      >
                        {fac.icuPercent}%
                      </span>
                    </div>

                    {/* Progress Bar under ICU */}
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full ${
                          fac.icuPercent === 100
                            ? 'bg-red-600'
                            : fac.icuPercent > 80
                            ? 'bg-amber-500'
                            : 'bg-slate-600'
                        }`}
                        style={{ width: `${Math.min(fac.icuPercent, 100)}%` }}
                      ></div>
                    </div>
                  </td>

                  {/* Clinician : Patient Ratio */}
                  <td className="py-3 px-3 align-middle text-center">
                    <div
                      className={`font-extrabold text-xs font-mono ${
                        isCritical ? 'text-red-600' : 'text-slate-800'
                      }`}
                    >
                      {fac.clinicianToPatient}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {fac.targetRatio}
                    </div>
                  </td>

                  {/* Oxygen Buffer */}
                  <td className="py-3 px-3 align-middle text-center">
                    <div
                      className={`font-bold text-xs ${
                        fac.oxygenBufferDays < 2
                          ? 'text-red-600 font-extrabold'
                          : 'text-slate-800'
                      }`}
                    >
                      {fac.oxygenBufferDays} Days
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-2.5 align-middle text-center">
                    {isCritical && (
                      <span className="inline-block bg-red-50 text-red-700 font-bold text-[10px] px-2 py-0.5 rounded border border-red-200">
                        Critical Deficit
                      </span>
                    )}
                    {isStrained && (
                      <span className="inline-block bg-slate-100 text-slate-700 font-semibold text-[10px] px-2 py-0.5 rounded border border-slate-200">
                        Strained
                      </span>
                    )}
                    {fac.status === 'Nominal' && (
                      <span className="inline-block bg-emerald-50 text-emerald-700 font-semibold text-[10px] px-2 py-0.5 rounded border border-emerald-200">
                        Nominal
                      </span>
                    )}
                  </td>

                  {/* Dispatch Action Button */}
                  <td className="py-3 px-3 align-middle text-right">
                    {fac.dispatchAction === 'Rebalance Staff' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDispatchAction(fac);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-2.5 py-1.5 rounded shadow-2xs transition-colors cursor-pointer"
                      >
                        Rebalance Staff
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDispatchAction(fac);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs px-2.5 py-1.5 rounded transition-colors cursor-pointer"
                      >
                        Deploy Float
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
