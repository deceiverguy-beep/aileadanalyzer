import {
  PricingPlan,
  CaseStudy,
  CornerstoneArticle,
  EmailFunnelStep,
  ContentCalendarMonth,
  SocialChannelStrategy,
  GrowthMilestone,
  FaqItem,
  WorkflowTemplate,
} from '../types';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free-trial',
    name: 'Free Trial',
    badge: '14 Days No Card',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Test the power of AI lead qualification and test-drive live workflow automations.',
    leadLimit: 'Up to 100 leads total',
    features: [
      '100 AI Lead Analyses included',
      'Two-way Google Sheets sync',
      'Single CRM webhook connection',
      'Visual Workflow Builder preview',
      'Standard email support',
      'Instant CSV export',
    ],
    ctaText: 'Start 14-Day Free Trial',
    popular: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    badge: 'Solo & Creators',
    priceMonthly: 29,
    priceAnnual: 23,
    description: 'Perfect for growing agencies, consultants, and lean B2B teams automating sales pipelines.',
    leadLimit: '1,500 qualified leads/mo',
    features: [
      '1,500 AI Lead Analyses per month',
      'Continuous Google Sheets 2-way sync',
      'HubSpot, Pipedrive & Zoho CRM sync',
      'Custom scoring rule builder',
      'Slack & Discord instant alerts',
      'Email enrichment & intent detection',
      'Community & priority email support',
    ],
    ctaText: 'Get Starter ($29/mo)',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    badge: 'Most Popular',
    priceMonthly: 79,
    priceAnnual: 63,
    description: 'The ultimate engine for fast-scaling sales teams requiring real-time webhooks & deep CRM sync.',
    leadLimit: '10,000 qualified leads/mo',
    features: [
      '10,000 AI Lead Analyses per month',
      'Sub-second real-time webhook routing',
      'Native Salesforce, HubSpot & Close sync',
      'Automated AI personalized email drafts',
      'Multi-branch conditional workflow logic',
      'Custom LLM intent classifier models',
      'Priority 1-on-1 Slack channel support',
      'Team seats (up to 5 users)',
    ],
    ctaText: 'Start with Growth ($79/mo)',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    badge: 'Custom Deployment',
    priceMonthly: 249,
    priceAnnual: 199,
    description: 'Custom volume, SOC2 compliance, on-premise private cloud connectors, and dedicated engineering.',
    leadLimit: 'Unlimited leads & events',
    features: [
      'Unlimited AI Lead Analyses',
      'Dedicated VPC or On-Premise Gateway',
      'Custom API connectors & legacy ERP sync',
      'SOC2 Type II & GDPR compliance suite',
      'SLA guarantee: 99.99% uptime',
      'Dedicated automation architect (Uzair & Team)',
      'Custom training for sales development reps',
    ],
    ctaText: 'Contact Enterprise Sales',
    popular: false,
  },
];

export const CASE_STUDY: CaseStudy = {
  company: 'ScaleOps Media',
  logo: '⚡',
  industry: 'B2B Growth Agency & SaaS Consulting',
  challenge:
    'ScaleOps was receiving 180+ inbound form leads daily across paid ads, outbound campaigns, and content assets. Their SDR team spent 4.5 hours every day manually researching company sizes, verifying work emails, and copying data into Google Sheets and HubSpot. Average lead response time was 3.8 hours, losing 42% of hot leads to competitors.',
  solution:
    'Implemented AI Lead Analyzer with automated two-way Google Sheets sync, real-time intent classification, and instant webhook triggers to HubSpot. High-intent leads trigger an immediate personalized reply email and a priority Slack alert within 30 seconds of submission.',
  results: [
    { metric: '42s', label: 'Lead Response Time (down from 3.8 hrs)' },
    { metric: '+310%', label: 'Demo Booking Rate Increase' },
    { metric: '22 hrs', label: 'Weekly SDR Time Saved per Rep' },
    { metric: '$420K', label: 'Additional Pipeline Generated in Q1' },
  ],
  quote:
    'AI Lead Analyzer turned our messy spreadsheet chaos into an automated revenue engine. The Google Sheets 2-way sync alone saved our team over 20 hours a week, and our qualified meeting rate shot up by over 300%.',
  author: 'Marcus Vance',
  title: 'VP of Revenue Operations, ScaleOps Media',
};

export const TESTIMONIALS = [
  {
    quote:
      'We plugged AI Lead Analyzer into our Webflow forms and connected our Google Sheet in under 12 minutes. The scoring accuracy is uncanny — our sales reps only talk to real buyers now.',
    name: 'Sarah Chen',
    role: 'Founder & CEO',
    company: 'FinPulse Analytics',
    metrics: 'Saved 18 hrs/week',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    quote:
      'The CRM sync with HubSpot is flawless. As soon as a lead submits, their company revenue is verified, intent is scored 0-100, and a tailored email draft is waiting in our outbound queue.',
    name: 'David Lindqvist',
    role: 'Head of Growth',
    company: 'NordicSaaS Ventures',
    metrics: '+185% conversion',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    quote:
      'Before AI Lead Analyzer, we had 3 people copying pasteboard data between spreadsheets and Salesforce. Now the whole workflow runs silently in the background 24/7. Worth 10x the price.',
    name: 'Elena Rostova',
    role: 'Director of RevOps',
    company: 'CloudBridge Solutions',
    metrics: '$32,000 saved/yr',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
];

export const CORNERSTONE_ARTICLES: CornerstoneArticle[] = [
  {
    id: 'guide-ai-workflow-automation-2026',
    slug: 'ai-workflow-automation-small-business-guide-2026',
    title: 'The Definitive Guide to AI Workflow Automation for Small Businesses in 2026',
    subtitle: 'How modern businesses save 20+ hours per week, eliminate manual data entry, and scale revenue without ballooning headcount.',
    targetKeywords: ['AI workflow automation', 'best AI tools 2026', 'sales automation'],
    readTime: '12 min read',
    category: 'Cornerstone Guide',
    publishedDate: 'January 2026',
    author: 'Uzair',
    excerpt:
      'A comprehensive roadmap to replacing manual business bottlenecks with autonomous AI pipelines. Covers lead triage, two-way spreadsheet synchronization, and autonomous CRM routing.',
    tableOfContents: [
      { id: 'introduction', title: 'Why AI Workflow Automation is Non-Negotiable in 2026' },
      { id: 'core-bottlenecks', title: 'The 3 Silent Profit Killers in Small Business Operations' },
      { id: 'lead-processing', title: 'Architecting an Autonomous Lead Scoring Pipeline' },
      { id: 'tech-stack', title: 'The Recommended 2026 AI Automation Stack' },
      { id: 'roi-framework', title: 'Calculating Your Automation ROI & Labor Hours Saved' },
      { id: 'action-checklist', title: 'Your 7-Day Implementation Action Plan' },
    ],
    contentMarkdown: `
### 1. Why AI Workflow Automation is Non-Negotiable in 2026
In 2026, the competitive dividing line between high-margin lean businesses and struggling legacy operators comes down to one metric: **speed to lead**. Research across 50,000 inbound B2B inquiries demonstrates that responding to an inbound prospect within 60 seconds yields a **391% higher qualification rate** compared to responding in 30 minutes.

Yet most small businesses still operate on fragmented workflows:
- A customer submits an inquiry on a landing page.
- An email notification sits in an unmonitored inbox for hours.
- An assistant manually inspects the prospect's LinkedIn, domain, and budget.
- The record is copied into a Google Sheet and manually keyed into a CRM.

By the time someone picks up the phone or sends an email, the prospect has already booked a demo with a competitor who automated the exact same pipeline.

### 2. The 3 Silent Profit Killers in Small Business Operations
1. **Lead Latency**: Every 10 minutes of delay decreases lead conversion probability by 16%.
2. **Context Switching & Human Data Entry**: Studies by McKinsey show knowledge workers spend 28% of their workweek copying data between web apps.
3. **Inconsistent Lead Qualification**: Without automated intent scoring, junior reps prioritize low-ticket tire-kickers over high-LTV enterprise prospects.

### 3. Architecting an Autonomous Lead Scoring Pipeline
With **AI Lead Analyzer**, this entire process is compressed into 42 seconds:
- **Trigger**: New form submission arrives via webhook (Webflow, Typeform, WordPress, or custom HTML).
- **AI Enrichment**: The engine parses company name, domain, job title, and message context.
- **Intent Scoring**: A neural model scores purchase readiness on a 0-100 index based on budget cues, urgency, and technical fit.
- **Action Dispatch**: 
  - If Score > 80: Instant Slack VIP alert to sales lead + auto-drafted personalized email.
  - If Score 50-79: Automated nurture sequence via CRM.
  - If Score < 50: Educational workflow template sent without human rep time wasted.

### 4. The Recommended 2026 AI Automation Stack
- **Ingestion & Scoring**: AI Lead Analyzer (Core Intelligence & Routing)
- **Data Backbone**: Google Sheets (Real-time 2-way sync for rapid reporting)
- **Customer Record of Truth**: HubSpot CRM or Salesforce
- **Team Communications**: Slack Webhooks for real-time deal alerts

### 5. Calculating Your Automation ROI & Labor Hours Saved
A typical 5-person sales or operations team processing 500 leads per month spends approximately **110 hours monthly** on manual qualification, data entry, and CRM updating. At an average loaded wage of $40/hour, that represents **$4,400 per month in wasted payroll** — which can be replaced by a $29-$79/month automation subscription.
    `,
  },
  {
    id: 'google-sheets-crm-automation-guide',
    slug: 'google-sheets-crm-automation-pipeline-guide',
    title: 'Google Sheets + AI Workflows: A Practical Guide to Zero-Code CRM Sync',
    subtitle: 'Step-by-step tutorial on building a resilient two-way data pipeline between Google Sheets, AI scoring models, and your CRM.',
    targetKeywords: ['Google Sheets automation', 'CRM integration', 'AI lead analyzer'],
    readTime: '9 min read',
    category: 'Tutorial',
    publishedDate: 'February 2026',
    author: 'Uzair',
    excerpt:
      'Learn how to leverage Google Sheets as an ultra-fast collaborative database paired with AI Lead Analyzer to automatically clean, score, and push leads into HubSpot or Salesforce.',
    tableOfContents: [
      { id: 'overview', title: 'The Power of Google Sheets as a Living Operations Database' },
      { id: 'step-1', title: 'Step 1: Setting up the Master Lead Sheet Schema' },
      { id: 'step-2', title: 'Step 2: Connecting AI Lead Analyzer Webhooks' },
      { id: 'step-3', title: 'Step 3: Bi-Directional CRM Property Mapping' },
      { id: 'step-4', title: 'Step 4: Handling Edge Cases and Data Validation' },
    ],
    contentMarkdown: `
### Why Google Sheets Remains the King of Lightweight Operations
Despite the proliferation of complex SaaS databases, Google Sheets remains the fastest, most customizable tool for executive oversight, sales triage, and custom formula calculations.

When paired with an intelligent bridge like **AI Lead Analyzer**, Google Sheets transforms from a static spreadsheet into an autonomous event bus.

### Step-by-Step Architecture:
1. **Webhook Ingestion**: Every lead captured on your site automatically populates Row N with columns: Timestamp, Company, Contact, Email, Estimated Budget, Intent Score, AI Classification, and Assigned Rep.
2. **Formula Triggering**: Google Sheets native formulas calculate customer acquisition cost (CAC) and projected deal size immediately.
3. **Bi-Directional CRM Push**: As soon as a rep changes the status column in Google Sheets from "New" to "Contacted", AI Lead Analyzer updates the corresponding Deal stage in HubSpot or Salesforce via background webhooks.
    `,
  },
  {
    id: 'best-ai-automation-tools-2026',
    slug: 'top-10-best-ai-automation-tools-2026',
    title: 'Top 10 Best AI Automation Tools in 2026: Benchmark & ROI Analysis',
    subtitle: 'An objective review of the top AI automation platforms for lead processing, workflow orchestration, and CRM integration.',
    targetKeywords: ['best AI tools 2026', 'AI workflow automation', 'AI lead analyzer'],
    readTime: '11 min read',
    category: 'Monetization Guide',
    publishedDate: 'March 2026',
    author: 'Uzair',
    excerpt:
      'We tested 25+ automation platforms across reliability, ease of setup, pricing transparency, and native AI capabilities. Here are the top 10 rankings for 2026.',
    tableOfContents: [
      { id: 'evaluation-criteria', title: 'How We Evaluated the 2026 Automation Landscape' },
      { id: 'top-pick', title: '#1 AI Lead Analyzer: Best for Sales Automation & CRM Sync' },
      { id: 'comparison-table', title: 'Side-by-Side Comparison Matrix' },
      { id: 'alternatives', title: 'When to Use Make, Zapier, or Custom Python Scripts' },
      { id: 'monetization-takeaway', title: 'Monetizing Automation Services for Clients' },
    ],
    contentMarkdown: `
### Evaluation Criteria for 2026
We scored each platform based on four stringent factors:
1. **Speed to Value**: Can an operations lead set up a production workflow in under 15 minutes without writing custom code?
2. **Native AI Intelligence**: Does the platform include native semantic understanding, intent scoring, and automated message drafting, or does it require daisy-chaining multiple fragile API calls?
3. **Cost Efficiency**: Transparent pricing without unpredictable token surcharges or opaque task multipliers.
4. **CRM & Spreadsheet Robustness**: Guaranteed delivery, automatic retries, and bi-directional synchronicity.

### Why AI Lead Analyzer Took the #1 Spot
For small and mid-market teams focused on customer acquisition and revenue operations, **AI Lead Analyzer** provides the highest ROI by bundling lead qualification, Google Sheets two-way sync, and CRM integration into a unified, zero-code interface.
    `,
  },
];

export const EMAIL_FUNNEL_STEPS: EmailFunnelStep[] = [
  {
    day: 'Day 0',
    stage: 'Welcome & Instant Activation',
    objective: 'Welcome the new user, set expectations, and drive immediate first workflow setup.',
    subject: 'Welcome to AI Lead Analyzer — Your first automated pipeline in 3 minutes 🚀',
    previewText: 'Here is your direct access link and your 3-step quickstart roadmap.',
    body: `Hi [First Name],

Welcome to AI Lead Analyzer! I’m Uzair, founder of the platform.

Your 14-day free trial is officially live. Over the next two weeks, our goal is simple: help your business eliminate manual lead triage, connect your Google Sheets & CRM, and cut your lead response time down to under 60 seconds.

Here is your 3-step action plan for today:

1. Connect your first Lead Source (Typeform, Webflow, or custom webhook)
2. Link your Google Sheet for 2-way real-time recording
3. Run your first test lead through the AI Scoring Engine

👉 [Click here to launch your first workflow]

If you get stuck or have questions about your specific CRM setup, just reply directly to this email. I read every message.

Best regards,
Uzair
Founder, AI Lead Analyzer`,
    ctaText: 'Launch First Workflow',
    conversionTips: [
      'Trigger within 60 seconds of signup',
      'Keep email plain-text or light styling to maximize deliverability into Primary inbox',
      'Direct personal signature from Uzair establishes immediate trust',
    ],
  },
  {
    day: 'Day 3',
    stage: 'First Workflow Setup Reminder',
    objective: 'Check in on setup progress, overcome technical hesitation, and offer free implementation help.',
    subject: 'Did you connect your Google Sheet yet, [First Name]?',
    previewText: 'Takes only 2 minutes. Watch this quick 45-second screen recording.',
    body: `Hi [First Name],

Uzair here again with a quick check-in.

I noticed you haven’t connected your Google Sheet or CRM webhook yet. Did you hit a roadblock, or have you just been busy?

Most of our members set this up in about 2 minutes using our pre-built Google Sheet template:

👉 [Download the 1-Click Master Lead Template]

Once connected, every new lead is automatically enriched with company insights, scored from 0 to 100 on purchase intent, and routed to your sales reps in real time.

Need a hand setting it up? Reply with "HELP" and I’ll personally record a 2-minute Loom walkthrough for your specific website.

Talk soon,
Uzair`,
    ctaText: 'Open Quick Setup Wizard',
    conversionTips: [
      'Address the activation drop-off point directly',
      'Provide pre-built template to eliminate blank-canvas friction',
      'Offer personalized Loom walkthrough to build high-touch rapport',
    ],
  },
  {
    day: 'Day 7',
    stage: 'Upgrade Push & Advanced ROI',
    objective: 'Highlight advanced Growth features (real-time CRM webhooks, multi-branching) and social proof.',
    subject: 'How ScaleOps saved 22 hours/week (and unlocked $420k in pipeline)',
    previewText: 'A breakdown of the exact Growth tier workflow they deployed.',
    body: `Hi [First Name],

You are halfway through your 14-day trial!

Today, I wanted to share a quick story from Marcus Vance, VP of Revenue Operations at ScaleOps.

Before using AI Lead Analyzer, their team spent 4.5 hours every day manually researching inbound leads, copy-pasting into spreadsheets, and pinging reps on Slack.

By upgrading to the **Growth Tier ($79/mo)**, they activated:
- Real-time sub-second webhook pushes directly into HubSpot
- Automated AI personalized follow-up email drafts for reps to review in 1 click
- High-intent Slack VIP alerts whenever a deal score exceeds 85/100

The result? Their lead response time dropped from 3.8 hours to **42 seconds**, and demo bookings jumped by **310%**.

Lock in your Growth tier today and get 20% off your first year with code **GROWTH2026**:

👉 [Upgrade to Growth Plan ($63/mo billed annually)]

Best regards,
Uzair`,
    ctaText: 'Claim 20% Off Growth Plan',
    conversionTips: [
      'Anchor the upgrade around a concrete case study and numbers',
      'Highlight specific Growth-only features',
      'Introduce time-sensitive 20% incentive to drive early conversion',
    ],
  },
  {
    day: 'Day 13',
    stage: 'Final Trial Expiration Alert',
    objective: 'Create urgency, emphasize impending data pause, and secure subscription conversion.',
    subject: 'Urgent: Your AI Lead Analyzer trial expires in 24 hours ⏳',
    previewText: 'Keep your automated workflows and CRM sync running without interruption.',
    body: `Hi [First Name],

Your 14-day free trial of AI Lead Analyzer ends tomorrow.

To ensure your live form webhooks, Google Sheets two-way sync, and CRM integrations continue operating without interruption, please choose your plan today:

- **Starter ($29/mo)**: Ideal for solo founders and lean teams (1,500 leads/mo)
- **Growth ($79/mo)**: Our most popular plan for scaling teams (10,000 leads/mo + real-time webhooks)

👉 [Select your plan and keep your pipeline active]

If you choose not to upgrade, your automations will be paused tomorrow at midnight, and new incoming leads won’t be scored or synced.

Thank you for testing the platform, and I look forward to supporting your business as you scale in 2026!

Best regards,
Uzair
Founder, AI Lead Analyzer`,
    ctaText: 'Activate Subscription Now',
    conversionTips: [
      'Clear deadline urgency (24 hours)',
      'Highlight risk of interrupted pipeline or paused leads',
      'Direct link to clean checkout selection page',
    ],
  },
];

export const CONTENT_CALENDAR: ContentCalendarMonth[] = [
  {
    monthName: 'Month 1',
    theme: 'Cornerstone Guides & 2026 AI Trends',
    weeks: [
      {
        weekNumber: 1,
        title: 'The Definitive Guide to AI Workflow Automation for Small Businesses in 2026',
        type: 'Cornerstone Guide',
        targetKeyword: 'AI workflow automation',
        distributionChannels: ['SEO Blog', 'LinkedIn Article', 'Twitter Thread'],
        status: 'Live',
      },
      {
        weekNumber: 2,
        title: 'Top 10 Best AI Automation Tools in 2026: Benchmark & ROI Analysis',
        type: 'Cornerstone Guide',
        targetKeyword: 'best AI tools 2026',
        distributionChannels: ['SEO Blog', 'Product Hunt Discussion', 'Reddit r/SaaS'],
        status: 'Live',
      },
      {
        weekNumber: 3,
        title: 'Google Sheets + AI Workflows: A Practical Guide to Zero-Code CRM Sync',
        type: 'Tutorial',
        targetKeyword: 'Google Sheets automation',
        distributionChannels: ['SEO Blog', 'YouTube Video', 'LinkedIn Newsletter'],
        status: 'Scheduled',
      },
      {
        weekNumber: 4,
        title: 'Why Lead Response Time is Killing Your B2B Conversions (And How AI Solves It)',
        type: 'Cornerstone Guide',
        targetKeyword: 'AI lead analyzer',
        distributionChannels: ['SEO Blog', 'Email Newsletter', 'Twitter/X'],
        status: 'Scheduled',
      },
    ],
  },
  {
    monthName: 'Month 2',
    theme: 'Case Studies & Step-by-Step Tutorials',
    weeks: [
      {
        weekNumber: 5,
        title: 'Case Study: How ScaleOps Cut Lead Qualification Time by 98% and Made $420k',
        type: 'Case Study',
        targetKeyword: 'CRM integration',
        distributionChannels: ['SEO Blog', 'LinkedIn Carousel', 'Customer Webinar'],
        status: 'Scheduled',
      },
      {
        weekNumber: 6,
        title: 'Step-by-Step: Connecting Webflow Inbound Forms to HubSpot in Under 5 Minutes',
        type: 'Tutorial',
        targetKeyword: 'CRM integration',
        distributionChannels: ['SEO Blog', 'YouTube Short', 'Webflow Community Forum'],
        status: 'Scheduled',
      },
      {
        weekNumber: 7,
        title: 'The Zero-Code Slack Alert Bot: Notifying Sales Reps of 90+ Score Leads Instantly',
        type: 'Tutorial',
        targetKeyword: 'AI workflow automation',
        distributionChannels: ['SEO Blog', 'TikTok/Reels', 'Twitter/X Thread'],
        status: 'Scheduled',
      },
      {
        weekNumber: 8,
        title: 'How Agency Owners Can Package & Sell AI Automation Services for $5,000/mo',
        type: 'Monetization / Affiliate',
        targetKeyword: 'AI automation consulting',
        distributionChannels: ['SEO Blog', 'Skool Community', 'LinkedIn Thought Leadership'],
        status: 'Scheduled',
      },
    ],
  },
  {
    monthName: 'Month 3',
    theme: 'Product Guides & SaaS Monetization Articles',
    weeks: [
      {
        weekNumber: 9,
        title: 'The Anatomy of a High-Converting AI Lead Scoring Algorithm',
        type: 'Cornerstone Guide',
        targetKeyword: 'AI lead analyzer',
        distributionChannels: ['SEO Blog', 'Medium Publication', 'HackerNews Show'],
        status: 'Scheduled',
      },
      {
        weekNumber: 10,
        title: 'Affiliate Playbook: Recommending Top SaaS Tools to Generate $10k/mo Passive Income',
        type: 'Monetization / Affiliate',
        targetKeyword: 'SaaS affiliate partnerships',
        distributionChannels: ['SEO Blog', 'Email Broadcast', 'Podcast Appearance'],
        status: 'Scheduled',
      },
      {
        weekNumber: 11,
        title: 'Salesforce vs HubSpot vs Pipedrive: Which CRM Pairs Best with AI Workflows?',
        type: 'Tutorial',
        targetKeyword: 'CRM integration',
        distributionChannels: ['SEO Blog', 'Comparison Landing Page', 'Twitter Debate'],
        status: 'Scheduled',
      },
      {
        weekNumber: 12,
        title: '2026 Annual AI Automation Benchmark: Data from 1,000,000 Inbound Form Leads',
        type: 'Cornerstone Guide',
        targetKeyword: 'best AI tools 2026',
        distributionChannels: ['SEO Whitepaper', 'PR Press Release', 'Keynote Slide Deck'],
        status: 'Scheduled',
      },
    ],
  },
];

export const SOCIAL_STRATEGIES: SocialChannelStrategy[] = [
  {
    platform: 'LinkedIn',
    cadence: '3-4 Posts / Week',
    focus: 'Thought leadership, agency case studies, B2B sales automation teardowns, founder building in public.',
    samplePost: {
      headline: 'We analyzed 50,000 B2B leads. Here is why 80% of sales reps lose deals before picking up the phone 👇',
      hook: 'If your response time is > 15 minutes, you are donating revenue to competitors with automated workflows.',
      content: `Here is the playbook our clients use to achieve a 42-second response time:

1. Webhook trigger from landing page into AI Lead Analyzer
2. Instant domain and tech stack enrichment
3. Real-time 0-100 purchase intent scoring
4. Auto-append into Google Sheets for executive tracking
5. Push to HubSpot with pre-drafted personalized outbound email

Total human time required: 0 seconds.
Result: 310% higher demo booking rate.

Want the exact Google Sheets + Zapier/Webhook template?
Comment "WORKFLOW" below and I’ll DM it to you for free.`,
    },
  },
  {
    platform: 'Twitter (X)',
    cadence: '1-2 Threads / Week + Daily Tips',
    focus: 'Direct comparisons between automation tools, viral workflow blueprints, bite-sized productivity hacks.',
    samplePost: {
      headline: 'Most people think AI is for generating generic blog posts. The top 1% use AI to automate their entire sales pipeline.',
      hook: 'Here is how to build a 24/7 autonomous lead qualification bot without writing a line of code 🧵👇',
      content: `1/ Inbound form submitted
2/ AI Lead Analyzer parses budget, pain point, and urgency
3/ Lead score computed in 0.8 seconds
4/ Hot leads -> Slack VIP alert
5/ Cold leads -> Auto-nurture drip
6/ Google Sheet synchronized bi-directionally

Cost to build in 2026: $29/mo.
Value created: 20+ hours saved every week.`,
    },
  },
  {
    platform: 'TikTok / Reels',
    cadence: '3-5 Videos / Week',
    focus: '30-second rapid-fire screen recordings, behind-the-scenes workflow setup, side-by-side speed tests.',
    samplePost: {
      headline: 'Watch me qualify 50 leads and sync them to Google Sheets in 10 seconds ⏱️',
      hook: 'Stop typing into spreadsheets manually. It is 2026!',
      content: `[Visual: Screen recording showing raw messy contact form submissions on left. Screen cuts to AI Lead Analyzer processing. Instant color-coded Google Sheet row update with lead score, rep assignment, and CRM sync status]. 
Caption: Link in bio to try the free trial & grab the workflow template!`,
    },
  },
  {
    platform: 'YouTube',
    cadence: '1 Long-form Tutorial / Week',
    focus: 'Comprehensive 15-25 minute masterclasses, architecture teardowns, "AI Automation for Small Businesses" series.',
    samplePost: {
      headline: 'The Ultimate 2026 AI Automation Masterclass: Google Sheets + CRM + AI Lead Analyzer',
      hook: 'Complete zero-to-production build with downloadable workflow JSON files and templates.',
      content: `Timestamp breakdown:
0:00 - The problem with traditional lead triage
2:15 - Setting up the Google Sheets master schema
6:40 - Connecting the AI Lead Analyzer API & webhooks
12:20 - HubSpot & Salesforce bi-directional field mapping
18:45 - Testing real-world edge cases & error handling
22:30 - How to charge clients $3,000 for this exact setup`,
    },
  },
];

export const GROWTH_ROADMAP: GrowthMilestone[] = [
  {
    period: '3 Months',
    targetTraffic: '1,500 - 3,000 monthly visitors',
    targetSubscribers: '500+ Email Subscribers & 30+ Paying Customers',
    revenueTarget: '$2,000 - $3,500 MRR',
    milestones: [
      'Publish 10-15 cornerstone SEO articles targeting keyword cluster',
      'Launch conversion-optimized landing page with interactive Lead Analyzer demo',
      'Build core email list past 500 subscribers via the Lead Magnet template vault',
      'Secure 5-10 high-authority backlinks via guest posts & podcast appearances',
      'Achieve sub-2.0s average page load speed and 100% Core Web Vitals score',
    ],
    keyActionItems: [
      'Deploy index.html Schema markup for SoftwareApplication and Product',
      'Initiate backlink outreach to top SaaS and productivity publications',
      'Set up Day 0 to Day 13 automated nurture email sequence',
    ],
  },
  {
    period: '6 Months',
    targetTraffic: '5,000 - 8,000 monthly visitors',
    targetSubscribers: '100+ Paying Subscribers (Starter & Growth)',
    revenueTarget: '$7,500 - $12,000 MRR',
    milestones: [
      'Rank top 3 on Google for "AI workflow automation" and "Google Sheets automation"',
      'Expand into vertical-specific landing pages (Real Estate, Agencies, SaaS)',
      'Launch monthly live webinars: "AI Automation for Small Businesses in 2026"',
      'Integrate two-way native connectors for ClickUp, Notion, and Airtable',
      'Roll out the Certified Automation Partner affiliate program (30% recurring)',
    ],
    keyActionItems: [
      'Publish weekly case studies with measurable revenue proof',
      'Host bi-weekly live Q&A demos for prospective agency clients',
      'Engage top 50 B2B micro-influencers on LinkedIn and Twitter',
    ],
  },
  {
    period: '12 Months',
    targetTraffic: '20,000+ monthly visitors',
    targetSubscribers: '500+ Paying Subscribers & 15+ Enterprise Accounts',
    revenueTarget: '$35,000 - $50,000 MRR',
    milestones: [
      'Dominate the keyword cluster for 2026 automation queries',
      'Scale affiliate revenue alongside core software subscription MRR',
      'Establish brand authority via keynote presentations and industry research reports',
      'Launch the AI Lead Analyzer App Marketplace for community-built workflow nodes',
      'Achieve under 2.5% monthly customer churn through proactive onboarding',
    ],
    keyActionItems: [
      'Hire dedicated enterprise sales development rep and customer success lead',
      'Roll out SOC2 Type II compliance badges on checkout flows',
      'Package white-label consulting services for agencies deploying to clients',
    ],
  },
];

export const FAQS: FaqItem[] = [
  {
    question: 'How fast does the AI Lead Analyzer process inbound form leads?',
    answer:
      'Under 2 seconds. The moment a user submits an inquiry on your website, our webhook triggers instant data enrichment, computes a 0-100 purchase intent score, appends the row into your Google Sheet, and pushes the synchronized contact into your CRM.',
    category: 'Product & Performance',
  },
  {
    question: 'Do I need coding experience or developers to connect Google Sheets and my CRM?',
    answer:
      'Zero coding required. You can connect your Google Sheet in literally 2 clicks using Google OAuth, and paste your CRM API key or webhook URL. We provide pre-built column templates for HubSpot, Salesforce, Pipedrive, and Zoho.',
    category: 'Integrations',
  },
  {
    question: 'What happens when my 14-day free trial expires?',
    answer:
      'You are never auto-billed without explicit consent. During your 14-day trial, you get 100 free lead analyses and full access to our workflow builder. When your trial ends, you can choose to continue on our Starter plan ($29/mo) or Growth plan ($79/mo). Your settings and templates remain safely stored.',
    category: 'Billing & Pricing',
  },
  {
    question: 'How does the two-way Google Sheets sync work?',
    answer:
      'It is bi-directional. When a new lead is scored, it appends as a new row in your sheet. If your sales team changes a column value in Google Sheets (for instance, changing the status from "New" to "Contacted" or adding notes), that update is immediately sent back to your CRM automatically.',
    category: 'Integrations',
  },
  {
    question: 'Is my lead and customer data secure and GDPR compliant?',
    answer:
      'Yes. All data transmissions are encrypted with 256-bit AES encryption in transit and at rest. We never sell or share your lead data, and our platform is fully GDPR and CCPA compliant with automated data deletion policies upon request.',
    category: 'Security',
  },
];

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'template-sheets-scorer',
    title: 'Instant Google Sheets Lead Scorer & Enrichment',
    category: 'Google Sheets Automation',
    description: 'Auto-enriches company domain, predicts deal value, and scores lead intent 0-100 on every new spreadsheet row.',
    toolsIntegrated: ['Google Sheets', 'AI Lead Analyzer', 'Clearbit/Domain API'],
    downloadCount: 3840,
    timeSavedPerWeek: '6.5 hours',
  },
  {
    id: 'template-hubspot-router',
    title: 'High-Intent Webflow-to-HubSpot VIP Fast Track',
    category: 'CRM Integration',
    description: 'Routes leads with scores > 80 straight to your top account executive with pre-drafted custom email templates.',
    toolsIntegrated: ['Webflow', 'HubSpot CRM', 'Slack', 'AI Lead Analyzer'],
    downloadCount: 2910,
    timeSavedPerWeek: '8.2 hours',
  },
  {
    id: 'template-slack-alert',
    title: 'Real-Time Slack Deal Alert & Sentiment Radar',
    category: 'AI Workflow Automation',
    description: 'Broadcasts new hot leads to your sales channel with actionable one-click buttons: "Claim Lead", "Send Email", "Snooze".',
    toolsIntegrated: ['Slack', 'AI Lead Analyzer', 'Gmail'],
    downloadCount: 4220,
    timeSavedPerWeek: '5.0 hours',
  },
  {
    id: 'template-churn-recovery',
    title: 'Stripe Failed Payment & Churn Recovery Bot',
    category: 'Monetization & Retention',
    description: 'Monitors Stripe failed charges, assesses customer account value, and triggers gentle, high-converting recovery emails.',
    toolsIntegrated: ['Stripe', 'Google Sheets', 'Customer.io'],
    downloadCount: 1750,
    timeSavedPerWeek: '4.8 hours',
  },
];

export const SAMPLE_LEADS = [
  {
    companyName: 'Apex Logistics Inc.',
    contactName: 'Sarah Jenkins',
    email: 'sjenkins@apexlogistics.com',
    estimatedBudget: '$5,000 - $15,000/mo',
    source: 'Google Search ("best AI workflow automation tools 2026")',
    currentCrm: 'HubSpot Enterprise',
    useCaseDescription:
      'We receive 400+ freight quote requests daily on our website. Our dispatchers spend hours manually copying shipments into Google Sheets. We urgently need automated intent scoring and CRM sync.',
  },
  {
    companyName: 'Nordic Growth Studio',
    contactName: 'Erik Larsson',
    email: 'erik@nordicgrowth.se',
    estimatedBudget: '$1,000 - $3,000/mo',
    source: 'LinkedIn Thought Leadership post',
    currentCrm: 'Pipedrive',
    useCaseDescription:
      'B2B growth agency with 25 clients. Looking to automate client onboarding, lead triage, and generate personalized outbound emails without burning our SDR hours.',
  },
  {
    companyName: 'TireKicker Media',
    contactName: 'Anonymous Visitor',
    email: 'free_tools1994@gmail.com',
    estimatedBudget: '$0 (Looking for free tier)',
    source: 'Reddit',
    currentCrm: 'None / Personal Excel',
    useCaseDescription: 'Just looking for free prompts to copy and paste for my side project.',
  },
];
