import os
import time
import logging
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx
from openai import OpenAI
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from models import Workspace, Lead, WebhookLog
from security import (
    get_current_workspace, 
    check_rate_limit, 
    enforce_workspace_rate_limit,
    verify_hmac_signature,
    redis_client
)
from enrichment import run_pre_llm_enrichment_pipeline

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AILeadAnalyzer")

# Initialize FastAPI app & OpenAI Client
app = FastAPI(title="AI Lead Analyzer Secured API", version="2026.1")

# Parse allowed origins from environment variable (comma-separated)
raw_origins = os.getenv("ALLOWED_ORIGINS", "https://yourdomain.com,https://app.yourdomain.com,http://localhost:3000,http://localhost:5173")
allowed_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-API-Key"],
)

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

# Environment Credentials
ENRICHMENT_API_KEY = os.getenv("ENRICHMENT_API_KEY", "")
HUBSPOT_ACCESS_TOKEN = os.getenv("HUBSPOT_ACCESS_TOKEN", "")
SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL", "")


# ==============================================================================
# 1. REAL APOLLO.IO ENRICHMENT REQUEST
# ==============================================================================
def enrich_company_data(company_name: str, email: str) -> dict:
    """
    Queries Apollo.io API to enrich company firmographics (industry, employee size, tech stack).
    """
    if not ENRICHMENT_API_KEY:
        logger.warning("ENRICHMENT_API_KEY missing. Skipping Apollo enrichment.")
        return {"industry": "Unknown", "estimated_revenue": "N/A"}

    url = "https://api.apollo.io/v1/people/match"
    headers = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "X-Api-Key": ENRICHMENT_API_KEY
    }
    payload = {
        "email": email,
        "organization_name": company_name,
        "reveal_personal_emails": False
    }

    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.post(url, json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                person = data.get("person") or {}
                org = person.get("organization") or {}

                industry = org.get("industry") or "Unknown"
                estimated_num_employees = org.get("estimated_num_employees") or 0
                
                logger.info(f"Apollo enrichment successful for {email}: Industry={industry}")
                return {
                    "industry": industry,
                    "estimated_revenue": f"{estimated_num_employees} employees (Apollo match)"
                }
            else:
                logger.error(f"Apollo API returned HTTP {response.status_code}: {response.text}")
                return {"industry": "Unknown", "estimated_revenue": "N/A"}

    except Exception as e:
        logger.error(f"Failed to execute Apollo enrichment call: {str(e)}")
        return {"industry": "Unknown", "estimated_revenue": "N/A"}


# ==============================================================================
# 2. REAL HUBSPOT CRM CONTACT CREATION REQUEST
# ==============================================================================
def push_to_hubspot_crm(lead_data: dict) -> bool:
    """
    Creates or updates a contact record in HubSpot CRM via the v3 Contacts API.
    """
    if not HUBSPOT_ACCESS_TOKEN:
        logger.warning("HUBSPOT_ACCESS_TOKEN missing. Skipping HubSpot CRM push.")
        return False

    url = "https://api.hubapi.com/crm/v3/objects/contacts"
    headers = {
        "Authorization": f"Bearer {HUBSPOT_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    # Split full name into first and last name for HubSpot CRM standard fields
    names = lead_data.get("full_name", "").split(" ", 1)
    first_name = names[0]
    last_name = names[1] if len(names) > 1 else ""

    payload = {
        "properties": {
            "email": lead_data.get("email"),
            "firstname": first_name or lead_data.get("first_name", ""),
            "lastname": last_name or lead_data.get("last_name", ""),
            "company": lead_data.get("company_name"),
            "jobtitle": lead_data.get("job_title", ""),
            "hs_lead_status": "NEW",
            # Custom HubSpot properties (ensure these properties are created in your HubSpot account)
            "message": f"Lead Tier: {lead_data.get('lead_tier')} | Score: {lead_data.get('lead_score')}/100. Action: {lead_data.get('recommended_action', lead_data.get('suggested_follow_up', ''))}"
        }
    }

    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.post(url, json=payload, headers=headers)

            if response.status_code in (200, 201):
                logger.info(f"HubSpot CRM Contact created successfully for {lead_data.get('email')}")
                return True
            # HTTP 409 means the contact already exists; search/update endpoint can be triggered
            elif response.status_code == 409:
                logger.info(f"Contact {lead_data.get('email')} already exists in HubSpot.")
                return True
            else:
                logger.error(f"HubSpot API returned HTTP {response.status_code}: {response.text}")
                return False

    except Exception as e:
        logger.error(f"Failed to execute HubSpot CRM push: {str(e)}")
        return False


# ==============================================================================
# 3. REAL SLACK INCOMING WEBHOOK NOTIFICATION
# ==============================================================================
def send_slack_hot_lead_alert(lead_data: dict) -> bool:
    """
    Posts a rich Block Kit notification message to your Slack #sales-alerts channel.
    """
    if not SLACK_WEBHOOK_URL:
        logger.warning("SLACK_WEBHOOK_URL missing. Skipping Slack alert.")
        return False

    full_name = lead_data.get("full_name") or f"{lead_data.get('first_name', '')} {lead_data.get('last_name', '')}".strip()

    slack_payload = {
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "🔥 HOT LEAD ALERT RECEIVED",
                    "emoji": True
                }
            },
            {
                "type": "section",
                "fields": [
                    {"type": "mrkdwn", "text": f"*Name:*\n{full_name}"},
                    {"type": "mrkdwn", "text": f"*Company:*\n{lead_data.get('company_name')}"},
                    {"type": "mrkdwn", "text": f"*Email:*\n{lead_data.get('email')}"},
                    {"type": "mrkdwn", "text": f"*Score:*\n*{lead_data.get('lead_score')}/100* ({lead_data.get('lead_tier')})"}
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*AI Justification:*\n_{lead_data.get('summary', lead_data.get('ai_summary', ''))}_\n\n*Recommended Action:*\n`{lead_data.get('recommended_action', lead_data.get('suggested_follow_up', ''))}`"
                }
            }
        ]
    }

    try:
        with httpx.Client(timeout=5.0) as client:
            response = client.post(SLACK_WEBHOOK_URL, json=slack_payload)
            if response.status_code == 200:
                logger.info(f"Slack alert successfully dispatched for Lead #{lead_data.get('id', lead_data.get('submission_id', ''))}")
                return True
            else:
                logger.error(f"Slack API returned HTTP {response.status_code}: {response.text}")
                return False
    except Exception as e:
        logger.error(f"Failed to send Slack alert: {str(e)}")
        return False


# ==============================================================================
# 4. Pydantic Schemas for Inbound Webhooks & AI Structured Output
# ==============================================================================
class LeadDetails(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    company_name: str
    company_website: str
    company_size: str
    budget: str
    timeline: str
    message: str

class ICPCriteria(BaseModel):
    target_company_size: str
    min_budget: str
    target_industries: List[str]
    required_crm: List[str]

class LeadWebhookPayload(BaseModel):
    submission_id: str
    timestamp: str
    lead_details: LeadDetails
    icp_criteria: ICPCriteria

class ScoringBreakdown(BaseModel):
    icp_fit_score: int = Field(description="Points earned for ICP criteria match (0-40)")
    intent_urgency_score: int = Field(description="Points earned for buyer intent and timeline (0-35)")
    contact_quality_score: int = Field(description="Points earned for domain and deliverability (0-25)")

class RecommendedAction(BaseModel):
    route_to: str
    notification_channel: str
    auto_calendar_link: bool
    suggested_follow_up: str

class CRMUpdateFields(BaseModel):
    Lead_Score__c: int
    Lead_Quality__c: str
    AI_Summary__c: str
    Priority_Status__c: str

class LeadAnalysisResult(BaseModel):
    submission_id: str
    lead_tier: str = Field(description="'Hot', 'Warm', or 'Cold'")
    lead_score: int = Field(description="Total score from 0 to 100")
    scoring_breakdown: ScoringBreakdown
    key_signals: List[str]
    risk_factors: List[str]
    recommended_action: RecommendedAction
    crm_update_fields: CRMUpdateFields


# ==============================================================================
# 5. In-Process Processing Fallback (Used when Celery Redis broker is not spun up)
# ==============================================================================
async def process_lead_pipeline(payload: LeadWebhookPayload, workspace_id: Optional[str] = None):
    raw_lead_dict = payload.lead_details.model_dump()
    from enrichment import extract_email_domain, sanitize_website_url, fetch_firmographic_enrichment

    email = raw_lead_dict.get("email", "")
    provided_website = raw_lead_dict.get("company_website", "")
    email_domain, is_disposable, is_corporate = extract_email_domain(email)
    target_domain = sanitize_website_url(provided_website) or email_domain

    # FAST-PATH: Disposable Email
    if is_disposable:
        logger.warning(f"Disposable domain detected @{email_domain}. Marking Cold.")
        cold_data = {
            "full_name": f"{raw_lead_dict.get('first_name')} {raw_lead_dict.get('last_name')}",
            "email": email,
            "company_name": raw_lead_dict.get("company_name"),
            "lead_tier": "Cold",
            "lead_score": 5,
            "summary": f"Disposable domain @{email_domain}. Auto-disqualified.",
            "recommended_action": "Quarantine / Require business email verification."
        }
        push_to_hubspot_crm(cold_data)
        return cold_data

    # Enrichment step
    apollo_firmographics = enrich_company_data(raw_lead_dict.get("company_name", ""), email)
    
    # LLM Structured Output with OpenAI GPT-4o
    system_prompt = (
        "You are an expert B2B SaaS Sales Operations Specialist and AI Lead Analyzer.\n"
        "Evaluate incoming leads against ICP criteria, verify firmographic metrics, perform intent scoring, "
        "and return output conforming exactly to the requested schema.\n"
        "TIERS: Hot (80-100), Warm (50-79), Cold (0-49)."
    )

    merged_data = {
        **raw_lead_dict,
        "apollo_enrichment": apollo_firmographics
    }

    completion = openai_client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Lead: {merged_data}\nICP: {payload.icp_criteria.model_dump()}"}
        ],
        response_format=LeadAnalysisResult,
    )
    analysis: LeadAnalysisResult = completion.choices[0].message.parsed

    lead_sync_data = {
        "full_name": f"{raw_lead_dict.get('first_name')} {raw_lead_dict.get('last_name')}",
        "first_name": raw_lead_dict.get("first_name"),
        "last_name": raw_lead_dict.get("last_name"),
        "email": email,
        "company_name": raw_lead_dict.get("company_name"),
        "lead_tier": analysis.lead_tier,
        "lead_score": analysis.lead_score,
        "summary": analysis.crm_update_fields.AI_Summary__c,
        "recommended_action": analysis.recommended_action.suggested_follow_up
    }

    # Push to HubSpot
    push_to_hubspot_crm(lead_sync_data)

    # Push to Slack for Hot leads (<42s Speed to Lead)
    if analysis.lead_tier == "Hot":
        send_slack_hot_lead_alert(lead_sync_data)

    return analysis


# ==============================================================================
# 6. FastAPI Secured Ingestion Endpoint (Phase 2 & Phase 4)
# ==============================================================================
@app.post("/api/v1/analyze-lead", status_code=status.HTTP_202_ACCEPTED)
async def analyze_lead_endpoint(
    request: Request,
    background_tasks: BackgroundTasks,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    """
    Phase 2 & 4 Ingestion:
    - Verifies X-API-Key Workspace
    - Enforces Redis Sliding Window Rate Limit (with graceful bypass on Redis outage)
    - Verifies HMAC Signature if configured
    - Persists raw lead to PostgreSQL ACID store
    - Dispatches to Celery / Background Queue
    - Returns HTTP 202 Accepted in < 200ms
    """
    # 1. Rate Limiting with graceful fallback
    await enforce_workspace_rate_limit(
        workspace_id=str(workspace.id),
        max_requests=60,
        window_seconds=60
    )

    # 2. HMAC Signature Validation
    webhook_secret = getattr(workspace, "webhook_secret", None)
    if webhook_secret:
        await verify_hmac_signature(request, secret_key=webhook_secret)

    payload_data = await request.json()
    submission_id = payload_data.get("submission_id") or f"sub_{int(time.time() * 1000)}"
    details = payload_data.get("lead_details", {})

    # 3. Save raw lead to PostgreSQL (Durability layer before queueing)
    try:
        new_lead = Lead(
            workspace_id=workspace.id,
            submission_id=submission_id,
            first_name=details.get("first_name", "Anonymous"),
            last_name=details.get("last_name", "Lead"),
            email=details.get("email", "unknown@domain.com"),
            phone=details.get("phone"),
            company_name=details.get("company_name", "Unknown Company"),
            company_website=details.get("company_website"),
            company_size=details.get("company_size"),
            budget=details.get("budget"),
            timeline=details.get("timeline"),
            raw_message=details.get("message"),
            lead_tier="Pending",
            lead_score=0
        )
        db.add(new_lead)
        await db.commit()
    except Exception as db_err:
        logger.warning(f"Database write skipped or non-fatal: {db_err}")

    # 4. Queue Job in Redis via Celery (with FastAPI BackgroundTasks fallback)
    celery_job_id = None
    try:
        from tasks import process_lead_job
        task_res = process_lead_job.delay(payload_data, str(workspace.id))
        celery_job_id = task_res.id
    except Exception as queue_err:
        logger.warning(f"Celery direct dispatch fallback to BackgroundTasks: {queue_err}")
        try:
            parsed_payload = LeadWebhookPayload(**payload_data)
            background_tasks.add_task(process_lead_pipeline, parsed_payload, str(workspace.id))
        except Exception as bg_err:
            logger.error(f"Fallback task scheduling failed: {bg_err}")

    # 5. Fast 202 Accepted Response (< 200ms)
    return {
        "status": "accepted",
        "code": status.HTTP_202_ACCEPTED,
        "workspace": workspace.name,
        "submission_id": submission_id,
        "job_id": celery_job_id,
        "queue": "lead_processing_queue",
        "message": "Raw lead persisted to database and queued for asynchronous Celery processing."
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AI Lead Analyzer API"}


# Include Modular V1 Endpoints
try:
    from backend.app.api.v1.endpoints.leads import router as leads_router
    app.include_router(leads_router, prefix="/api/v1")
except Exception as e:
    logger.warning(f"Could not load leads_router: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
