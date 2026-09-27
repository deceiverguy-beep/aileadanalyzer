import React, { useState } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Send 
} from 'lucide-react';
import { FAQS } from '../data/mockData';

interface FaqSectionProps {
  onOpenTrial: () => void;
  onOpenDemo: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenTrial, onOpenDemo }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [leadEmail, setLeadEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleQuickSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadEmail) {
      setSubmitted(true);
      setTimeout(() => {
        onOpenTrial();
      }, 700);
    }
  };

  return (
    <section id="faq" className="py-20 bg-slate-900/60 border-t border-slate-800 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1 text-xs font-semibold text-indigo-300 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Got Questions? We’ve Got Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-300 text-base leading-relaxed">
            Everything you need to know about AI Lead Analyzer, two-way Google Sheets sync, and CRM integrations.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 mb-16">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:text-white transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-100 font-display">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-900 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FINAL HIGH-CONVERSION CTA SECTION */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 border-2 border-indigo-500/80 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Get Started Today
            </span>

            <h3 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight leading-tight">
              Ready to Automate Your Pipeline in 42 Seconds?
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Join over 1,400 high-velocity businesses using AI Lead Analyzer to qualify leads, sync Google Sheets, and accelerate CRM conversions.
            </p>

            {/* Quick Email Lead Capture */}
            <form onSubmit={handleQuickSignup} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="Enter your work email..."
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
              />
              <button
                type="submit"
                className="shrink-0 px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>{submitted ? 'Starting Trial...' : 'Start Free Trial'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 14-day free trial
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No credit card required
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant 2-way sync
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
