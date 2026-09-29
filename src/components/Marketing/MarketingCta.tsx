import React from 'react';
import { ArrowRight, Calendar, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

interface MarketingCtaProps {
  onRequestAccess: () => void;
  onScheduleBriefing: () => void;
  onOpenConsole?: () => void;
}

export const MarketingCta: React.FC<MarketingCtaProps> = ({
  onRequestAccess,
  onScheduleBriefing,
  onOpenConsole,
}) => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/90 relative overflow-hidden">
      {/* Subtle Grid */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#94a3b8 0.75px, transparent 0.75px), radial-gradient(#94a3b8 0.75px, #F8F9FB 0.75px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold tracking-wider font-mono uppercase mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>SOVEREIGN DEPLOYMENT READY • v4.12</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Ready to strengthen national health resilience?
        </h2>

        <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Partner with our sovereign engineering team to connect your regional and primary health facilities,
          activate predictive stock-out prevention, and protect vital medical supply chains.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onRequestAccess}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-7 py-3.5 rounded-lg shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
          >
            <span>Request National Access</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onScheduleBriefing}
            className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Schedule Ministerial Briefing</span>
          </button>

          {onOpenConsole && (
            <button
              onClick={onOpenConsole}
              className="w-full sm:w-auto bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-semibold text-xs sm:text-sm px-5 py-3.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Live Sandbox</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Air-gapped on-soil deployment options</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Formal government MoU &amp; security audit included</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Interoperable with DHIS2, OpenLMIS &amp; FHIR</span>
          </div>
        </div>
      </div>
    </section>
  );
};
