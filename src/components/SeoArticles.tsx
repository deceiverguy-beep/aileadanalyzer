import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Tag, 
  User, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  Sparkles,
  Search,
  Download,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { CORNERSTONE_ARTICLES } from '../data/mockData';
import { CornerstoneArticle } from '../types';
import { downloadCsvFile, generateSeoKeywordMatrixCsv } from '../utils/exportUtils';

interface SeoArticlesProps {
  onOpenTrial: () => void;
  onOpenTemplates: () => void;
}

export const SeoArticles: React.FC<SeoArticlesProps> = ({ onOpenTrial, onOpenTemplates }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<CornerstoneArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'reading-asc' | 'reading-desc' | 'title-az'>('newest');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const categories = ['All', 'Cornerstone Guide', 'Tutorial', 'Monetization Guide'];

  const keywordClusters = [
    'AI workflow automation',
    'CRM integration',
    'Google Sheets automation',
    'AI lead analyzer',
    'best AI tools 2026',
  ];

  const handleDownloadKeywordMatrix = () => {
    const csv = generateSeoKeywordMatrixCsv();
    downloadCsvFile('2026-seo-keyword-clusters-matrix.csv', csv);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const filteredArticles = CORNERSTONE_ARTICLES
    .filter((art) => {
      const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.targetKeywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOption === 'title-az') return a.title.localeCompare(b.title);
      const parseTime = (str: string) => parseInt(str.replace(/\D/g, '')) || 0;
      if (sortOption === 'reading-asc') return parseTime(a.readTime) - parseTime(b.readTime);
      if (sortOption === 'reading-desc') return parseTime(b.readTime) - parseTime(a.readTime);
      return 0; // default newest
    });

  return (
    <section id="cornerstone-seo" className="py-20 bg-slate-900/50 border-y border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-300 mb-3 shadow-inner">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>High-Authority SEO & Educational Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
            Cornerstone Guides, Tutorials & 2026 Strategies
          </h2>
          <p className="mt-3 text-slate-300 text-base leading-relaxed">
            In-depth operational playbooks engineered for search intent, rapid Google ranking, and actionable small business workflow automation.
          </p>
        </div>

        {/* Keyword Cluster Cloud & Instant CSV Export Bar */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Clusters:</span>
            </div>
            {keywordClusters.map((kw, i) => (
              <button
                key={i}
                onClick={() => setSearchQuery(kw)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  searchQuery === kw
                    ? 'bg-indigo-600 text-white border-indigo-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                #{kw}
              </button>
            ))}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[11px] text-slate-400 hover:text-white underline ml-1 cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Download CSV Action Button */}
          <button
            onClick={handleDownloadKeywordMatrix}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer shrink-0"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Keyword Matrix Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-cyan-200" />
                <span>Export Keyword Matrix (.CSV)</span>
              </>
            )}
          </button>
        </div>

        {/* Filters and Sorting Phase Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-60">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search guides & keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            {/* Sorting dropdown */}
            <div className="flex items-center gap-1.5 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
              >
                <option value="newest">Newest Guides</option>
                <option value="reading-asc">Reading Time: Shortest</option>
                <option value="reading-desc">Reading Time: Longest</option>
                <option value="title-az">Alphabetical: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredArticles.length === 0 ? (
            <div className="col-span-3 text-center py-12 bg-slate-950 rounded-2xl border border-slate-800 p-8">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No articles match your current search or category filter.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-3 px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-slate-950 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all group shadow-lg"
              >
                <div>
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-0.5 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" /> {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white font-display group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>

                  {/* Target Keywords */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {article.targetKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <span className="w-5 h-5 rounded-full bg-indigo-900 border border-indigo-700 flex items-center justify-center text-[10px] text-indigo-200 font-bold">
                      U
                    </span>
                    <span>By {article.author}</span>
                  </div>

                  <button
                    onClick={() => setActiveArticle(article)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer group-hover:translate-x-0.5"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Lead Magnet Banner inside SEO Section */}
        <div className="mt-12 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-cyan-950/70 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800/50 px-2.5 py-0.5 rounded-full">
              Free Lead Magnet • 2026 Edition
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
              Want the 15+ Production Automation Blueprints?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Get the exact Make & Zapier JSON files, Google Sheets formulas, and CRM webhook payloads used in these guides.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadKeywordMatrix}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5 text-cyan-300" />
              <span>Keyword Matrix (.CSV)</span>
            </button>
            <button
              onClick={onOpenTemplates}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Download Automation Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Reader Drawer Modal for Reading the Article */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-slate-950 border-l border-slate-800 w-full max-w-3xl h-full overflow-y-auto p-6 sm:p-10 shadow-2xl flex flex-col justify-between animate-slideIn">
            <div>
              {/* Top Navigation in Reader */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                  {activeArticle.category} • {activeArticle.readTime}
                </span>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Close article"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Metadata */}
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display leading-tight mb-3">
                {activeArticle.title}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium">
                {activeArticle.subtitle}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-400 pb-6 border-b border-slate-800/80 mb-6">
                <span>By {activeArticle.author}</span>
                <span>•</span>
                <span>Published {activeArticle.publishedDate}</span>
                <span>•</span>
                <span className="text-indigo-400">Verified for 2026 SEO Intent</span>
              </div>

              {/* Table of Contents */}
              <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 mb-8">
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Table of Contents
                </div>
                <ul className="space-y-1.5 text-xs text-indigo-300">
                  {activeArticle.tableOfContents.map((toc) => (
                    <li key={toc.id} className="flex items-center gap-1.5 hover:text-indigo-200">
                      <ChevronRight className="w-3 h-3 text-indigo-500" />
                      <span>{toc.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Article Body Content */}
              <div className="prose prose-invert max-w-none text-slate-200 text-xs sm:text-sm leading-relaxed space-y-4">
                <div className="whitespace-pre-line">
                  {activeArticle.contentMarkdown}
                </div>
              </div>
            </div>

            {/* Bottom Actions in Reader */}
            <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleDownloadKeywordMatrix}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-300" />
                <span>Export Keyword Matrix (.CSV)</span>
              </button>

              <button
                onClick={() => {
                  setActiveArticle(null);
                  onOpenTrial();
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Try This Workflow Live</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
