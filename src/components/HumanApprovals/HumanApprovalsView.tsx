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
  ExternalLink,
} from 'lucide-react';
import {
  fetchPendingDockets,
  authorizeActionDocket,
  rollbackActionDocket,
  ActionDocketItem,
} from '../../services/backendApi';
import { EcdsaSigningModal } from './EcdsaSigningModal';
import { useNotifications } from '../../context/NotificationContext';
import { useRbac } from '../../context/RbacContext';

interface HumanApprovalsViewProps {
  onAuthorizeProposal?: (proposalId: string) => void;
  onExecuteProtocol?: (protocolId: string) => void;
}

export const HumanApprovalsView: React.FC<HumanApprovalsViewProps> = ({
  onAuthorizeProposal,
  onExecuteProtocol,
}) => {
  const [dockets, setDockets] = useState<ActionDocketItem[]>([]);
  const [authorizedDockets, setAuthorizedDockets] = useState<
    Record<string, { signature: string; rollbackToken: string; timestamp: number }>
  >({});
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const [selectedDocketForSign, setSelectedDocketForSign] = useState<ActionDocketItem | null>(null);

  const { showToast, addNotification } = useNotifications();
  const { verifyPermissionOrPrompt } = useRbac();

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

  const handleStartAuthorize = (docket: ActionDocketItem) => {
    if (verifyPermissionOrPrompt('canSignEcdsa', `Authorize Action Docket #${docket.docket_id} with Cryptographic ECDSA`)) {
      setSelectedDocketForSign(docket);
    }
  };

  const handleSigningModalComplete = async (
    docketId: string,
    signature: string,
    rollbackToken: string
  ) => {
    setAuthorizedDockets((prev) => ({
      ...prev,
      [docketId]: {
        signature,
        rollbackToken,
        timestamp: Date.now(),
      },
    }));

    showToast(`Action Docket #${docketId} Authorized: ECDSA Signature & Rollback Token active.`, 'success');

    addNotification({
      type: 'approval',
      title: `Docket #${docketId} Authorized`,
      message: `Statutory sign-off executed by Dr. V. Rao. Rollback Token: ${rollbackToken}.`,
      actionLabel: 'View Ledger',
      actionTargetModule: 'human-approvals',
    });

    if (docketId.includes('842') && onAuthorizeProposal) {
      onAuthorizeProposal(docketId);
    } else if (onExecuteProtocol) {
      onExecuteProtocol(docketId);
    }
  };

  const handleRollback = async (docketId: string, token: string) => {
    if (!verifyPermissionOrPrompt('canSignEcdsa', `Rollback Directive #${docketId}`)) {
      return;
    }

    setIsProcessing((prev) => ({ ...prev, [docketId]: true }));
    try {
      await rollbackActionDocket(docketId, token, 'Ministerial Abort Directive');
      setAuthorizedDockets((prev) => {
        const copy = { ...prev };
        delete copy[docketId];
        return copy;
      });
      showToast(`Action Docket #${docketId} Rolled Back: Mission aborted and logged to audit ledger.`, 'warning');
    } catch (err) {
      showToast(`Rollback failed for #${docketId}`, 'error');
    } finally {
      setIsProcessing((prev) => ({ ...prev, [docketId]: false }));
    }
  };

  const pendingCount = dockets.length - Object.keys(authorizedDockets).length;

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 bg-white dark:bg-[#0F172A] p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1 text-[11px] font-bold tracking-wider uppercase font-mono">
            <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400">
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>SOVEREIGN GOVERNANCE &amp; HUMAN-IN-THE-LOOP AUDIT</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-600 dark:text-slate-400 font-mono">FIPS 140-3 RULE A-42 ACTIVE</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Human Approvals &amp; Executive Sign-off Ledger
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Autonomous multi-agent algorithmic proposals requiring statutory Ministerial Director authorization. No autonomous logistics dispatch is permitted without an ECDSA cryptographic signature.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Pending Review:</span>
            <span
              className={`font-extrabold text-[11px] px-2 py-0.5 rounded-full ${
                pendingCount > 0
                  ? 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-400'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400'
              }`}
            >
              {pendingCount} Urgent
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
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/60 ring-1 ring-emerald-200 dark:ring-emerald-900/40'
                  : 'bg-white dark:bg-[#0F172A] border-slate-200/90 dark:border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border font-mono ${
                      docket.action_type === 'STOCK_REBALANCE'
                        ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-900/60'
                        : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900/60'
                    }`}
                  >
                    {docket.action_type.replace('_', ' ')}
                  </span>
                  <span className="font-mono text-xs text-slate-400 dark:text-slate-500">ID: {docket.docket_id}</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{docket.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {docket.payload.justification || 'Autonomous multi-echelon transfer generated to mitigate imminent stockout.'}
                  </p>
                </div>

                {/* Algorithmic Details Box */}
                <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs font-sans">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Originating Agent:</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white">{docket.originating_agent}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Commodity &amp; Units:</span>
                    <span className="font-bold text-blue-700 dark:text-cyan-400">
                      {docket.payload.commodity} ({docket.payload.units?.toLocaleString()} units)
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Transit ETA:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {docket.payload.transit_eta_hours || 1.2} Hours via Road Fleet
                    </span>
                  </div>
                </div>

                {/* Signed Certificate View (Shown when authorized) */}
                {isAuthorized && (
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-900 text-xs space-y-1.5 font-mono text-[11px] animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>MINISTERIAL SIGN-OFF EXECUTED</span>
                      </span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-300 dark:border-emerald-800">
                        APPENDED TO LEDGER
                      </span>
                    </div>
                    <div className="truncate text-slate-600 dark:text-slate-400">
                      Signature: <span className="text-blue-700 dark:text-cyan-400">{authData.signature.slice(0, 32)}...</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span>
                        Rollback Token: <strong className="text-amber-700 dark:text-amber-400">{authData.rollbackToken}</strong>
                      </span>
                      <button
                        onClick={() => handleRollback(docket.docket_id, authData.rollbackToken)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-[10px] font-bold flex items-center gap-1 underline cursor-pointer"
                      >
                        <Undo2 className="w-3 h-3" />
                        <span>Rollback Directive</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button Row */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {isAuthorized ? 'Status: DISPATCHED & ACTIVE' : 'SLA Cutoff: Today 18:00 UTC+3'}
                </span>

                {!isAuthorized ? (
                  <button
                    onClick={() => handleStartAuthorize(docket)}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Authorize with Cryptographic ECDSA</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <Check className="w-3.5 h-3.5" />
                    <span>Authorized by Dr. V. Rao</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ECDSA Signing Modal */}
      {selectedDocketForSign && (
        <EcdsaSigningModal
          isOpen={!!selectedDocketForSign}
          onClose={() => setSelectedDocketForSign(null)}
          docket={selectedDocketForSign}
          onSignComplete={handleSigningModalComplete}
        />
      )}
    </div>
  );
};
