import os
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ollama_base_url: str = "http://localhost:11434"
    embedding_model: str = "nomic-embed-text"
    llm_model: str = "llama3"
    chunk_size: int = 800
    chunk_overlap: int = 100
    retrieval_k: int = 4
    max_summary_chunks: int = 6

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
