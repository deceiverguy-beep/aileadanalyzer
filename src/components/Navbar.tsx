import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Menu, 
  X, 
  FileSpreadsheet, 
  Workflow, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck,
  Calendar,
  Gift
} from 'lucide-react';

interface NavbarProps {
  onOpenTrial: () => void;
  onOpenDemo: () => void;
  onOpenTemplates: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTrial,
  onOpenDemo,
  onOpenTemplates,
  activeSection,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'features', label: 'Features' },
    { id: 'demo-tool', label: 'Live AI Demo' },
    { id: 'case-study', label: 'Case Study' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'cornerstone-seo', label: 'SEO & Guides' },
    { id: 'growth-playbook', label: 'Growth Playbook' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('hero')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Workflow className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg text-white tracking-tight">AI Lead Analyzer</span>
                <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Workflow Automation & CRM Sync</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? 'text-indigo-300 bg-indigo-950/50 border border-indigo-800/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onOpenDemo}
              className="px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-900 rounded-lg border border-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Book Demo
            </button>
            <button
              onClick={onOpenTrial}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 rounded-lg shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all flex items-center gap-1.5"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenTrial}
              className="sm:hidden px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg"
            >
              Free Trial
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/98 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTemplates();
              }}
              className="w-full py-2 text-center text-xs font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 rounded-lg"
            >
              🎁 Download 15+ Free Workflow Templates
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-800 rounded-lg"
            >
              Book a 1-on-1 Strategy Demo
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrial();
              }}
              className="w-full py-2.5 text-center text-xs font-bold text-white bg-indigo-600 rounded-lg shadow-md"
            >
              Start 14-Day Free Trial
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
