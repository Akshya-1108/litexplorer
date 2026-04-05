from fastapi import APIRouter, Form, HTTPException
from fastapi.responses import StreamingResponse
import json

from services.vector_store import retrieve, has_session

from services.llm_service import stream_answer

router = APIRouter(prefix="/api", tags=["chat"])


async def sse_generator(session_id: str, question: str):
    """Server-Sent Events generator for streaming answers."""
    if not has_session(session_id):
        yield f"data: {json.dumps({'error': 'Session not found. Please re-upload the document.'})}\n\n"
        return

    context_chunks = await retrieve(session_id, question)
    if not context_chunks:
        yield f"data: {json.dumps({'token': 'No relevant information found in the document for that question.'})}\n\n"
        yield "data: [DONE]\n\n"
        return

    async for token in stream_answer(context_chunks, question):
        payload = json.dumps({"token": token})
        yield f"data: {payload}\n\n"

    yield "data: [DONE]\n\n"


@router.post("/ask")
async def ask_question(
    session_id: str = Form(...),
    question: str = Form(...),
):
    """Stream an answer to a question about the processed document."""
    if not question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    return StreamingResponse(
        sse_generator(session_id, question.strip()),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
