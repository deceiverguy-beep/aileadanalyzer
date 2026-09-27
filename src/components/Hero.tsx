import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Star, 
  TrendingUp, 
  FileSpreadsheet, 
  Clock, 
  Users 
} from 'lucide-react';
import { Hero3DCanvas } from './Hero3DCanvas';

interface HeroProps {
  onOpenTrial: () => void;
  onOpenDemo: () => void;
  onScrollToDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTrial, onOpenDemo, onScrollToDemo }) => {
  return (
    <section id="hero" className="relative pt-12 pb-20 overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Top Eyebrow Chip */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1 text-xs font-semibold text-indigo-300 shadow-sm shadow-indigo-950/50">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>2026’s Ranked #1 AI Workflow Automation & Lead Qualification Platform</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] font-display">
            Turn Inbound Leads Into Closed Deals in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400">
              42 Seconds
            </span>{' '}
            with AI Automation
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Stop losing high-value prospects to manual data entry. Our <strong>AI Lead Analyzer</strong> auto-enriches incoming forms, calculates 0–100 purchase intent, maintains continuous <strong>2-way Google Sheets sync</strong>, and routes hot deals to your CRM instantly.
          </p>

          {/* Dual Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenTrial}
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 rounded-xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto px-7 py-4 text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 hover:text-white rounded-xl border border-slate-700/80 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Book a 1-on-1 Demo</span>
            </button>
          </div>

          {/* Trial perks line */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Setup in 3 minutes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100 free lead analyses included
            </span>
          </div>

          {/* 3D Interactive Pipeline Core */}
          <div className="pt-4 pb-2">
            <div className="relative rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900/70 via-slate-950/80 to-slate-950/95 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl overflow-hidden">
              <Hero3DCanvas interactive={true} />
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-bold font-display text-white">42s</div>
              <div className="text-xs text-slate-400 mt-0.5">Average Speed to Lead</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-bold font-display text-cyan-400">+310%</div>
              <div className="text-xs text-slate-400 mt-0.5">Demo Conversion Uplift</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-bold font-display text-indigo-400">22 hrs</div>
              <div className="text-xs text-slate-400 mt-0.5">Saved Weekly per Rep</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-bold font-display text-emerald-400">1.4M+</div>
              <div className="text-xs text-slate-400 mt-0.5">Leads Processed in 2026</div>
            </div>
          </div>

          {/* Interactive Tool Teaser Bar */}
          <div className="pt-4">
            <button
              onClick={onScrollToDemo}
              className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/50 px-4 py-2 rounded-full transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Scroll down to test the live AI Lead Analyzer simulator below</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Integration Logos Banner */}
        <div className="mt-16 pt-8 border-t border-slate-800/80">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-300 mb-6">
            Engineered for seamless zero-code integration across your 2026 stack
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-400 text-sm font-semibold">
            <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-lg hover:border-slate-700 transition-colors">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Google Sheets 2-Way Sync</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-lg hover:border-slate-700 transition-colors">
              <Zap className="w-4 h-4 text-orange-400" />
              <span>HubSpot CRM</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-lg hover:border-slate-700 transition-colors">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Salesforce Cloud</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-lg hover:border-slate-700 transition-colors">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Pipedrive & Zoho</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-lg hover:border-slate-700 transition-colors">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Slack & Discord Bots</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-lg hover:border-slate-700 transition-colors">
              <Users className="w-4 h-4 text-teal-400" />
              <span>Webflow & Typeform</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
