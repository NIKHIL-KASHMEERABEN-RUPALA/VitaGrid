import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Flag,
  Download,
  Sparkles,
  Radio,
  CheckCircle2,
  HeartPulse,
  ThermometerSnowflake,
  Wind,
  Stethoscope,
  Activity,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import { ResourceKpiCards } from './ResourceKpiCards';
import { FacilityRosterTable } from './FacilityRosterTable';
import { RebalanceDirectiveCard } from './RebalanceDirectiveCard';
import {
  RESOURCE_KPIS_DATA,
  FACILITY_ROSTER_DATA,
  INITIAL_DIRECTIVE_DATA,
} from '../../data/resourceIntelData';
import { FacilityLoad, RebalanceDirective } from '../../types/resourceIntel';

interface ResourceIntelligenceViewProps {
  onOptimizeStaffing?: () => void;
  onDispatchComplete?: (msg: string) => void;
}

export const ResourceIntelligenceView: React.FC<ResourceIntelligenceViewProps> = ({
  onOptimizeStaffing,
  onDispatchComplete,
}) => {
  const [selectedShift, setSelectedShift] = useState<string>('morning');
  const [facilityType, setFacilityType] = useState<string>('all');
  const [facilities, setFacilities] = useState<FacilityLoad[]>(FACILITY_ROSTER_DATA);
  const [selectedFacility, setSelectedFacility] = useState<FacilityLoad>(FACILITY_ROSTER_DATA[0]);
  const [directive, setDirective] = useState<RebalanceDirective>(INITIAL_DIRECTIVE_DATA);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const shifts = [
    { id: 'morning', label: 'Shift: Morning (07:00–15:30)' },
    { id: 'evening', label: 'Evening' },
    { id: 'night', label: 'Night Trauma' },
  ];

  const handleExecuteTransfer = (directiveId: string) => {
    setDirective((prev) => ({ ...prev, status: 'executed' }));
    // Update Lodwar clinic status
    setFacilities((prev) =>
      prev.map((f) =>
        f.id === 'fac-1'
          ? {
              ...f,
              clinicianToPatient: '1 : 14',
              status: 'Nominal',
              oxygenBufferDays: 4.8,
              dispatchAction: 'Deploy Float',
            }
          : f
      )
    );
    showToast(
      'Surge Mitigation Executed: 4 Pediatric MDs + 2 O₂ Pods rolling down A1 Highway Corridor.'
    );
    if (onDispatchComplete) {
      onDispatchComplete('Lodwar PHC staff transfer in transit.');
    }
  };

  const handleProposeToDirector = (directiveId: string) => {
    showToast('Directive #LOD-01 submitted to National Director Human Approvals queue.');
  };

  const handleDispatchActionFromRow = (facility: FacilityLoad) => {
    setSelectedFacility(facility);
    if (facility.dispatchAction === 'Rebalance Staff') {
      setDirective({
        id: `dir-${facility.id}`,
        confidence: '95.2%',
        title: `Emergency Rebalance: ${facility.name}`,
        description: `Acute staffing pressure detected (${facility.clinicianToPatient} ratio). Safe threshold is 1:12.`,
        sourceNode: 'Regional Buffer Hub',
        transferResource: '3 Acute Care Nurses + 1 Emergency MD',
        transitCorridor: 'Express Health Logistics Route',
        eta: '1.8h',
        status: 'pending',
      });
      showToast(`Directive auto-generated for ${facility.name}. Review in right panel.`);
    } else {
      showToast(`Float officer dispatched to ${facility.name} from county reserve.`);
    }
  };

  const handleExportCsv = () => {
    const headers = 'Facility,District,Level,Total Beds,ICU In-Use,ICU Total,Ratio,Oxygen Buffer,Status\n';
    const rows = facilities
      .map(
        (f) =>
          `"${f.name}","${f.district}","${f.level}",${f.totalBeds},${f.icuInUse},${f.icuTotal},"${f.clinicianToPatient}",${f.oxygenBufferDays},"${f.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VitaGrid_Facility_Personnel_Grid_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4">
      {/* 1. Breadcrumb & Controls Row */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 text-xs">
        {/* Breadcrumb Left */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] font-mono">
            RESOURCE INTELLIGENCE
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-blue-600 uppercase tracking-wider text-[11px] font-mono">
            WORKFORCE &amp; FACILITY BALANCING
          </span>
          <span className="bg-blue-100 text-blue-800 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border border-blue-200">
            NODE 08-EAST
          </span>
        </div>

        {/* Controls Right */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Shift Selector Tabs */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200/70">
            {shifts.map((shift) => (
              <button
                key={shift.id}
                onClick={() => setSelectedShift(shift.id)}
                className={`px-3 py-1 font-medium rounded transition-all text-xs ${
                  selectedShift === shift.id
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {shift.label}
              </button>
            ))}
          </div>

          {/* Facility Type Dropdown */}
          <div className="relative">
            <select
              value={facilityType}
              onChange={(e) => setFacilityType(e.target.value)}
              className="bg-white border border-slate-200/90 rounded-md px-3 py-1.5 text-xs text-slate-800 font-medium appearance-none pr-7 shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Facility Types (2,840)</option>
              <option value="level-5">Level 5 National Referrals</option>
              <option value="level-4">Level 4 County Hospitals</option>
              <option value="level-3">Level 3 Primary Healthcare Centres</option>
              <option value="maternal">Rural Maternal Dispensaries</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => showToast('Facility flag modal opened for sentinel audit.')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 rounded-md font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5 text-slate-500" />
            <span>Flag Facility</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="p-1.5 bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md shadow-2xs transition-colors cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              if (onOptimizeStaffing) onOptimizeStaffing();
              showToast('Running multi-facility linear programming optimization...');
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optimize Staffing via AI</span>
          </button>
        </div>
      </div>

      {/* 2. Main Title Row */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          National Facility &amp; Personnel Grid
        </h1>

        <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-subtle"></span>
          <span>LIVE TELEMETRY</span>
        </span>
      </div>

      {/* 3. Top KPI Row (4 Equal White Cards) */}
      <ResourceKpiCards kpis={RESOURCE_KPIS_DATA} />

      {/* NEW: Live Clinician Fatigue Model & Digital Twin Telemetry Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Clinician Fatigue & Rostering Model (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-purple-200/90 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-2xs">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Clinician Fatigue &amp; Burnout Model • Shift Strain Predictor
                </h3>
                <p className="text-[11px] text-slate-500">
                  Calculates multi-shift exhaustion index using patient acuity, triage ratios, and consecutive duty hours.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded">
              AI ROSTER OPTIMIZER
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 p-3 bg-purple-50/40 rounded-lg border border-purple-100 text-center font-mono">
            <div>
              <div className="text-[10px] text-slate-500 font-sans">Burnout Risk Index</div>
              <div className="text-lg font-black text-red-600 mt-0.5">
                {selectedFacility.status === 'Critical Deficit' ? '0.78 (HIGH)' : '0.42 (MOD)'}
              </div>
              <div className="text-[10px] text-slate-400 font-sans">Threshold: &gt;0.65</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-sans">Duty Strain Deficit</div>
              <div className="text-lg font-black text-amber-600 mt-0.5">
                {selectedFacility.status === 'Critical Deficit' ? '-4 Clinicians' : 'Balanced'}
              </div>
              <div className="text-[10px] text-slate-400 font-sans">Across Night/Trauma</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-sans">Fatigue Reduction Δ</div>
              <div className="text-lg font-black text-emerald-600 mt-0.5">
                -43.6%
              </div>
              <div className="text-[10px] text-slate-400 font-sans">With Float Dispatch</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span className="text-[11px] text-slate-600 flex items-center gap-1.5 font-medium">
              <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
              <span>Recommended Surge: <strong>3 Acute Care RNs + 1 Emergency MD</strong> via express corridor.</span>
            </span>
            <button
              onClick={() => {
                if (onOptimizeStaffing) onOptimizeStaffing();
                showToast('LP Simplex optimizer executed: mutual-aid routing solution found.');
              }}
              className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              Run LP Solver &rarr;
            </button>
          </div>
        </div>

        {/* Selected Facility Digital Twin Live Telemetry (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-mono">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Digital Twin • {selectedFacility.name}</span>
              </div>
              <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {selectedFacility.level}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-2">
              Autonomous digital twin node synchronized with PostGIS spatial catchment and IoT biomedical telemetry.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>OXYGEN BUFFER</span>
                  <Wind className="w-3 h-3 text-cyan-600" />
                </div>
                <div className="text-sm font-extrabold text-slate-900 mt-1 font-mono">
                  {selectedFacility.oxygenBufferDays} Days
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">52.4 PSI Manifold</div>
              </div>

              <div className="p-2 rounded bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>COLD-CHAIN</span>
                  <ThermometerSnowflake className="w-3 h-3 text-blue-600" />
                </div>
                <div className="text-sm font-extrabold text-emerald-700 mt-1 font-mono">
                  4.4°C Safe
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">IoT Sentinel Ping 4s</div>
              </div>

              <div className="p-2 rounded bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>ACUTE BEDS</span>
                  <Activity className="w-3 h-3 text-indigo-600" />
                </div>
                <div className="text-sm font-extrabold text-slate-900 mt-1 font-mono">
                  {selectedFacility.totalBeds} Total
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">92% Occupied</div>
              </div>

              <div className="p-2 rounded bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>ICU VENTILATORS</span>
                  <ShieldAlert className="w-3 h-3 text-red-600" />
                </div>
                <div className="text-sm font-extrabold text-red-600 mt-1 font-mono">
                  {selectedFacility.icuInUse} / {selectedFacility.icuTotal}
                </div>
                <div className="text-[10px] text-red-500 mt-0.5">{selectedFacility.icuPercent}% Saturation</div>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-100 flex items-center justify-between">
            <span>District: {selectedFacility.district}</span>
            <span className="text-emerald-700 font-bold">DIGITAL TWIN: VERIFIED</span>
          </div>
        </div>
      </div>

      {/* 4. Main Content Area (Two Columns: Table on Left, Directive Card on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Side – Cross-Facility Bed & Clinical Load Roster (8 cols on desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <FacilityRosterTable
            facilities={facilities}
            selectedFacilityId={selectedFacility.id}
            onSelectFacility={(fac) => setSelectedFacility(fac)}
            onDispatchAction={handleDispatchActionFromRow}
          />
        </div>

        {/* Right Side – AI Rebalance Directive Card (4 cols on desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
          <RebalanceDirectiveCard
            directive={directive}
            selectedFacility={selectedFacility}
            onExecuteTransfer={handleExecuteTransfer}
            onProposeToDirector={handleProposeToDirector}
          />
        </div>
      </div>

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
