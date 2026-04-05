import asyncio
from typing import AsyncGenerator, List
from langchain_community.llms import Ollama
from core.config import get_settings

ACADEMIC_SYSTEM = (
    "You are a precise academic research assistant. "
    "Answer factually, concisely, and in well-structured prose. "
    "When you don't know something, say so clearly."
)


def _get_llm() -> Ollama:
    settings = get_settings()
    return Ollama(
        base_url=settings.ollama_base_url,
        model=settings.llm_model,
    )


async def stream_answer(context_chunks: List[str], question: str) -> AsyncGenerator[str, None]:
    """Stream an answer grounded in the retrieved context."""
    context = "\n\n---\n\n".join(context_chunks)
    prompt = (
        f"{ACADEMIC_SYSTEM}\n\n"
        f"Use ONLY the context below to answer the question. "
        f"If the context does not contain the answer, say 'I could not find relevant information in the document.'\n\n"
        f"Context:\n{context}\n\n"
        f"Question: {question}\n\n"
        f"Answer:"
    )

    llm = _get_llm()

    async def _stream():
        async for chunk in llm.astream(prompt):
            yield chunk

    async for token in _stream():
        yield token


async def summarize_chunk(llm: Ollama, chunk: str, index: int) -> str:
    """Summarize a single chunk — runs in thread to allow parallelism."""
    prompt = f"Summarize the following section of an academic paper concisely, preserving key findings:\n\n{chunk}"

    def _invoke():
        return llm.invoke(prompt)

    return await asyncio.to_thread(_invoke)


async def stream_summary(chunks: List[str]) -> AsyncGenerator[str, None]:
    """
    Parallel chunk summarization, then stream a final structured summary.
    Much faster than sequential summarization.
    """
    settings = get_settings()
    llm = _get_llm()

    # Cap chunks and parallelize
    selected = chunks[: settings.max_summary_chunks]

    # Run all chunk summaries in parallel
    tasks = [summarize_chunk(llm, chunk, i) for i, chunk in enumerate(selected)]
    partial_summaries = await asyncio.gather(*tasks)

    combined = "\n\n".join(partial_summaries)

    final_prompt = (
        f"{ACADEMIC_SYSTEM}\n\n"
        "Write a final structured academic summary using the section summaries below. "
        "Use exactly these markdown headers in order:\n"
        "## Objective\n## Methodology\n## Key Findings\n## Conclusion\n\n"
        "Be concise but thorough. Start directly with ## Objective.\n\n"
        f"Section summaries:\n{combined}"
    )

    # Stream the final synthesis
    async for token in llm.astream(final_prompt):
        yield token
