import React, { useState } from 'react';
import { Bot, GitFork, UserCheck, CheckCircle2, ShieldCheck } from 'lucide-react';
import { RebalanceDirective, FacilityLoad } from '../../types/resourceIntel';
import { TransferExecutionFlowModal } from './TransferExecutionFlowModal';
import { useRbac } from '../../context/RbacContext';
import { useNotifications } from '../../context/NotificationContext';

interface RebalanceDirectiveCardProps {
  directive: RebalanceDirective;
  selectedFacility?: FacilityLoad;
  onExecuteTransfer: (directiveId: string) => void;
  onProposeToDirector: (directiveId: string) => void;
}

export const RebalanceDirectiveCard: React.FC<RebalanceDirectiveCardProps> = ({
  directive,
  selectedFacility,
  onExecuteTransfer,
  onProposeToDirector,
}) => {
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false);
  const [isExecuted, setIsExecuted] = useState(directive.status === 'executed');
  const [isProposed, setIsProposed] = useState(false);

  const { verifyPermissionOrPrompt } = useRbac();
  const { showToast } = useNotifications();

  const handleSimulateAndExecute = () => {
    if (verifyPermissionOrPrompt('canExecuteTransfer', 'Simulate & Execute Inter-Facility Transfer')) {
      setIsExecutionModalOpen(true);
    }
  };

  const handleFlowComplete = () => {
    setIsExecuted(true);
    onExecuteTransfer(directive.id);
  };

  const handlePropose = () => {
    setIsProposed(true);
    onProposeToDirector(directive.id);
    showToast(`Directive #${directive.id} queued for National Director human review.`, 'info');
  };

  return (
    <>
      <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 flex flex-col justify-between h-full">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-cyan-400">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider font-mono">
                AI REBALANCE DIRECTIVE
              </span>
            </div>

            <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900/60">
              CONFIDENCE: {directive.confidence}
            </span>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              {directive.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {directive.description}
            </p>
          </div>

          {/* Structured Spec Box */}
          <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3.5 space-y-2.5 text-xs font-mono">
            <div className="flex justify-between items-start">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Source Node:</span>
              <span className="font-bold text-slate-900 dark:text-white text-right">
                {directive.sourceNode}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Transfer Resource:</span>
              <span className="font-bold text-blue-700 dark:text-cyan-400 text-right font-sans">
                {directive.transferResource}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Transit Corridor:</span>
              <span className="font-bold text-slate-900 dark:text-white text-right">
                {directive.transitCorridor}
              </span>
            </div>
          </div>

          {/* Dynamic Context Notice */}
          <div className="bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-lg p-3 text-[11px] text-blue-900 dark:text-cyan-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Automated Routing Verification:</strong> Corridor A1 verified clear. Clinician fatigue index in Lodwar projected to drop from <strong>0.84 &rarr; 0.48</strong> post-arrival.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
          {isExecuted ? (
            <div className="w-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Transfer Dispatched (Fleet #RL-09 in Transit)</span>
            </div>
          ) : (
            <button
              onClick={handleSimulateAndExecute}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Simulate &amp; Execute Transfer</span>
            </button>
          )}

          {isProposed ? (
            <div className="w-full text-center text-xs font-medium text-slate-500 dark:text-slate-400 py-1.5 font-mono">
              ✓ Logged in Ministerial Human Approvals Queue
            </div>
          ) : (
            <button
              onClick={handlePropose}
              className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Propose to National Director</span>
            </button>
          )}
        </div>
      </div>

      {/* Step-by-Step Execution Modal */}
      <TransferExecutionFlowModal
        isOpen={isExecutionModalOpen}
        onClose={() => setIsExecutionModalOpen(false)}
        directive={directive}
        facility={selectedFacility}
        onComplete={handleFlowComplete}
      />
    </>
  );
};
