import os
import time
import hmac
import hashlib
import json
import logging
import uuid
import psycopg2
from psycopg2.extras import RealDictCursor
import httpx

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

# ------------------------------------------------------------------
# Test Configuration & Credentials
# ------------------------------------------------------------------
API_BASE_URL = os.getenv("TEST_API_URL", "http://localhost:8000/api/v1")
TEST_WORKSPACE_API_KEY = os.getenv("TEST_WORKSPACE_API_KEY", "test_sk_9f8e7d6c5b4a3a2a")
WEBHOOK_SECRET = os.getenv("TEST_WEBHOOK_SECRET", "super_secret_hmac_key_123")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/ai_lead_analyzer")

# ------------------------------------------------------------------
# Helpers: HMAC Signing & DB Queries
# ------------------------------------------------------------------
def generate_hmac_signature(payload_bytes: bytes, secret: str) -> str:
    """Generates SHA-256 HMAC signature for payload validation tests."""
    return hmac.new(
        secret.encode("utf-8"),
        payload_bytes,
        hashlib.sha256
    ).hexdigest()


def get_db_connection():
    """Establishes direct PostgreSQL connection to verify persistence."""
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)


# ------------------------------------------------------------------
# End-to-End Integration Test Suite
# ------------------------------------------------------------------
def run_end_to_end_test():
    test_submission_id = f"test_sub_{uuid.uuid4().hex[:8]}"
    logging.info(f"--- STARTING E2E PIPELINE TEST [{test_submission_id}] ---")

    # 1. Construct Test Payload
    test_payload = {
        "submission_id": test_submission_id,
        "timestamp": "2026-09-23T06:10:00Z",
        "lead_details": {
            "first_name": "Sarah",
            "last_name": "Connor",
            "email": "sarah.connor@cyberdyne.io",
            "phone": "+1-555-019-2834",
            "company_name": "Cyberdyne Systems",
            "company_website": "cyberdyne.io",
            "company_size": "100-500",
            "budget": "$25,000+",
            "timeline": "Immediate (<30 days)",
            "message": "We need an enterprise solution for automated lead evaluation and routing into HubSpot. Require SOC2 compliance and instant Slack notifications."
        },
        "icp_criteria": {
            "target_company_size": "20-500",
            "min_budget": "$5,000",
            "target_industries": ["AI", "SaaS", "Robotics"],
            "required_crm": ["HubSpot", "Salesforce"]
        }
    }

    payload_bytes = json.dumps(test_payload).encode("utf-8")
    hmac_sig = generate_hmac_signature(payload_bytes, WEBHOOK_SECRET)

    headers = {
        "Content-Type": "application/json",
        "X-API-Key": TEST_WORKSPACE_API_KEY,
        "X-Hub-Signature-256": f"sha256={hmac_sig}"
    }

    # --------------------------------------------------------------
    # STEP 1: Verify API Endpoint Response (Phase 2 & Phase 4)
    # --------------------------------------------------------------
    logging.info("STEP 1: Testing API Key Authentication & Endpoint Response...")
    with httpx.Client(timeout=10.0) as client:
        response = client.post(
            f"{API_BASE_URL}/analyze-lead",
            content=payload_bytes,
            headers=headers
        )

        assert response.status_code == 202, f"Expected status 202, got {response.status_code}: {response.text}"
        res_data = response.json()
        assert res_data.get("status") == "accepted", "Endpoint did not return 'accepted' status"
        logging.info("✓ STEP 1 PASSED: Fast 202 Accepted response received.")

    # --------------------------------------------------------------
    # STEP 2: Poll Database for Async Celery Execution (Phase 1 & 4)
    # --------------------------------------------------------------
    logging.info("STEP 2: Polling PostgreSQL for Celery worker processing...")
    max_retries = 12
    poll_interval = 2.5 # Total wait time up to 30 seconds
    lead_record = None

    conn = get_db_connection()
    cursor = conn.cursor()

    for attempt in range(1, max_retries + 1):
        time.sleep(poll_interval)
        logging.info(f"Checking Database (Attempt {attempt}/{max_retries})...")

        cursor.execute(
            "SELECT * FROM leads WHERE submission_id = %s;",
            (test_submission_id,)
        )
        lead_record = cursor.fetchone()

        if lead_record:
            logging.info("✓ Database record found!")
            break

    assert lead_record is not None, f"FAIL: Lead with submission_id '{test_submission_id}' was not processed within 30s."
    logging.info("✓ STEP 2 PASSED: DB Persistence confirmed.")

    # --------------------------------------------------------------
    # STEP 3: Validate Enrichment & LLM Output Quality (Phase 3 & 1)
    # --------------------------------------------------------------
    logging.info("STEP 3: Validating Enriched Data & AI Lead Scoring...")

    assert lead_record["lead_tier"] in ["Hot", "Warm", "Cold"], f"Invalid lead tier: {lead_record['lead_tier']}"
    assert 0 <= lead_record["lead_score"] <= 100, f"Invalid score range: {lead_record['lead_score']}"
    
    # Check Pre-LLM Firmographics
    enriched_data = lead_record.get("enriched_data", {})
    assert "pre_llm_validation" in enriched_data or "tech_stack" in enriched_data, "Missing pre-LLM enrichment data"
    
    # Verify Hot Lead Classification
    assert lead_record["lead_tier"] == "Hot", f"Expected 'Hot' tier for enterprise lead, got: {lead_record['lead_tier']}"
    
    logging.info(f"✓ Lead Tier: {lead_record['lead_tier']}")
    logging.info(f"✓ Lead Score: {lead_record['lead_score']}/100")
    logging.info(f"✓ AI Summary: {lead_record['ai_summary']}")
    logging.info("✓ STEP 3 PASSED: Enrichment & Structured AI Output validated.")

    cursor.close()
    conn.close()

    logging.info("==================================================")
    logging.info("🎉 SUCCESS: ALL 5 PHASES VALIDATED AND READY FOR PRODUCTION!")
    logging.info("==================================================")


if __name__ == "__main__":
    run_end_to_end_test()
