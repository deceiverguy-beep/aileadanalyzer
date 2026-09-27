import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Text, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    api_key_hash = Column(String(255), unique=True, nullable=False)
    webhook_secret = Column(String(255), nullable=True)
    icp_criteria = Column(JSONB, nullable=False, default={
        "target_company_size": "20-500",
        "min_budget": "$5,000",
        "target_industries": ["SaaS", "Logistics", "E-commerce"],
        "required_crm": ["HubSpot", "Salesforce"]
    })
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    leads = relationship("Lead", back_populates="workspace", cascade="all, delete-orphan")
    webhook_logs = relationship("WebhookLog", back_populates="workspace")


class Lead(Base):
    __tablename__ = "leads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    submission_id = Column(String(100), nullable=False)

    # Contact Details
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    company_name = Column(String(255), nullable=False)
    company_website = Column(String(255), nullable=True)

    # Submitted Qualification Metadata
    company_size = Column(String(50), nullable=True)
    budget = Column(String(100), nullable=True)
    timeline = Column(String(100), nullable=True)
    raw_message = Column(Text, nullable=True)

    # AI Evaluation Output
    lead_tier = Column(String(20), nullable=False)  # 'Hot', 'Warm', 'Cold'
    lead_score = Column(Integer, nullable=False)
    icp_fit_score = Column(Integer, nullable=False, default=0)
    intent_urgency_score = Column(Integer, nullable=False, default=0)
    contact_quality_score = Column(Integer, nullable=False, default=0)

    # JSON Storage for Dynamic Signals & Extracted Meta
    key_signals = Column(JSONB, nullable=False, default=list)
    risk_factors = Column(JSONB, nullable=False, default=list)
    enriched_data = Column(JSONB, nullable=True, default=dict)
    ai_summary = Column(Text, nullable=True)
    suggested_follow_up = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    workspace = relationship("Workspace", back_populates="leads")
    webhook_logs = relationship("WebhookLog", back_populates="lead", cascade="all, delete-orphan")


class WebhookLog(Base):
    __tablename__ = "webhook_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="SET NULL"), nullable=True)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id", ondelete="CASCADE"), nullable=True)
    source_event = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False)  # 'success', 'failed', 'retrying'
    response_code = Column(Integer, nullable=True)
    error_message = Column(Text, nullable=True)
    execution_time_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    workspace = relationship("Workspace", back_populates="webhook_logs")
    lead = relationship("Lead", back_populates="webhook_logs")
