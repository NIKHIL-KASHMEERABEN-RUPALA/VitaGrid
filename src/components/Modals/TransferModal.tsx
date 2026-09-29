import React, { useState } from 'react';
import { X, Check, ShieldCheck, ArrowRight, Truck, AlertTriangle } from 'lucide-react';
import { TransferProposal } from '../../types/dashboard';

interface TransferModalProps {
  proposal: TransferProposal;
  isOpen: boolean;
  onClose: () => void;
  onAuthorize: (proposalId: string) => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  proposal,
  isOpen,
  onClose,
  onAuthorize,
}) => {
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authorized, setAuthorized] = useState(proposal.status === 'authorized');

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      setAuthorized(true);
      onAuthorize(proposal.id);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                EMERGENCY REBALANCE
              </span>
              <span className="font-mono text-xs text-slate-500 font-medium">#{proposal.id}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              Autonomous Stock Transfer Sign-off
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-red-50/70 border border-red-200 rounded-lg p-3 text-xs text-red-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{proposal.facility}</p>
              <p className="text-red-700 mt-0.5">
                Current inventory depleted to <strong>{proposal.currentStock} units</strong>. Projected runout in{' '}
                <strong>{proposal.runoutDays} days</strong> without rebalancing dispatch.
              </p>
            </div>
          </div>

          {/* Transfer Flow Visual */}
          <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Logistics Rebalance Route
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-500 font-medium">DONOR DEPOT</div>
                <div className="font-bold text-slate-900">{proposal.donorFacility}</div>
                <div className="text-[11px] text-emerald-600 font-medium">
                  {proposal.donorAvailable.toLocaleString()} units in reserve
                </div>
              </div>

              <div className="flex flex-col items-center px-4">
                <Truck className="w-4 h-4 text-blue-600 mb-0.5" />
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                  {proposal.donorDistanceKm} km
                </span>
              </div>

              <div className="space-y-0.5 text-right">
                <div className="text-[10px] text-slate-500 font-medium">DESTINATION</div>
                <div className="font-bold text-slate-900">{proposal.facility}</div>
                <div className="text-[11px] text-red-600 font-medium">
                  Receiving {proposal.transferAmount.toLocaleString()} units
                </div>
              </div>
            </div>
          </div>

          {/* Commodity Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-medium">Commodity</div>
              <div className="font-semibold text-slate-900 mt-0.5">{proposal.item}</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-medium">Cold Chain Integrity</div>
              <div className="font-semibold text-slate-900 mt-0.5">{proposal.coldChainRequirement}</div>
            </div>
          </div>

          {/* Cryptographic Ledger Verification */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded p-2.5 flex items-center gap-2 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="font-mono text-[10px] truncate">
              Signed by Sovereign Mesh: {proposal.hashSignature}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          {authorized ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
              <Check className="w-4 h-4" />
              Transfer Authorized &amp; Dispatched
            </div>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={isAuthorizing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              {isAuthorizing ? 'Authorizing On-Grid...' : 'Authorize Sovereign Rebalance'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
