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

1. **Docker & Docker Compose** — [Install Docker](https://www.docker.com/get-started)
2. **Ollama** installed and running on your host machine — [ollama.com](https://ollama.com)

Pull the required models:
```bash
ollama pull llama3
ollama pull nomic-embed-text
```

---

## Quick Start with Docker Compose

### 1. Clone the Repository

```bash
git clone https://github.com/Akshya-1108/litexplorer.git
cd litexplorer
```

### 2. Run the Application

```bash
docker compose up --build
```

This command will:
- ✅ Build Docker images for both frontend and backend
- ✅ Pull the required base images (Node, Python, Nginx)
- ✅ Start both services automatically
- ✅ Connect them to communicate with each other

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

The backend API is available at:
```
http://localhost:8000
```

### 4. Stop the Application

To stop the running containers:
```bash
docker compose down
```

---

## How It Works

- **Frontend** (React + Nginx): Runs on port `3000` — built with multi-stage Docker build
- **Backend** (FastAPI): Runs on port `8000` inside the container
- **Ollama**: Accessed from containers via `host.docker.internal:11434`
- **Data Persistence**: Models and uploaded PDFs are processed in containers

---

## API Endpoints

| Method | Path             | Description                              |
|--------|-----------------|------------------------------------------|
| GET    | `/health`        | Check backend + model config             |
| POST   | `/api/process`   | Upload PDF or text → build FAISS index  |
| POST   | `/api/ask`       | Stream answer for a question (SSE)       |
| POST   | `/api/summarize` | Stream structured summary of PDF (SSE)  |

---

## Environment Configuration

All backend configuration is managed via environment variables in `docker-compose.yml`:

| Variable           | Default                    | Description                  |
|--------------------|----------------------------|------------------------------|
| `OLLAMA_BASE_URL`  | `http://host.docker.internal:11434`   | Ollama server URL            |
| `LLM_MODEL`        | `llama3`                   | Generation model             |
| `EMBEDDING_MODEL`  | `nomic-embed-text`         | Embedding model              |
| `CHUNK_SIZE`       | `800`                      | Chars per chunk              |
| `CHUNK_OVERLAP`    | `100`                      | Overlap between chunks       |
| `RETRIEVAL_K`      | `4`                        | Chunks retrieved per query   |
| `MAX_SUMMARY_CHUNKS`| `6`                       | Max chunks used in summary   |

To customize, create a `.env` file in the root directory:
```bash
OLLAMA_BASE_URL=http://host.docker.internal:11434
LLM_MODEL=llama3
EMBEDDING_MODEL=nomic-embed-text
CHUNK_SIZE=800
CHUNK_OVERLAP=100
RETRIEVAL_K=4
MAX_SUMMARY_CHUNKS=6
```

---

## Troubleshooting

**Backend can't reach Ollama:**
- Ensure Ollama is running on your host machine: `ollama serve`
- On Mac/Windows, `host.docker.internal` automatically points to the host machine
- On Linux, you may need to add `--add-host=host.docker.internal:host-gateway` to docker compose

**Port already in use:**
- Change ports in `docker-compose.yml`:
  ```yaml
  ports:
    - "3001:80"      # Frontend on 3001 instead
    - "8001:8000"    # Backend on 8001 instead
  ```

**Rebuild without cache:**
```bash
docker compose up --build --no-cache
```

---

## Preview

Below is the preview of this project 

![Summarizer UI](images/Screenshot%202026-04-05%20194341.png)
![Chat Interface](images/Screenshot%202026-04-05%20194849.png)