import asyncio
from typing import List, Optional, Dict
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from core.config import get_settings


# In-memory session store: session_id -> FAISS index
_store: Dict[str, FAISS] = {}


def _get_embeddings() -> OllamaEmbeddings:
    settings = get_settings()
    return OllamaEmbeddings(
        base_url=settings.ollama_base_url,
        model=settings.embedding_model,
    )


async def build_index(session_id: str, chunks: List[str]) -> int:
    """
    Build a FAISS index for the given chunks.
    Embeddings are computed in a thread to avoid blocking the event loop.
    Returns the number of chunks indexed.
    """
    embeddings = _get_embeddings()

    def _build():
        return FAISS.from_texts(chunks, embedding=embeddings)

    index = await asyncio.to_thread(_build)
    _store[session_id] = index
    return len(chunks)


async def retrieve(session_id: str, query: str, k: int = None) -> List[str]:
    """
    Retrieve the top-k most relevant chunks for a query.
    Returns list of page content strings.
    """
    settings = get_settings()
    index = _store.get(session_id)
    if not index:
        return []

    k = k or settings.retrieval_k

    def _search():
        return index.similarity_search(query, k=k)

    docs = await asyncio.to_thread(_search)
    return [doc.page_content for doc in docs]


def has_session(session_id: str) -> bool:
    return session_id in _store


def clear_session(session_id: str) -> None:
    _store.pop(session_id, None)
