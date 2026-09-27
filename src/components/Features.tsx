import React, { useState } from 'react';
import { 
  Sparkles, 
  FileSpreadsheet, 
  Workflow, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Split, 
  RefreshCw, 
  Layers, 
  SlidersHorizontal 
} from 'lucide-react';

interface FeaturesProps {
  onOpenTrial: () => void;
  onOpenDemo: () => void;
}

export const Features: React.FC<FeaturesProps> = ({ onOpenTrial, onOpenDemo }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const featuresList = [
    {
      id: 'lead-processing',
      title: 'Lead Processing Automation',
      headline: 'Qualify, Enrich, and Route Leads in 42 Seconds Flat',
      shortDesc: 'Stop waiting hours for manual data entry. Extract intent, predict deal size, and assign reps autonomously.',
      icon: Zap,
      accentColor: 'text-indigo-400',
      tag: 'Core Intelligence',
      benefits: [
        '0-100 purchase intent scoring calibrated against your historical conversion data',
        'Automatic company enrichment: verified domain, revenue bracket, employee count',
        'Spam, throwaway emails, and bot submissions filtered before reaching reps',
        'Timezone-aware auto-assignment to available sales account executives',
      ],
      stats: '391% higher qualification rate via sub-minute speed-to-lead',
      visualType: 'qualification',
    },
    {
      id: 'google-sheets',
      title: 'Google Sheets 2-Way Sync',
      headline: 'The Flexibility of Spreadsheets. The Precision of Autonomous AI.',
      shortDesc: 'Google Sheets is your team’s favorite workspace. Turn it into a real-time event bus with live bi-directional sync.',
      icon: FileSpreadsheet,
      accentColor: 'text-emerald-400',
      tag: 'Two-Way Synchronization',
      benefits: [
        'Sub-second row appending whenever a new lead submits anywhere on your website',
        'Bi-directional status updates: updating a sheet cell immediately triggers CRM deal changes',
        'Zero Google Cloud console setup — one-click secure OAuth authorization',
        'Pre-configured formula templates for CAC calculation, deal value, and rep quotas',
      ],
      stats: 'Saves an average of 22 hours per week per sales development team',
      visualType: 'sheets',
    },
    {
      id: 'crm-sync',
      title: 'Real-Time CRM Sync',
      headline: 'Native Pipeline Synchronization with HubSpot, Salesforce & Pipedrive',
      shortDesc: 'Never copy-paste a prospect into a CRM again. Mapped properties, deal stages, and outbound tasks sync automatically.',
      icon: ShieldCheck,
      accentColor: 'text-orange-400',
      tag: 'Zero-Latency Pipeline',
      benefits: [
        'Automatic deduplication against existing CRM contacts and open opportunities',
        'Sub-second deal creation with AI-suggested deal size and custom property mapping',
        'Pre-drafted personalized follow-up emails staged directly into sales queues',
        'Fallback queuing and auto-retry guarantees so no inbound lead is ever dropped',
      ],
      stats: 'Zero dropped leads across 1,400,000+ synchronized pipeline records',
      visualType: 'crm',
    },
    {
      id: 'workflow-builder',
      title: 'Visual Workflow Builder',
      headline: 'Drag, Drop, and Automate Multi-Step Pipelines Without Writing Code',
      shortDesc: 'Create conditional branches, time delays, multi-app notifications, and custom webhook logic in a visual canvas.',
      icon: Workflow,
      accentColor: 'text-cyan-400',
      tag: 'Drag & Drop Canvas',
      benefits: [
        'Multi-branch logic: "If score > 80, Slack sales lead; else send nurture guide"',
        'Connect any webhook: Typeform, Webflow, WordPress, Framer, custom forms',
        'Built-in rate limiting, security encryption, and audit logs',
        'One-click template exports to share workflows across your team or clients',
      ],
      stats: '15+ pre-built production templates ready for instant deployment',
      visualType: 'builder',
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1 text-xs font-semibold text-indigo-300 mb-3">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Built for Modern Revenue Operations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
            The 4 Pillars of Autonomous AI Lead Automation
          </h2>
          <p className="mt-3 text-slate-300 text-base leading-relaxed">
            Eliminate operational friction, shorten sales cycles, and ensure every high-value inbound lead is touched within seconds.
          </p>
        </div>

        {/* Feature Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {featuresList.map((feat, index) => {
            const Icon = feat.icon;
            const isSelected = activeTab === index;
            return (
              <button
                key={feat.id}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-semibold text-xs transition-all border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-indigo-500/80 shadow-lg shadow-indigo-950/60'
                    : 'bg-slate-950/80 text-slate-400 border-slate-800/80 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? feat.accentColor : 'text-slate-500'}`} />
                <span>{feat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Feature Showcase Box */}
        {(() => {
          const current = featuresList[activeTab];
          const CurrentIcon = current.icon;

          return (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl backdrop-blur-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                {/* Left Description Column */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/50 border border-indigo-800/50 px-3 py-1 rounded-full">
                    <CurrentIcon className="w-3.5 h-3.5" />
                    <span>{current.tag}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight leading-snug">
                    {current.headline}
                  </h3>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {current.shortDesc}
                  </p>

                  <div className="space-y-3 pt-2">
                    {current.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-xs font-medium text-slate-400">
                      ⚡ <strong>Proven Impact:</strong> {current.stats}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={onOpenTrial}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      <span>Try Free for 14 Days</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={onOpenDemo}
                      className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
                    >
                      Schedule Walkthrough
                    </button>
                  </div>
                </div>

                {/* Right Interactive Visual Representation */}
                <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  
                  {current.visualType === 'qualification' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <span className="text-xs font-semibold text-slate-300">Live Inbound Triage Stream</span>
                        <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Real-time 2026
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-xs text-white">Apex Logistics • Freight Quoting</div>
                          <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800">
                            Score 96 (Hot Lead)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Enriched: $10M+ ARR • 85 employees • CRM: HubSpot Enterprise
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
                          ✓ Routed to SDR Marcus in 38 seconds • Auto-draft queued
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 opacity-75">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-xs text-white">Nordic Growth Studio</div>
                          <span className="bg-yellow-950 text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-800">
                            Score 78 (Qualified)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">Enriched: $2M ARR • CRM: Pipedrive</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 opacity-50">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-xs text-white">Anonymous Student Project</div>
                          <span className="bg-rose-950 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-800">
                            Score 34 (Disqualified)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">Automated self-service guide sent</p>
                      </div>
                    </div>
                  )}

                  {current.visualType === 'sheets' && (
                    <div className="space-y-3 font-mono text-[11px]">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                          <FileSpreadsheet className="w-4 h-4" /> 2-Way Google Sheet Stream
                        </span>
                        <span className="text-slate-400 text-[10px]">Sync latency: 0.2s</span>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                        <div className="text-slate-400 text-[10px] uppercase">Master Sheet Cell Event</div>
                        <div className="text-slate-200">
                          UPDATE [Sheet: "Inbound_2026", Row: 142]
                        </div>
                        <div className="text-emerald-300 bg-slate-950 p-2 rounded border border-slate-800 text-[10px]">
                          SET Cell(G142, "Status") = "Demo Confirmed"<br />
                          ➔ AI Trigger: Update HubSpot Deal #8491 to "Discovery Held"<br />
                          ➔ AI Trigger: Send Calendar invite & reminder SMS
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Zero custom Google Apps Script required.
                      </div>
                    </div>
                  )}

                  {current.visualType === 'crm' && (
                    <div className="space-y-3 font-mono text-[11px]">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-orange-400 font-semibold flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" /> CRM Direct Dispatch Gateway
                        </span>
                        <span className="text-slate-400 text-[10px]">Status: 200 OK</span>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="text-slate-400 text-[10px]">HubSpot & Salesforce Connector</div>
                        <div className="text-slate-300">
                          POST /crm/v3/objects/deals<br />
                          dealname: "Apex Logistics - Automated AI Pipeline"<br />
                          amount: 12000<br />
                          pipeline_stage: "qualified_to_buy"<br />
                          ai_score: 96<br />
                          sla_response_time: "42s"
                        </div>
                      </div>
                      <div className="text-emerald-400 text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized without duplicate records
                      </div>
                    </div>
                  )}

                  {current.visualType === 'builder' && (
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                          <Workflow className="w-4 h-4" /> Visual Workflow Logic
                        </span>
                        <span className="text-slate-400 text-[10px]">Active Production Flow</span>
                      </div>
                      
                      {/* Flow Diagram */}
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <span className="font-semibold text-slate-200">1. Webhook: Inbound Form</span>
                          <span className="text-[10px] text-cyan-400">Webflow / Typeform</span>
                        </div>
                        <div className="w-0.5 h-3 bg-slate-700 mx-auto" />
                        <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-700/50 flex items-center justify-between">
                          <span className="font-semibold text-indigo-200">2. AI Lead Analyzer Node</span>
                          <span className="text-[10px] text-indigo-300">Score & Enrich</span>
                        </div>
                        <div className="w-0.5 h-3 bg-slate-700 mx-auto" />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-center">
                            <div className="text-[10px] font-bold text-emerald-400">Score &gt; 80</div>
                            <div className="text-[10px] text-slate-300 mt-1">Slack Alert + CRM VIP Push</div>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
                            <div className="text-[10px] font-bold text-yellow-400">Score &lt; 80</div>
                            <div className="text-[10px] text-slate-300 mt-1">Nurture Email Campaign</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          );
        })()}

        {/* Phase 4 Architectural Deep Dive: Sync vs Async Decoupled Queue */}
        <div className="mt-16 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-300 mb-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Phase 4 Architecture • Event-Driven Ingestion</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Why Synchronous Webhooks Fail (and How Phase 4 Fixes It)
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Target Ingestion Latency: &lt; 50ms</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* The Problem: Synchronous 6-8s */}
            <div className="rounded-xl border border-red-500/30 bg-red-950/15 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> Without Phase 4 (Synchronous &amp; Fragile)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                    6,000 – 8,000ms Latency
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  The client connection stays frozen while sequentially waiting for external APIs to respond.
                </p>

                <div className="space-y-2 font-mono text-xs text-slate-300 bg-slate-950/80 p-3.5 rounded-lg border border-red-500/20">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Incoming Webhook</span>
                    <span className="text-red-400">0ms</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 pl-3 border-l-2 border-slate-800">
                    <span>├── Enrichment API (Apollo/Clearbit)</span>
                    <span className="text-amber-400">~2,000ms</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 pl-3 border-l-2 border-slate-800">
                    <span>├── OpenAI GPT-4o Evaluation</span>
                    <span className="text-amber-400">~3,500ms</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 pl-3 border-l-2 border-slate-800">
                    <span>└── CRM / Slack Sync</span>
                    <span className="text-amber-400">~1,500ms</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-bold text-red-400">
                    <span>Total HTTP Hold Duration:</span>
                    <span>6,000 - 8,000ms ❌</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-red-500/20 text-[11px] text-red-300 flex items-start gap-2">
                <span className="font-bold text-base leading-none">⚠️</span>
                <span>
                  <strong>High Risk:</strong> Typeform, Webflow &amp; HubSpot drop connections after 3–5s timeouts (HTTP 504 Gateway Timeout), dropping high-value inbound leads forever.
                </span>
              </div>
            </div>

            {/* The Solution: Phase 4 Asynchronous Decoupling */}
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> With Phase 4 (Event-Driven Queue)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    &lt; 50ms Acknowledgment
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Decouples HTTP ingestion from heavy compute using an atomic Redis buffer and background workers.
                </p>

                <div className="space-y-2 font-mono text-xs text-slate-300 bg-slate-950/80 p-3.5 rounded-lg border border-emerald-500/30">
                  <div className="flex items-center justify-between text-emerald-300 font-semibold">
                    <span>1. Inbound Webhook Received</span>
                    <span className="text-emerald-400">&lt; 5ms</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 pl-3 border-l-2 border-emerald-800/60">
                    <span>2. HMAC Check &amp; Redis Rate Limiter</span>
                    <span className="text-emerald-400">&lt; 15ms</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-400 pl-3 border-l-2 border-emerald-800/60 font-bold bg-emerald-950/40 p-1 rounded">
                    <span>3. Return HTTP 202 Accepted</span>
                    <span>&lt; 40ms Total ✅</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 pl-3 border-l-2 border-indigo-800/60 pt-1">
                    <span>4. Background Worker (Redis / Celery)</span>
                    <span className="text-indigo-300">Async Pipeline</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-bold text-slate-200">
                    <span>End-to-End Speed to Lead:</span>
                    <span className="text-indigo-400 font-bold">&lt; 42s total SLA</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Guaranteed Zero-Drop Ingestion:</strong> Inbound forms acknowledge in milliseconds. Heavy enrichment, LLM evaluation, and CRM routing occur with automatic exponential retries.
                </span>
              </div>
            </div>
          </div>

          {/* Complete 5-Phase End-to-End System Architecture Blueprint */}
          <div className="mt-10 pt-8 border-t border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                  Full-Stack Topology
                </span>
                <h4 className="text-lg font-bold text-white mt-1">
                  Complete 5-Phase Production Pipeline Flow
                </h4>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Distributed Pipeline
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
              {/* Stage 1: Inbound & Phase 2 Middleware */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-indigo-500/40 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                    <span className="text-indigo-400 font-bold">STAGE 01</span>
                    <span>&lt; 15ms</span>
                  </div>
                  <h5 className="font-semibold text-sm text-white mb-1">Inbound Webhook</h5>
                  <p className="text-xs text-slate-400 mb-3">Webflow, HubSpot, Stripe, or Custom API</p>
                  <div className="p-2 rounded bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-300 font-mono space-y-1">
                    <div className="font-bold text-white">FastAPI Middleware</div>
                    <div>• X-API-Key Validation</div>
                    <div>• HMAC Signature Check</div>
                    <div>• Redis Rate Limiter</div>
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-slate-400 text-center font-mono">
                  [Phase 2 Security]
                </div>
              </div>

              {/* Stage 2: Queue & 202 Accepted (Phase 4) */}
              <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 hover:border-cyan-400 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300 mb-2">
                    <span className="font-bold">STAGE 02</span>
                    <span>&lt; 200ms</span>
                  </div>
                  <h5 className="font-semibold text-sm text-white mb-1">Queue &amp; Ack</h5>
                  <p className="text-xs text-slate-400 mb-3">Save raw lead to DB, return 202</p>
                  <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-200 font-mono space-y-1">
                    <div className="font-bold text-white">Redis / Celery Queue</div>
                    <div>• Immediate 202 Accepted</div>
                    <div>• Zero dropped leads</div>
                    <div>• Celery Worker Dispatch</div>
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-cyan-300 text-center font-mono">
                  [Phase 4 Asynchronous]
                </div>
              </div>

              {/* Stage 3: Dual Worker Pipeline (Pre-LLM & GPT-4o) */}
              <div className="p-4 rounded-xl border border-purple-500/40 bg-purple-950/20 hover:border-purple-400 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-purple-300 mb-2">
                    <span className="font-bold">STAGE 03</span>
                    <span>~3-5s async</span>
                  </div>
                  <h5 className="font-semibold text-sm text-white mb-1">Worker Execution</h5>
                  <p className="text-xs text-slate-400 mb-3">Dual-engine enrichment &amp; inference</p>
                  <div className="p-2 rounded bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-200 font-mono space-y-1">
                    <div className="font-bold text-white">Enrichment &amp; LLM</div>
                    <div>• Apollo/Clearbit Data</div>
                    <div>• Disposable fast-path</div>
                    <div>• OpenAI GPT-4o JSON</div>
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-purple-300 text-center font-mono">
                  [Phase 3 Intelligence]
                </div>
              </div>

              {/* Stage 4: PostgreSQL Persistence (Phase 1) */}
              <div className="p-4 rounded-xl border border-blue-500/40 bg-blue-950/20 hover:border-blue-400 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-blue-300 mb-2">
                    <span className="font-bold">STAGE 04</span>
                    <span>Durable ACID</span>
                  </div>
                  <h5 className="font-semibold text-sm text-white mb-1">PostgreSQL Store</h5>
                  <p className="text-xs text-slate-400 mb-3">Multi-tenant schema persistence</p>
                  <div className="p-2 rounded bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-200 font-mono space-y-1">
                    <div className="font-bold text-white">PostgreSQL Database</div>
                    <div>• Workspaces &amp; Leads</div>
                    <div>• Scored ICP breakdown</div>
                    <div>• WebhookLog audit trail</div>
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-blue-300 text-center font-mono">
                  [Phase 1 Data Schema]
                </div>
              </div>

              {/* Stage 5: Supabase Realtime & TanStack Query (Phase 5) */}
              <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 mb-2">
                    <span className="font-bold">STAGE 05</span>
                    <span>Real-time</span>
                  </div>
                  <h5 className="font-semibold text-sm text-white mb-1">Live Dashboard</h5>
                  <p className="text-xs text-slate-400 mb-3">Instant reactivity on client</p>
                  <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-200 font-mono space-y-1">
                    <div className="font-bold text-white">Supabase / TanStack</div>
                    <div>• Postgres INSERT listener</div>
                    <div>• Zero-refresh invalidation</div>
                    <div>• Slack SDR Dispatch</div>
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-emerald-300 text-center font-mono">
                  [Phase 5 Realtime Sync]
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
