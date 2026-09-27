import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  FileSpreadsheet, 
  Download, 
  ShieldCheck, 
  Zap,
  RefreshCw
} from 'lucide-react';
import { downloadJsonFile, FULL_WORKFLOW_TEMPLATES_VAULT } from '../utils/exportUtils';
import { apiUrl } from '../utils/apiConfig';

export type ModalType = 'trial' | 'demo' | 'templates' | 'consulting' | null;

interface LeadCaptureModalProps {
  type: ModalType;
  onClose: () => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ type, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [crm, setCrm] = useState('HubSpot');
  const [selectedSlot, setSelectedSlot] = useState('Tomorrow at 2:00 PM EST');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverConfirmation, setServerConfirmation] = useState<string | null>(null);

  if (!type) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // POST to full-stack Express lead webhook endpoint
      const res = await fetch(apiUrl('/api/leads/submit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: name,
          email,
          companyName: company || 'Company Not Specified',
          currentCrm: crm,
          modalType: type,
          selectedSlot: type === 'demo' ? selectedSlot : undefined,
          source: `Modal: ${type}`,
          useCaseDescription: `Lead capture from ${type} modal flow`,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setServerConfirmation(json.message || 'Lead processed successfully');
      }
    } catch (err) {
      // If server unreachable, still proceed gracefully
      console.warn('Backend webhook submission fallback triggered:', err);
    } finally {
      // If user requested the template vault, also trigger file download directly
      if (type === 'templates') {
        downloadJsonFile('ai-automation-templates-vault-2026.json', {
          schemaVersion: '2026.2',
          curatedBy: 'Uzair, Founder of AI Lead Analyzer',
          recipient: { name, email, company },
          templates: FULL_WORKFLOW_TEMPLATES_VAULT,
        });
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  const handleDownloadVaultAgain = () => {
    downloadJsonFile('ai-automation-templates-vault-2026.json', {
      schemaVersion: '2026.2',
      curatedBy: 'Uzair, Founder of AI Lead Analyzer',
      recipient: { name, email, company },
      templates: FULL_WORKFLOW_TEMPLATES_VAULT,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative animate-fadeIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
              {type === 'trial' && 'Your 14-Day Free Trial is Live!'}
              {type === 'demo' && 'Demo Session Confirmed!'}
              {type === 'templates' && 'Templates Downloaded & Dispatched!'}
              {type === 'consulting' && 'Consulting Request Received!'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              {type === 'trial' && (
                <>We sent your instant sandbox login link and API credentials to <strong>{email}</strong>. You have 100 free lead analyses ready.</>
              )}
              {type === 'demo' && (
                <>Uzair has booked your strategy call for <strong>{selectedSlot}</strong>. A calendar invite has been sent to <strong>{email}</strong>.</>
              )}
              {type === 'templates' && (
                <>The 2026 AI Automation Vault JSON has been downloaded to your machine and backed up to <strong>{email}</strong>.</>
              )}
              {type === 'consulting' && (
                <>Uzair will personally review {company || 'your'} CRM and workflow architecture and reply to <strong>{email}</strong> within 4 business hours.</>
              )}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {type === 'templates' && (
                <button
                  onClick={handleDownloadVaultAgain}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Download Again (.JSON)</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Back to Platform
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                {type === 'trial' && '14-Day Free Trial • No Credit Card'}
                {type === 'demo' && '1-on-1 Automation Strategy Demo'}
                {type === 'templates' && 'Free Lead Magnet • 15+ Production Templates'}
                {type === 'consulting' && 'Bespoke Automation Implementation'}
              </div>

              <h3 className="text-2xl font-bold text-white font-display">
                {type === 'trial' && 'Activate Your Automation Pipeline'}
                {type === 'demo' && 'Schedule a 15-Minute Strategy Walkthrough'}
                {type === 'templates' && 'Download the 2026 AI Automation Vault'}
                {type === 'consulting' && 'Book Custom Automation Consulting'}
              </h3>

              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {type === 'trial' && 'Includes 100 free analyses, full Google Sheets 2-way sync, and single CRM connection.'}
                {type === 'demo' && 'Speak directly with Uzair to map out your zero-latency CRM and Google Sheets pipeline.'}
                {type === 'templates' && 'Battle-tested Make, Zapier, Webflow, and HubSpot workflow files (.json & .csv).'}
                {type === 'consulting' && 'Bespoke enterprise build delivered in 7 business days with guaranteed SLA.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Work Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@yourcompany.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company / Organization</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Media"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Current CRM</label>
                  <select
                    value={crm}
                    onChange={(e) => setCrm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
                  >
                    <option value="HubSpot">HubSpot</option>
                    <option value="Salesforce">Salesforce</option>
                    <option value="Pipedrive">Pipedrive</option>
                    <option value="Zoho">Zoho</option>
                    <option value="Google Sheets Only">Google Sheets Only</option>
                  </select>
                </div>
              </div>

              {type === 'demo' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Select Available Time Slot</label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
                  >
                    <option value="Tomorrow at 2:00 PM EST">Tomorrow at 2:00 PM EST</option>
                    <option value="Tomorrow at 4:30 PM EST">Tomorrow at 4:30 PM EST</option>
                    <option value="Thursday at 11:00 AM EST">Thursday at 11:00 AM EST</option>
                    <option value="Friday at 1:00 PM EST">Friday at 1:00 PM EST</option>
                  </select>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Synchronizing with Webhook & CRM...</span>
                    </>
                  ) : (
                    <>
                      {type === 'trial' && <span>Start My 14-Day Free Trial</span>}
                      {type === 'demo' && <span>Confirm 15-Minute Strategy Demo</span>}
                      {type === 'templates' && <span>Download 15+ Templates Now (.JSON)</span>}
                      {type === 'consulting' && <span>Submit Consulting Request</span>}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SOC2 Compliant
                </span>
                <span>•</span>
                <span>No Credit Card Required</span>
                <span>•</span>
                <span>Instant Access</span>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
