import os
import re
import logging
from typing import Dict, Any, Tuple, Optional, Set
import httpx

logging.basicConfig(level=logging.INFO)

ENRICHMENT_API_KEY = os.getenv("ENRICHMENT_API_KEY")

# ------------------------------------------------------------------
# 1. Curated Disposable Email Domain List
# ------------------------------------------------------------------
DISPOSABLE_DOMAINS: Set[str] = {
    "mailinator.com", "tempmail.com", "10minutemail.com", "guerrillamail.com",
    "sharklasers.com", "trashmail.com", "dispostable.com", "getnada.com",
    "throwawaymail.com", "yopmail.com", "temp-mail.org", "fakeinbox.com",
    "maildrop.cc", "emailondeck.com", "mohmal.com", "disposable.com"
}

FREE_CONSUMER_PROVIDERS: Set[str] = {
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "icloud.com"
}


# ------------------------------------------------------------------
# 2. Email & Domain Normalization Helpers
# ------------------------------------------------------------------
def extract_email_domain(email: str) -> Tuple[str, bool, bool]:
    """
    Extracts domain from email address.
    Returns: (domain, is_disposable, is_corporate)
    """
    clean_email = email.strip().lower()
    match = re.search(r"@([\w\.-]+)", clean_email)
    
    if not match:
        return "", False, False

    domain = match.group(1)
    is_disposable = domain in DISPOSABLE_DOMAINS
    is_corporate = domain not in FREE_CONSUMER_PROVIDERS and not is_disposable

    return domain, is_disposable, is_corporate


def sanitize_website_url(url: str) -> str:
    """Standardizes input URLs to clean domain strings (e.g. https://apexlogistics.io/about -> apexlogistics.io)."""
    clean_url = url.strip().lower()
    clean_url = re.sub(r"^https?://", "", clean_url)
    clean_url = re.sub(r"^www\.", "", clean_url)
    return clean_url.split("/")[0]


# ------------------------------------------------------------------
# 3. Firmographic API Enrichment Service
# ------------------------------------------------------------------
async def fetch_firmographic_enrichment(domain: str) -> Dict[str, Any]:
    """
    Queries third-party enrichment APIs (e.g., Apollo, Clearbit, or Brandfetch)
    to pull company employee count, industry, funding, and tech stack.
    """
    # Default fallback data structure if domain is consumer or API key missing
    fallback_data = {
        "enriched_industry": None,
        "enriched_headcount": None,
        "estimated_annual_revenue": None,
        "tech_stack": [],
        "linkedin_url": f"https://linkedin.com/company/{domain.split('.')[0]}" if domain else None,
        "enrichment_status": "skipped"
    }

    if not domain or domain in FREE_CONSUMER_PROVIDERS or domain in DISPOSABLE_DOMAINS:
        return fallback_data

    if not ENRICHMENT_API_KEY or ENRICHMENT_API_KEY == "your-apollo-or-clearbit-api-key":
        logging.warning("ENRICHMENT_API_KEY not set or placeholder. Skipping external firmographic lookup.")
        return fallback_data

    # Example: Async Call to Apollo/Clearbit/Enrichment API
    # Adapt endpoint URL and headers according to your preferred vendor
    api_url = f"https://api.apollo.io/v1/organizations/enrich?domain={domain}"
    headers = {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        "x-api-key": ENRICHMENT_API_KEY
    }

    async with httpx.AsyncClient(timeout=4.0) as client:
        try:
            response = await client.get(api_url, headers=headers)
            if response.status_code == 200:
                data = response.json().get("organization", {})
                return {
                    "enriched_industry": data.get("industry"),
                    "enriched_headcount": data.get("estimated_num_employees"),
                    "estimated_annual_revenue": data.get("annual_revenue_printed"),
                    "tech_stack": data.get("technologies", [])[:8], # Top 8 technologies
                    "linkedin_url": data.get("linkedin_url"),
                    "enrichment_status": "success"
                }
            else:
                logging.warning(f"Enrichment API returned status {response.status_code} for {domain}")
                fallback_data["enrichment_status"] = "not_found"
                return fallback_data

        except httpx.RequestError as exc:
            logging.error(f"Enrichment request failed for {domain}: {exc}")
            fallback_data["enrichment_status"] = "error"
            return fallback_data


# ------------------------------------------------------------------
# 4. Master Pre-LLM Pipeline Execution Step
# ------------------------------------------------------------------
async def run_pre_llm_enrichment_pipeline(raw_lead_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main pipeline entry point. Sanitizes incoming data, validates deliverability,
    runs firmographic lookup, and merges results into payload for OpenAI.
    """
    email = raw_lead_data.get("email", "")
    provided_website = raw_lead_data.get("company_website", "")

    # 1. Domain Extraction & Deliverability Analysis
    email_domain, is_disposable, is_corporate = extract_email_domain(email)
    target_domain = sanitize_website_url(provided_website) or email_domain

    # 2. Fetch Firmographics
    firmographics = await fetch_firmographic_enrichment(target_domain)

    # 3. Construct Unified Enriched Payload for LLM Prompt
    enriched_payload = {
        **raw_lead_data,
        "company_website": target_domain,
        "pre_llm_validation": {
            "email_domain": email_domain,
            "is_disposable_email": is_disposable,
            "is_corporate_email": is_corporate,
            "domain_validated": bool(target_domain and not is_disposable)
        },
        "enriched_firmographics": firmographics
    }

    return enriched_payload
