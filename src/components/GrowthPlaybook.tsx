import React, { useState } from 'react';
import { 
  Mail, 
  Calendar, 
  Share2, 
  TrendingUp, 
  Link2, 
  DollarSign, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight, 
  Send,
  FileSpreadsheet,
  Layers,
  Award,
  Video,
  ExternalLink,
  Download,
  CheckCircle2,
  Search,
  Filter,
  Code
} from 'lucide-react';
import { 
  EMAIL_FUNNEL_STEPS, 
  CONTENT_CALENDAR, 
  SOCIAL_STRATEGIES, 
  GROWTH_ROADMAP 
} from '../data/mockData';
import { 
  downloadJsonFile, 
  downloadCsvFile, 
  FULL_WORKFLOW_TEMPLATES_VAULT 
} from '../utils/exportUtils';

interface GrowthPlaybookProps {
  onOpenConsulting: () => void;
  onOpenTemplates: () => void;
}

export const GrowthPlaybook: React.FC<GrowthPlaybookProps> = ({
  onOpenConsulting,
  onOpenTemplates,
}) => {
  const [activeTab, setActiveTab] = useState<
    'email' | 'calendar' | 'social' | 'roadmap' | 'outreach' | 'monetization' | 'templates'
  >('templates');
  const [activeEmailDay, setActiveEmailDay] = useState<string>('Day 0');
  const [copiedEmailIndex, setCopiedEmailIndex] = useState<number | null>(null);

  // Outreach form customization state
  const [outreachName, setOutreachName] = useState('Alex');
  const [outreachSite, setOutreachSite] = useState('SaaSGrowthDaily.com');
  const [copiedOutreach, setCopiedOutreach] = useState(false);

  // Template vault state
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategory, setTemplateCategory] = useState('All');
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);
  const [downloadedAllJson, setDownloadedAllJson] = useState(false);

  const selectedEmail = EMAIL_FUNNEL_STEPS.find((s) => s.day === activeEmailDay) || EMAIL_FUNNEL_STEPS[0];

  const generateOutreachBody = () => {
    return `Subject: Collaboration Opportunity — AI Automation Content

Hi ${outreachName || '[Name]'},

I’ve been following your work on ${outreachSite || '[Website/Blog]'} and really value your insights on automation and SaaS. I recently launched AI Lead Analyzer, a tool that helps small businesses automate workflows and CRM integration.

I’d love to collaborate by contributing a guest post or case study that adds value to your readers. In return, I’d be happy to feature your site in our resources section.

Here are a few suggested topics:
• “How Small Businesses Can Save 20 Hours/Week with AI Automation”
• “Google Sheets + AI Workflows: A Practical Guide”
• “The Future of CRM Automation in 2026”

Would you be open to discussing this further?

Best regards,
Uzair
Founder, AI Lead Analyzer`;
  };

  const handleCopyOutreach = () => {
    navigator.clipboard.writeText(generateOutreachBody());
    setCopiedOutreach(true);
    setTimeout(() => setCopiedOutreach(false), 2000);
  };

  const handleCopyEmail = (body: string, idx: number) => {
    navigator.clipboard.writeText(body);
    setCopiedEmailIndex(idx);
    setTimeout(() => setCopiedEmailIndex(null), 2000);
  };

  // Download all templates vault as JSON
  const handleDownloadVaultJson = () => {
    downloadJsonFile('ai-automation-templates-vault-2026.json', {
      schemaVersion: '2026.2',
      curatedBy: 'Uzair, Founder of AI Lead Analyzer',
      license: 'MIT / Free Community License',
      templates: FULL_WORKFLOW_TEMPLATES_VAULT,
    });
    setDownloadedAllJson(true);
    setTimeout(() => setDownloadedAllJson(false), 2500);
  };

  // Download templates index as CSV
  const handleDownloadTemplatesCsv = () => {
    const headers = ['Template ID', 'Template Name', 'Category', 'Tools Compatible', 'Weekly Hours Saved', 'Description'];
    const rows = FULL_WORKFLOW_TEMPLATES_VAULT.map((tpl) => [
      tpl.id,
      tpl.name,
      tpl.category,
      tpl.compatibility.join('; '),
      `${tpl.timeSavedHoursWeekly} hrs/wk`,
      tpl.description,
    ]);

    const csv = [
      headers.map((h) => `"${h}"`).join(','),
      ...rows.map((r) => r.map((c) => `"${(c || '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    downloadCsvFile('workflow-templates-index-2026.csv', csv);
  };

  // Download single template as JSON
  const handleDownloadSingleTemplate = (tpl: (typeof FULL_WORKFLOW_TEMPLATES_VAULT)[0]) => {
    downloadJsonFile(`${tpl.id.toLowerCase()}-${tpl.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`, tpl);
  };

  // Copy single template JSON payload
  const handleCopyTemplateJson = (tpl: (typeof FULL_WORKFLOW_TEMPLATES_VAULT)[0]) => {
    navigator.clipboard.writeText(JSON.stringify(tpl, null, 2));
    setCopiedTemplateId(tpl.id);
    setTimeout(() => setCopiedTemplateId(null), 2000);
  };

  const templateCategories = ['All', 'Google Sheets Automation', 'CRM Integration', 'AI Workflow Automation', 'Monetization & Retention'];

  const filteredTemplates = FULL_WORKFLOW_TEMPLATES_VAULT.filter((tpl) => {
    const matchesCategory = templateCategory === 'All' || tpl.category === templateCategory;
    const query = templateSearch.toLowerCase();
    const matchesSearch =
      query === '' ||
      tpl.name.toLowerCase().includes(query) ||
      tpl.description.toLowerCase().includes(query) ||
      tpl.compatibility.some((tool) => tool.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="growth-playbook" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1 text-xs font-semibold text-indigo-300 mb-3 shadow-inner">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>Operational Launch & Scaling Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
            Uzair’s Marketing Funnel, Content Engine & Growth Roadmap
          </h2>
          <p className="mt-3 text-slate-300 text-base leading-relaxed">
            The full operational playbook to rank quickly on Google, nurture leads through email, syndicate social authority, and scale to 20,000+ monthly visits.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-cyan-200" />
            <span>15+ Template Vault (.JSON & .CSV)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-200 font-bold uppercase">
              Live Vault
            </span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'email'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Funnel (Day 0–13)</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>3-Month Content Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'social'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Social Media Strategy</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>12-Month Growth Roadmap</span>
          </button>

          <button
            onClick={() => setActiveTab('outreach')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'outreach'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Backlink Outreach Pitch</span>
          </button>

          <button
            onClick={() => setActiveTab('monetization')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'monetization'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Monetization & Consulting</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 0: 15+ WORKFLOW TEMPLATES VAULT (DOWNLOADABLE GENERATION ENGINE) */}
        {/* ========================================================================= */}
        {activeTab === 'templates' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Vault Actions Banner */}
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center lg:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800/50 px-3 py-0.5 rounded-full">
                  Free Production Blueprints (.JSON & .CSV)
                </span>
                <h3 className="text-2xl font-bold text-white font-display">
                  The 2026 AI Automation & CRM Template Vault
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Pre-configured workflow architectures for Make, Zapier, Google Sheets, HubSpot, and Salesforce. Instant one-click file generation for immediate deployment.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                <button
                  onClick={handleDownloadTemplatesCsv}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download Catalog (.CSV)</span>
                </button>
                <button
                  onClick={handleDownloadVaultJson}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-indigo-600/30"
                >
                  {downloadedAllJson ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Vault Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-cyan-200" />
                      <span>Download Full Vault (.JSON)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Template Filters & Search */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5 text-indigo-400" /> Category:
                </span>
                {templateCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTemplateCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      templateCategory === cat
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tools (HubSpot, Sheets, Slack)..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-slate-900/80 border border-slate-800/90 hover:border-slate-750 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded">
                        {tpl.id} • {tpl.category}
                      </span>
                      <span className="text-xs font-mono font-semibold text-emerald-400">
                        Saves {tpl.timeSavedHoursWeekly} hrs/wk
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {tpl.name}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {tpl.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tpl.compatibility.map((tool, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyTemplateJson(tpl)}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 transition-colors cursor-pointer"
                    >
                      {copiedTemplateId === tpl.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedTemplateId === tpl.id ? 'Copied' : 'Copy JSON'}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadSingleTemplate(tpl)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-200" />
                      <span>Download .JSON</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 1: EMAIL FUNNEL ENGINE */}
        {activeTab === 'email' && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl animate-fadeIn">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Day Selector Steps */}
              <div className="lg:w-1/3 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Funnel Stage:
                </div>
                {EMAIL_FUNNEL_STEPS.map((step, idx) => (
                  <button
                    key={step.day}
                    onClick={() => setActiveEmailDay(step.day)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeEmailDay === step.day
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider">
                        {step.day}
                      </span>
                      <span className="text-[10px] opacity-80">{step.stage}</span>
                    </div>
                    <div className="text-xs font-medium truncate">
                      {step.subject}
                    </div>
                  </button>
                ))}
              </div>

              {/* Email Content Preview */}
              <div className="lg:w-2/3 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                    <div>
                      <span className="text-xs font-mono text-cyan-400">{selectedEmail.stage}</span>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        Subject: {selectedEmail.subject}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Preview: {selectedEmail.previewText}</p>
                    </div>

                    <button
                      onClick={() => handleCopyEmail(selectedEmail.body, 1)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedEmailIndex === 1 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedEmailIndex === 1 ? 'Copied' : 'Copy Email'}
                    </button>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans bg-slate-900/50 p-4 rounded-xl border border-slate-850 mb-6">
                    {selectedEmail.body}
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Target Outcome & Conversion Tips:
                    </div>
                    <ul className="space-y-1.5">
                      {selectedEmail.conversionTips.map((tip, i) => (
                        <li key={i} className="text-xs text-slate-400 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Sign-off: <strong>Uzair, Founder</strong></span>
                  <span>Automated Drip Sequence (Klaviyo / Customer.io)</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: 3-MONTH CONTENT CALENDAR */}
        {activeTab === 'calendar' && (
          <div className="space-y-8 animate-fadeIn">
            {CONTENT_CALENDAR.map((month) => (
              <div key={month.monthName} className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800 mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">
                      {month.monthName}
                    </h3>
                    <p className="text-xs text-cyan-400 font-medium">{month.theme}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Target: High-Intent SEO & Commercial Conversions
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {month.weeks.map((week) => (
                    <div key={week.weekNumber} className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-mono font-bold text-indigo-400">
                            Week {week.weekNumber}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                            {week.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white mb-2 leading-snug line-clamp-3">
                          {week.title}
                        </h4>
                        <div className="text-[11px] text-slate-400 font-mono mb-2">
                          KW: #{week.targetKeyword}
                        </div>
                      </div>

                      <div className="border-t border-slate-850 pt-2.5 mt-2 flex flex-wrap gap-1">
                        {week.distributionChannels.map((ch, i) => (
                          <span key={i} className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SOCIAL MEDIA STRATEGY */}
        {activeTab === 'social' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {SOCIAL_STRATEGIES.map((soc) => (
              <div key={soc.platform} className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {soc.platform === 'LinkedIn' && <Share2 className="w-4 h-4 text-sky-400" />}
                        {soc.platform === 'Twitter (X)' && <Share2 className="w-4 h-4 text-slate-200" />}
                        {soc.platform === 'TikTok / Reels' && <Video className="w-4 h-4 text-rose-400" />}
                        {soc.platform === 'YouTube' && <Video className="w-4 h-4 text-red-400" />}
                        {soc.platform}
                      </h3>
                      <span className="text-xs text-cyan-400 font-mono font-medium">
                        Cadence: {soc.cadence}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    <strong>Focus:</strong> {soc.focus}
                  </p>

                  <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 text-xs font-sans text-slate-200 whitespace-pre-line leading-relaxed">
                    <div className="font-bold text-white mb-1.5 pb-1.5 border-b border-slate-800">
                      {soc.samplePost.headline}
                    </div>
                    {soc.samplePost.content}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Viral Hook Verified</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${soc.samplePost.headline}\n\n${soc.samplePost.content}`);
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Post Text</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: 12-MONTH GROWTH ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6 animate-fadeIn">
            {GROWTH_ROADMAP.map((milestone, idx) => (
              <div key={milestone.period} className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                      0{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-white font-display">
                        {milestone.period} Horizon Target
                      </h3>
                      <p className="text-xs text-slate-400">Target Traffic: {milestone.targetTraffic}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
                      {milestone.revenueTarget}
                    </div>
                    <span className="text-[11px] text-slate-400">{milestone.targetSubscribers}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                      Key Milestone Deliverables
                    </h4>
                    <ul className="space-y-2">
                      {milestone.milestones.map((m, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                      Operational Action Items
                    </h4>
                    <ul className="space-y-2">
                      {milestone.keyActionItems.map((act, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                          <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: BACKLINK OUTREACH ENGINE */}
        {activeTab === 'outreach' && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left customization panel */}
              <div className="lg:col-span-4 space-y-4 text-xs">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    Dynamic Pitch Generator
                  </h3>
                  <p className="text-slate-400 text-xs">Customize the outreach letter before sending</p>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Editor / Blogger Name</label>
                  <input
                    type="text"
                    value={outreachName}
                    onChange={(e) => setOutreachName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Blog / Publication</label>
                  <input
                    type="text"
                    value={outreachSite}
                    onChange={(e) => setOutreachSite(e.target.value)}
                    placeholder="e.g. SaaSGrowthDaily.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-[11px] text-slate-400 leading-relaxed">
                  💡 <strong>Backlink Strategy:</strong> Aim for DR 45+ SaaS and operations blogs. Propose genuine case studies and exchange reciprocal resource mentions.
                </div>
              </div>

              {/* Right generated letter */}
              <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                    <span className="text-xs font-mono text-cyan-400">Outreach Draft ready to send</span>
                    <button
                      onClick={handleCopyOutreach}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
                    >
                      {copiedOutreach ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedOutreach ? 'Copied Pitch!' : 'Copy Outreach Pitch'}
                    </button>
                  </div>

                  <div className="font-mono text-xs text-slate-200 whitespace-pre-line leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-850">
                    {generateOutreachBody()}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Sign-off: <strong>Uzair (Founder)</strong></span>
                  <span className="text-emerald-400">Estimated response rate: 18–24%</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 6: MONETIZATION & CONSULTING SERVICES */}
        {activeTab === 'monetization' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top 4 Monetization Streams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl text-center">
                <div className="text-2xl font-bold font-display text-emerald-400">1. Subscriptions</div>
                <div className="text-xs text-slate-300 font-semibold mt-1">Core SaaS Model</div>
                <p className="text-[11px] text-slate-400 mt-1">Starter ($29) & Growth ($79) recurring software MRR.</p>
              </div>

              <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl text-center">
                <div className="text-2xl font-bold font-display text-cyan-400">2. Affiliate SaaS</div>
                <div className="text-xs text-slate-300 font-semibold mt-1">Recommended Tools</div>
                <p className="text-[11px] text-slate-400 mt-1">Partnerships with HubSpot, Make, Zapier, Webflow.</p>
              </div>

              <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl text-center">
                <div className="text-2xl font-bold font-display text-indigo-400">3. Lead Magnets</div>
                <div className="text-xs text-slate-300 font-semibold mt-1">Template Vault</div>
                <p className="text-[11px] text-slate-400 mt-1">Free 15+ workflow templates that convert to subscribers.</p>
              </div>

              <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl text-center">
                <div className="text-2xl font-bold font-display text-yellow-400">4. Consulting</div>
                <div className="text-xs text-slate-300 font-semibold mt-1">Custom Setup Packages</div>
                <p className="text-[11px] text-slate-400 mt-1">$2,500 - $10,000 done-for-you enterprise implementations.</p>
              </div>
            </div>

            {/* Consulting Services Highlight Box */}
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-700/60 rounded-3xl p-8 lg:p-10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center sm:text-left">
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Done-For-You Implementation
                </span>
                <h3 className="text-2xl font-bold text-white font-display">
                  Need a Custom Enterprise AI Pipeline Built for Your Team?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Uzair and our senior automation engineers will build, test, and deploy a bespoke Google Sheets, CRM, and custom LLM qualification pipeline in 7 business days with guaranteed SLA.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <button
                  onClick={onOpenConsulting}
                  className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book Automation Consulting</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
