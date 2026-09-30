import React, { useState } from 'react';
import { X, Plus, Package, CheckCircle2, ShieldCheck } from 'lucide-react';
import { EssentialMedicine } from '../../types/supplyChain';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedicine: (medicine: EssentialMedicine) => void;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  isOpen,
  onClose,
  onAddMedicine,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'antibiotics' | 'antimalarials' | 'vaccines' | 'maternal' | 'chronic'>('antibiotics');
  const [currentStock, setCurrentStock] = useState<number>(5000);
  const [dailyVelocity, setDailyVelocity] = useState<number>(250);
  const [packaging, setPackaging] = useState('Box of 100 tablets');
  const [formulation, setFormulation] = useState('Oral Suspension / Dispersible');
  const [batchNumber, setBatchNumber] = useState(`BATCH-${new Date().getFullYear()}-KE${Math.floor(Math.random() * 90 + 10)}`);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const runoutDays = Number((currentStock / (dailyVelocity || 1)).toFixed(1));
    const riskTier = runoutDays <= 3 ? 'critical' : runoutDays <= 7 ? 'action_required' : 'optimal';

    const newMed: EssentialMedicine = {
      id: `MED-${name.slice(0, 4).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
      name,
      category,
      currentStock,
      dailyVelocity,
      stockUnit: 'units',
      velocityUnit: 'units/day',
      runoutDays,
      depletionDate: `In ${runoutDays} days`,
      riskTier,
      riskLabel: riskTier === 'critical' ? 'Stockout Imminent' : riskTier === 'action_required' ? 'Buffer Required' : 'Adequate Supply',
      syncTimeAgo: 'Just now',
      historicalData: [currentStock + 400, currentStock + 300, currentStock + 200, currentStock + 100, currentStock],
      forecastData: [currentStock - dailyVelocity, currentStock - dailyVelocity * 2, currentStock - dailyVelocity * 3],
      safetyBuffer: 25,
      packaging,
      formulation,
      batchNumber,
    };

    onAddMedicine(newMed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200/90 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-2xs">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Add New Essential Medicine / Batch</h2>
              <p className="text-xs text-slate-500">Register a new pharmaceutical item into the 5-echelon supply chain register</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Medicine Name & Strength</label>
            <input
              type="text"
              required
              placeholder="e.g. Ciprofloxacin 500mg, Paracetamol 120mg/5ml"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="antibiotics">Antibiotics</option>
                <option value="antimalarials">Antimalarials</option>
                <option value="vaccines">Vaccines & Cold-Chain</option>
                <option value="maternal">Maternal & Child Health</option>
                <option value="chronic">Chronic / NCD</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Batch / Lot ID</label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Stock Units</label>
              <input
                type="number"
                required
                min="1"
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Burn Rate (Units/day)</label>
              <input
                type="number"
                required
                min="1"
                value={dailyVelocity}
                onChange={(e) => setDailyVelocity(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Packaging Spec</label>
              <input
                type="text"
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Formulation</label>
              <input
                type="text"
                value={formulation}
                onChange={(e) => setFormulation(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Sovereign Health Register</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add to Supply Chain
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
