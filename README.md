# LitExplorer AI

An AI-powered research assistant for querying and summarising academic PDFs — running entirely on local models via Ollama.

## Architecture

```
PDF Upload → Text Extraction → Chunking → Embeddings (nomic-embed-text)
         → FAISS Index → Similarity Retrieval → LLM Answer (llama3)
```

- **Frontend**: React 19 + Vite 6 + Tailwind CSS v4
- **Backend**: FastAPI + LangChain + FAISS (CPU)
- **LLM / Embeddings**: Ollama (local, no external API)

---

## Prerequisites

1. **Python 3.11+**
2. **Node.js 18+**
3. **Ollama** installed and running — [ollama.com](https://ollama.com)

Pull the required models:
```bash
ollama pull llama3
ollama pull nomic-embed-text
```

---

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.sample .env             # edit if Ollama is on a different host

uvicorn main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`  
Health check: `GET http://localhost:8000/health`

---

## Frontend Setup

```bash
cd frontend
npm install

cp .env.sample .env             # set VITE_API_BASE if needed

npm run dev
```

Frontend runs at `http://localhost:3000`

---

## Docker (Backend only)

```bash
cd backend
docker build -t litexplorer-backend .
docker run -p 8000:8000 litexplorer-backend
```

Ollama must be reachable at `host.docker.internal:11434` (set in Dockerfile).

---

## API Endpoints

| Method | Path             | Description                              |
|--------|-----------------|------------------------------------------|
| GET    | `/health`        | Check backend + model config             |
| POST   | `/api/process`   | Upload PDF or text → build FAISS index  |
| POST   | `/api/ask`       | Stream answer for a question (SSE)       |
| POST   | `/api/summarize` | Stream structured summary of PDF (SSE)  |

---

## Configuration

All backend config via environment variables (or `.env`):

| Variable           | Default                    | Description                  |
|--------------------|----------------------------|------------------------------|
| `OLLAMA_BASE_URL`  | `http://localhost:11434`   | Ollama server URL            |
| `LLM_MODEL`        | `llama3`                   | Generation model             |
| `EMBEDDING_MODEL`  | `nomic-embed-text`         | Embedding model              |
| `CHUNK_SIZE`       | `800`                      | Chars per chunk              |
| `CHUNK_OVERLAP`    | `100`                      | Overlap between chunks       |
| `RETRIEVAL_K`      | `4`                        | Chunks retrieved per query   |
| `MAX_SUMMARY_CHUNKS`| `6`                       | Max chunks used in summary   |

## Preview
Below is the preview of this project 

![Summarizer UI](images/Screenshot%202026-04-05%20194341.png)
![Chat Interface](images/Screenshot%202026-04-05%20194849.png)
