import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  Check,
  X,
  ShieldCheck,
  Clock,
  AlertTriangle,
  ArrowRight,
  Lock,
  RotateCw,
  Key,
  Undo2,
  FileCheck2,
} from 'lucide-react';
import {
  fetchPendingDockets,
  authorizeActionDocket,
  rollbackActionDocket,
  ActionDocketItem,
} from '../../services/backendApi';

interface HumanApprovalsViewProps {
  onAuthorizeProposal?: (proposalId: string) => void;
  onExecuteProtocol?: (protocolId: string) => void;
}

export const HumanApprovalsView: React.FC<HumanApprovalsViewProps> = ({
  onAuthorizeProposal,
  onExecuteProtocol,
}) => {
  const [dockets, setDockets] = useState<ActionDocketItem[]>([]);
  const [authorizedDockets, setAuthorizedDockets] = useState<Record<string, { signature: string; rollbackToken: string; timestamp: number }>>({});
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadDockets();
  }, []);

  const loadDockets = async () => {
    try {
      const items = await fetchPendingDockets();
      setDockets(items);
    } catch (e) {
      console.warn('Using fallback dockets.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAuthorize = async (docketId: string) => {
    setIsProcessing((prev) => ({ ...prev, [docketId]: true }));
    try {
      const res = await authorizeActionDocket(docketId, 'DR_V_RAO', 'National Health Director');
      setAuthorizedDockets((prev) => ({
        ...prev,
        [docketId]: {
          signature: res.cryptographic_signature,
          rollbackToken: res.rollback_token,
          timestamp: Date.now(),
        },
      }));
      showToast(`Action Docket #${docketId} Authorized: ECDSA Signature & Rollback Token generated.`);
      if (docketId.includes('842') && onAuthorizeProposal) {
        onAuthorizeProposal(docketId);
      } else if (onExecuteProtocol) {
        onExecuteProtocol(docketId);
      }
    } catch (err) {
      showToast(`Authorization failed for #${docketId}`);
    } finally {
      setIsProcessing((prev) => ({ ...prev, [docketId]: false }));
    }
  };

  const handleRollback = async (docketId: string, token: string) => {
    setIsProcessing((prev) => ({ ...prev, [docketId]: true }));
    try {
      await rollbackActionDocket(docketId, token, 'Ministerial Abort Directive');
      setAuthorizedDockets((prev) => {
        const copy = { ...prev };
        delete copy[docketId];
        return copy;
      });
      showToast(`Action Docket #${docketId} Rolled Back: Mission aborted and logged to audit ledger.`);
    } catch (err) {
      showToast(`Rollback failed for #${docketId}`);
    } finally {
      setIsProcessing((prev) => ({ ...prev, [docketId]: false }));
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1 text-[11px] font-bold tracking-wider uppercase font-mono">
            <div className="flex items-center gap-1.5 text-purple-700">
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>SOVEREIGN GOVERNANCE &amp; HUMAN-IN-THE-LOOP AUDIT</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-mono">FIPS 140-3 RULE A-42 ACTIVE</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Human Approvals &amp; Executive Sign-off Ledger
          </h1>

          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Autonomous multi-agent algorithmic proposals requiring statutory Ministerial Director authorization. No autonomous logistics dispatch is permitted without an ECDSA cryptographic signature.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
            <span className="font-semibold text-slate-700">Pending Review:</span>
            <span className="bg-red-100 text-red-700 font-extrabold text-[11px] px-2 py-0.5 rounded-full">
              {dockets.length - Object.keys(authorizedDockets).length} Urgent
            </span>
          </div>
        </div>
      </div>

      {/* Approvals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dockets.map((docket) => {
          const authData = authorizedDockets[docket.docket_id];
          const isAuthorized = !!authData;
          const loading = !!isProcessing[docket.docket_id];

          return (
            <div
              key={docket.docket_id}
              className={`rounded-xl border p-5 shadow-2xs flex flex-col justify-between transition-all ${
                isAuthorized
                  ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-200'
                  : 'bg-white border-slate-200/90'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border font-mono ${
                      docket.action_type === 'STOCK_REBALANCE'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {docket.action_type.replace('_', ' ')}
                  </span>
                  <span className="font-mono text-xs text-slate-400">ID: {docket.docket_id}</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{docket.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {docket.payload.justification || 'Autonomous multi-echelon transfer generated to mitigate imminent stockout.'}
                  </p>
                </div>

                {/* Algorithmic Details Box */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-1.5 text-xs font-sans">
                  <div className="flex justify-between text-slate-600">
                    <span>Originating Agent:</span>
                    <span className="font-bold font-mono text-slate-900">{docket.originating_agent}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Commodity &amp; Units:</span>
                    <span className="font-bold text-blue-700">{docket.payload.commodity} ({docket.payload.units?.toLocaleString()} units)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Transit ETA:</span>
                    <span className="font-bold text-emerald-700">{docket.payload.transit_eta_hours || 1.2} Hours via Road Fleet</span>
                  </div>
                </div>

                {/* Signed Certificate View (Shown when authorized) */}
                {isAuthorized && (
                  <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs space-y-1.5 font-mono text-[11px] animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-emerald-800 font-bold">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>MINISTERIAL SIGN-OFF EXECUTED</span>
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                        APPENDED TO LEDGER
                      </span>
                    </div>
                    <div className="truncate text-slate-600">
                      Signature: <span className="text-blue-700">{authData.signature.slice(0, 32)}...</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-100">
                      <span>Rollback Token: <strong className="text-amber-700">{authData.rollbackToken}</strong></span>
                      <button
                        onClick={() => handleRollback(docket.docket_id, authData.rollbackToken)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 text-[10px] font-bold flex items-center gap-1 underline cursor-pointer"
                      >
                        <Undo2 className="w-3 h-3" />
                        <span>Rollback Directive</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button Row */}
              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  {isAuthorized ? 'Status: DISPATCHED & ACTIVE' : 'SLA Cutoff: Today 18:00 UTC+3'}
                </span>

                {!isAuthorized ? (
                  <button
                    onClick={() => handleAuthorize(docket.docket_id)}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {loading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                    <span>Authorize with Cryptographic ECDSA</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <Check className="w-3.5 h-3.5" />
                    <span>Authorized by Dr. V. Rao</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
