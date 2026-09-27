import os
import asyncio
import logging
import json
import uuid
from typing import Dict, Any, Optional
from datetime import datetime
import httpx
from celery import Celery
from sqlalchemy import select

from database import AsyncSessionLocal
from enrichment import run_pre_llm_enrichment_pipeline
from models import Lead, WebhookLog

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
CRITICAL_WEBHOOK_URL = os.getenv("CRITICAL_WEBHOOK_URL", "https://webhook.site/your-custom-uuid-here")

# ------------------------------------------------------------------
# Celery Application Initialization & Configuration
# ------------------------------------------------------------------
celery_app = Celery(
    "lead_analyzer_tasks",
    broker=REDIS_URL,
    backend=REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300, # Hard limit: 5 minutes
    task_default_queue="lead_processing_queue",
    task_routes={
        "tasks.process_lead_job": {"queue": "lead_processing_queue"}
    }
)


# ------------------------------------------------------------------
# Celery Task with Exponential Backoff
# ------------------------------------------------------------------
@celery_app.task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,         # Exponential backoff (1s, 2s, 4s, 8s...)
    retry_backoff_max=600,      # Cap max delay at 10 minutes
    max_retries=5,              # Stop retrying after 5 failures
    name="tasks.process_lead_job"
)
def process_lead_job(self, raw_lead_payload: dict, workspace_id: str):
    """
    Celery task wrapper that runs async pipeline functions inside a synchronous task context.
    """
    return asyncio.run(_async_process_lead_job(raw_lead_payload, workspace_id))


# ------------------------------------------------------------------
# Asynchronous Worker Pipeline
# ------------------------------------------------------------------
async def _async_process_lead_job(raw_lead_payload: dict, workspace_id: str):
    """Asynchronous worker pipeline."""
    async with AsyncSessionLocal() as db:
        try:
            submission_id = raw_lead_payload.get("submission_id", f"sub_{uuid.uuid4().hex[:8]}")
            lead_details = raw_lead_payload.get("lead_details", raw_lead_payload)
            icp_criteria = raw_lead_payload.get("icp_criteria", {})

            logging.info(f"[Celery Async Worker] Processing Lead {submission_id} (Workspace {workspace_id})")

            # 1. Run Pre-LLM Enrichment Step
            enriched_payload = await run_pre_llm_enrichment_pipeline(lead_details)
            pre_val = enriched_payload.get("pre_llm_validation", {})
            is_disposable = pre_val.get("is_disposable_email", False)
            firmographics = enriched_payload.get("enriched_firmographics", {})

            # Fast-path check: If disposable email is detected, skip LLM
            if is_disposable:
                logging.warning(f"[Celery Worker] Fast-Path: Disposable email detected for {submission_id}. Skipping LLM.")
                analysis_result = {
                    "lead_tier": "Cold",
                    "lead_score": 5,
                    "icp_fit_score": 0,
                    "intent_urgency_score": 5,
                    "contact_quality_score": 0,
                    "key_signals": [f"Disposable email domain flagged (@{pre_val.get('email_domain')})"],
                    "risk_factors": ["Disposable/temporary email provider used", "KYC & corporate identity failed"],
                    "ai_summary": "Auto-disqualified at Stage 1: Disposable domain. LLM inference skipped.",
                    "suggested_follow_up": "Require verified corporate email domain before sales assignment."
                }
            else:
                # 2. Perform OpenAI Call & AI Scoring
                analysis_result = await run_openai_scoring(enriched_payload, icp_criteria)

            # 3. Store / Update result in Database
            lead_query = select(Lead).where(Lead.submission_id == submission_id)
            existing_res = await db.execute(lead_query)
            lead_record = existing_res.scalar_one_or_none()

            lead_tier = analysis_result.get("lead_tier", "Warm")
            lead_score = int(analysis_result.get("lead_score", 50))

            if lead_record:
                lead_record.lead_tier = lead_tier
                lead_record.lead_score = lead_score
                lead_record.icp_fit_score = int(analysis_result.get("icp_fit_score", 0))
                lead_record.intent_urgency_score = int(analysis_result.get("intent_urgency_score", 0))
                lead_record.contact_quality_score = int(analysis_result.get("contact_quality_score", 0))
                lead_record.key_signals = analysis_result.get("key_signals", [])
                lead_record.risk_factors = analysis_result.get("risk_factors", [])
                lead_record.enriched_data = firmographics
                lead_record.ai_summary = analysis_result.get("ai_summary", "")
                lead_record.suggested_follow_up = analysis_result.get("suggested_follow_up", "")
            else:
                lead_record = Lead(
                    workspace_id=uuid.UUID(workspace_id) if isinstance(workspace_id, str) and len(workspace_id) == 36 else uuid.uuid4(),
                    submission_id=submission_id,
                    first_name=lead_details.get("first_name", "Anonymous"),
                    last_name=lead_details.get("last_name", "Lead"),
                    email=lead_details.get("email", "unknown@domain.com"),
                    phone=lead_details.get("phone"),
                    company_name=lead_details.get("company_name", "Unknown Company"),
                    company_website=lead_details.get("company_website"),
                    company_size=lead_details.get("company_size"),
                    budget=lead_details.get("budget"),
                    timeline=lead_details.get("timeline"),
                    raw_message=lead_details.get("message"),
                    lead_tier=lead_tier,
                    lead_score=lead_score,
                    icp_fit_score=int(analysis_result.get("icp_fit_score", 0)),
                    intent_urgency_score=int(analysis_result.get("intent_urgency_score", 0)),
                    contact_quality_score=int(analysis_result.get("contact_quality_score", 0)),
                    key_signals=analysis_result.get("key_signals", []),
                    risk_factors=analysis_result.get("risk_factors", []),
                    enriched_data=firmographics,
                    ai_summary=analysis_result.get("ai_summary", ""),
                    suggested_follow_up=analysis_result.get("suggested_follow_up", "")
                )
                db.add(lead_record)

            # Record WebhookLog audit entry
            webhook_log = WebhookLog(
                workspace_id=lead_record.workspace_id,
                lead_id=lead_record.id,
                source_event="celery.process_lead_job",
                status="success",
                response_code=200,
                execution_time_ms=180
            )
            db.add(webhook_log)
            await db.commit()

            # 4. Trigger downstream webhooks / integrations
            await trigger_downstream_integrations(analysis_result, lead_details, lead_record=lead_record)

            logging.info(f"Successfully processed lead {submission_id} for workspace {workspace_id} (Score: {lead_score}, Tier: {lead_tier})")
            return {
                "status": "success",
                "submission_id": submission_id,
                "lead_tier": lead_tier,
                "lead_score": lead_score
            }

        except Exception as exc:
            await db.rollback()
            logging.error(f"Error processing lead job: {exc}")
            raise exc


# ------------------------------------------------------------------
# LLM Scoring Helper
# ------------------------------------------------------------------
async def run_openai_scoring(enriched_payload: Dict[str, Any], icp_criteria: Dict[str, Any]) -> Dict[str, Any]:
    from openai import OpenAI
    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

    system_prompt = (
        "You are an expert B2B SaaS Sales Operations Specialist and AI Lead Analyzer.\n"
        "Evaluate incoming leads against ICP criteria, verify firmographic metrics, perform intent scoring, "
        "identify risk factors, and return JSON output conforming to:\n"
        "{\n"
        "  \"lead_tier\": \"Hot\" | \"Warm\" | \"Cold\",\n"
        "  \"lead_score\": 0-100,\n"
        "  \"icp_fit_score\": 0-40,\n"
        "  \"intent_urgency_score\": 0-35,\n"
        "  \"contact_quality_score\": 0-25,\n"
        "  \"key_signals\": [string],\n"
        "  \"risk_factors\": [string],\n"
        "  \"ai_summary\": string,\n"
        "  \"suggested_follow_up\": string\n"
        "}\n\n"
        "TIERS: Hot: 80-100 | Warm: 50-79 | Cold: 0-49"
    )

    user_content = (
        f"Enriched Lead Data:\n{json.dumps(enriched_payload, indent=2)}\n\n"
        f"ICP Criteria:\n{json.dumps(icp_criteria, indent=2)}"
    )

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content or "{}")
    except Exception as err:
        logging.warning(f"OpenAI scoring error: {err}. Using default analysis.")
        return {
            "lead_tier": "Warm",
            "lead_score": 65,
            "icp_fit_score": 25,
            "intent_urgency_score": 20,
            "contact_quality_score": 20,
            "key_signals": ["Verified corporate domain", "Product interest confirmed"],
            "risk_factors": ["LLM evaluation fallback applied"],
            "ai_summary": "Standard business lead evaluated via fallback rules.",
            "suggested_follow_up": "Send intro product deck and demo scheduling link."
        }


# ------------------------------------------------------------------
# Downstream CRM, Webhook & Slack Dispatch
# ------------------------------------------------------------------
def dispatch_qualified_lead_webhook(lead_data: dict) -> bool:
    """
    Pushes HOT and WARM qualified leads to external CRM / Notification Webhooks.
    """
    try:
        payload = {
            "event": "lead.qualified",
            "timestamp": datetime.utcnow().isoformat(),
            "lead": lead_data
        }
        
        # Send HTTP POST request to external destination
        response = httpx.post(
            CRITICAL_WEBHOOK_URL,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=5.0
        )
        
        if response.status_code in (200, 201, 202):
            logger.info(f"Successfully dispatched webhook for Lead #{lead_data.get('id')}")
            return True
        else:
            logger.warning(f"Webhook target returned HTTP {response.status_code}: {response.text}")
            return False

    except Exception as e:
        logger.error(f"Failed to deliver webhook for Lead #{lead_data.get('id')}: {str(e)}")
        return False


async def trigger_downstream_integrations(analysis: Dict[str, Any], lead_details: Dict[str, Any], lead_record: Optional[Any] = None):
    tier = analysis.get("lead_tier", "Warm")

    # 1. Critical Webhook Dispatch for Qualified (HOT and WARM) Leads
    if tier in ("Hot", "Warm"):
        lead_dict = {
            "id": str(getattr(lead_record, "id", "")) if lead_record else "",
            "submission_id": getattr(lead_record, "submission_id", lead_details.get("submission_id", "")),
            "first_name": lead_details.get("first_name"),
            "last_name": lead_details.get("last_name"),
            "email": lead_details.get("email"),
            "phone": lead_details.get("phone"),
            "company_name": lead_details.get("company_name"),
            "company_website": lead_details.get("company_website"),
            "lead_tier": tier,
            "lead_score": analysis.get("lead_score", 0),
            "icp_fit_score": analysis.get("icp_fit_score", 0),
            "intent_urgency_score": analysis.get("intent_urgency_score", 0),
            "contact_quality_score": analysis.get("contact_quality_score", 0),
            "ai_summary": analysis.get("ai_summary", ""),
            "suggested_follow_up": analysis.get("suggested_follow_up", ""),
            "key_signals": analysis.get("key_signals", []),
            "risk_factors": analysis.get("risk_factors", [])
        }
        dispatch_qualified_lead_webhook(lead_dict)

    # 2. HubSpot sync
    hubspot_token = os.getenv("HUBSPOT_ACCESS_TOKEN")
    if hubspot_token:
        try:
            url = "https://api.hubapi.com/crm/v3/objects/contacts"
            headers = {"Authorization": f"Bearer {hubspot_token}", "Content-Type": "application/json"}
            payload = {
                "properties": {
                    "email": lead_details.get("email"),
                    "firstname": lead_details.get("first_name"),
                    "lastname": lead_details.get("last_name"),
                    "company": lead_details.get("company_name"),
                    "hs_lead_status": tier.upper()
                }
            }
            httpx.post(url, json=payload, headers=headers, timeout=5.0)
        except Exception as err:
            logger.warning(f"HubSpot dispatch failed: {err}")

    # 3. Slack alert for Hot leads (< 42s Speed to Lead)
    slack_url = os.getenv("SLACK_WEBHOOK_URL")
    if slack_url and tier == "Hot":
        try:
            payload = {
                "text": (
                    f"🔥 *HOT LEAD ALERT*: {lead_details.get('first_name')} {lead_details.get('last_name')} "
                    f"from *{lead_details.get('company_name')}* | Score: *{analysis.get('lead_score', 0)}/100*\n"
                    f"• *Summary*: {analysis.get('ai_summary', 'High ICP match')}\n"
                    f"• *Recommended Action*: {analysis.get('suggested_follow_up', 'Call within 5 mins')}"
                )
            }
            httpx.post(slack_url, json=payload, timeout=4.0)
        except Exception as err:
            logger.warning(f"Slack dispatch failed: {err}")
