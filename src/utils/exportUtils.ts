/**
 * File Generation & Browser Download Utilities
 * Supports instant CSV & JSON export without requiring server round-trips
 */

export function triggerDownload(filename: string, mimeType: string, content: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadJsonFile(filename: string, data: any) {
  const jsonString = JSON.stringify(data, null, 2);
  triggerDownload(filename, 'application/json;charset=utf-8;', jsonString);
}

export function downloadCsvFile(filename: string, csvContent: string) {
  triggerDownload(filename, 'text/csv;charset=utf-8;', csvContent);
}

/**
 * 2026 High-Volume SEO Keyword Matrix CSV Export
 */
export function generateSeoKeywordMatrixCsv(): string {
  const headers = [
    'Target Keyword',
    'Monthly Search Volume (Est.)',
    'Keyword Difficulty (KD %)',
    'Est. CPC ($)',
    'Search Intent',
    'Primary Target URL',
    'Recommended Content Format',
    'Business Priority',
  ];

  const rows = [
    ['AI workflow automation', '18,500', '42%', '$4.80', 'Commercial / Transactional', '/#features', 'Interactive Demo & Architecture Pillars', 'P0 (High)'],
    ['CRM integration automation', '14,200', '38%', '$6.10', 'Commercial', '/#features', '2-Way CRM Architecture Breakdown', 'P0 (High)'],
    ['Google Sheets automation', '33,000', '46%', '$3.90', 'Informational / Commercial', '/#sheets-sync', 'Tutorial + Bi-Directional Formula Guide', 'P0 (High)'],
    ['AI lead analyzer', '8,900', '29%', '$5.40', 'Transactional', '/#demo-tool', 'Live Interactive Analyzer Simulator', 'P0 (High)'],
    ['best AI tools 2026', '65,000', '58%', '$2.75', 'Commercial Investigation', '/#cornerstone-seo', 'Top 10 Benchmark & ROI Comparison', 'P1 (Medium)'],
    ['lead processing automation software', '4,200', '27%', '$8.20', 'High Commercial Intent', '/#pricing', 'Product Comparison Table & Free Trial', 'P0 (High)'],
    ['automated lead scoring for HubSpot', '3,800', '31%', '$7.50', 'Transactional', '/#demo-tool', 'HubSpot Webhook & Deal Creation Guide', 'P1 (Medium)'],
    ['Salesforce Google Sheets two-way sync', '5,100', '35%', '$9.00', 'Transactional', '/#features', 'Field Mapping & Webhook Tutorial', 'P1 (Medium)'],
    ['AI sales qualification bot', '6,400', '33%', '$4.20', 'Commercial', '/#demo-tool', 'Interactive Intent Simulator', 'P1 (Medium)'],
    ['speed to lead automation 2026', '2,900', '19%', '$5.10', 'Problem-Aware', '/#case-study', 'ScaleOps Media 42s Response Case Study', 'P1 (Medium)'],
    ['automate inbound sales inquiries', '4,600', '24%', '$6.30', 'Commercial', '/#pricing', 'ROI Calculator & Labor Savings Guide', 'P1 (Medium)'],
    ['Zapier alternative for sales lead scoring', '7,200', '44%', '$3.80', 'Comparison / Alternative', '/#cornerstone-seo', 'Latency & Pricing Benchmark Review', 'P2 (Niche)'],
    ['Make com CRM automation blueprints', '5,800', '32%', '$3.20', 'Tutorial', '/#growth-playbook', 'Downloadable JSON Template Vault', 'P1 (Medium)'],
    ['zero code lead qualification engine', '3,100', '21%', '$4.50', 'Transactional', '/#demo-tool', 'Live Inbound Ingestion Playground', 'P0 (High)'],
    ['B2B agency lead automation templates', '4,900', '26%', '$5.80', 'Commercial', '/#growth-playbook', '15+ Workflow Template Vault (.JSON)', 'P0 (High)'],
  ];

  const csvRows = [
    headers.map((h) => `"${h}"`).join(','),
    ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
  ];

  return csvRows.join('\n');
}

/**
 * 15+ Workflow Automation Templates Vault Export
 */
export const FULL_WORKFLOW_TEMPLATES_VAULT = [
  {
    id: 'TPL-01',
    name: 'Google Sheets 2-Way Lead Scorer & Enrichment',
    category: 'Google Sheets Automation',
    compatibility: ['Google Sheets', 'AI Lead Analyzer API', 'Clearbit / Domain Enriched'],
    description: 'Auto-enriches company domain, estimates purchase budget, and writes an AI intent score (0-100) whenever a row is inserted.',
    timeSavedHoursWeekly: 6.5,
    webhookPayloadSample: {
      action: 'ROW_INSERTED',
      sheetId: '1aB2cD3eF_MasterLeads_2026',
      trigger: 'onFormSubmit',
      aiEngine: 'gemini-3.8-flash',
      targetColumns: ['Intent Score', 'Quality Tier', 'Assigned Rep', 'Draft Email'],
    },
  },
  {
    id: 'TPL-02',
    name: 'Webflow Inbound to HubSpot VIP Fast-Track Router',
    category: 'CRM Integration',
    compatibility: ['Webflow', 'HubSpot CRM', 'Slack', 'AI Lead Analyzer'],
    description: 'Filters incoming form fills; scores > 80 instantly create a Deal in HubSpot, ping top AE on Slack, and send calendar link in 42s.',
    timeSavedHoursWeekly: 8.2,
    webhookPayloadSample: {
      action: 'NEW_WEBFLOW_SUBMISSION',
      hubspotDealStage: 'decision_maker_contacted',
      routingRule: 'score >= 80 ? ASSIGN_SENIOR_AE : AUTO_DRIP',
      speedToLeadTarget: '42s',
    },
  },
  {
    id: 'TPL-03',
    name: 'Real-Time Slack Sales Radar & 1-Click Action Buttons',
    category: 'AI Workflow Automation',
    compatibility: ['Slack', 'AI Lead Analyzer', 'Gmail'],
    description: 'Broadcasts new qualified leads to #sales-vip with interactive buttons: [Claim Lead], [Approve AI Email], [Snooze].',
    timeSavedHoursWeekly: 5.0,
    webhookPayloadSample: {
      action: 'BROADCAST_SLACK_CARD',
      channel: '#sales-hot-leads',
      interactivity: ['claim_lead', 'send_draft_email', 'flag_disqualified'],
    },
  },
  {
    id: 'TPL-04',
    name: 'Stripe Failed Payment & Churn Recovery Bot',
    category: 'Monetization & Retention',
    compatibility: ['Stripe', 'Google Sheets', 'Customer.io'],
    description: 'Detects card failures, evaluates customer lifetime value, and sends a gentle, high-converting payment update link.',
    timeSavedHoursWeekly: 4.8,
    webhookPayloadSample: {
      action: 'INVOICE_PAYMENT_FAILED',
      gracePeriodHours: 72,
      recoveryTemplate: 'founder_personal_outreach',
    },
  },
  {
    id: 'TPL-05',
    name: 'Salesforce Enterprise Lead Distribution Matrix',
    category: 'CRM Integration',
    compatibility: ['Salesforce', 'AI Lead Analyzer', 'Google Sheets'],
    description: 'Calculates employee band and territory routing rules before creating Salesforce Lead and Contact objects.',
    timeSavedHoursWeekly: 7.5,
    webhookPayloadSample: {
      action: 'SALESFORCE_LEAD_UPSERT',
      assignmentRule: 'Territory_By_Country_And_Budget',
      customFields: ['AI_Lead_Score__c', 'ICP_Fit_Score__c'],
    },
  },
  {
    id: 'TPL-06',
    name: 'Typeform to Notion Knowledge Base & Triage',
    category: 'AI Workflow Automation',
    compatibility: ['Typeform', 'Notion', 'AI Lead Analyzer'],
    description: 'Parses complex multi-step Typeform responses, creates Notion cards, and tags high-intent customer requests.',
    timeSavedHoursWeekly: 4.2,
    webhookPayloadSample: {
      action: 'NOTION_DATABASE_PAGE_CREATE',
      database: 'Customer Triage Kanban',
      tags: ['Enterprise Inquiry', 'Needs Architect Call'],
    },
  },
  {
    id: 'TPL-07',
    name: 'Pipedrive Pipeline Stage Transition Webhook',
    category: 'CRM Integration',
    compatibility: ['Pipedrive', 'Google Sheets', 'AI Lead Analyzer'],
    description: 'Syncs deal status transitions bi-directionally between Pipedrive pipelines and executive Google Sheets.',
    timeSavedHoursWeekly: 5.5,
    webhookPayloadSample: {
      action: 'PIPEDRIVE_DEAL_UPDATE',
      stageChangeTrigger: true,
      mirrorToGoogleSheets: true,
    },
  },
  {
    id: 'TPL-08',
    name: 'Automated Cold Inbound Disqualification & Nurture Filter',
    category: 'AI Workflow Automation',
    compatibility: ['Google Sheets', 'Mailchimp / Substack', 'AI Lead Analyzer'],
    description: 'Catches personal freemail submissions and low-budget inquiries, redirecting them to educational content drips without human SDR distraction.',
    timeSavedHoursWeekly: 6.0,
    webhookPayloadSample: {
      action: 'ROUTE_TO_NURTURE',
      filterCriteria: 'email_domain in FREEMAIL_LIST or budget == 0',
      tag: 'Nurture_2026_SelfService',
    },
  },
];
