import os
from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/ai_lead_analyzer",
        description="Async PostgreSQL connection URL"
    )
    GEMINI_API_KEY: str = Field(
        default="",
        description="Google Gemini AI API Key"
    )
    API_SECRET_KEY_HASH: str = Field(
        default="",
        description="Hash or secret used for API verification"
    )
    ALLOWED_ORIGINS: str = Field(
        default="https://yourdomain.com,https://app.yourdomain.com,http://localhost:3000,http://localhost:5173",
        description="Comma-separated allowed origins for CORS"
    )

    # Optional third-party integrations
    OPENAI_API_KEY: Optional[str] = ""
    REDIS_URL: Optional[str] = "redis://localhost:6379/0"
    ENRICHMENT_API_KEY: Optional[str] = ""
    HUBSPOT_ACCESS_TOKEN: Optional[str] = ""
    SLACK_WEBHOOK_URL: Optional[str] = ""
    CRITICAL_WEBHOOK_URL: Optional[str] = "https://webhook.site/your-custom-uuid-here"

    # Support modern Pydantic V2 settings configuration
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Backward compatibility with Pydantic V1 Config class if referenced
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
