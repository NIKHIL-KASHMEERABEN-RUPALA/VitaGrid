import React, { useState } from 'react';
import {
  PackageCheck,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  AlertTriangle,
  Plus,
  X,
  FileText,
  Sliders,
  Sparkles,
  ArrowRight,
  ThermometerSnowflake,
  Layers,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useRbac } from '../../context/RbacContext';

interface DepotStaging {
  id: string;
  name: string;
  region: string;
  focusOutbreak: string;
  commodity: string;
  stagedUnits: number;
  bufferDays: number;
  status: 'nominal' | 'staging_in_transit' | 'active_buffer';
  temperatureCelsius: number;
  lastInspection: string;
}

const INITIAL_DEPOTS: DepotStaging[] = [
  {
    id: 'depot-1',
    name: 'Kisumu Western Strategic Depot',
    region: 'Lake Victoria Basin (C42)',
    focusOutbreak: 'Malaria & Pediatric Enteric Spike',
    commodity: 'Artemether/Lumefantrine + mRDT Bundles',
    stagedUnits: 15000,
    bufferDays: 28,
    status: 'active_buffer',
    temperatureCelsius: 4.4,
    lastInspection: '4h ago',
  },
  {
    id: 'depot-2',
    name: 'Mombasa Maritime Health Depot',
    region: 'Coastal Maritime Belt (C01)',
    focusOutbreak: 'Pediatric Antimicrobial Deficit',
    commodity: 'Amoxicillin 250mg DT (Dispersible Tablets)',
    stagedUnits: 8400,
    bufferDays: 19,
    status: 'staging_in_transit',
    temperatureCelsius: 5.1,
    lastInspection: '1h ago',
  },
  {
    id: 'depot-3',
    name: 'Garissa Solar Vertiport Enclave',
    region: 'Tana River & Northern Delta (C07)',
    focusOutbreak: 'Acute Vibrio Cholerae Vector',
    commodity: 'Oral Cholera Vaccine (OCV) & Ringers Lactate',
    stagedUnits: 6200,
    bufferDays: 24,
    status: 'active_buffer',
    temperatureCelsius: 4.1,
    lastInspection: '30m ago',
  },
  {
    id: 'depot-4',
    name: 'Lodwar Frontier Airstrip Hub',
    region: 'Turkana Desert Corridor (C23)',
    focusOutbreak: 'Severe Acute Malnutrition & Antibiotic Runout',
    commodity: 'Pediatric IV Saline & Ampicillin Vials',
    stagedUnits: 4800,
    bufferDays: 14,
    status: 'nominal',
    temperatureCelsius: 4.6,
    lastInspection: '2h ago',
  },
];

export const PreemptiveStagingView: React.FC = () => {
  const [depots, setDepots] = useState<DepotStaging[]>(INITIAL_DEPOTS);
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);
  const [selectedTargetRegion, setSelectedTargetRegion] = useState('Lake Victoria Basin (C42)');
  const [selectedCommodity, setSelectedCommodity] = useState('Amoxicillin 250mg DT');
  const [selectedUnits, setSelectedUnits] = useState(5000);
  const [transportMode, setTransportMode] = useState('Armored Refrigerated Convoy (Tier-1)');
  const [manifestGenerated, setManifestGenerated] = useState<any>(null);

  const { showToast, addNotification } = useNotifications();
  const { verifyPermissionOrPrompt } = useRbac();

  const handleOpenManifestGenerator = () => {
    if (verifyPermissionOrPrompt('canGenerateManifest', 'Generate Forward-Deployment Logistics Manifest')) {
      setIsManifestModalOpen(true);
    }
  };

  const handleGenerateManifest = () => {
    const manifestId = `MAN-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newManifest = {
      id: manifestId,
      timestamp: new Date().toISOString(),
      targetRegion: selectedTargetRegion,
      commodity: selectedCommodity,
      units: selectedUnits,
      transportMode,
      escortClearance: 'MINISTRY DISASTER EXEMPTION §12',
      sha256Digest: `0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    };

    setManifestGenerated(newManifest);

    // Update depots
    setDepots((prev) => [
      {
        id: `depot-${Date.now()}`,
        name: `Forward Enclave ${selectedTargetRegion.split(' ')[0]}`,
        region: selectedTargetRegion,
        focusOutbreak: 'Pre-emptive Wave Mitigation',
        commodity: selectedCommodity,
        stagedUnits: selectedUnits,
        bufferDays: 21,
        status: 'staging_in_transit',
        temperatureCelsius: 4.2,
        lastInspection: 'Just now',
      },
      ...prev,
    ]);

    showToast(`Manifest #${manifestId} generated and committed to staging!`, 'success');
    addNotification({
      type: 'approval',
      title: `Forward Deployment Manifest #${manifestId} Active`,
      message: `${selectedUnits.toLocaleString()} units of ${selectedCommodity} staged for ${selectedTargetRegion}.`,
      actionLabel: 'View Staging',
      actionTargetModule: 'preemptive-staging',
    });
  };

  const handleDownloadManifest = () => {
    if (!manifestGenerated) return;
    const blob = new Blob([JSON.stringify(manifestGenerated, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VitaGrid_${manifestGenerated.id}_Deployment_Manifest.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Manifest downloaded to JSON format.', 'info');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0F172A] p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
            <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
              SOVEREIGN PRE-EMPTIVE LOGISTICS &amp; STRATEGIC RESERVES
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pre-emptive Staging &amp; Strategic Buffer Reserves
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated forward-deployment of critical antibiotics, vaccines, and IV fluids prior to predicted syndromic peaks.
          </p>
        </div>

        <button
          onClick={handleOpenManifestGenerator}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <PackageCheck className="w-4 h-4" />
          <span>Generate Forward-Deployment Manifest</span>
        </button>
      </div>

      {/* Strategic Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#0F172A] p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold">TOTAL STAGED RESERVES</div>
          <div className="text-xl font-mono font-extrabold text-slate-900 dark:text-white mt-0.5">
            {depots.reduce((acc, d) => acc + d.stagedUnits, 0).toLocaleString()} Units
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
            Across {depots.length} Regional Hubs
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F172A] p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold">NATIONAL RUNWAY BUFFER</div>
          <div className="text-xl font-mono font-extrabold text-blue-600 dark:text-cyan-400 mt-0.5">23.4 Days</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Exceeds 18d policy floor</div>
        </div>

        <div className="bg-white dark:bg-[#0F172A] p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold">COLD-CHAIN HEALTH</div>
          <div className="text-xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">+4.4°C Safe</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">0 excursions &gt;6h</div>
        </div>

        <div className="bg-white dark:bg-[#0F172A] p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold">TRANSIT ESCORTS ACTIVE</div>
          <div className="text-xl font-mono font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">3 Fleets</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">GPS Beacon active</div>
        </div>
      </div>

      {/* Depots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {depots.map((depot) => (
          <div
            key={depot.id}
            className="bg-white dark:bg-[#0F172A] p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-blue-900/60">
                  {depot.region}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    depot.status === 'staging_in_transit'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {depot.status === 'staging_in_transit' ? 'CONVOY IN TRANSIT' : 'BUFFER SECURED'}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{depot.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{depot.focusOutbreak}</p>

              <div className="mt-3 bg-slate-50 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">Primary Staged Commodity:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-sans">{depot.commodity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">Staged Buffer Units:</span>
                  <span className="font-bold text-blue-700 dark:text-cyan-400 text-sm">
                    {depot.stagedUnits.toLocaleString()} Units ({depot.bufferDays} Days Runway)
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">Thermal Reading:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ThermometerSnowflake className="w-3 h-3" />
                    <span>+{depot.temperatureCelsius}°C Safe</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
              <span>Inspected {depot.lastInspection}</span>
              <button
                onClick={() => {
                  showToast(`Scanned RFID pallet payload for ${depot.name}: 100% verified.`, 'info');
                }}
                className="text-blue-600 hover:text-blue-700 dark:text-cyan-400 font-semibold cursor-pointer"
              >
                Inspect Pallet Tags &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Manifest Generation Modal */}
      {isManifestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0F172A] w-full max-w-xl rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Forward-Deployment Logistics Manifest Generator
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsManifestModalOpen(false);
                  setManifestGenerated(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {!manifestGenerated ? (
                <>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Destination Health Zone
                    </label>
                    <select
                      value={selectedTargetRegion}
                      onChange={(e) => setSelectedTargetRegion(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Lake Victoria Basin (C42)">Lake Victoria Basin (Kisumu Cluster C42)</option>
                      <option value="Northern Delta & Tana River (C07)">Northern Delta &amp; Tana River (Garissa C07)</option>
                      <option value="Turkana Desert Corridor (C23)">Turkana Desert Corridor (Lodwar C23)</option>
                      <option value="Coastal Maritime Belt (C01)">Coastal Maritime Belt (Mombasa C01)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Commodity Allocation
                    </label>
                    <select
                      value={selectedCommodity}
                      onChange={(e) => setSelectedCommodity(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Amoxicillin 250mg DT">Amoxicillin 250mg DT (Class I Pediatric Antibiotic)</option>
                      <option value="Artemether/Lumefantrine + mRDT">Artemether/Lumefantrine 20/120mg + Rapid Tests</option>
                      <option value="Oral Cholera Vaccine (OCV)">Oral Cholera Vaccine (OCV) 2-Dose Vials</option>
                      <option value="Pediatric IV Normal Saline">Pediatric IV Normal Saline 500ml Infusion</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Buffer Quantity: <span className="font-bold text-blue-600 dark:text-cyan-400 font-mono">{selectedUnits.toLocaleString()} Packs</span>
                    </label>
                    <input
                      type="range"
                      min="1000"
                      max="20000"
                      step="1000"
                      value={selectedUnits}
                      onChange={(e) => setSelectedUnits(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Transport Corridor &amp; Fleet Mode
                    </label>
                    <select
                      value={transportMode}
                      onChange={(e) => setTransportMode(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Armored Refrigerated Convoy (Tier-1)">Armored Refrigerated Convoy (Tier-1 Cold-Chain)</option>
                      <option value="Islanded Solar Cargo Drone (Vertiport)">Islanded Solar Cargo Drone (Garissa Vertiport)</option>
                      <option value="Lake Victoria Emergency River Boat">Lake Victoria Emergency River Boat (Express Watercraft)</option>
                    </select>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                    <button
                      onClick={() => setIsManifestModalOpen(false)}
                      className="px-4 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleGenerateManifest}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Compile &amp; Authorize Manifest</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800 space-y-2">
                    <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Manifest Compiled: #{manifestGenerated.id}</span>
                      </span>
                      <span className="font-mono text-[10px] bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded">
                        SEALED
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-700 dark:text-slate-300 pt-1">
                      <div>Destination: <strong>{manifestGenerated.targetRegion}</strong></div>
                      <div>Commodity: <strong>{manifestGenerated.commodity}</strong></div>
                      <div>Units: <strong>{manifestGenerated.units.toLocaleString()}</strong></div>
                      <div>Mode: <strong>{manifestGenerated.transportMode}</strong></div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 break-all pt-1 border-t border-emerald-200 dark:border-emerald-900">
                      Digest: {manifestGenerated.sha256Digest}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleDownloadManifest}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download JSON Manifest</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsManifestModalOpen(false);
                        setManifestGenerated(null);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold cursor-pointer"
                    >
                      Close &amp; View Depots
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
