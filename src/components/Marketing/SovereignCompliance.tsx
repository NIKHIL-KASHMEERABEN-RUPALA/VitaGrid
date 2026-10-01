import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Server,
  FileCheck,
  KeyRound,
  CheckCircle2,
  HardDrive,
  BadgeAlert,
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const SovereignCompliance: React.FC = () => {
  const complianceItems = [
    {
      title: '100% Sovereign Data Residency',
      badge: 'Zero Foreign Egress',
      description:
        'All patient telemetry, warehouse inventory, and clinical logs reside strictly on domestic sovereign infrastructure. VitaGrid guarantees that no raw health records or metadata cross national borders.',
      icon: Server,
    },
    {
      title: 'Air-Gapped & Offline Deployment',
      badge: 'Tier-III Certified',
      description:
        'Engineered for air-gapped sovereign military and public health networks. Decentralized edge nodes store localized SQLite replicas, allowing uninterrupted operation even during national telecom cutoffs.',
      icon: HardDrive,
    },
    {
      title: 'Hardware Enclave & Role-Based Encryption',
      badge: 'AES-256-GCM / TPM 2.0',
      description:
        'Cryptographic keys protected inside hardware security modules (HSMs). Strict role-based access control (RBAC) ensures only credentialed medical officers access sensitive facility reports.',
      icon: KeyRound,
    },
    {
      title: 'Immutable Cryptographic Audit Logs',
      badge: 'Statutory Rule A-42',
      description:
        'Every algorithmic forecast, multi-agent negotiation turn, and director approval token is sealed with SHA-256 hash chains, providing tamper-evident audit trails for ministerial inspection.',
      icon: FileCheck,
    },
    {
      title: 'ISO 27001 & HIPAA Compliance',
      badge: 'Certified Security',
      description:
        'Independently audited and certified against ISO/IEC 27001 information security standards and HIPAA technical safeguards for electronic protected health information (ePHI).',
      icon: ShieldCheck,
    },
    {
      title: 'Constitutional Human-in-the-Loop',
      badge: 'Zero Autonomous Risk',
      description:
        'Autonomous AI models are strictly advisory. No physical inventory redistribution, hospital staff reassignment, or clinical priority adjustment executes without verified human sign-off.',
      icon: Lock,
    },
  ];

  return (
    <section id="compliance-section" className="py-20 bg-[#F8F9FB] border-b border-slate-200/90 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 pulse-dot-blue" />
            <span>SOVEREIGN DATA INTEGRITY &amp; TRUST</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Security &amp; Sovereign Compliance
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Built from inception to respect national data borders, constitutional privacy laws,
            and ministerial command authority without reliance on proprietary foreign clouds.
          </p>
        </ScrollReveal>

        {/* 6 Grid Cards with Sequential Scroll Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {complianceItems.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 26, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-2xs glow-card transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {card.badge}
                    </span>
                    <div className="p-1.5 rounded-md bg-blue-50/70 border border-blue-100 text-blue-600 group-hover:scale-105 transition-transform shadow-2xs">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Sovereign Constitutional Standard</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">0{idx + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust & Certifications Strip */}
        <ScrollReveal
          direction="up"
          delay={0.2}
          className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs glow-card"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900">National Sovereign Security Seal</div>
              <div className="text-[11px] text-slate-500">Certified for deployment across public healthcare infrastructure</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
              ISO/IEC 27001:2022
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
              HIPAA SECURITY RULE
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
              FIPS 140-3 LEVEL 2
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              ZERO PII EGRESS CERTIFIED
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
