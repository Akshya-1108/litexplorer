import tempfile
import os
from fastapi import UploadFile, HTTPException
from pypdf import PdfReader


def extract_text_from_upload(file: UploadFile) -> str:
    """Extract text from an uploaded PDF file."""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(file.file.read())
            tmp_path = tmp.name

        reader = PdfReader(tmp_path)
        pages = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                pages.append(text.strip())

        os.remove(tmp_path)
        return "\n\n".join(pages)

    except Exception as e:
        raise HTTPException(status_code=422, detail=f"PDF extraction failed: {str(e)}")


def extract_text_from_bytes(raw: bytes) -> str:
    """Extract text from raw PDF bytes."""
    from io import BytesIO
    reader = PdfReader(BytesIO(raw))
    pages = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            pages.append(text.strip())
    return "\n\n".join(pages)
