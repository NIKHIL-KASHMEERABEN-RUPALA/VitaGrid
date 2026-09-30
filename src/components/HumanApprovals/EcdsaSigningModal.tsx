import React, { useState, useEffect } from 'react';
import {
  Key,
  ShieldCheck,
  CheckCircle2,
  RotateCw,
  X,
  FileCheck2,
  Lock,
  Cpu,
  Layers,
} from 'lucide-react';
import { ActionDocketItem } from '../../services/backendApi';

interface EcdsaSigningModalProps {
  isOpen: boolean;
  onClose: () => void;
  docket: ActionDocketItem | null;
  onSignComplete: (docketId: string, signature: string, rollbackToken: string) => void;
}

export const EcdsaSigningModal: React.FC<EcdsaSigningModalProps> = ({
  isOpen,
  onClose,
  docket,
  onSignComplete,
}) => {
  const [signingStep, setSigningStep] = useState<number>(0); // 0: ready, 1: hashing, 2: signing, 3: completed
  const [signature, setSignature] = useState<string>('');
  const [rollbackToken, setRollbackToken] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setSigningStep(0);
      setSignature('');
      setRollbackToken('');
    }
  }, [isOpen]);

  if (!isOpen || !docket) return null;

  const handleStartSigning = () => {
    setSigningStep(1);

    setTimeout(() => {
      setSigningStep(2);
    }, 900);

    setTimeout(() => {
      const generatedSig = `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;
      const generatedToken = `RTK-${Math.floor(100000 + Math.random() * 900000)}`;

      setSignature(generatedSig);
      setRollbackToken(generatedToken);
      setSigningStep(3);
    }, 2100);
  };

  const handleFinish = () => {
    onSignComplete(docket.docket_id, signature, rollbackToken);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0F172A] w-full max-w-xl rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 dark:bg-purple-700 flex items-center justify-center text-white shadow-xs">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                FIPS 140-3 LEVEL 4 HSM ENCLAVE
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Ministerial ECDSA Cryptographic Sign-Off
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Docket Spec Card */}
          <div className="bg-purple-50/50 dark:bg-purple-950/30 rounded-xl p-3.5 border border-purple-200/80 dark:border-purple-900/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-950 dark:text-purple-200 text-xs">
                Docket #{docket.docket_id}: {docket.title}
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                {docket.action_type}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              {docket.payload.justification || 'Autonomous multi-echelon transfer generated to mitigate imminent stockout.'}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-purple-200/60 dark:border-purple-900/40 text-[11px] font-mono text-slate-600 dark:text-slate-400">
              <div>
                Commodity: <strong className="text-slate-900 dark:text-white">{docket.payload.commodity}</strong>
              </div>
              <div>
                Units: <strong className="text-blue-700 dark:text-cyan-400">{docket.payload.units?.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Cryptographic Parameters Grid */}
          <div className="grid grid-cols-2 gap-2.5 font-mono text-[11px]">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800">
              <div className="text-slate-400 dark:text-slate-500 text-[10px]">AUTHORIZED SIGNATORY</div>
              <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Dr. V. Rao</div>
              <div className="text-slate-500 text-[10px]">National Health Director</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800">
              <div className="text-slate-400 dark:text-slate-500 text-[10px]">ELLIPTIC CURVE</div>
              <div className="font-bold text-purple-700 dark:text-purple-400 mt-0.5">secp256k1 (256-bit)</div>
              <div className="text-slate-500 text-[10px]">Deterministic Nonce RFC 6979</div>
            </div>
          </div>

          {/* Signing Status Flow */}
          {signingStep > 0 && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 space-y-2.5 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">1. SHA-256 Docket Hash</span>
                {signingStep >= 1 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>0x7a29...4e1b</span>
                  </span>
                ) : (
                  <span className="text-slate-400">QUEUED</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">2. Hardware Key Enclave Handshake</span>
                {signingStep >= 2 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>HSM Verified</span>
                  </span>
                ) : signingStep === 1 ? (
                  <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1 animate-pulse">
                    <RotateCw className="w-3 h-3 animate-spin" />
                    <span>Enclave Signing...</span>
                  </span>
                ) : (
                  <span className="text-slate-400">QUEUED</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">3. Sovereign Audit Ledger Block Stamp</span>
                {signingStep === 3 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Block #1,842,904 Committed</span>
                  </span>
                ) : signingStep === 2 ? (
                  <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1 animate-pulse">
                    <RotateCw className="w-3 h-3 animate-spin" />
                    <span>Stamping Ledger...</span>
                  </span>
                ) : (
                  <span className="text-slate-400">QUEUED</span>
                )}
              </div>
            </div>
          )}

          {/* Generated Certificate preview */}
          {signingStep === 3 && (
            <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Statutory ECDSA Signature Generated</span>
                </span>
                <span className="font-mono text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded">
                  AUTHENTIC
                </span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-slate-900 font-mono text-[10px] break-all text-blue-700 dark:text-cyan-400 border border-emerald-200 dark:border-emerald-900">
                {signature}
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-300">
                <span>Rollback Token: <strong className="text-amber-700 dark:text-amber-400">{rollbackToken}</strong></span>
                <span className="text-slate-400">TTL: 24h</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>

          {signingStep === 0 && (
            <button
              onClick={handleStartSigning}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Sign with Private Key</span>
            </button>
          )}

          {signingStep > 0 && signingStep < 3 && (
            <button
              disabled
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-400 text-white rounded-lg text-xs font-bold shadow-xs cursor-wait"
            >
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>Cryptographic Computation...</span>
            </button>
          )}

          {signingStep === 3 && (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Commit Sign-Off &amp; Close</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
