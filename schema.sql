-- ================================================================
-- POSTGRESQL SCHEMA FOR AI LEAD ANALYZER & INTENT SCORING PIPELINE
-- ================================================================

-- Enable UUID extension for secure, non-sequential IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. WORKSPACES TABLE
-- Stores client accounts, API keys, and custom ICP configurations
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    api_key_hash VARCHAR(255) UNIQUE NOT NULL,
    webhook_secret VARCHAR(255),
    icp_criteria JSONB NOT NULL DEFAULT '{
        "target_company_size": "20-500",
        "min_budget": "$5,000",
        "target_industries": ["SaaS", "Logistics", "E-commerce"],
        "required_crm": ["HubSpot", "Salesforce"]
    }'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. LEADS TABLE
-- Stores raw submissions, enriched firmographics, and AI analysis output
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    submission_id VARCHAR(100) NOT NULL,
    
    -- Contact Details
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company_name VARCHAR(255) NOT NULL,
    company_website VARCHAR(255),
    
    -- Submitted Qualification Metadata
    company_size VARCHAR(50),
    budget VARCHAR(100),
    timeline VARCHAR(100),
    raw_message TEXT,
    
    -- AI Evaluation Output
    lead_tier VARCHAR(20) NOT NULL CHECK (lead_tier IN ('Hot', 'Warm', 'Cold')),
    lead_score INT NOT NULL CHECK (lead_score BETWEEN 0 AND 100),
    icp_fit_score INT NOT NULL DEFAULT 0,
    intent_urgency_score INT NOT NULL DEFAULT 0,
    contact_quality_score INT NOT NULL DEFAULT 0,
    
    -- JSON Storage for Dynamic Signals & Extracted Meta
    key_signals JSONB NOT NULL DEFAULT '[]'::jsonb,
    risk_factors JSONB NOT NULL DEFAULT '[]'::jsonb,
    enriched_data JSONB DEFAULT '{}'::jsonb,
    ai_summary TEXT,
    suggested_follow_up TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. WEBHOOK LOGS TABLE
-- Tracks execution latency, errors, and retry attempts for webhooks
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    source_event VARCHAR(100) NOT NULL, -- e.g., 'webflow_form', 'hubspot_crm'
    status VARCHAR(50) NOT NULL, -- 'success', 'failed', 'retrying'
    response_code INT,
    error_message TEXT,
    execution_time_ms INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR FAST DASHBOARD QUERYING
CREATE INDEX IF NOT EXISTS idx_leads_workspace_created 
    ON leads(workspace_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_tier 
    ON leads(workspace_id, lead_tier);

CREATE INDEX IF NOT EXISTS idx_leads_score 
    ON leads(workspace_id, lead_score DESC);
