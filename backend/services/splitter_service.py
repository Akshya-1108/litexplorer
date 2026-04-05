from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter
from core.config import get_settings


def split_text(text: str, chunk_size: int = None, chunk_overlap: int = None) -> List[str]:
    """Split text into overlapping chunks for embedding."""
    settings = get_settings()
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size or settings.chunk_size,
        chunk_overlap=chunk_overlap or settings.chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks = splitter.split_text(text)
    # Filter empty/tiny chunks
    return [c.strip() for c in chunks if len(c.strip()) > 50]
