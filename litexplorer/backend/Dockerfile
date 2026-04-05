FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV OLLAMA_BASE_URL=http://host.docker.internal:11434
ENV EMBEDDING_MODEL=nomic-embed-text
ENV LLM_MODEL=llama3
ENV CHUNK_SIZE=800
ENV CHUNK_OVERLAP=100
ENV RETRIEVAL_K=4
ENV MAX_SUMMARY_CHUNKS=6

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
