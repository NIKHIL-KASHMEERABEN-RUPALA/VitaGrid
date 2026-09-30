import React from 'react';
import { Archive, Download, LayoutList, Sparkles, CheckCircle2 } from 'lucide-react';
import { EssentialMedicine } from '../../types/supplyChain';

interface DepletionTableProps {
  medicines: EssentialMedicine[];
  selectedMedicineId: string;
  onSelectMedicine: (medicine: EssentialMedicine) => void;
  onInspectMedicine?: (medicine: EssentialMedicine) => void;
  onExportCsv?: () => void;
}

export const DepletionTable: React.FC<DepletionTableProps> = ({
  medicines,
  selectedMedicineId,
  onSelectMedicine,
  onInspectMedicine,
  onExportCsv,
}) => {
  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center text-blue-600 dark:text-cyan-400">
            <Archive className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Real-Time Stock Depletion Table
          </h3>
        </div>

        {/* View toggles & download */}
        <div className="flex items-center gap-1">
          <button
            className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 transition-colors"
            title="List / Matrix view"
          >
            <LayoutList className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onExportCsv}
            className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
        Live telemetry sync with automated burn-rate tracking. Click any row to inspect XGBoost + TreeSHAP model inference.
      </p>

      {/* Table Container */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50 font-mono">
              <th className="py-2 px-2.5">ESSENTIAL MEDICINE</th>
              <th className="py-2 px-2.5 text-right">CURRENT STOCK</th>
              <th className="py-2 px-2.5 text-right">DAILY VELOCITY</th>
              <th className="py-2 px-2.5 text-left">RUNOUT SLA</th>
              <th className="py-2 px-2.5 text-left">RISK TIER</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {medicines.map((med) => {
              const isSelected = med.id === selectedMedicineId;
              const isCritical = med.riskTier === 'critical';

              return (
                <tr
                  key={med.id}
                  onClick={() => {
                    onSelectMedicine(med);
                    if (onInspectMedicine) onInspectMedicine(med);
                  }}
                  className={`cursor-pointer transition-colors group ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-l-2 border-l-blue-600 dark:border-l-cyan-400'
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-850/60'
                  }`}
                >
                  {/* Medicine Name & Formulation */}
                  <td className="py-2.5 px-2.5 align-top">
                    <div className="flex items-center gap-1.5">
                      <div className="font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-700 dark:group-hover:text-cyan-400 transition-colors">
                        {med.name}
                      </div>
                      <Sparkles className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {med.packaging} • {med.formulation}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                      Sync {med.syncTimeAgo}
                    </div>
                  </td>

                  {/* Current Stock */}
                  <td className="py-2.5 px-2.5 align-top text-right">
                    <div
                      className={`font-extrabold text-sm font-mono ${
                        isCritical ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {med.currentStock.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      {med.stockUnit}
                    </div>
                  </td>

                  {/* Daily Velocity */}
                  <td className="py-2.5 px-2.5 align-top text-right">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs font-mono">
                      {med.dailyVelocity}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      {med.velocityUnit}
                    </div>
                  </td>

                  {/* Runout SLA */}
                  <td className="py-2.5 px-2.5 align-top">
                    <div
                      className={`font-extrabold text-xs font-mono ${
                        isCritical ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {med.runoutDays} Days
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Depletion: {med.depletionDate}
                    </div>
                  </td>

                  {/* Risk Tier Badge */}
                  <td className="py-2.5 px-2.5 align-top font-mono">
                    {med.riskTier === 'critical' && (
                      <span className="inline-block bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-2xs leading-tight">
                        Critical Stockout Imminent
                      </span>
                    )}

                    {med.riskTier === 'action_required' && (
                      <span className="inline-block bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 font-semibold text-[10px] px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/60">
                        Action Required
                      </span>
                    )}

                    {med.riskTier === 'low_buffer' && (
                      <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-[10px] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        Low Buffer
                      </span>
                    )}

                    {med.riskTier === 'optimal' && (
                      <span className="inline-block bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold text-[10px] px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/60">
                        Optimal Buffer
                      </span>
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
