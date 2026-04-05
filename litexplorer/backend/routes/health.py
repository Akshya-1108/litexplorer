from fastapi import APIRouter
from core.config import get_settings
from models.schemas import HealthResponse

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
