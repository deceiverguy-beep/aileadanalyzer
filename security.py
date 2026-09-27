import os
import hmac
import hashlib
import time
import logging
from typing import Optional, Tuple, Any
from fastapi import Request, HTTPException, Security, status, Depends
from fastapi.security import APIKeyHeader
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import redis.asyncio as redis

from redis.asyncio import Redis
from redis.exceptions import ConnectionError
import redis.asyncio as redis

from database import get_db
from models import Workspace

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ------------------------------------------------------------------
# Configuration & Redis Initialization
# ------------------------------------------------------------------
X_API_KEY_HEADER = APIKeyHeader(name="X-API-Key", auto_error=False)
X_HUB_SIGNATURE_HEADER = "X-Hub-Signature-256"

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client = redis.from_url(REDIS_URL, encoding="utf-8", decode_responses=True)


# ------------------------------------------------------------------
# 1. API Key Authentication & Workspace Context Ingestion
# ------------------------------------------------------------------
def hash_api_key(raw_api_key: str) -> str:
    """Hashes the raw API key using SHA-256 for database lookup."""
    return hashlib.sha256(raw_api_key.encode("utf-8")).hexdigest()


async def get_current_workspace(
    api_key: Optional[str] = Depends(X_API_KEY_HEADER),
    db: AsyncSession = Depends(get_db)
) -> Workspace:
    """
    Validates the X-API-Key header against active workspaces in DB.
    Injects the validated Workspace model instance directly into FastAPI routes.
    """
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing required authentication header: 'X-API-Key'",
        )

    key_hash = hash_api_key(api_key)
    query = select(Workspace).where(
        Workspace.api_key_hash == key_hash,
        Workspace.is_active == True
    )
    result = await db.execute(query)
    workspace = result.scalar_one_or_none()

    if not workspace:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or revoked API Key.",
        )

    return workspace


# ------------------------------------------------------------------
# 2. HMAC Signature Verification Helper (For Webhook Sources)
# ------------------------------------------------------------------
async def verify_hmac_signature(request: Request, secret_key: str) -> bool:
    """
    Verifies incoming webhook SHA256 signatures (e.g. Webflow, HubSpot, Typeform).
    Prevents unauthorized third-party spoofing on public webhook URLs.
    """
    signature_header = request.headers.get(X_HUB_SIGNATURE_HEADER)
    if not signature_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Missing HMAC signature header '{X_HUB_SIGNATURE_HEADER}'",
        )

    # Clean prefix if format is sha256=...
    expected_sig = signature_header.replace("sha256=", "").strip()
    
    body = await request.body()
    computed_hmac = hmac.new(
        secret_key.encode("utf-8"),
        body,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(computed_hmac, expected_sig):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="HMAC signature verification failed. Request payload altered or unauthorized.",
        )
    return True


# ------------------------------------------------------------------
# 3. Redis Lua Script Sliding-Window Rate Limiter
# ------------------------------------------------------------------
# Atomic Redis Lua script to enforce rolling window rate limits per workspace
LUA_RATE_LIMIT_SCRIPT = """
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local now = redis.call('TIME')[1]
local clear_before = now - window

-- Remove old request timestamps outside current sliding window
redis.call('ZREMRANGEBYSCORE', key, 0, clear_before)

-- Count requests in window
local current_requests = redis.call('ZCARD', key)

if current_requests >= limit then
    return current_requests + 1
else
    -- Add current request timestamp
    redis.call('ZADD', key, now, now)
    -- Expire key after window duration to auto-clean memory
    redis.call('EXPIRE', key, window)
    return current_requests + 1
end
"""
LUA_SLIDING_WINDOW_SCRIPT = LUA_RATE_LIMIT_SCRIPT

async def check_rate_limit(
    redis_client_or_workspace_id: Any = None,
    key: Optional[str] = None,
    limit: int = 60,
    window: int = 60
) -> bool:
    """
    Checks rate limit against Redis. If Redis is down, logs warning and allows request through (fail-open).
    Supports:
      - check_rate_limit(redis_client, key, limit, window) -> bool
      - check_rate_limit("workspace_123", limit=60, window=60) -> bool
    """
    client = redis_client
    rate_key = key or "rate_limit:default"
    rate_limit = limit
    rate_window = window

    if isinstance(redis_client_or_workspace_id, Redis):
        client = redis_client_or_workspace_id
        rate_key = key or "rate_limit:default"
    elif isinstance(redis_client_or_workspace_id, str):
        rate_key = f"rate_limit:{redis_client_or_workspace_id}"

    try:
        current_count = await client.eval(LUA_RATE_LIMIT_SCRIPT, 1, rate_key, rate_limit, rate_window)
        return int(current_count) <= rate_limit
    except (ConnectionError, Exception) as e:
        # Fallback: Log the issue and allow the request through so the API stays online
        logger.warning(f"Redis rate limiter unavailable ({e}). Bypassing rate limit check.")
        return True

async def enforce_workspace_rate_limit(
    workspace_id: str,
    max_requests: int = 60,
    window_seconds: int = 60
) -> bool:
    """
    FastAPI route dependency to enforce rate limits and return HTTP 429 when exceeded.
    """
    allowed = await check_rate_limit(
        redis_client=redis_client,
        key=f"rate_limit:{workspace_id}",
        limit=max_requests,
        window=window_seconds
    )
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded ({max_requests} requests per {window_seconds}s). Retry later.",
            headers={"Retry-After": str(window_seconds)}
        )
    return True
