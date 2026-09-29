import React, { useState } from 'react';
import {
  Plus,
  ArrowRight,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  User,
  Landmark,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { AccessRequestModal } from '../Marketing/AccessRequestModal';

interface LoginPageProps {
  onSuccessLogin: (user?: { name: string; role: string; email: string }) => void;
  onBackToHomepage: () => void;
  onRequestAccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccessLogin,
  onBackToHomepage,
  onRequestAccess,
}) => {
  const [identifier, setIdentifier] = useState('dr.rao@vitagrid.gov');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLocalAccessModalOpen, setIsLocalAccessModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setAuthError('Please enter your sovereign Email or National ID.');
      return;
    }

    setAuthError(null);
    setIsSubmitting(true);

    // Simulate authenticating against sovereign cryptographic FedRAMP High enclave
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessLogin({
        name: 'Dr. V. Rao',
        role: 'National Health Director',
        email: identifier,
      });
    }, 700);
  };

  const handleGovernmentSso = () => {
    setAuthError(null);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessLogin({
        name: 'Dr. V. Rao',
        role: 'National Health Director (SSO)',
        email: 'dr.rao@vitagrid.gov',
      });
    }, 850);
  };

  const handleFillDemoCredentials = () => {
    setIdentifier('dr.rao@vitagrid.gov');
    setPassword('Gov-Sovereign-Pass#2026');
    setAuthError(null);
  };

  const handleOpenAccessModal = () => {
    if (onRequestAccess) {
      onRequestAccess();
    } else {
      setIsLocalAccessModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between relative selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Light dotted background */}
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
        {/* Left: Back button to Homepage */}
        <button
          onClick={onBackToHomepage}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1 px-2.5 rounded-md hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </button>

        {/* Center: Explicit flow indicator as requested: Homepage → Click "Sign In" → Opens this Login page */}
        <div className="hidden md:flex items-center gap-2 text-[11px] font-mono bg-slate-50 border border-slate-200 px-3 py-1 rounded-md text-slate-600 shadow-2xs">
          <button
            onClick={onBackToHomepage}
            className="hover:text-blue-600 hover:underline cursor-pointer font-semibold"
          >
            Homepage
          </button>
          <span className="text-slate-400">→</span>
          <span className="text-slate-500">Click &ldquo;Sign In&rdquo;</span>
          <span className="text-slate-400">→</span>
          <span className="text-blue-700 font-bold bg-blue-100/70 px-1.5 py-0.5 rounded">
            VitaGrid GOV Login
          </span>
          <span className="text-slate-400">→</span>
          <button
            onClick={handleOpenAccessModal}
            className="hover:text-blue-600 hover:underline cursor-pointer text-slate-500"
          >
            Request Access
          </button>
        </div>

        {/* Right: Security info */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className="hidden sm:inline">PERIMETER:</span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            SOVEREIGN LEVEL 4
          </span>
        </div>
      </header>

      {/* Main Centered Login Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-[460px] bg-white rounded-xl shadow-[0_12px_40px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] border border-slate-200/90 p-7 sm:p-9 relative">
          {/* Top Badge: “OFFICIAL NATIONAL HEALTH GATEWAY” */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100/90 border border-slate-200/90 text-slate-700 text-[11px] font-mono font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-subtle"></span>
              <span>OFFICIAL NATIONAL HEALTH GATEWAY</span>
            </div>
          </div>

          {/* VitaGrid GOV logo + “PUBLIC SECTOR” badge */}
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-500/20">
              <Plus className="w-5 h-5 stroke-[3]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">VitaGrid</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                GOV
              </span>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-blue-200">
                PUBLIC SECTOR
              </span>
            </div>
          </div>

          {/* Title: Sign in to VitaGrid */}
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 text-center">
            Sign in to VitaGrid
          </h1>

          {/* Subtitle: “National Health Intelligence Platform” */}
          <p className="text-xs text-slate-500 text-center mt-1 mb-5 font-normal">
            National Health Intelligence Platform
          </p>

          {/* Blue Info Box */}
          <div className="bg-blue-50/80 border border-blue-200/90 rounded-lg p-3.5 mb-6 text-xs text-blue-950 flex items-start gap-2.5 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-slate-700 font-normal">
              Authorized sovereign personnel only. All access, queries, and credential events are audited per FedRAMP High and NIST protocols.
            </p>
          </div>

          {/* Error Message if any */}
          {authError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field 1: Email or National ID */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Email or National ID
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  FedID / CAC supported
                </span>
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="officer.id@health.gov or FedID #"
                  required
                  className="w-full bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none"
                />
              </div>
            </div>

            {/* Field 2: Password (with show/hide eye icon) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('For testing, please use the sample credentials or click Auto-fill below.')}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg pl-9 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* “Remember this device for 30 days” checkbox */}
            <div className="flex items-center gap-2 pt-1 pb-1">
              <input
                id="remember-device"
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
              />
              <label
                htmlFor="remember-device"
                className="text-xs text-slate-600 font-normal cursor-pointer select-none"
              >
                Remember this device for 30 days
              </label>
            </div>

            {/* Large blue primary button: Sign In → */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm group disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying FedID / CAC Enclave...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="mt-3 text-right">
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-medium underline decoration-blue-200 underline-offset-2 cursor-pointer"
            >
              Auto-fill Dr. V. Rao Credentials
            </button>
          </div>

          {/* Divider with “OR” */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 font-mono">
                OR
              </span>
            </div>
          </div>

          {/* Secondary button: Sign in with Government SSO */}
          <button
            type="button"
            onClick={handleGovernmentSso}
            disabled={isSubmitting}
            className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold py-2.5 px-4 rounded-lg shadow-2xs flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs sm:text-sm"
          >
            <Landmark className="w-4 h-4 text-slate-600" />
            <span>Sign in with Government SSO</span>
          </button>

          {/* Link: “Need official institutional credentials? Request National Access →” */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={handleOpenAccessModal}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 group cursor-pointer"
            >
              <span>Need official institutional credentials? Request National Access</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Bottom security badges: ISO-27001 Certified • Zero PII Egress • FIPS 140-3 */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <div className="text-[11px] font-mono text-slate-500 tracking-wide flex items-center justify-center gap-2 flex-wrap">
              <span>ISO-27001 Certified</span>
              <span className="text-slate-300">•</span>
              <span>Zero PII Egress</span>
              <span className="text-slate-300">•</span>
              <span>FIPS 140-3</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer status: “GATEWAY: AP-SOV-01 READY • TLS 1.3 ENCLAVE • National Helpdesk” */}
      <footer className="relative z-10 w-full py-3 px-6 border-t border-slate-200/80 bg-white/90 backdrop-blur-xs text-[11px] font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-semibold text-slate-700">GATEWAY: AP-SOV-01 READY</span>
          <span className="text-slate-300">•</span>
          <span>TLS 1.3 ENCLAVE</span>
          <span className="text-slate-300">•</span>
          <button
            onClick={handleOpenAccessModal}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            National Helpdesk
          </button>
        </div>

        <div className="text-[10px] text-slate-400">
          VITAGRID GOV SOVEREIGN SECURITY PERIMETER
        </div>
      </footer>

      {/* Optional fallback access request dialog */}
      <AccessRequestModal
        isOpen={isLocalAccessModalOpen}
        onClose={() => setIsLocalAccessModalOpen(false)}
        initialType="access"
      />
    </div>
  );
};
