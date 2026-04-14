import os
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
LLM_MODEL = os.getenv("LLM_MODEL", "llama3")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "nomic-embed-text")

from services.pdf_service import extract_text_from_upload
from services.splitter_service import split_text
from services.vector_store import build_index
from models.schemas import ProcessResponse

router = APIRouter(prefix="/api", tags=["documents"])


@router.post("/process", response_model=ProcessResponse)
async def process_document(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    session_id: Optional[str] = Form(None),
):
    """
    Process a PDF or plain text. Chunks it and builds a FAISS index.
    Returns a session_id to use for follow-up queries.
    """
    if not file and not text:
        raise HTTPException(status_code=400, detail="Provide either a PDF file or text input.")

    # Generate a session id if not provided
    sid = session_id or str(uuid.uuid4())
    source = "unknown"

    if file:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=422, detail="Only PDF files are supported.")
        raw_text = extract_text_from_upload(file)
        source = "pdf"
    else:
        raw_text = text.strip()
        source = "text"

    if not raw_text:
        raise HTTPException(status_code=422, detail="Could not extract any text from the document.")

    chunks = split_text(raw_text)
    if not chunks:
        raise HTTPException(status_code=422, detail="Document is too short to process.")

    num_chunks = await build_index(sid, chunks)

    return ProcessResponse(
        status="success",
        source=source,
        chunks=num_chunks,
        message=f"Document indexed with {num_chunks} chunks. Session: {sid}",
    )
