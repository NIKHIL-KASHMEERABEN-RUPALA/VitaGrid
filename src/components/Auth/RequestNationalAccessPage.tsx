import React, { useState } from 'react';
import {
  Plus,
  ArrowRight,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  Mail,
  FileCheck2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  AlertTriangle,
  Fingerprint,
  FileText,
  BadgeAlert,
  Download,
  Copy,
  Check,
} from 'lucide-react';

interface RequestNationalAccessPageProps {
  onNavigateToLogin: () => void;
  onBackToHomepage: () => void;
  onSuccessSubmit?: (docket: {
    docketId: string;
    fullName: string;
    email: string;
    jurisdiction: string;
    role: string;
  }) => void;
}

export const RequestNationalAccessPage: React.FC<RequestNationalAccessPageProps> = ({
  onNavigateToLogin,
  onBackToHomepage,
  onSuccessSubmit,
}) => {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [email, setEmail] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [roleTier, setRoleTier] = useState('');
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [agreeMandate, setAgreeMandate] = useState(false);

  // UI state
  const [showPasscode, setShowPasscode] = useState(false);
  const [showConfirmPasscode, setShowConfirmPasscode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedDocket, setSubmittedDocket] = useState<{
    docketId: string;
    fullName: string;
    email: string;
    jurisdiction: string;
    role: string;
    timestamp: string;
  } | null>(null);
  const [hasCopiedDocket, setHasCopiedDocket] = useState(false);

  // Email validation checks
  const isCommercialEmail = (val: string): boolean => {
    const commercialDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'mail.com'];
    const lower = val.toLowerCase();
    return commercialDomains.some((d) => lower.includes(`@${d}`) || lower.endsWith(`@${d}`));
  };

  const isEmailWarning = isCommercialEmail(email);

  // Passcode validation rules
  const hasMinLength = passcode.length >= 12;
  const hasLetter = /[a-zA-Z]/.test(passcode);
  const hasNumber = /[0-9]/.test(passcode);
  const hasSymbol = /[^a-zA-Z0-9]/.test(passcode);
  const passcodesMatch = passcode.length > 0 && passcode === confirmPasscode;

  const handleFillDemo = () => {
    setFullName('Dr. Jane Mutua');
    setNationalId('MOH-8849201');
    setEmail('j.mutua@health.go.ke');
    setJurisdiction('Ministry of Health (HQ) – National Disease Surveillance Unit');
    setRoleTier('Chief Epidemiologist / Surveillance Director (Tier 1)');
    setPasscode('Sovereign#Grid2026!');
    setConfirmPasscode('Sovereign#Grid2026!');
    setAgreeMandate(true);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Full Name is required.');
      return;
    }
    if (!nationalId.trim()) {
      setErrorMessage('National ID / Staff ID is required.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Official Institutional Email is required.');
      return;
    }
    if (isCommercialEmail(email)) {
      setErrorMessage('Commercial email providers (gmail, yahoo, etc.) are strictly rejected. Please use an accredited institutional address.');
      return;
    }
    if (!jurisdiction) {
      setErrorMessage('Please select your Ministry or County Node jurisdiction.');
      return;
    }
    if (!roleTier) {
      setErrorMessage('Please select your Operational Role tier.');
      return;
    }
    if (!hasMinLength || !hasLetter || !hasNumber || !hasSymbol) {
      setErrorMessage('Passcode must be at least 12 characters and contain letters, numbers, and symbols.');
      return;
    }
    if (passcode !== confirmPasscode) {
      setErrorMessage('Passcodes do not match. Please verify your entries.');
      return;
    }
    if (!agreeMandate) {
      setErrorMessage('You must confirm agreement with the National Health Data Sovereignty Protocol & Zero-PII Egress Mandate.');
      return;
    }

    setIsSubmitting(true);

    // Simulate cryptographic credential reconciliation against FedRAMP High ministerial enclaves
    setTimeout(() => {
      const generatedDocketId = `REQ-2026-MOH-${Math.floor(100000 + Math.random() * 900000)}`;
      const docket = {
        docketId: generatedDocketId,
        fullName,
        email,
        jurisdiction,
        role: roleTier,
        timestamp: new Date().toISOString(),
      };
      setIsSubmitting(false);
      setSubmittedDocket(docket);
      if (onSuccessSubmit) {
        onSuccessSubmit(docket);
      }
    }, 950);
  };

  const handleCopyDocket = () => {
    if (submittedDocket) {
      navigator.clipboard.writeText(
        `VITAGRID GOV ACCESS DOCKET\nDocket ID: ${submittedDocket.docketId}\nApplicant: ${submittedDocket.fullName}\nEmail: ${submittedDocket.email}\nJurisdiction: ${submittedDocket.jurisdiction}\nRole Tier: ${submittedDocket.role}\nStatus: PROVISIONAL ENCLAVE REVIEW (6-12h)`
      );
      setHasCopiedDocket(true);
      setTimeout(() => setHasCopiedDocket(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between relative selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Light dotted background matching Login and VitaGrid platform */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1.25px, transparent 1.25px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0',
        }}
      />

      {/* Top Navigation & Workflow Banner */}
      <header className="relative z-20 w-full bg-white/90 backdrop-blur-xs border-b border-slate-200/90 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        {/* Left: Return actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToLogin}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors py-1 px-2.5 rounded-md hover:bg-slate-100 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={onBackToHomepage}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors py-1 px-2 cursor-pointer"
          >
            Homepage
          </button>
        </div>

        {/* Center: Workflow Route indicator */}
        <div className="hidden md:flex items-center gap-2 text-[11px] font-mono bg-slate-50 border border-slate-200 px-3 py-1 rounded-md text-slate-600 shadow-2xs">
          <button
            onClick={onBackToHomepage}
            className="hover:text-blue-600 hover:underline cursor-pointer"
          >
            Homepage
          </button>
          <span className="text-slate-400">→</span>
          <button
            onClick={onNavigateToLogin}
            className="hover:text-blue-600 hover:underline cursor-pointer font-medium"
          >
            Sign In Gateway
          </button>
          <span className="text-slate-400">→</span>
          <span className="text-blue-700 font-bold bg-blue-100/70 px-1.5 py-0.5 rounded">
            Request National Access
          </span>
        </div>

        {/* Right: Security info & 1-click test prefill */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={handleFillDemo}
            className="hidden sm:inline-flex items-center gap-1 text-[11px] text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-2 py-0.5 rounded font-mono transition-colors cursor-pointer"
            title="Auto-fill with sample accredited officer data for evaluation"
          >
            <FileText className="w-3 h-3 text-blue-600" />
            <span>Sample Officer Data</span>
          </button>

          <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200 text-[10px] tracking-wider uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            RESTRICTED ENCLAVE
          </span>
        </div>
      </header>

      {/* Main Centered Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 sm:py-10 my-auto">
        <div className="w-full max-w-[580px] bg-white rounded-xl shadow-[0_12px_40px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] border border-slate-200/90 p-6 sm:p-9 relative">
          {/* Top Badge: “OFFICIAL NATIONAL HEALTH GATEWAY” */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100/90 border border-slate-200/90 text-slate-700 text-[11px] font-mono font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-subtle"></span>
              <span>OFFICIAL NATIONAL HEALTH GATEWAY</span>
            </div>
          </div>

          {/* Card Header: VitaGrid GOV logo + red “RESTRICTED ACCESS” badge */}
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-500/20">
              <Plus className="w-5 h-5 stroke-[3]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">VitaGrid</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                GOV
              </span>
              {/* Red RESTRICTED ACCESS Badge */}
              <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                RESTRICTED ACCESS
              </span>
            </div>
          </div>

          {/* Title: Request National Access */}
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 text-center">
            Request National Access
          </h1>

          {/* Subtitle: “For accredited personnel from national and county health authorities” */}
          <p className="text-xs sm:text-[13px] text-slate-500 text-center mt-1 mb-5 font-normal">
            For accredited personnel from national and county health authorities
          </p>

          {/* Info Banner: Blue information box */}
          <div className="bg-blue-50/90 border border-blue-200/90 rounded-lg p-3.5 mb-6 text-xs text-blue-950 flex items-start gap-2.5 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-slate-700 font-normal">
              <strong className="font-semibold text-slate-900">Institutional verification required.</strong> Provisioning is strictly limited to accredited public health officers, epidemiologists, and facility directors.
            </p>
          </div>

          {/* Submission Success View if already submitted */}
          {submittedDocket ? (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-5 text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-2xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Access Request Docket Submitted
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Your request has entered sovereign cryptographic reconciliation. Provisional clearance turnaround is typically 6–12 hours.
                </p>

                <div className="mt-4 p-3 bg-white rounded-md border border-emerald-200/80 font-mono text-xs text-left space-y-1.5">
                  <div className="flex justify-between items-center text-slate-500 text-[11px] pb-1 border-b border-slate-100">
                    <span>DOCKET REGISTRATION NUMBER</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {submittedDocket.docketId}
                    </span>
                  </div>
                  <div className="text-slate-700 text-xs pt-1">
                    <span className="font-semibold">Officer:</span> {submittedDocket.fullName}
                  </div>
                  <div className="text-slate-700 text-xs">
                    <span className="font-semibold">Email:</span> {submittedDocket.email}
                  </div>
                  <div className="text-slate-700 text-xs">
                    <span className="font-semibold">Jurisdiction:</span> {submittedDocket.jurisdiction}
                  </div>
                  <div className="text-slate-700 text-xs">
                    <span className="font-semibold">Tier:</span> {submittedDocket.role}
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopyDocket}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs cursor-pointer"
                  >
                    {hasCopiedDocket ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Docket Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Docket Telemetry</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs shadow-blue-600/20 cursor-pointer"
                  >
                    <span>Proceed to Sign In Gateway</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Reset form option */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittedDocket(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Submit another access request
                </button>
              </div>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error message */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-lg flex items-start gap-2 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Row 1: Full Name & National ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dr. Jane Mutua"
                      required
                      className="w-full bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* National ID / Staff ID */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      National ID / Staff ID <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      MOH / CAC
                    </span>
                  </div>
                  <div className="relative">
                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      placeholder="MOH-8849201"
                      required
                      className="w-full bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Field 3: Official Institutional Email */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    Official Institutional Email <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    Whitelisted Domains Only
                  </span>
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="j.mutua@health.go.ke or officer@county.gov"
                    required
                    className={`w-full bg-slate-50/70 border ${
                      isEmailWarning
                        ? 'border-amber-400 bg-amber-50/40 focus:border-amber-500 focus:ring-amber-500/20'
                        : 'border-slate-300 hover:border-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none`}
                  />
                </div>

                {/* Email Warning: Commercial domains (gmail, yahoo) are automatically rejected. */}
                {isEmailWarning ? (
                  <div className="flex items-start gap-1.5 text-[11px] text-amber-700 bg-amber-50/80 border border-amber-200/80 p-2 rounded-md">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Warning:</strong> Commercial domains (gmail, yahoo) are automatically rejected by sovereign filters. Please enter an authorized ministerial or county agency email.
                    </span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 font-normal">
                    Commercial domains (gmail, yahoo) are automatically rejected.
                  </p>
                )}
              </div>

              {/* Row 2: Ministry / County Node & Operational Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Ministry / County Node (dropdown: “Select Jurisdiction”) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Ministry / County Node <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select
                      value={jurisdiction}
                      onChange={(e) => setJurisdiction(e.target.value)}
                      required
                      className="w-full bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg pl-9 pr-7 py-2 text-xs text-slate-800 transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Select Jurisdiction
                      </option>
                      <option value="Ministry of Health (HQ) – National Disease Surveillance Unit">
                        Ministry of Health (HQ) – National Disease Surveillance
                      </option>
                      <option value="Nairobi City County – Directorate of Health Services">
                        Nairobi City County – Directorate of Health Services
                      </option>
                      <option value="Mombasa County – Department of Public Health">
                        Mombasa County – Department of Public Health
                      </option>
                      <option value="Kisumu County – Department of Health & Sanitation">
                        Kisumu County – Department of Health & Sanitation
                      </option>
                      <option value="Nakuru County – Health & Vector Management Directorate">
                        Nakuru County – Health & Vector Management
                      </option>
                      <option value="Uasin Gishu County – Department of Health Services">
                        Uasin Gishu County – Department of Health Services
                      </option>
                      <option value="Kiambu County – Division of Disease Prevention">
                        Kiambu County – Disease Prevention & Control
                      </option>
                      <option value="National Public Health Laboratories (NPHL) & Genomics">
                        National Public Health Laboratories (NPHL)
                      </option>
                      <option value="Kenya National Vector Surveillance Enclave">
                        Kenya National Vector Surveillance Enclave
                      </option>
                      <option value="Africa CDC / Sovereign Health Partner Agency">
                        Africa CDC / Sovereign Health Partner Agency
                      </option>
                    </select>
                    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Operational Role (dropdown: “Select Role Tier”) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Operational Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileCheck2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select
                      value={roleTier}
                      onChange={(e) => setRoleTier(e.target.value)}
                      required
                      className="w-full bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg pl-9 pr-7 py-2 text-xs text-slate-800 transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Select Role Tier
                      </option>
                      <option value="Chief Epidemiologist / Surveillance Director (Tier 1)">
                        Chief Epidemiologist / Surveillance Director (Tier 1)
                      </option>
                      <option value="County Health Officer / Executive (Tier 1)">
                        County Health Officer / Executive (Tier 1)
                      </option>
                      <option value="Hospital Medical Director / Chief of Staff (Tier 2)">
                        Hospital Medical Director / Chief of Staff (Tier 2)
                      </option>
                      <option value="Cold-Chain Logistics & Vaccine Depot Lead (Tier 2)">
                        Cold-Chain Logistics & Depot Lead (Tier 2)
                      </option>
                      <option value="Senior Outbreak Investigation Specialist (Tier 2)">
                        Senior Outbreak Investigation Specialist (Tier 2)
                      </option>
                      <option value="Sovereign Vector Control Officer (Tier 3)">
                        Sovereign Vector Control Officer (Tier 3)
                      </option>
                      <option value="Accredited Public Biostatistician (Tier 3)">
                        Accredited Public Biostatistician (Tier 3)
                      </option>
                    </select>
                    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Create Passcode & Confirm Passcode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Create Passcode (Min. 12 characters) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Create Passcode <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPasscode ? 'text' : 'password'}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Min. 12 characters"
                      required
                      className="w-full bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg pl-9 pr-9 py-2 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode(!showPasscode)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      {showPasscode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Passcode (Re-enter passcode) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      Confirm Passcode <span className="text-red-500">*</span>
                    </label>
                    {confirmPasscode && (
                      <span
                        className={`text-[10px] font-mono ${
                          passcodesMatch ? 'text-emerald-600 font-semibold' : 'text-red-500'
                        }`}
                      >
                        {passcodesMatch ? '✓ Matches' : '✗ Mismatch'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showConfirmPasscode ? 'text' : 'password'}
                      value={confirmPasscode}
                      onChange={(e) => setConfirmPasscode(e.target.value)}
                      placeholder="Re-enter passcode"
                      required
                      className="w-full bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg pl-9 pr-9 py-2 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPasscode(!showConfirmPasscode)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      {showConfirmPasscode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password requirement note: “Requires letter, number & symbol” */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700">Passcode Requirements:</span>
                  <span>Min. 12 chars, letter, number & symbol</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className={hasMinLength ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                    {hasMinLength ? '✓ 12+' : '○ 12+'}
                  </span>
                  <span className={hasLetter ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                    {hasLetter ? '✓ Letter' : '○ Letter'}
                  </span>
                  <span className={hasNumber ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                    {hasNumber ? '✓ Number' : '○ Number'}
                  </span>
                  <span className={hasSymbol ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                    {hasSymbol ? '✓ Symbol' : '○ Symbol'}
                  </span>
                </div>
              </div>

              {/* Checkbox: “I confirm that I am an accredited officer of an authorized public health institution...” */}
              <div className="pt-1.5 pb-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={agreeMandate}
                    onChange={(e) => setAgreeMandate(e.target.checked)}
                    required
                    className="w-4 h-4 mt-0.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer accent-blue-600 shrink-0"
                  />
                  <span className="text-xs text-slate-600 font-normal leading-relaxed group-hover:text-slate-800">
                    I confirm that I am an accredited officer of an authorized public health institution, and agree to the{' '}
                    <span className="text-blue-600 font-semibold underline decoration-blue-300">
                      National Health Data Sovereignty Protocol
                    </span>{' '}
                    &amp;{' '}
                    <span className="text-blue-600 font-semibold underline decoration-blue-300">
                      Zero-PII Egress Mandate
                    </span>
                    .
                  </span>
                </label>
              </div>

              {/* Primary Button: Large blue button: Submit Access Request */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg shadow-sm shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm disabled:opacity-75 disabled:cursor-not-allowed group mt-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Reconciling Sovereign Enclave Clearance...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Access Request</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              {/* Secondary Link: “Already authorized by the Ministry? Authenticate / Sign In” */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 group cursor-pointer"
                >
                  <span>Already authorized by the Ministry? Authenticate / Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </form>
          )}

          {/* Bottom Statutory Notice */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-3 text-[11px] leading-relaxed text-slate-500 font-normal">
              <strong className="text-slate-700 font-semibold block mb-0.5">
                STATUTORY ENFORCEMENT &amp; AUDIT NOTICE
              </strong>
              Submissions undergo multi-agent cryptographic credential reconciliation against ministerial staff registries. Provisional clearance turnaround is typically 6–12 hours. Unauthorized access attempts, credential spoofing, or misrepresentation are logged with SHA-256 origin telemetry and audited per FedRAMP High and national cybersecurity statutes.
            </div>
          </div>

          {/* Footer Badges inside card / bottom indicator */}
          <div className="mt-4 pt-3 text-center">
            <div className="text-[11px] font-mono text-slate-500 tracking-wide flex items-center justify-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-600">ISO-27001 Certified</span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-slate-600">Zero-PII Egress Guaranteed</span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-slate-600">Ministry of Health Endorsed</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer status bar */}
      <footer className="relative z-10 w-full py-3 px-6 border-t border-slate-200/80 bg-white/90 backdrop-blur-xs text-[11px] font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-semibold text-slate-700">OPERATIONAL STATUS:</span>
          <span className="text-slate-800 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            VitaGrid GOV v4.2.1 SEC
          </span>
          <span className="text-slate-300">•</span>
          <span>GATEWAY: AP-SOV-01 READY</span>
          <span className="text-slate-300">•</span>
          <span>FIPS 140-3 LEVEL 3</span>
        </div>

        <div className="flex items-center gap-3 text-slate-500">
          <button
            onClick={onNavigateToLogin}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Authenticate / Sign In
          </button>
          <span className="text-slate-300">•</span>
          <span>National Healthdesk: 0800-721-000</span>
        </div>
      </footer>
    </div>
  );
};
