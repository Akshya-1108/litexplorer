export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  isStreaming?: boolean;
}

export interface ProcessResponse {
  status: string;
  source: string;
  chunks: number;
  message: string;
}

export interface HealthResponse {
  status: string;
  ollama_url: string;
  llm_model: string;
  embedding_model: string;
}
