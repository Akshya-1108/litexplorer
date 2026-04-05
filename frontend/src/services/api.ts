const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000';

// ── Process document ──────────────────────────────────────────────────────────

export async function processDocument(
  file?: File,
  textInput?: string,
  sessionId?: string
): Promise<{ status: string; chunks: number; message: string }> {
  const form = new FormData();
  if (file) form.append('file', file);
  if (textInput) form.append('text', textInput);
  if (sessionId) form.append('session_id', sessionId);

  const res = await fetch(`${API_BASE}/api/process`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail ?? `HTTP ${res.status}`);
  }

  return res.json();
}

// ── Stream question answer ────────────────────────────────────────────────────

export async function* streamAnswer(
  sessionId: string,
  question: string
): AsyncGenerator<string> {
  const form = new FormData();
  form.append('session_id', sessionId);
  form.append('question', question);

  const res = await fetch(`${API_BASE}/api/ask`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail ?? `HTTP ${res.status}`);
  }

  yield* readSSEStream(res);
}

// ── Stream summary ────────────────────────────────────────────────────────────

export async function* streamSummary(file: File): AsyncGenerator<string> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${API_BASE}/api/summarize`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail ?? `HTTP ${res.status}`);
  }

  yield* readSSEStream(res);
}

// ── Health check ──────────────────────────────────────────────────────────────

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Backend unreachable');
  return res.json();
}

// ── SSE reader utility ────────────────────────────────────────────────────────

async function* readSSEStream(res: Response): AsyncGenerator<string> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;

        const raw = trimmed.slice(5).trim();
        if (raw === '[DONE]') return;

        try {
          const parsed = JSON.parse(raw);
          if (parsed.token) yield parsed.token;
          if (parsed.error) throw new Error(parsed.error);
        } catch {
          // skip malformed lines
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
