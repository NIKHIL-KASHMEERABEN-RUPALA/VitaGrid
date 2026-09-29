import React, { useState } from 'react';
import { X, ShieldCheck, Check, Building2, Globe, Send, User, Mail } from 'lucide-react';

interface AccessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'access' | 'briefing';
}

export const AccessRequestModal: React.FC<AccessRequestModalProps> = ({
  isOpen,
  onClose,
  initialType = 'access',
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Dr. V. Rao',
    title: 'Director of Health Informatics',
    organization: 'Ministry of Health & Family Welfare',
    country: 'Kenya / East Africa Region',
    email: 'v.rao@health.gov.ke',
    scope: 'national-grid',
    notes: 'Requesting sovereign deployment assessment for 2,840 PHC nodes and drone corridors.',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after confirmation
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {initialType === 'briefing' ? 'Schedule a Technical Briefing' : 'Request National Sovereign Access'}
              </h2>
              <p className="text-xs text-slate-500">
                Government Ministries, Public Health Institutes &amp; Sovereign Entities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Sovereign Inquiry Dispatched</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your credentials for <strong>{formData.organization}</strong> have been securely received. A VitaGrid Sovereign Implementation Architect will contact you within 4 business hours.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-xs font-semibold shadow-xs transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name &amp; Title</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ministry / Entity</label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Jurisdiction / Country</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Deployment Scope</label>
              <select
                value={formData.scope}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="national-grid">Full Sovereign National Health Grid (2,000+ PHCs)</option>
                <option value="sub-national">Sub-County Regional Pilot (100–500 PHCs)</option>
                <option value="cold-chain-logistics">Dedicated Cold-Chain &amp; Drone Logistics Mesh</option>
                <option value="epidemic-radar">Bio-Climatic Epidemic Surveillance Only</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Operational Requirements</label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded p-2.5 flex items-center gap-2 text-emerald-900 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Zero PII Protocol Enforced: All submissions audited and encrypted in accordance with ISO-27001 data residency standards.
              </span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 border border-slate-200 rounded-md text-slate-700 hover:bg-slate-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded-md shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Sovereign Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
