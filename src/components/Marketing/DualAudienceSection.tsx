import React from 'react';
import { ArrowRight, CheckCircle2, Building2, Globe } from 'lucide-react';

interface DualAudienceSectionProps {
  onOpenConsole: () => void;
  onRequestAccess: () => void;
}

export const DualAudienceSection: React.FC<DualAudienceSectionProps> = ({
  onOpenConsole,
  onRequestAccess,
}) => {
  return (
    <section id="audiences-section" className="py-20 bg-white border-b border-slate-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: National / Regional Health Authorities */}
          <div className="bg-blue-50/40 rounded-xl p-7 border border-blue-200 shadow-2xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded shadow-2xs">
                  SOVEREIGN LEADERSHIP
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  National / Regional Health Authorities
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Macro-level visibility, outbreak containment, and strategic stockpiling across all national primary healthcare tiers.
                </p>
              </div>

              <div className="space-y-2 pt-1 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Macro-level visibility across 2,840 connected health facilities</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Rapid outbreak containment with 14-day early warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Strategic stockpiling and multi-echelon supply allocation</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-blue-200/80">
              <button
                onClick={onRequestAccess}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-md shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Request National Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Frontline PHC Workers & District Officers */}
          <div className="bg-slate-50/70 rounded-xl p-7 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded">
                  FRONTLINE OPERATIONS
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  Frontline PHC Workers &amp; District Officers
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Automated stock replenishment, reduced paperwork, and rapid emergency response for primary healthcare centers.
                </p>
              </div>

              <div className="space-y-2 pt-1 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Automated stock replenishment before dispensary shelves run dry</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Reduced paperwork with automated telemetry ingestion</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Fast emergency response with automated drone &amp; ground fleet tracking</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200/80">
              <button
                onClick={onOpenConsole}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors group cursor-pointer"
              >
                <span>Explore Frontline Console Demo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
