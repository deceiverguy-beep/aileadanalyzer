import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  FileSpreadsheet, 
  Zap, 
  Mail, 
  ShieldCheck, 
  RefreshCw, 
  Send, 
  Code, 
  Table, 
  Sliders,
  AlertCircle,
  Copy,
  Download,
  Search,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { LeadSubmission, LeadAnalysisResult } from '../types';
import { SAMPLE_LEADS } from '../data/mockData';
import { downloadCsvFile } from '../utils/exportUtils';
import { apiUrl } from '../utils/apiConfig';
import { Score3DGlobe } from './Score3DGlobe';
import { LoadingSpinner } from './LoadingSpinner';

interface LeadAnalyzerDemoProps {
  onOpenTrial: () => void;
  onOpenTemplates: () => void;
}

interface AnalyzedLeadRecord {
  id: string;
  lead: LeadSubmission;
  analysis: LeadAnalysisResult;
  timestamp: string;
  engine: string;
}

export const LeadAnalyzerDemo: React.FC<LeadAnalyzerDemoProps> = ({
  onOpenTrial,
  onOpenTemplates,
}) => {
  const [formData, setFormData] = useState<LeadSubmission>({
    companyName: SAMPLE_LEADS[0].companyName,
    contactName: SAMPLE_LEADS[0].contactName,
    email: SAMPLE_LEADS[0].email,
    estimatedBudget: SAMPLE_LEADS[0].estimatedBudget,
    source: SAMPLE_LEADS[0].source,
    currentCrm: SAMPLE_LEADS[0].currentCrm,
    useCaseDescription: SAMPLE_LEADS[0].useCaseDescription,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisEngine, setAnalysisEngine] = useState('Gemini 3.8 Flash • Real-Time AI');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedSlack, setCopiedSlack] = useState(false);
  const [activeOutputTab, setActiveOutputTab] = useState<'score' | 'sheets' | 'crm' | 'slack' | 'email'>('score');

  // Compute initial local fallback analysis
  const calculateFallback = (data: LeadSubmission): LeadAnalysisResult => {
    const isFree = data.estimatedBudget.includes('$0') || data.email.includes('gmail.com') || data.email.includes('yahoo.com');
    const isEnterprise = data.estimatedBudget.includes('15,000') || data.estimatedBudget.includes('5,000') || data.useCaseDescription.toLowerCase().includes('enterprise');

    let score = 88;
    let tier: LeadAnalysisResult['qualityTier'] = 'Tier 1 - High Priority';
    let icpFit = 92;

    if (isFree) {
      score = 34;
      tier = 'Disqualified';
      icpFit = 28;
    } else if (isEnterprise) {
      score = 96;
      tier = 'Tier 1 - High Priority';
      icpFit = 98;
    } else {
      score = 78;
      tier = 'Tier 2 - Qualified';
      icpFit = 82;
    }

    const signals = isFree
      ? [
          'Generic freemail domain detected (low commercial intent)',
          'Zero software budget allocated for automation infrastructure',
          'Self-service nurture path recommended; bypass human SDR',
        ]
      : [
          'High purchase intent detected in inquiry payload',
          'Clear high-volume bottleneck: manual spreadsheet copying',
          `Existing investment in ${data.currentCrm || 'CRM stack'}`,
          'Executive contact with direct operational decision authority',
        ];

    const action = isFree
      ? 'Route to free educational nurture drip; bypass human SDR routing.'
      : `Trigger instant VIP Slack notification, append to Google Sheet, and create Deal in ${data.currentCrm || 'HubSpot'} within 42 seconds.`;

    const rep = isEnterprise ? 'Marcus Vance (Senior Enterprise Rep)' : isFree ? 'Automated Bot (No Rep)' : 'Elena Rostova (SMB Account Exec)';
    const status = isFree ? 'Archived / Nurture' : 'VIP Hot Lead';

    return {
      score,
      qualityTier: tier,
      icpFitPercent: icpFit,
      intentSignals: signals,
      recommendedAction: action,
      suggestedFollowUpEmail: {
        subject: `Automating workflows & ${data.currentCrm || 'CRM'} sync for ${data.companyName}`,
        body: `Hi ${data.contactName.split(' ')[0]},\n\nI reviewed your inquiry regarding ${data.companyName}'s spreadsheet bottlenecks.\n\nWith AI Lead Analyzer, we can connect your inbound workflows directly to Google Sheets and ${data.currentCrm || 'your CRM'} in under 15 minutes, cutting your response time from hours to 42 seconds.\n\nWould you have 10 minutes tomorrow for a live demonstration?\n\nBest,\nUzair\nFounder, AI Lead Analyzer`,
      },
      sheetsSyncPayload: {
        rowId: `ROW-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        company: data.companyName,
        score,
        assignedRep: rep,
        crmStatus: status,
      },
      crmWebhookData: {
        endpoint: `https://api.aileadanalyzer.com/v1/crm/sync/${data.currentCrm.toLowerCase().includes('salesforce') ? 'salesforce' : 'hubspot'}`,
        objectType: 'contact_and_deal',
        properties: {
          company_name: data.companyName,
          contact_name: data.contactName,
          email_address: data.email,
          ai_lead_score: score,
          icp_fit_percentage: icpFit,
          budget_bracket: data.estimatedBudget,
          pipeline_stage: isFree ? 'unqualified' : 'qualified_to_buy',
          source_channel: data.source,
        },
      },
    };
  };

  const [analysisResult, setAnalysisResult] = useState<LeadAnalysisResult>(calculateFallback(SAMPLE_LEADS[0]));

  // History state for sorting and interactive lead inspection
  const [analyzedHistory, setAnalyzedHistory] = useState<AnalyzedLeadRecord[]>([
    {
      id: 'REC-01',
      lead: SAMPLE_LEADS[0],
      analysis: calculateFallback(SAMPLE_LEADS[0]),
      timestamp: 'Just now',
      engine: 'Gemini 3.8 Flash',
    },
    {
      id: 'REC-02',
      lead: SAMPLE_LEADS[1],
      analysis: calculateFallback(SAMPLE_LEADS[1]),
      timestamp: '5m ago',
      engine: 'Gemini 3.8 Flash',
    },
    {
      id: 'REC-03',
      lead: SAMPLE_LEADS[2],
      analysis: calculateFallback(SAMPLE_LEADS[2]),
      timestamp: '12m ago',
      engine: 'Gemini 3.8 Flash',
    },
  ]);

  // Filtering & Sorting Phase State
  const [searchHistory, setSearchHistory] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'hot' | 'warm' | 'disqualified'>('all');
  const [sortOption, setSortOption] = useState<'score-desc' | 'score-asc' | 'company-az' | 'recent'>('score-desc');

  // Trigger Live AI Analysis via Server Endpoint
  const performAnalysis = async (data: LeadSubmission) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch(apiUrl('/api/analyze-lead'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        setAnalysisResult(json.data);
        setAnalysisEngine(json.poweredBy || 'Gemini 3.8 Flash');

        const engineLabel = json.poweredBy
          ? json.poweredBy.replace(' (Live Server Inference)', '').replace(' (Fallback Mode)', '')
          : 'Gemini AI';

        // Add to history
        const newRecord: AnalyzedLeadRecord = {
          id: `REC-${Date.now().toString().slice(-4)}`,
          lead: { ...data },
          analysis: json.data,
          timestamp: 'Just now',
          engine: engineLabel,
        };
        setAnalyzedHistory((prev) => [newRecord, ...prev.filter((r) => r.lead.companyName !== data.companyName)]);
      } else {
        throw new Error('Fallback triggered');
      }
    } catch (err) {
      // Graceful heuristic fallback
      const fallback = calculateFallback(data);
      setAnalysisResult(fallback);
      setAnalysisEngine('Deterministic Rule Engine');
      const newRecord: AnalyzedLeadRecord = {
        id: `REC-${Date.now().toString().slice(-4)}`,
        lead: { ...data },
        analysis: fallback,
        timestamp: 'Just now',
        engine: 'Rule Engine',
      };
      setAnalyzedHistory((prev) => [newRecord, ...prev.filter((r) => r.lead.companyName !== data.companyName)]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_LEADS[0]) => {
    setFormData(sample);
    performAnalysis(sample);
  };

  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    performAnalysis(formData);
  };

  const handleInspectHistoryLead = (record: AnalyzedLeadRecord) => {
    setFormData(record.lead);
    setAnalysisResult(record.analysis);
    setAnalysisEngine(record.engine);
    // Scroll smoothly to output container
    const el = document.getElementById('analysis-output-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const copyToClipboard = (text: string, type: 'email' | 'json' | 'slack') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else if (type === 'json') {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } else {
      setCopiedSlack(true);
      setTimeout(() => setCopiedSlack(false), 2000);
    }
  };

  // Export current lead history as CSV
  const handleExportHistoryCsv = () => {
    const headers = ['Record ID', 'Company', 'Contact Name', 'Email', 'Budget', 'Current CRM', 'Intent Score', 'Quality Tier', 'ICP Fit %', 'Recommended Action'];
    const rows = analyzedHistory.map((rec) => [
      rec.id,
      rec.lead.companyName,
      rec.lead.contactName,
      rec.lead.email,
      rec.lead.estimatedBudget,
      rec.lead.currentCrm,
      rec.analysis.score.toString(),
      rec.analysis.qualityTier,
      `${rec.analysis.icpFitPercent}%`,
      rec.analysis.recommendedAction,
    ]);

    const csvContent = [
      headers.map((h) => `"${h}"`).join(','),
      ...rows.map((row) => row.map((c) => `"${(c || '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    downloadCsvFile(`ai-analyzed-leads-${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
  };

  // Process sorting and filtering
  const filteredHistory = analyzedHistory
    .filter((rec) => {
      const query = searchHistory.toLowerCase();
      const matchesSearch =
        query === '' ||
        rec.lead.companyName.toLowerCase().includes(query) ||
        rec.lead.contactName.toLowerCase().includes(query) ||
        rec.lead.email.toLowerCase().includes(query);

      let matchesTier = true;
      if (tierFilter === 'hot') matchesTier = rec.analysis.score >= 85;
      else if (tierFilter === 'warm') matchesTier = rec.analysis.score >= 60 && rec.analysis.score < 85;
      else if (tierFilter === 'disqualified') matchesTier = rec.analysis.score < 60;

      return matchesSearch && matchesTier;
    })
    .sort((a, b) => {
      if (sortOption === 'score-desc') return b.analysis.score - a.analysis.score;
      if (sortOption === 'score-asc') return a.analysis.score - b.analysis.score;
      if (sortOption === 'company-az') return a.lead.companyName.localeCompare(b.lead.companyName);
      return 0; // recent preserves array order
    });

  return (
    <section id="demo-tool" className="py-20 bg-slate-900/60 border-y border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-300 mb-3 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Live Inference Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
            Test the AI Lead Analyzer Engine Live
          </h2>
          <p className="mt-3 text-slate-300 text-base leading-relaxed">
            Witness how raw form submissions are instantly enriched with Gemini LLM reasoning, scored for purchase intent, synchronized into Google Sheets, and pushed to your CRM in 42 seconds.
          </p>
        </div>

        {/* Sample lead scenario pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
            Load Pre-Configured Scenario:
          </span>
          {SAMPLE_LEADS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(sample)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                formData.companyName === sample.companyName
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {idx === 0 && '🔥 Enterprise ($15k/mo Lead)'}
              {idx === 1 && '⚡ B2B Agency Lead'}
              {idx === 2 && '🚫 Low Intent / Freebie'}
            </button>
          ))}
        </div>

        {/* Two-Column Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Form Input / Ingestion Simulator */}
          <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-indigo-400" />
                  Inbound Lead Ingestion
                </h3>
                <p className="text-xs text-slate-400">Simulate a submission from your website form</p>
              </div>
              <span className="text-[11px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/50">
                POST /api/analyze-lead
              </span>
            </div>

            <form onSubmit={handleRunAnalysis} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Work Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estimated Budget</label>
                  <select
                    value={formData.estimatedBudget}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="$5,000 - $15,000/mo">$5,000 - $15,000/mo (Enterprise)</option>
                    <option value="$1,000 - $3,000/mo">$1,000 - $3,000/mo (Growth)</option>
                    <option value="$500 - $1,000/mo">$500 - $1,000/mo (Starter)</option>
                    <option value="$0 (Looking for free tier)">$0 (Free tier / No budget)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Current CRM</label>
                  <select
                    value={formData.currentCrm}
                    onChange={(e) => setFormData({ ...formData, currentCrm: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="HubSpot Enterprise">HubSpot</option>
                    <option value="Salesforce Cloud">Salesforce</option>
                    <option value="Pipedrive">Pipedrive</option>
                    <option value="Zoho CRM">Zoho CRM</option>
                    <option value="None / Personal Excel">None / Manual Sheets</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Use Case & Bottleneck Description</label>
                <textarea
                  rows={3}
                  value={formData.useCaseDescription}
                  onChange={(e) => setFormData({ ...formData, useCaseDescription: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-medium text-xs resize-none"
                  required
                />
              </div>

              {/* Visual Feedback during Lead Processing API Call */}
              {isAnalyzing && (
                <div className="p-3.5 rounded-xl bg-indigo-950/70 border border-indigo-500/40 backdrop-blur-md shadow-lg transition-all animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <LoadingSpinner size="sm" variant="cyan" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">
                          Processing via Gemini AI...
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/40">
                          Speed-to-lead: 42s
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Evaluating intent signals, computing qualification score & CRM payload
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <LoadingSpinner
                    size="sm"
                    variant="white"
                    inline
                    label="Evaluating Lead with Gemini AI..."
                  />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    <span>Run AI Lead Qualification & 2-Way Sync</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Automated Output & Multi-Tab Inspection */}
          <div id="analysis-output-panel" className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col">
            
            {/* Tab Navigation */}
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2 mb-4">
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  onClick={() => setActiveOutputTab('score')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeOutputTab === 'score'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-300" />
                  Score & Intent
                </button>
                <button
                  onClick={() => setActiveOutputTab('sheets')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeOutputTab === 'sheets'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
                  Google Sheets Sync
                </button>
                <button
                  onClick={() => setActiveOutputTab('crm')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeOutputTab === 'crm'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Code className="w-3.5 h-3.5 text-orange-300" />
                  CRM Payload
                </button>
                <button
                  onClick={() => setActiveOutputTab('slack')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeOutputTab === 'slack'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                  Slack Alert Card
                </button>
                <button
                  onClick={() => setActiveOutputTab('email')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeOutputTab === 'email'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-sky-300" />
                  Auto-Drafted Email
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className={`flex h-2 w-2 rounded-full ${isAnalyzing ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                <span className={`text-[11px] font-mono font-semibold ${isAnalyzing ? 'text-cyan-300' : 'text-emerald-400'}`}>
                  {isAnalyzing ? 'AI Reasoning in Flight...' : analysisEngine}
                </span>
              </div>
            </div>

            {/* In-Flight Processing Spinner State */}
            {isAnalyzing ? (
              <div className="py-16 px-4 flex flex-col items-center justify-center my-auto min-h-[360px] animate-fadeIn">
                <LoadingSpinner
                  size="xl"
                  variant="gradient"
                  steps={[
                    'Ingesting inbound lead payload...',
                    'Querying Gemini 3.8 Flash inference model...',
                    'Extracting purchase intent & budget signals...',
                    'Calculating ICP Fit % and Quality Tier...',
                    'Synthesizing 2-way Google Sheets row & CRM Deal...',
                  ]}
                  sublabel="Sub-second AI qualification pipeline active"
                />
              </div>
            ) : (
              <>
            {/* TAB 1: SCORE & INTENT BREAKDOWN */}
            {activeOutputTab === 'score' && (
              <div className="space-y-5 animate-fadeIn">
                {/* Score Hero Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* 3D Lead Score Radial Card */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center justify-center overflow-hidden">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">3D Intent Matrix</div>
                    <Score3DGlobe score={analysisResult.score} icpFit={analysisResult.icpFitPercent} />
                    <span className={`mt-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      analysisResult.score >= 80
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                        : analysisResult.score >= 50
                        ? 'bg-yellow-950 text-yellow-300 border border-yellow-800/40'
                        : 'bg-rose-950 text-rose-300 border border-rose-800/40'
                    }`}>
                      {analysisResult.qualityTier}
                    </span>
                  </div>

                  {/* ICP Fit */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center justify-center">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">ICP Fit Match</div>
                    <div className="text-4xl font-extrabold text-cyan-400 font-display">
                      {analysisResult.icpFitPercent}%
                    </div>
                    <span className="mt-1.5 text-[11px] text-slate-400 font-medium">
                      {analysisResult.icpFitPercent > 80 ? 'Ideal Enterprise ICP' : 'Mid-Market Match'}
                    </span>
                  </div>

                  {/* Speed to Lead Clock */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center flex flex-col items-center justify-center">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Response Time</div>
                    <div className="text-4xl font-extrabold text-indigo-400 font-display">
                      42<span className="text-lg text-slate-500 font-normal">s</span>
                    </div>
                    <span className="mt-1.5 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Zero SLA Breach
                    </span>
                  </div>
                </div>

                {/* Signals & Recommended Action */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Detected Buying Signals & Evaluation
                    </h4>
                    <ul className="space-y-1.5">
                      {analysisResult.intentSignals.map((sig, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{sig}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40">
                    <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
                      Automated Routing Instruction
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {analysisResult.recommendedAction}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GOOGLE SHEETS LIVE PREVIEW */}
            {activeOutputTab === 'sheets' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-200">
                      Master_Lead_Pipeline_2026.gsheet
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/80 border border-emerald-800/40 px-2 py-0.5 rounded">
                    Synced in 0.42s
                  </span>
                </div>

                {/* Simulated Google Sheet Table */}
                <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/80">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                        <th className="py-2.5 px-3 border-r border-slate-800">Row #</th>
                        <th className="py-2.5 px-3 border-r border-slate-800">Timestamp</th>
                        <th className="py-2.5 px-3 border-r border-slate-800">Company</th>
                        <th className="py-2.5 px-3 border-r border-slate-800">AI Score</th>
                        <th className="py-2.5 px-3 border-r border-slate-800">Assigned Rep</th>
                        <th className="py-2.5 px-3">CRM Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-800/60 bg-emerald-950/20 font-mono text-emerald-300 font-medium">
                        <td className="py-2.5 px-3 border-r border-slate-800 text-slate-400">{analysisResult.sheetsSyncPayload.rowId}</td>
                        <td className="py-2.5 px-3 border-r border-slate-800">{analysisResult.sheetsSyncPayload.timestamp}</td>
                        <td className="py-2.5 px-3 border-r border-slate-800 font-bold text-white">{analysisResult.sheetsSyncPayload.company}</td>
                        <td className="py-2.5 px-3 border-r border-slate-800">
                          <span className="px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 font-bold">
                            {analysisResult.sheetsSyncPayload.score}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-800 text-slate-300">{analysisResult.sheetsSyncPayload.assignedRep}</td>
                        <td className="py-2.5 px-3 text-cyan-400 font-bold">{analysisResult.sheetsSyncPayload.crmStatus}</td>
                      </tr>
                      <tr className="border-b border-slate-800/40 text-slate-400">
                        <td className="py-2 px-3 border-r border-slate-800 text-slate-500">ROW-9412</td>
                        <td className="py-2 px-3 border-r border-slate-800">10:14:02 AM</td>
                        <td className="py-2 px-3 border-r border-slate-800">Vortex Logistics</td>
                        <td className="py-2 px-3 border-r border-slate-800">92</td>
                        <td className="py-2 px-3 border-r border-slate-800">Marcus Vance</td>
                        <td className="py-2 px-3 text-emerald-400">Synced to HubSpot</td>
                      </tr>
                      <tr className="text-slate-400">
                        <td className="py-2 px-3 border-r border-slate-800 text-slate-500">ROW-9411</td>
                        <td className="py-2 px-3 border-r border-slate-800">09:58:34 AM</td>
                        <td className="py-2 px-3 border-r border-slate-800">ClearWater Agency</td>
                        <td className="py-2 px-3 border-r border-slate-800">81</td>
                        <td className="py-2 px-3 border-r border-slate-800">Elena Rostova</td>
                        <td className="py-2 px-3 text-cyan-400">Pipedrive Deal Created</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Bi-Directional Event Bus:</strong> Any edit made to the 'Assigned Rep' or 'CRM Status' column in your real Google Sheet will sync back to {formData.currentCrm} in real-time.
                  </span>
                </div>
              </div>
            )}

            {/* TAB 3: CRM WEBHOOK PAYLOAD */}
            {activeOutputTab === 'crm' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-orange-400 font-semibold">
                    POST {analysisResult.crmWebhookData.endpoint}
                  </span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(analysisResult.crmWebhookData, null, 2), 'json')}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedJson ? 'Copied' : 'Copy JSON'}
                  </button>
                </div>

                <pre className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto max-h-60 leading-relaxed">
                  {JSON.stringify(analysisResult.crmWebhookData, null, 2)}
                </pre>

                <p className="text-[11px] text-slate-400 leading-normal">
                  This payload is automatically formatted for your CRM's v3 Contacts and Deals API. Includes calculated pipeline stage and custom AI fields without requiring Zapier tasks.
                </p>
              </div>
            )}

            {/* TAB 4: SLACK HOT LEAD ALERT CARD */}
            {activeOutputTab === 'slack' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-mono font-bold text-slate-200">#sales-hot-leads-instant</span>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `🔥 HOT LEAD ALERT: ${formData.contactName} from ${formData.companyName} (Score: ${analysisResult.score}/100)\nAction: ${analysisResult.recommendedAction}`,
                        'slack'
                      )
                    }
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedSlack ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSlack ? 'Copied Card' : 'Copy Slack Text'}
                  </button>
                </div>

                {/* Slack Interactive Block Preview */}
                <div className="bg-[#1A1D21] border border-slate-700 rounded-xl p-4 font-sans text-xs space-y-3 shadow-lg">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-[11px] shrink-0">
                      ⚡
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">AI Lead Analyzer Bot</span>
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-1 py-0.2 rounded font-mono">APP</span>
                        <span className="text-[10px] text-slate-400">Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="mt-1 text-sm font-semibold text-rose-400 flex items-center gap-1.5">
                        <span>🔥</span>
                        <span>
                          {analysisResult.score >= 80 ? 'HOT LEAD ALERT (Score ≥ 80)' : 'INBOUND LEAD NOTIFICATION'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-emerald-500 pl-3.5 py-1 space-y-2 bg-slate-900/50 rounded-r-md">
                    <div className="grid grid-cols-2 gap-2 text-slate-300 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold">Contact:</span> {formData.contactName} ({formData.email})
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Company:</span> {formData.companyName}
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Lead Score:</span> <span className="text-emerald-400 font-bold">{analysisResult.score}/100</span> ({analysisResult.qualityTier})
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Target CRM:</span> {formData.currentCrm}
                      </div>
                    </div>

                    <div className="text-xs pt-1 border-t border-slate-800 text-slate-300">
                      <span className="text-slate-400 font-semibold">AI Routing Summary:</span> {analysisResult.recommendedAction}
                    </div>

                    <div className="text-xs bg-slate-950/80 p-2.5 rounded border border-slate-800">
                      <span className="text-cyan-400 font-semibold block mb-0.5">Ready-to-Send 1-Click AE Reply:</span>
                      <span className="text-slate-300 italic">{analysisResult.suggestedFollowUpEmail.body.slice(0, 160)}...</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={onOpenTrial}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[11px] transition-colors"
                    >
                      Instant SDR 1-Click Dial
                    </button>
                    <button
                      onClick={() => setActiveOutputTab('crm')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold text-[11px] transition-colors"
                    >
                      Open in {formData.currentCrm}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    Dispatched automatically via <code className="text-cyan-300 font-mono">SLACK_WEBHOOK_URL</code> whenever a lead scores <strong>≥ 80</strong> (Hot tier).
                  </span>
                </div>
              </div>
            )}

            {/* TAB 5: SUGGESTED FOLLOW-UP EMAIL */}
            {activeOutputTab === 'email' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    Generated Personalized Follow-Up
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `Subject: ${analysisResult.suggestedFollowUpEmail.subject}\n\n${analysisResult.suggestedFollowUpEmail.body}`,
                        'email'
                      )
                    }
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedEmail ? 'Copied Draft' : 'Copy Draft'}
                  </button>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Subject:</span>{' '}
                    <span className="text-white font-bold">{analysisResult.suggestedFollowUpEmail.subject}</span>
                  </div>
                  <div className="border-t border-slate-800 pt-3 text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                    {analysisResult.suggestedFollowUpEmail.body}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  Ready to send via Gmail, Outlook, or automatically injected into a personalized HubSpot sequence.
                </p>
              </div>
            )}
              </>
            )}

            {/* Bottom Actions */}
            <div className="pt-5 mt-auto border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Want to connect your real Google Sheet & CRM?
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenTrial}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <span>Connect Your Live Stack</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE LEAD SORTING & FILTERING PHASE STUDIO (EASY TO INTERACT) */}
        {/* ========================================================================= */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  Analyzed Leads Ledger & Real-Time Triage
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-slate-800 font-mono font-semibold">
                  {filteredHistory.length} Record{filteredHistory.length !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Filter and sort analyzed leads by intent score, quality tier, or company. Click any row to inspect its full AI email & webhook output above.
              </p>
            </div>

            {/* CSV Export Action Button */}
            <button
              onClick={handleExportHistoryCsv}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-semibold shadow-sm transition-all cursor-pointer shrink-0"
              title="Download full analyzed ledger in CSV format"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Analyzed Leads (.CSV)</span>
            </button>
          </div>

          {/* Interactive Sorting & Filtering Controls Bar */}
          <div className="py-4 flex flex-col lg:flex-row items-center justify-between gap-3 border-b border-slate-800/80">
            
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-indigo-400" /> Filter:
              </span>
              <button
                onClick={() => setTierFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  tierFilter === 'all'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                All Leads ({analyzedHistory.length})
              </button>
              <button
                onClick={() => setTierFilter('hot')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  tierFilter === 'hot'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                🔥 Hot / VIP (85+) ({analyzedHistory.filter((r) => r.analysis.score >= 85).length})
              </button>
              <button
                onClick={() => setTierFilter('warm')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  tierFilter === 'warm'
                    ? 'bg-yellow-600 text-white border-yellow-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                ⚡ Qualified (60–84) ({analyzedHistory.filter((r) => r.analysis.score >= 60 && r.analysis.score < 85).length})
              </button>
              <button
                onClick={() => setTierFilter('disqualified')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  tierFilter === 'disqualified'
                    ? 'bg-rose-600 text-white border-rose-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                🚫 Nurture / Disqualified ({analyzedHistory.filter((r) => r.analysis.score < 60).length})
              </button>
            </div>

            {/* Search and Sort Phase */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              
              {/* Search input */}
              <div className="relative flex-1 lg:w-56">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter company or contact..."
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
                >
                  <option value="score-desc">Score: Highest to Lowest</option>
                  <option value="score-asc">Score: Lowest to Highest</option>
                  <option value="company-az">Company Name: A to Z</option>
                  <option value="recent">Most Recent First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3">Company & Contact</th>
                  <th className="py-2.5 px-3">Declared Budget</th>
                  <th className="py-2.5 px-3">CRM Stack</th>
                  <th className="py-2.5 px-3 text-center">AI Intent Score</th>
                  <th className="py-2.5 px-3">Quality Tier</th>
                  <th className="py-2.5 px-3">ICP Fit</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500 text-xs">
                      No matching leads found for current filter or search query.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((rec) => {
                    const isSelected = formData.companyName === rec.lead.companyName;
                    return (
                      <tr
                        key={rec.id}
                        onClick={() => handleInspectHistoryLead(rec)}
                        className={`transition-colors cursor-pointer group ${
                          isSelected ? 'bg-indigo-950/30' : 'hover:bg-slate-900/60'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                            {rec.lead.companyName}
                            {isSelected && (
                              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-500/40">
                                Active in Studio
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {rec.lead.contactName} • {rec.lead.email}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-300 font-medium">
                          {rec.lead.estimatedBudget}
                        </td>
                        <td className="py-3 px-3 text-slate-400">
                          {rec.lead.currentCrm}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md font-extrabold font-mono text-xs ${
                              rec.analysis.score >= 80
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                                : rec.analysis.score >= 50
                                ? 'bg-yellow-950 text-yellow-300 border border-yellow-700/50'
                                : 'bg-rose-950 text-rose-300 border border-rose-700/50'
                            }`}
                          >
                            {rec.analysis.score}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              rec.analysis.score >= 80
                                ? 'text-emerald-400 bg-emerald-950/50'
                                : rec.analysis.score >= 50
                                ? 'text-yellow-400 bg-yellow-950/50'
                                : 'text-rose-400 bg-rose-950/50'
                            }`}
                          >
                            {rec.analysis.qualityTier}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-cyan-400">
                          {rec.analysis.icpFitPercent}%
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInspectHistoryLead(rec);
                            }}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 group-hover:underline cursor-pointer"
                          >
                            <span>Inspect</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <span>
              💡 Tip: Click any row in the ledger to automatically load its generated email draft and CRM sync webhook into the live studio.
            </span>
            <span className="font-mono text-emerald-400 font-semibold">
              Live bi-directional sync active
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
