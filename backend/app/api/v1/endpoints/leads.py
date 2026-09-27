import uuid
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.db.database import get_db
from models import Lead as LeadModel

router = APIRouter(prefix="/leads", tags=["Leads"])

class LeadPayload(BaseModel):
    email: str
    score: int = Field(default=0, ge=0, le=100)
    first_name: Optional[str] = "Anonymous"
    last_name: Optional[str] = "Lead"
    company_name: Optional[str] = "Unknown Co"
    company_website: Optional[str] = None
    phone: Optional[str] = None
    submission_id: Optional[str] = None
    workspace_id: Optional[str] = None
    lead_tier: Optional[str] = "Pending"
    message: Optional[str] = None

@router.post("/analyze-lead")
async def analyze_lead(
    payload: LeadPayload, 
    db: AsyncSession = Depends(get_db)
):
    # 1. Create your database record
    workspace_uuid = uuid.UUID(payload.workspace_id) if payload.workspace_id else uuid.uuid4()
    submission_id = payload.submission_id or f"sub_{uuid.uuid4().hex[:12]}"
    
    tier = "Hot" if payload.score >= 80 else ("Warm" if payload.score >= 50 else "Cold")
    if payload.lead_tier and payload.lead_tier != "Pending":
        tier = payload.lead_tier

    new_lead = LeadModel(
        workspace_id=workspace_uuid,
        submission_id=submission_id,
        email=payload.email,
        first_name=payload.first_name or "Anonymous",
        last_name=payload.last_name or "Lead",
        company_name=payload.company_name or "Unknown Co",
        company_website=payload.company_website,
        phone=payload.phone,
        lead_score=payload.score,
        lead_tier=tier,
        raw_message=payload.message
    )
    db.add(new_lead)
    
    # 2. Add explicit commit here before returning
    await db.commit()
    await db.refresh(new_lead)
    
    return {
        "status": "success", 
        "lead_id": str(new_lead.id),
        "email": new_lead.email,
        "score": new_lead.lead_score,
        "tier": new_lead.lead_tier
    }
