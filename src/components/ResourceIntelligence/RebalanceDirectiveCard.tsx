import React, { useState } from 'react';
import { Bot, GitFork, UserCheck, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { RebalanceDirective, FacilityLoad } from '../../types/resourceIntel';

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
  const [isExecuting, setIsExecuting] = useState(false);
  const [isExecuted, setIsExecuted] = useState(directive.status === 'executed');
  const [isProposed, setIsProposed] = useState(false);

  const handleSimulateAndExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setIsExecuted(true);
      onExecuteTransfer(directive.id);
    }, 700);
  };

  const handlePropose = () => {
    setIsProposed(true);
    onProposeToDirector(directive.id);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center text-blue-600">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider font-mono">
              AI REBALANCE DIRECTIVE
            </span>
          </div>

          <span className="bg-blue-50 text-blue-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-blue-200">
            CONFIDENCE: {directive.confidence}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {directive.title}
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {directive.description}
          </p>
        </div>

        {/* Structured Spec Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 space-y-2.5 text-xs font-mono">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 font-medium">Source Node:</span>
            <span className="font-bold text-slate-900 text-right">
              {directive.sourceNode}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-slate-500 font-medium">Transfer Resource:</span>
            <span className="font-bold text-blue-700 text-right font-sans">
              {directive.transferResource}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-slate-500 font-medium">Transit Corridor:</span>
            <span className="font-bold text-slate-900 text-right">
              {directive.transitCorridor}
            </span>
          </div>
        </div>

        {/* Dynamic Context Notice */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-md p-2.5 text-[11px] text-blue-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>Automated Routing Verification:</strong> Road corridor clear. Clinician fatigue index in Lodwar projected to drop from <strong>0.84 → 0.48</strong> post-arrival.
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-slate-100 mt-4">
        {isExecuted ? (
          <div className="w-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs py-2 px-3 rounded-md flex items-center justify-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Transfer Dispatched (ETA 2.4h on A1 Corridor)</span>
          </div>
        ) : (
          <button
            onClick={handleSimulateAndExecute}
            disabled={isExecuting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded-md shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <GitFork className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
            <span>
              {isExecuting ? 'Simulating Dynamic Load...' : 'Simulate & Execute Transfer'}
            </span>
          </button>
        )}

        {isProposed ? (
          <div className="w-full text-center text-xs font-medium text-slate-500 py-1.5">
            ✓ Logged in Ministerial Human Approvals Queue
          </div>
        ) : (
          <button
            onClick={handlePropose}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Propose to National Director</span>
          </button>
        )}
      </div>
    </div>
  );
};
