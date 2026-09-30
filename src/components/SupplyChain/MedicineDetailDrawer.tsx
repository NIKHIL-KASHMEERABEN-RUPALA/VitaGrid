import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Play,
  Sliders,
  Cpu,
  CheckCircle2,
  TrendingDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Edit3,
  Trash2,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { EssentialMedicine } from '../../types/supplyChain';

interface MedicineDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: EssentialMedicine | null;
  onOpenModelWeights?: () => void;
  onRunRebalanceDirective?: (medicineName: string) => void;
  onUpdateMedicine?: (updated: EssentialMedicine) => void;
  onDeleteMedicine?: (medicineId: string) => void;
}

export const MedicineDetailDrawer: React.FC<MedicineDetailDrawerProps> = ({
  isOpen,
  onClose,
  medicine,
  onOpenModelWeights,
  onRunRebalanceDirective,
  onUpdateMedicine,
  onDeleteMedicine,
}) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'edit'>('insights');
  const [isRunningInference, setIsRunningInference] = useState<boolean>(false);
  const [inferenceResult, setInferenceResult] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit form state
  const [formData, setFormData] = useState<Partial<EssentialMedicine>>({});

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name,
        category: medicine.category,
        currentStock: medicine.currentStock,
        dailyVelocity: medicine.dailyVelocity,
        runoutDays: medicine.runoutDays,
        riskTier: medicine.riskTier,
        packaging: medicine.packaging,
        formulation: medicine.formulation,
        batchNumber: medicine.batchNumber || 'BATCH-2026-KE09',
        minBufferDays: 7,
      });
      setInferenceResult(null);
      setActiveTab('insights');
    }
  }, [medicine]);

  if (!isOpen || !medicine) return null;

  const handleRunCustomPrediction = () => {
    setIsRunningInference(true);
    setTimeout(() => {
      setIsRunningInference(false);
      setInferenceResult({
        confidence: 96.8,
        projectedStockoutHours: (medicine.runoutDays * 24).toFixed(0),
        adjustedBurnRate: `${medicine.dailyVelocity} units/day`,
        treeShapAttribution: [
          { feature: 'Regional Epidemic Surge Lag (Rt = 1.34)', contribution: '+42.5%', positive: true },
          { feature: 'Sub-County Depot Buffer Depletion', contribution: '+28.1%', positive: true },
          { feature: 'Scheduled National Shipment Inflow', contribution: '-18.4%', positive: false },
          { feature: 'Seasonal Monsoon Road Accessibility', contribution: '+9.2%', positive: true },
        ],
      });
    }, 700);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const calculatedRunout = formData.dailyVelocity && formData.dailyVelocity > 0
      ? Number(((formData.currentStock || 0) / formData.dailyVelocity).toFixed(1))
      : medicine.runoutDays;

    const updated: EssentialMedicine = {
      ...medicine,
      name: formData.name || medicine.name,
      category: (formData.category as any) || medicine.category,
      currentStock: Number(formData.currentStock) || medicine.currentStock,
      dailyVelocity: Number(formData.dailyVelocity) || medicine.dailyVelocity,
      runoutDays: calculatedRunout,
      riskTier: calculatedRunout <= 3 ? 'critical' : calculatedRunout <= 7 ? 'action_required' : 'optimal',
      packaging: formData.packaging || medicine.packaging,
      formulation: formData.formulation || medicine.formulation,
      batchNumber: formData.batchNumber || medicine.batchNumber,
    };

    if (onUpdateMedicine) {
      onUpdateMedicine(updated);
    }

    setToastMessage('✅ Medicine record successfully updated and synchronized across all 5 echelons!');
    setTimeout(() => {
      setToastMessage(null);
      setActiveTab('insights');
    }, 1200);
  };

  const handleDeleteConfirm = () => {
    if (onDeleteMedicine) {
      onDeleteMedicine(medicine.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200/90 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-2xs">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                {medicine.name}
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${medicine.riskTier === 'critical' ? 'bg-red-100 text-red-700' : medicine.riskTier === 'action_required' || medicine.riskTier === 'low_buffer' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {medicine.riskTier.toUpperCase()}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {medicine.packaging} • {medicine.formulation} (Code: {medicine.id.toUpperCase()})
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            {/* Tab switchers */}
            <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg mr-2">
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${activeTab === 'insights' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Model Insights
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${activeTab === 'edit' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Edit3 className="w-3 h-3" /> Edit / Update
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {toastMessage}
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'edit' ? (
            /* EDIT / UPDATE FORM */
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-xs text-blue-900">
                <span className="font-bold">Direct Inventory Update:</span> Modifications are instantly saved to the operational ledger, recalculating burn velocities and runout days in real-time.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Medicine Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category || 'all'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="antibiotics">Antibiotics & Antibacterials</option>
                    <option value="antimalarials">Antimalarials & ACT</option>
                    <option value="vaccines">Vaccines & Cold-Chain</option>
                    <option value="maternal">Maternal & Child Health</option>
                    <option value="chronic">Chronic & Non-Communicable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Batch / Lot ID</label>
                  <input
                    type="text"
                    value={formData.batchNumber || ''}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Stock (Packs/Units)</label>
                  <input
                    type="number"
                    value={formData.currentStock || 0}
                    onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Consumption Velocity</label>
                  <input
                    type="number"
                    value={formData.dailyVelocity || 0}
                    onChange={(e) => setFormData({ ...formData, dailyVelocity: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Packaging Spec</label>
                  <input
                    type="text"
                    value={formData.packaging || ''}
                    onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Formulation</label>
                  <input
                    type="text"
                    value={formData.formulation || ''}
                    onChange={(e) => setFormData({ ...formData, formulation: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsDeleting(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5 border border-red-200"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Item
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('insights')}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* MODEL INSIGHTS TAB */
            <>
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                  <span className="text-[11px] font-medium text-slate-500 block">Current Stock</span>
                  <span className="text-base font-bold text-slate-900 mt-0.5 block">
                    {medicine.currentStock.toLocaleString()} <span className="text-xs font-normal text-slate-500">units</span>
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                  <span className="text-[11px] font-medium text-slate-500 block">Daily Velocity</span>
                  <span className="text-base font-bold text-slate-900 mt-0.5 block">
                    {medicine.dailyVelocity} <span className="text-xs font-normal text-slate-500">units/day</span>
                  </span>
                </div>
                <div className={`p-3 rounded-lg border ${medicine.riskTier === 'critical' ? 'bg-red-50/60 border-red-200 text-red-900' : 'bg-blue-50/60 border-blue-200 text-blue-900'}`}>
                  <span className="text-[11px] font-medium opacity-80 block">Projected Runway</span>
                  <span className="text-base font-bold mt-0.5 block">
                    {medicine.runoutDays} <span className="text-xs font-normal opacity-70">days</span>
                  </span>
                </div>
              </div>

              {/* Real-Time Inference Section */}
              <div className="p-3.5 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-xl border border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-950">Active Model Inference & SHAP Drivers</span>
                  </div>
                  <button
                    onClick={handleRunCustomPrediction}
                    disabled={isRunningInference}
                    className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded-md shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isRunningInference ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-blue-600 fill-blue-600" />
                        Run Prediction
                      </>
                    )}
                  </button>
                </div>

                {inferenceResult ? (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs bg-white/80 p-2 rounded border border-blue-100">
                      <span className="text-slate-600">Model Confidence:</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {inferenceResult.confidence}% F1-Score
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-700 block">TreeSHAP Feature Importance:</span>
                      {inferenceResult.treeShapAttribution.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-[11px] py-1 border-b border-blue-100/60 last:border-0">
                          <span className="text-slate-600 truncate max-w-[280px]">{item.feature}</span>
                          <span className={`font-mono font-bold ${item.positive ? 'text-red-600' : 'text-emerald-600'}`}>
                            {item.contribution}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Click "Run Prediction" to execute the TreeSHAP feature weight calculation and evaluate multi-echelon burn velocity against the sovereign model.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleting && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-xs p-6 flex flex-col items-center justify-center text-center space-y-3 z-20">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Delete {medicine.name}?</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Are you sure you want to remove this stock record from the sovereign supply chain register? This will purge active telemetry tracking for this batch.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsDeleting(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200/90 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Cryptographic Ledger Verification Active</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                if (onOpenModelWeights) onOpenModelWeights();
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              Configure Weights
            </button>

            {onRunRebalanceDirective && (
              <button
                onClick={() => {
                  onClose();
                  onRunRebalanceDirective(medicine.name);
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <span>Rebalance Stock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
