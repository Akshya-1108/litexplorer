import os

from fastapi import APIRouter
from core.config import get_settings
from models.schemas import HealthResponse

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
LLM_MODEL = os.getenv("LLM_MODEL", "llama3")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "nomic-embed-text")


router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health():
    settings = get_settings()
    return HealthResponse(
        status="ok",
        ollama_url=settings.ollama_base_url,
        llm_model=settings.llm_model,
        embedding_model=settings.embedding_model,
    )
