import React from 'react';
import {
  TrendingDown,
  ShieldCheck,
  Zap,
  HeartHandshake,
  CheckCircle2,
  Building,
  Quote,
} from 'lucide-react';

export const ImpactResults: React.FC = () => {
  const stats = [
    {
      value: '41%',
      label: 'Reduction in Stock-Outs',
      detail: 'Primary care stock-out crises dropped by 41% across 2,840 facilities within the first 6 months of deployment.',
      icon: TrendingDown,
      color: 'text-blue-600',
    },
    {
      value: '99.4%',
      label: 'Cold-Chain Lock',
      detail: 'Excursions outside +2°C to +8°C reduced to under 0.6% using automated sensor alerts and preventative rerouting.',
      icon: ShieldCheck,
      color: 'text-emerald-600',
    },
    {
      value: '8.6x',
      label: 'Faster Redistribution',
      detail: 'Peer-to-peer inter-facility transfer orders generated and dispatched in <90 seconds vs. 13-day manual procurement cycles.',
      icon: Zap,
      color: 'text-blue-600',
    },
    {
      value: '1.2M+',
      label: 'Patient Days Averted',
      detail: 'Over 1,200,000 preventable stock-out patient days averted across maternal, antibiotic, and pediatric treatments.',
      icon: HeartHandshake,
      color: 'text-emerald-600',
    },
  ];

  const caseStudies = [
    {
      title: 'Coastal Region Pediatric Antibiotic Surge',
      region: 'Coast Health Sector • 18 Facilities',
      result: 'Zero Dispensary Stock-outs During Influx',
      description:
        'When an unseasonal spike in pediatric respiratory presentations exhausted local clinics, VitaGrid autonomously detected the burn-rate velocity at Day 3 and generated a 3,200-unit Amoxicillin redistribution order from Mombasa Regional Depot, averting stock-out 72 hours before crisis.',
    },
    {
      title: 'Post-Monsoon Dengue & Malaria Preemptive Buffer',
      region: 'Rift Valley Basin • 42 Health Centers',
      result: '45,000 ACT Treatment Courses Positioned',
      description:
        'Correlating Copernicus meteorological precipitation data (+42% anomaly) with sentinel fever logs, VitaGrid raised an early warning R₀ 1.48 alert 14 days ahead of hospital admission peaks, positioning ACT and IV fluids before roads flooded.',
    },
    {
      title: 'Autonomous Drone Blood & Vaccine Cold Corridor',
      region: 'Garissa & Remote Pastoralist Enclaves',
      result: '100% On-Time Emergency Resupply',
      description:
        'Connected rural maternity dispensaries with regional blood banks and snake-venom antiserum depots via automated medical drone dispatch corridors, reducing critical delivery transit from 9 hours by road to 38 minutes.',
    },
  ];

  return (
    <section id="impact-section" className="py-20 bg-white border-b border-slate-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
            <span>MEASURABLE HEALTH OUTCOMES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Impact &amp; Empirical Results
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Proven outcomes documented across national health networks, showing tangible reductions in stock-outs,
            uninterrupted vaccine integrity, and rapid life-saving logistics.
          </p>
        </div>

        {/* Big Numbers Row (4 Stat Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 rounded-xl p-6 border border-slate-200/90 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      VERIFIED
                    </span>
                  </div>
                  <div className="text-4xl font-extrabold text-slate-900 tracking-tight mt-2 font-mono">
                    {item.value}
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {item.label}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-4 pt-3 border-t border-slate-200/60">
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Short Case-Style Descriptions Grid (3 Cases) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {caseStudies.map((cs, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 block w-fit mb-3">
                  CASE STUDY 0{idx + 1} • {cs.region}
                </span>

                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {cs.title}
                </h3>

                <div className="text-xs font-semibold text-emerald-700 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{cs.result}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {cs.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Verified Field Audit</span>
                <span className="text-blue-600 font-semibold">MoH Validated</span>
              </div>
            </div>
          ))}
        </div>

        {/* Ministry-Style Testimonial Quote & Official Seal Badge */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-900 to-indigo-950 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
            {/* Avatar / Seal */}
            <div className="shrink-0 text-center">
              <div className="w-20 h-20 rounded-full bg-blue-800 border-2 border-blue-400/40 flex items-center justify-center text-white text-xl font-extrabold mx-auto shadow-inner">
                VR
              </div>
              <div className="mt-2 text-xs font-bold text-blue-200 font-mono uppercase tracking-wider">
                OFFICIAL SEAL
              </div>
            </div>

            {/* Quote content */}
            <div className="space-y-3 text-center md:text-left">
              <Quote className="w-8 h-8 text-blue-400 opacity-60 mx-auto md:mx-0" />
              <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed italic">
                &ldquo;VitaGrid transformed our national public health supply chain from reactive, crisis-driven firefighting
                into predictive, mathematical precision. For the first time across 2,840 remote dispensaries,
                our clinicians can count on medicine availability before the first patient arrives.&rdquo;
              </p>
              <div className="pt-2">
                <div className="font-extrabold text-white text-sm sm:text-base">
                  Dr. V. Rao, MD, MPH
                </div>
                <div className="text-xs text-blue-300 font-mono">
                  National Director of Healthcare Logistics • Republic Health Grid • Ministry of Health &amp; Family Welfare
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
