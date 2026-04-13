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

## Installation Guide

Follow these steps carefully to set up the project locally.

### Step 1: Install Docker

Download and install Docker from:
https://www.docker.com/get-started

Verify installation:
```bash
docker --version
docker compose version
```

---

### Step 2: Install Ollama

Download and install Ollama:
https://ollama.com

Start Ollama:
```bash
ollama serve
```

---

### Step 3: Pull Required Models

```bash
ollama pull llama3
ollama pull nomic-embed-text
```

---

### Step 4: Clone the Repository

```bash
git clone https://github.com/Akshya-1108/litexplorer.git
cd litexplorer
```

---

### Step 5: Configure Environment (Optional but Recommended)

Create a `.env` file in the root directory:

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

### Step 6: Run the Application

```bash
docker compose up --build
```

---

### Step 7: Access the Application

Frontend:
http://localhost:3000

Backend API:
http://localhost:8000

---

### Step 8: Stop the Application

```bash
docker compose down
```

---

## Prerequisites

1. Docker & Docker Compose — https://www.docker.com/get-started  
2. Ollama — https://ollama.com  

---

## Quick Start with Docker Compose

```bash
git clone https://github.com/Akshya-1108/litexplorer.git
cd litexplorer
docker compose up --build
```

---

## How It Works

- Frontend: React + Nginx (port 3000)  
- Backend: FastAPI (port 8000)  
- Ollama: host.docker.internal:11434  
- FAISS for retrieval  

---

## API Endpoints

| Method | Path             | Description                              |
|--------|-----------------|------------------------------------------|
| GET    | /health         | Check backend + model config             |
| POST   | /api/process    | Upload PDF or text → build FAISS index  |
| POST   | /api/ask        | Stream answer for a question             |
| POST   | /api/summarize  | Stream structured summary               |

---

## Troubleshooting

- Ensure Ollama is running: `ollama serve`
- Fix port conflicts in docker-compose.yml
- Rebuild without cache:
```bash
docker compose up --build --no-cache
```

---

## Preview

![Summarizer UI](images/Screenshot%202026-04-05%20194341.png)  
![Chat Interface](images/Screenshot%202026-04-05%20194849.png)  
