import React from 'react';
import { 
  Workflow, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Heart, 
  Mail, 
  ExternalLink 
} from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenTrial: () => void;
  onOpenTemplates: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenTrial,
  onOpenTemplates,
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Workflow className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-display font-bold text-base text-white tracking-tight">AI Lead Analyzer</span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              The premier AI workflow automation platform for small businesses in 2026. Qualify inbound inquiries, 2-way sync Google Sheets, and update your CRM in under 42 seconds.
            </p>

            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SOC2 & GDPR Ready
              </span>
              <span>•</span>
              <span>Sub-2.0s Page Load Speed</span>
              <span>•</span>
              <span>Schema.org Verified</span>
            </div>

            <div className="pt-2">
              <span className="text-slate-300 font-semibold">Founder: </span>
              <span className="text-indigo-400 font-bold">Uzair</span>
              <span className="text-slate-500 ml-2">(B2B SaaS & AI Automation Architect)</span>
            </div>
          </div>

          {/* Col 2: Keyword Clusters & SEO Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-display">
              Keyword Clusters (SEO)
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('cornerstone-seo')} 
                  className="hover:text-indigo-300 transition-colors text-left"
                >
                  AI workflow automation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('cornerstone-seo')} 
                  className="hover:text-indigo-300 transition-colors text-left"
                >
                  CRM integration
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('cornerstone-seo')} 
                  className="hover:text-indigo-300 transition-colors text-left"
                >
                  Google Sheets automation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('demo-tool')} 
                  className="hover:text-indigo-300 transition-colors text-left"
                >
                  AI lead analyzer
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('cornerstone-seo')} 
                  className="hover:text-indigo-300 transition-colors text-left"
                >
                  best AI tools 2026
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-display">
              Platform Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">
                  Lead Processing Automation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">
                  Google Sheets 2-Way Sync
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">
                  HubSpot & Salesforce Sync
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">
                  Visual Workflow Builder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">
                  Automation ROI Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('case-study')} className="hover:text-white transition-colors">
                  ScaleOps Case Study (+310%)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Growth & Funnel Suite */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-display">
              Growth Playbook
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('growth-playbook')} className="hover:text-white transition-colors">
                  3-Month Content Calendar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('growth-playbook')} className="hover:text-white transition-colors">
                  4-Part Email Funnel Scripts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('growth-playbook')} className="hover:text-white transition-colors">
                  Social Media Content Engine
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('growth-playbook')} className="hover:text-white transition-colors">
                  12-Month Growth Roadmap
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('growth-playbook')} className="hover:text-white transition-colors">
                  Backlink Outreach Template
                </button>
              </li>
              <li>
                <button onClick={onOpenTemplates} className="text-cyan-400 hover:text-cyan-300 font-semibold">
                  🎁 15+ Free Workflow Templates
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 AI Lead Analyzer by Uzair. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('cornerstone-seo')} className="hover:text-slate-400">
              Editorial Guidelines
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('pricing')} className="hover:text-slate-400">
              Subscription Terms
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('faq')} className="hover:text-slate-400">
              Security & Privacy
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
