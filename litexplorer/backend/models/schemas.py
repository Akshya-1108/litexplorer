from pydantic import BaseModel
from typing import Optional


class ProcessResponse(BaseModel):
    status: str
    source: str
    chunks: int
    message: str


class AskRequest(BaseModel):
    question: str


class ErrorResponse(BaseModel):
    error: str


class HealthResponse(BaseModel):
    status: str
    ollama_url: str
    llm_model: str
    embedding_model: str
