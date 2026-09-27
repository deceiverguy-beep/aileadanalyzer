export interface LeadSubmission {
  companyName: string;
  contactName: string;
  email: string;
  estimatedBudget: string;
  source: string;
  currentCrm: string;
  useCaseDescription: string;
}

export interface LeadAnalysisResult {
  score: number;
  qualityTier: 'Tier 1 - High Priority' | 'Tier 2 - Qualified' | 'Tier 3 - Nurture' | 'Disqualified';
  icpFitPercent: number;
  intentSignals: string[];
  recommendedAction: string;
  suggestedFollowUpEmail: {
    subject: string;
    body: string;
  };
  sheetsSyncPayload: {
    rowId: string;
    timestamp: string;
    company: string;
    score: number;
    assignedRep: string;
    crmStatus: string;
  };
  crmWebhookData: {
    endpoint: string;
    objectType: string;
    properties: Record<string, string | number>;
  };
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  leadLimit: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
}

export interface CaseStudy {
  company: string;
  logo: string;
  industry: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    label: string;
  }[];
  quote: string;
  author: string;
  title: string;
}

export interface CornerstoneArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  targetKeywords: string[];
  readTime: string;
  category: 'Cornerstone Guide' | 'Tutorial' | 'Monetization Guide';
  publishedDate: string;
  author: string;
  excerpt: string;
  contentMarkdown: string;
  tableOfContents: { id: string; title: string }[];
}

export interface EmailFunnelStep {
  day: string;
  stage: string;
  objective: string;
  subject: string;
  previewText: string;
  body: string;
  ctaText: string;
  conversionTips: string[];
}

export interface ContentCalendarMonth {
  monthName: string;
  theme: string;
  weeks: {
    weekNumber: number;
    title: string;
    type: 'Cornerstone Guide' | 'Case Study' | 'Tutorial' | 'Monetization / Affiliate';
    targetKeyword: string;
    distributionChannels: string[];
    status: 'Scheduled' | 'Live' | 'In Production';
  }[];
}

export interface SocialChannelStrategy {
  platform: 'LinkedIn' | 'Twitter (X)' | 'TikTok / Reels' | 'YouTube';
  cadence: string;
  focus: string;
  samplePost: {
    headline: string;
    content: string;
    hook: string;
  };
}

export interface GrowthMilestone {
  period: '3 Months' | '6 Months' | '12 Months';
  targetTraffic: string;
  targetSubscribers: string;
  milestones: string[];
  revenueTarget: string;
  keyActionItems: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export interface WorkflowTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  toolsIntegrated: string[];
  downloadCount: number;
  timeSavedPerWeek: string;
}

// ==========================================
// RELATIONAL DATABASE MODELS (POSTGRESQL)
// ==========================================

export interface WorkspaceRecord {
  id: string;
  name: string;
  api_key_hash: string;
  icp_criteria: {
    target_company_size: string;
    min_budget: string;
    target_industries: string[];
    required_crm: string[];
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeadRecord {
  id: string;
  workspace_id: string;
  submission_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  company_name: string;
  company_website?: string | null;
  company_size?: string | null;
  budget?: string | null;
  timeline?: string | null;
  raw_message?: string | null;
  lead_tier: 'Hot' | 'Warm' | 'Cold';
  lead_score: number;
  icp_fit_score: number;
  intent_urgency_score: number;
  contact_quality_score: number;
  key_signals: string[];
  risk_factors: string[];
  enriched_data: Record<string, any>;
  ai_summary?: string | null;
  suggested_follow_up?: string | null;
  created_at: string;
}

export type Lead = LeadRecord;

export interface WebhookLogRecord {
  id: string;
  workspace_id?: string | null;
  lead_id?: string | null;
  source_event: string;
  status: 'success' | 'failed' | 'retrying';
  response_code?: number | null;
  error_message?: string | null;
  execution_time_ms?: number | null;
  created_at: string;
}

