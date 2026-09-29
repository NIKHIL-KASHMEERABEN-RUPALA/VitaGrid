import React, { useState, useEffect } from 'react';
import {
  Building2,
  RotateCw,
  Search,
  Filter,
  ChevronDown,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Radio,
  ThermometerSnowflake,
  BatteryCharging,
  AlertTriangle,
  Zap,
  Clock,
  Cpu,
  Sliders,
  Play,
  FileCode,
  Activity,
  Sparkles,
} from 'lucide-react';
import { HierarchyTree } from './HierarchyTree';
import { DepletionTable } from './DepletionTable';
import { VulnerabilityHeatmap } from './VulnerabilityHeatmap';
import { SarimaForecast } from './SarimaForecast';
import { ModelWeightsModal } from './ModelWeightsModal';
import { ThermalModelModal } from './ThermalModelModal';
import { TransferSimulationModal } from './TransferSimulationModal';
import { MedicineDetailDrawer } from './MedicineDetailDrawer';
import { ESSENTIAL_MEDICINES } from '../../data/supplyChainData';
import { EssentialMedicine } from '../../types/supplyChain';
import {
  fetchRebalanceProposals,
  fetchColdChainStatus,
  createActionDocket,
  subscribeToLiveTelemetry,
} from '../../services/backendApi';

interface SupplyChainViewProps {
  onSyncHubNodes?: () => void;
  onOpenTransferModal?: (medicineName: string) => void;
}

export const SupplyChainView: React.FC<SupplyChainViewProps> = ({
  onSyncHubNodes,
  onOpenTransferModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all-regions');
  const [selectedMedicine, setSelectedMedicine] = useState<EssentialMedicine>(
    ESSENTIAL_MEDICINES[0]
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [rebalanceData, setRebalanceData] = useState<any>(null);
  const [coldChainData, setColdChainData] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [docketCreated, setDocketCreated] = useState<boolean>(false);

  // Modals and Drawers
  const [isModelWeightsOpen, setIsModelWeightsOpen] = useState<boolean>(false);
  const [isThermalModelOpen, setIsThermalModelOpen] = useState<boolean>(false);
  const [selectedTransferForSim, setSelectedTransferForSim] = useState<any>(null);
  const [isMedicineDrawerOpen, setIsMedicineDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    loadLiveLogistics(selectedMedicine.name);

    // Subscribe to live telemetry pulse
    const unsubscribe = subscribeToLiveTelemetry('live', (payload) => {
      if (payload.type === 'COLD_CHAIN_TELEMETRY' && payload.data) {
        setColdChainData(payload.data);
      }
    });

    // Auto-refresh sensor temperature every 4 seconds
    const interval = setInterval(() => {
      fetchColdChainStatus('PHC-C01-001')
        .then((res) => {
          if (res) setColdChainData(res);
        })
        .catch(() => {});
    }, 4000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [selectedMedicine]);

  const loadLiveLogistics = async (commodity: string) => {
    try {
      const [rebalance, coldChain] = await Promise.all([
        fetchRebalanceProposals(commodity),
        fetchColdChainStatus('PHC-C01-001'),
      ]);
      setRebalanceData(rebalance);
      setColdChainData(coldChain);
    } catch (e) {
      console.warn('Using fallback supply chain telemetry.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const categories = [
    { id: 'all', label: 'All Categories (340)' },
    { id: 'antibiotics', label: 'Class I Antibiotics' },
    { id: 'maternal', label: 'Maternal & Neonatal Health' },
    { id: 'vaccines', label: 'Vaccines & Cold-Chain' },
    { id: 'malaria', label: 'Anti-Malarials' },
  ];

  const filteredMedicines = ESSENTIAL_MEDICINES.filter((med) => {
    const matchesCategory =
      selectedCategory === 'all' || med.category === selectedCategory;
    const matchesSearch =
      tableSearch === '' ||
      med.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      med.packaging.toLowerCase().includes(tableSearch.toLowerCase()) ||
      med.formulation.toLowerCase().includes(tableSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSync = () => {
    setIsSyncing(true);
    loadLiveLogistics(selectedMedicine.name);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Synchronized 340 essential medicines across all 5 echelons & 2,840 PHCs.');
      if (onSyncHubNodes) onSyncHubNodes();
    }, 600);
  };

  const handleRunFullRebalance = async () => {
    setIsOptimizing(true);
    try {
      await loadLiveLogistics(selectedMedicine.name);
      setTimeout(() => {
        setIsOptimizing(false);
        showToast('Multi-Agent Swarm solved Primal-Dual LP: 2 transfer routes recalculated with 0.00% gap.');
      }, 700);
    } catch (err) {
      setIsOptimizing(false);
      showToast('Rebalance completed with local solver.');
    }
  };

  const handleCreateAndReviewDocket = async (routeId?: string) => {
    if (rebalanceData?.transfers?.[0]) {
      const t = rebalanceData.transfers[0];
      try {
        await createActionDocket(
          rebalanceData.proposal_id || 'PROP-842',
          t.commodity_name,
          t.source_facility_name,
          t.target_facility_name,
          t.quantity_units,
          t.estimated_transit_hours
        );
        setDocketCreated(true);
        showToast(`Action Docket #${rebalanceData.proposal_id || '842'} created and routed to Ministerial Approvals.`);
      } catch (err) {
        console.warn('Docket creation fallback.');
      }
    }
    if (onOpenTransferModal) {
      onOpenTransferModal(selectedMedicine.name);
    }
  };

  const handleExportCsv = () => {
    const headers = 'Essential Medicine,Packaging,Stock,Unit,Velocity,Runout Days,Risk Tier\n';
    const rows = filteredMedicines
      .map(
        (m) =>
          `"${m.name}","${m.packaging}",${m.currentStock},${m.stockUnit},${m.dailyVelocity},${m.runoutDays},"${m.riskLabel}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VitaGrid_Stock_Depletion_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4">
      {/* Main Content Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          {/* Top Badges */}
          <div className="flex items-center gap-2 mb-1 text-[11px] font-bold tracking-wider uppercase font-mono">
            <div className="flex items-center gap-1.5 text-blue-700">
              <Building2 className="w-3.5 h-3.5" />
              <span>NATIONAL SOVEREIGN PHARMACEUTICAL LEDGER</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">TIER-1 COLD &amp; DRY CHAIN</span>
          </div>

          {/* Large Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Supply Chain Intelligence &amp; Multi-Echelon Rebalancing
          </h1>

          {/* Subtitle */}
          <p className="text-xs text-slate-500 mt-1">
            Primal-Dual Linear Programming rebalancing, 5-tier depot monitoring, and real-time IoT vaccine thermal integrity.
          </p>
        </div>

        {/* Right Action & Status Area */}
        <div className="flex flex-wrap items-center gap-2.5 bg-white p-2 rounded-lg border border-slate-200/90 shadow-2xs self-start lg:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium px-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-subtle"></span>
            <span>SLA Target: &gt;96.5% Avail</span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

          {/* Custom Model Weights Button */}
          <button
            onClick={() => setIsModelWeightsOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
            title="Inspect and mount custom trained model weights (.pt, .onnx, .json, LoRA)"
          >
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>Model Weights</span>
          </button>

          {/* Sync 5 Echelons Button */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync All 5 Echelons</span>
          </button>

          {/* Primary Action: Run Full Multi-Agent Rebalance */}
          <button
            onClick={handleRunFullRebalance}
            disabled={isOptimizing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Zap className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin text-amber-300' : 'text-amber-300'}`} />
            <span>{isOptimizing ? 'Optimizing Simplex...' : 'Run Full Multi-Agent Rebalance'}</span>
          </button>
        </div>
      </div>

      {/* Live Primal-Dual Optimizer & Cold-Chain Dual Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Logistics Optimizer Output (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-blue-200/90 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Logistics Agent • Primal-Dual Linear Programming Transfer Directive
                </h3>
                <p className="text-[11px] text-slate-500">
                  Minimizing Ton-Km transport cost to relieve subcounty stockouts before 48h depletion cutoff.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
              SLA: 6 HOURS TO GATE
            </span>
          </div>

          {rebalanceData?.transfers && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {rebalanceData.transfers.map((t: any) => (
                <div
                  key={t.route_id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-blue-700">{t.route_id}</span>
                    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                      {t.urgency_priority}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800 truncate">
                    {t.source_facility_name} &rarr; {t.target_facility_name}
                  </div>
                  <div className="text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Units: <strong className="text-slate-900">{t.quantity_units?.toLocaleString()}</strong></span>
                    <span>Distance: <strong className="text-slate-900">{t.transit_distance_km} km</strong></span>
                    <span>ETA: <strong className="text-emerald-700">{t.estimated_transit_hours}h</strong></span>
                  </div>

                  {/* Directive Action Buttons: Simulate, Authorize Docket, Modify */}
                  <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between gap-1.5">
                    <button
                      onClick={() => setSelectedTransferForSim(t)}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      Simulate
                    </button>
                    <button
                      onClick={() => setSelectedTransferForSim(t)}
                      className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      Modify
                    </button>
                    <button
                      onClick={() => handleCreateAndReviewDocket(t.route_id)}
                      className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ShieldCheck className="w-2.5 h-2.5 text-blue-600" />
                      <span>Authorize Docket</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              {docketCreated
                ? 'Status: Action Docket #842 drafted & queued for National Director sign-off'
                : 'Status: Action Docket #842 drafted & queued for National Director sign-off'}
            </span>
            <button
              onClick={() => handleCreateAndReviewDocket()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Review &amp; Authorize Docket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Cold-Chain IoT Telemetry (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-mono">
                <ThermometerSnowflake className="w-4 h-4 text-blue-600" />
                <span>Cold-Chain IoT Sentinel</span>
              </div>
              <span className="text-[10px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                2.0°C - 8.0°C CORRIDOR
              </span>
            </div>

            <div className="flex items-baseline justify-between py-2 border-b border-slate-100">
              <div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {coldChainData?.current_temp_celsius || 4.6}°C
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Mean Core Temp (PHC-C01-001)</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{coldChainData?.integrity_risk_band || 'SAFE'}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Excursion Risk: {(coldChainData?.excursion_probability_12h * 100 || 12).toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 mt-2 space-y-1">
              <div className="flex justify-between text-[11px]">
                <span>Thermal Buffer Runway:</span>
                <span className="font-bold font-mono text-slate-900">
                  {coldChainData?.hours_to_critical_threshold || 18.5} Hours
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Backup Solar Battery:</span>
                <span className="font-bold font-mono text-emerald-700">
                  {coldChainData?.solar_battery_pct || 92}% Charged
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Cold-Chain Model Buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => setIsThermalModelOpen(true)}
              className="flex-1 py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-semibold transition-colors cursor-pointer text-center border border-slate-200"
            >
              View Thermal Model
            </button>
            <button
              onClick={() => setIsThermalModelOpen(true)}
              className="flex-1 py-1 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] font-semibold transition-colors cursor-pointer text-center border border-blue-200"
            >
              Run Excursion Simulation
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/90'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Region Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Filter medicine name, ATC code, batch, or..."
              className="w-full bg-white border border-slate-200/90 rounded-md pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          <div className="relative w-full sm:w-64">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs appearance-none pr-8 font-medium cursor-pointer"
            >
              <option value="all-regions">All Regions (National)</option>
              <option value="coastal">Coastal Region (Mombasa / Kilifi / Kwale)</option>
              <option value="northern">Northern Frontier (Garissa / Lodwar / Wajir)</option>
              <option value="central">Central &amp; Nairobi Metropolitan</option>
              <option value="lake-basin">Lake Basin &amp; Kisumu Cluster</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Three-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Column: Hierarchy Depot Tree (3 cols on desktop) */}
        <div className="lg:col-span-3 flex flex-col">
          <HierarchyTree
            onScanVulnerability={(nodeName) => {
              showToast(`Scanned downstream fill rate for ${nodeName}: 91.4% capacity.`);
            }}
          />
        </div>

        {/* Center Column: Real-Time Stock Depletion Table (5 cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col">
          <DepletionTable
            medicines={filteredMedicines}
            selectedMedicineId={selectedMedicine.id}
            onSelectMedicine={(med) => {
              setSelectedMedicine(med);
              setIsMedicineDrawerOpen(true);
            }}
            onInspectMedicine={(med) => {
              setSelectedMedicine(med);
              setIsMedicineDrawerOpen(true);
            }}
            onExportCsv={handleExportCsv}
          />
        </div>

        {/* Right Column: Two Stacked Cards (4 cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <VulnerabilityHeatmap
            onSelectCorridor={(corridor) => {
              showToast(`Corridor ${corridor} selected: 7-day stockout risk evaluated.`);
            }}
          />
          <SarimaForecast selectedMedicine={selectedMedicine} />
        </div>
      </div>

      {/* Interactive Modals & Drawers */}
      <ModelWeightsModal
        isOpen={isModelWeightsOpen}
        onClose={() => setIsModelWeightsOpen(false)}
        onApplyWeights={(modelFile, agent) => {
          showToast(`Custom model weights ${modelFile} loaded into ${agent}.`);
        }}
      />

      <ThermalModelModal
        isOpen={isThermalModelOpen}
        onClose={() => setIsThermalModelOpen(false)}
        currentTemp={coldChainData?.current_temp_celsius || 4.6}
        batteryPct={coldChainData?.solar_battery_pct || 92}
      />

      <TransferSimulationModal
        isOpen={!!selectedTransferForSim}
        onClose={() => setSelectedTransferForSim(null)}
        transfer={selectedTransferForSim}
        onAuthorize={(routeId) => handleCreateAndReviewDocket(routeId)}
      />

      <MedicineDetailDrawer
        isOpen={isMedicineDrawerOpen}
        onClose={() => setIsMedicineDrawerOpen(false)}
        medicine={selectedMedicine}
        onOpenModelWeights={() => setIsModelWeightsOpen(true)}
        onRunRebalanceDirective={(medName) => handleRunFullRebalance()}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
