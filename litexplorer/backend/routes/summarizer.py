from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
import json

from services.pdf_service import extract_text_from_upload
from services.splitter_service import split_text
from services.llm_service import stream_summary

router = APIRouter(prefix="/api", tags=["summarizer"])


async def summary_sse(chunks):
    async for token in stream_summary(chunks):
        yield f"data: {json.dumps({'token': token})}\n\n"
    yield "data: [DONE]\n\n"


@router.post("/summarize")
async def summarize_document(file: UploadFile = File(...)):
    """Upload a PDF and receive a structured summary as a stream."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=422, detail="Only PDF files are supported.")

    raw_text = extract_text_from_upload(file)
    if not raw_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from PDF.")

    chunks = split_text(raw_text)
    if not chunks:
        raise HTTPException(status_code=422, detail="Document too short to summarize.")

    return StreamingResponse(
        summary_sse(chunks),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
