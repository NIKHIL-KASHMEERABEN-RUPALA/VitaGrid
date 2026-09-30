import React from 'react';
import { ShieldAlert, X, Lock, CheckCircle2, UserCheck } from 'lucide-react';
import { useRbac } from '../../context/RbacContext';
import { ROLE_CONFIGS, UserRole } from '../../types/rbac';

export const PermissionDeniedModal: React.FC = () => {
  const { permissionModalState, closePermissionModal, currentRole, switchRole } = useRbac();

  if (!permissionModalState?.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0F172A] w-full max-w-md rounded-2xl border border-red-200 dark:border-red-900/60 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Top Warning Banner */}
        <div className="bg-red-500/10 dark:bg-red-950/30 p-4 border-b border-red-100 dark:border-red-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-red-600 dark:text-red-400 uppercase">
                FEDRAMP HIGH • ACCESS RESTRICTED
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Statutory Permission Required
              </h3>
            </div>
          </div>
          <button
            onClick={closePermissionModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Your active credential clearance does not possess statutory authorization to execute:
            </p>
            <div className="mt-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 font-mono text-red-700 dark:text-red-300 font-bold">
              {permissionModalState.actionName}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200/80 dark:border-slate-800 space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Required Role:</span>
              <span className="font-bold text-slate-900 dark:text-slate-200 font-sans">
                {permissionModalState.requiredRole}
              </span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Current Role:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 font-sans">
                {ROLE_CONFIGS[currentRole].title}
              </span>
            </div>
          </div>

          {/* Quick Demo Switcher */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Demo Clearance Override (Evaluation Portal):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  switchRole('national_director');
                  closePermissionModal();
                }}
                className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-left cursor-pointer flex items-center justify-between"
              >
                <span>Elevate to National Director</span>
                <UserCheck className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  switchRole('regional_commander');
                  closePermissionModal();
                }}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors text-left cursor-pointer flex items-center justify-between"
              >
                <span>Switch to Commander</span>
                <UserCheck className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={closePermissionModal}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Acknowledge &amp; Return
          </button>
        </div>
      </div>
    </div>
  );
};
