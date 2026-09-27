import React from 'react';
import { 
  Star, 
  Quote, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Award,
  Zap,
  Building2
} from 'lucide-react';
import { CASE_STUDY, TESTIMONIALS } from '../data/mockData';

interface SocialProofProps {
  onOpenDemo: () => void;
  onOpenTrial: () => void;
}

export const SocialProof: React.FC<SocialProofProps> = ({ onOpenDemo, onOpenTrial }) => {
  return (
    <section id="case-study" className="py-20 bg-slate-900/40 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-300 mb-3">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Proven Enterprise & SMB Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
            Real Revenue Growth. Real Hours Saved.
          </h2>
          <p className="mt-3 text-slate-300 text-base leading-relaxed">
            See how high-growth operations teams eliminate manual lead entry, accelerate speed-to-lead, and scale conversions with AI Lead Analyzer.
          </p>
        </div>

        {/* FEATURED IN-DEPTH CASE STUDY SPOTLIGHT: SCALEOPS MEDIA */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-700/80 rounded-3xl p-8 lg:p-12 shadow-2xl mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Case Study Story */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Verified Case Study
                </span>
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {CASE_STUDY.industry}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight leading-snug">
                How ScaleOps Cut Lead Response Time to 42 Seconds and Unlocked $420,000 in New Pipeline
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <strong className="text-rose-400 block mb-1 font-semibold uppercase text-[11px] tracking-wider">
                    The Challenge:
                  </strong>
                  {CASE_STUDY.challenge}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <strong className="text-emerald-400 block mb-1 font-semibold uppercase text-[11px] tracking-wider">
                    The Solution:
                  </strong>
                  {CASE_STUDY.solution}
                </div>
              </div>

              {/* Quote from VP */}
              <div className="border-l-2 border-indigo-500 pl-4 py-1 italic text-xs sm:text-sm text-slate-200 leading-relaxed">
                "{CASE_STUDY.quote}"
                <div className="mt-2 text-xs font-semibold not-italic text-indigo-300">
                  — {CASE_STUDY.author}, <span className="text-slate-400 font-normal">{CASE_STUDY.title}</span>
                </div>
              </div>
            </div>

            {/* Right Case Study Metrics Bento Grid */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
              <div className="text-center pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quarterly Operational Results
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {CASE_STUDY.results.map((res, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-lg text-center flex flex-col items-center justify-center hover:border-indigo-500/50 transition-colors"
                  >
                    <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-display">
                      {res.metric}
                    </div>
                    <div className="text-xs font-medium text-slate-300 mt-1.5 leading-snug">
                      {res.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenDemo}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>See How to Replicate ScaleOps' Setup</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* CUSTOMER TESTIMONIALS 3-COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-lg"
            >
              {/* Stars & Metric Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  {t.metrics}
                </span>
              </div>

              {/* Quote text */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                "{t.quote}"
              </p>

              {/* Author details */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-900">
                <img
                  src={t.avatar}
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-indigo-500/40"
                />
                <div>
                  <div className="text-xs font-bold text-white">{t.name}</div>
                  <div className="text-[11px] text-slate-400">
                    {t.role}, <span className="text-slate-300 font-medium">{t.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
