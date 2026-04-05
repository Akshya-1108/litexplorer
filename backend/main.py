from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.health import router as health_router
from routes.documents import router as documents_router
from routes.chat import router as chat_router
from routes.summarizer import router as summarizer_router

app = FastAPI(
    title="LitExplorer AI",
    description="AI-powered research assistant with RAG pipeline over local LLMs.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(documents_router)
app.include_router(chat_router)
app.include_router(summarizer_router)
