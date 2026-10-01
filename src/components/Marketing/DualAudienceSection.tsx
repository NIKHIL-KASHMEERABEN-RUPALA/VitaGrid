import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Building2, Globe } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface DualAudienceSectionProps {
  onOpenConsole: () => void;
  onRequestAccess: () => void;
}

export const DualAudienceSection: React.FC<DualAudienceSectionProps> = ({
  onOpenConsole,
  onRequestAccess,
}) => {
  return (
    <section id="audiences-section" className="py-20 bg-white border-b border-slate-200/90 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: National / Regional Health Authorities */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="bg-blue-50/40 rounded-xl p-7 border border-blue-200 shadow-2xs glow-card flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded shadow-2xs">
                  SOVEREIGN LEADERSHIP
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
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
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-md shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer hover:scale-102 active:scale-98"
              >
                <span>Request National Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: Frontline PHC Workers & District Officers */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="bg-slate-50/70 rounded-xl p-7 border border-slate-200/90 shadow-2xs glow-card flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded">
                  FRONTLINE OPERATIONS
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};
