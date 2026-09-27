import React, { useState } from 'react';
import { 
  Check, 
  ArrowRight, 
  Sparkles, 
  Calculator, 
  ShieldCheck, 
  HelpCircle,
  Zap
} from 'lucide-react';
import { PRICING_PLANS } from '../data/mockData';
import { Card3D } from './Card3D';

interface PricingProps {
  onOpenTrial: () => void;
  onOpenDemo: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onOpenTrial, onOpenDemo }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [monthlyLeads, setMonthlyLeads] = useState<number>(650);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(18);
  const [hourlyWage, setHourlyWage] = useState<number>(40);

  // ROI calculations
  const weeklyHoursSaved = Math.round(hoursPerWeek * 0.85); // 85% automation
  const annualHoursSaved = weeklyHoursSaved * 50;
  const annualLaborSavings = annualHoursSaved * hourlyWage;
  const growthAnnualCost = 63 * 12; // $756/yr
  const netRoiPercent = Math.max(100, Math.round(((annualLaborSavings - growthAnnualCost) / growthAnnualCost) * 100));

  return (
    <section id="pricing" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1 text-xs font-semibold text-indigo-300 mb-3">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Simple, Transparent 2026 SaaS Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
            Invest in Revenue Speed, Not Manual Triage
          </h2>
          <p className="mt-3 text-slate-300 text-base leading-relaxed">
            No hidden setup fees. No unpredictable token multipliers. Choose the plan that fits your pipeline scale.
          </p>

          {/* Billing Cycle Switch */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-13 h-7 rounded-full bg-slate-800 p-1 border border-slate-700 transition-colors relative"
              aria-label="Toggle billing cycle"
            >
              <div
                className={`w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold ${billingCycle === 'annual' ? 'text-white' : 'text-slate-400'}`}>
                Annual Billing
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                SAVE 20%
              </span>
            </div>
          </div>
        </div>

        {/* 4 Pricing Cards Grid with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-16">
          {PRICING_PLANS.map((plan) => {
            const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
            const isPopular = plan.popular;

            return (
              <Card3D
                key={plan.id}
                depth={isPopular ? 22 : 14}
                glowColor={isPopular ? 'rgba(99, 102, 241, 0.35)' : 'rgba(56, 189, 248, 0.15)'}
                className={`rounded-2xl p-6 flex flex-col justify-between h-full transition-all relative ${
                  isPopular
                    ? 'bg-gradient-to-b from-indigo-950/80 via-slate-900 to-slate-950 border-2 border-indigo-500 shadow-2xl shadow-indigo-950/80'
                    : 'bg-slate-900/60 border border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {/* Popular Pill */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md ${
                        isPopular
                          ? 'bg-indigo-600 text-white border border-indigo-400'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="pt-2">
                    <h3 className="text-lg font-bold text-white font-display">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 min-h-[34px] leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price display */}
                  <div className="my-6 pb-5 border-b border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white font-display">
                        ${price}
                      </span>
                      <span className="text-xs text-slate-400">
                        {plan.id === 'free-trial' ? '/ 14 days' : '/ month'}
                      </span>
                    </div>
                    {billingCycle === 'annual' && plan.priceMonthly > 0 && (
                      <span className="text-[10px] text-emerald-400 font-medium">
                        Billed annually (${price * 12}/yr)
                      </span>
                    )}
                    <div className="mt-2 text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-1 rounded">
                      {plan.leadLimit}
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="space-y-2.5 text-xs text-slate-300 mb-6">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <button
                  onClick={plan.id === 'enterprise' ? onOpenDemo : onOpenTrial}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${
                    isPopular
                      ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white hover:text-white'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Card3D>
            );
          })}
        </div>

        {/* INTERACTIVE ROI & LABOR SAVINGS CALCULATOR */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-8 lg:p-10 shadow-xl">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              <Calculator className="w-4 h-4" />
              <span>Interactive Automation ROI Calculator</span>
            </div>
            <h3 className="text-2xl font-bold text-white font-display">
              How Much Revenue & Labor Will You Unlock in 2026?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Adjust the sliders to match your current inbound volume and team bottlenecks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Inbound Leads per Month</span>
                  <span className="text-indigo-400 font-bold text-sm">{monthlyLeads} leads/mo</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={monthlyLeads}
                  onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Hours spent manually qualifying & copy-pasting data / week</span>
                  <span className="text-indigo-400 font-bold text-sm">{hoursPerWeek} hrs/week</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  step="1"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Estimated loaded hourly wage / SDR rate</span>
                  <span className="text-indigo-400 font-bold text-sm">${hourlyWage}/hour</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="5"
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>

            {/* Right ROI Output Box */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-xl">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Estimated Annual Savings
              </div>

              <div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-display">
                ${annualLaborSavings.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                Annual Labor Cost Saved (Payroll Recovery)
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-left">
                <div className="p-3 bg-slate-900 rounded-xl">
                  <div className="text-[11px] text-slate-400">Hours Saved/Yr</div>
                  <div className="text-lg font-bold text-white font-display">{annualHoursSaved.toLocaleString()} hrs</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl">
                  <div className="text-[11px] text-slate-400">Net Software ROI</div>
                  <div className="text-lg font-bold text-emerald-400 font-display">{netRoiPercent}% ROI</div>
                </div>
              </div>

              <button
                onClick={onOpenTrial}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
              >
                Claim Your Automation ROI Today
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
