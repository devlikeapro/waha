import os
import logging
import tempfile
import boto3
from fastapi import FastAPI, HTTPException, Body, Header, Depends, Request
from pydantic import BaseModel, Field
from typing import List, Optional
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from .engine import VisionEngine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Rate limiter: 60 requests per minute per IP
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Vision Worker", version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Initialize Engine
engine = VisionEngine()

# S3 Configuration
S3_ENDPOINT = os.getenv("S3_ENDPOINT", "http://minio:9000")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY")
S3_BUCKET = os.getenv("S3_BUCKET", "waha-media")
S3_REGION = os.getenv("S3_REGION", "us-east-1")
VISION_API_KEY = os.getenv("VISION_API_KEY")

if not S3_ACCESS_KEY or not S3_SECRET_KEY:
    raise ValueError("S3_ACCESS_KEY and S3_SECRET_KEY environment variables must be set.")

s3_client = boto3.client(
    's3',
    endpoint_url=S3_ENDPOINT,
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_KEY,
    region_name=S3_REGION
)

import re
import secrets

# Stricter S3 key pattern: alphanumeric, underscore, hyphen, with optional single extension
S3_KEY_PATTERN = re.compile(r'^[a-zA-Z0-9_\-]+(?:/[a-zA-Z0-9_\-]+)*(?:\.[a-zA-Z0-9]{1,10})?$')

def verify_api_key(x_api_key: Optional[str] = Header(None)):
    if not VISION_API_KEY:
        return  # No key configured = skip auth (dev mode)
    if not x_api_key or not secrets.compare_digest(x_api_key, VISION_API_KEY):
        raise HTTPException(status_code=401, detail="Invalid API key")

class DetectRequest(BaseModel):
    s3_key: str = Field(..., max_length=500, min_length=1)
    
    @property
    def validated_key(self) -> str:
        """Validate S3 key to prevent path traversal and injection attacks."""
        if '..' in self.s3_key or self.s3_key.startswith('/'):
            raise ValueError("Invalid S3 key: path traversal detected")
        if not S3_KEY_PATTERN.match(self.s3_key):
            raise ValueError("Invalid S3 key format")
        return self.s3_key

class FaceResult(BaseModel):
    bbox: List[float]
    det_score: float
    embedding: List[float]

class DetectResponse(BaseModel):
    faces: List[FaceResult]

@app.get("/health")
def health_check():
    try:
        s3_client.head_bucket(Bucket=S3_BUCKET)
        return {"status": "ok", "model": "buffalo_s", "s3": "connected"}
    except Exception as e:
        logger.warning(f"S3 health check failed: {e}")
        return {"status": "degraded", "model": "buffalo_s", "s3": str(e)}

@app.post("/detect", response_model=DetectResponse, dependencies=[Depends(verify_api_key)])
@limiter.limit("60/minute")
def detect_faces(request: Request, body: DetectRequest = Body(...)):
    try:
        s3_key = body.validated_key  # Use validated key
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            logger.info(f"Downloading {s3_key} from bucket {S3_BUCKET}")
            s3_client.download_fileobj(S3_BUCKET, s3_key, tmp)
            tmp_path = tmp.name

        try:
            results = engine.process_image(tmp_path)
            return {"faces": results}
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    except Exception as e:
        logger.error(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail=str(e))
