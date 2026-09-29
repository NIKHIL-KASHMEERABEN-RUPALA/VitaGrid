import React, { useState } from 'react';
import { X, Download, Printer, Check, FileText } from 'lucide-react';

interface BriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BriefingModal: React.FC<BriefingModalProps> = ({ isOpen, onClose }) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => {
      const element = document.createElement('a');
      const file = new Blob(
        [
          `REPUBLIC HEALTH GRID • SOVEREIGN EPIDEMIOLOGICAL WATCH BRIEFING
DATE: ${new Date().toISOString().split('T')[0]} (UTC+3)
DEFCON LEVEL: 4
OVERALL AVAILABILITY INDEX: 94.6% (Optimal)
SURGE BED ICU UTILIZATION: 78.2% (1,420 / 1,815)
CLINICIAN ROSTERING: 98.4% Live on-shift (14,920 personnel)
ACTIVE CRITICAL ALERTS: 03 (Kilifi County PHC-08 Stockout, Kisumu Vector Surge, Garissa Cold-Chain Flight)
CONFIDENTIAL - SOVEREIGN MINISTRY OF HEALTH & FAMILY WELFARE`,
        ],
        { type: 'text/plain' }
      );
      element.href = URL.createObjectURL(file);
      element.download = `VitaGrid_National_Briefing_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                National Epidemiological &amp; Supply Briefing
              </h2>
              <p className="text-xs text-slate-500">
                Republic Health Grid • Official Cabinet Executive Summary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Preview Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono bg-slate-50/50 border-y border-slate-100 flex-1">
          <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-2xs space-y-4 text-slate-800 font-sans">
            <div className="border-b border-slate-200 pb-3 flex justify-between items-start">
              <div>
                <div className="text-[10px] font-bold text-blue-700 tracking-wider uppercase">
                  SOVEREIGN BRIEFING • DEFCON 4 WATCH
                </div>
                <h1 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  Daily Health Operations Intelligence
                </h1>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Timestamp: 2026-09-27 13:45 UTC+3 • Classification: Confidential
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                SOVEREIGN AUDIT VERIFIED
              </span>
            </div>

            {/* Section 1: Executive KPI Summary */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                1. Sovereign Health Metric Summary
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed font-sans">
                National availability index currently holds at <strong>94.6%</strong> across all 47 counties (above sovereign minimum target of 92.0%). Surge bed occupancy is nominal at <strong>78.2%</strong> (1,420 of 1,815 ICU beds occupied) with 41 days of oxygen reserve headroom. Live clinician roster adherence stands at <strong>98.4%</strong> with 14,920 frontline medical officers verified on shift.
              </p>
            </div>

            {/* Section 2: Active Vulnerability Points */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                2. Imminent Stock &amp; Outbreak Signals
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>
                  <strong className="text-red-700">Kilifi PHC-08:</strong> Amoxicillin 250mg runout in 1.8 days. Fast-road logistics transfer #842 from Mombasa Hub (34 km) ready for deployment.
                </li>
                <li>
                  <strong className="text-amber-700">Kisumu Central Health Cluster:</strong> Pediatric vector &amp; rotavirus surge detected (+18% syndromic week-over-week). Automated IV re-allocation staged.
                </li>
                <li>
                  <strong className="text-blue-700">Garissa Drone Corridor:</strong> 2 autonomous drone units delivering urgent cold-chain rabies and insulin payloads (ETA 34m).
                </li>
              </ul>
            </div>

            {/* Section 3: Data Integrity */}
            <div className="bg-slate-100/70 p-3 rounded text-[11px] text-slate-600 font-mono">
              Consensus Node Hash: 0x9a88f...7702 | Zero PII Egress Checksum: PASSED | 2,840 PHC Nodes Connected
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              {downloaded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Downloaded
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Export Official Briefing (PDF)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
