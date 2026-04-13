import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  BookOpen, Sparkles, MessageSquare, ArrowUp,
  AlertCircle, FileText, RotateCcw,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { processDocument, streamAnswer } from '../services/api';
import { Button } from '../components/Button';
import { DropZone } from '../components/DropZone';
import { LoaderOverlay } from '../components/LoaderOverlay';
import type { ChatMessage } from '../types';

type Phase = 'upload' | 'chat';

const SUGGESTED_PROMPTS = [
  'What is the methodology used in this paper?',
  'Summarize the key findings and results...',
  'What are the main conclusions?',
  'Explain the theoretical framework...',
  'What gaps does this research address?',
];

/* ── Typewriter component for empty chat state ─────────────────── */
function TypewriterPrompts() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentPrompt = SUGGESTED_PROMPTS[promptIdx];

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setCharIdx(0);
        setPromptIdx((prev) => (prev + 1) % SUGGESTED_PROMPTS.length);
      }, 2000);
      return () => clearTimeout(pauseTimer);
    }

    if (charIdx < currentPrompt.length) {
      const typeTimer = setTimeout(() => {
        setCharIdx((prev) => prev + 1);
      }, 60);
      return () => clearTimeout(typeTimer);
    }

    // Fully typed — pause before next
    setIsPaused(true);
  }, [charIdx, promptIdx, isPaused]);

  const displayText = SUGGESTED_PROMPTS[promptIdx].slice(0, charIdx);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 select-none">
      <div className="p-4 bg-[#111318] border border-[#1E2028] rounded-xl">
        <MessageSquare className="w-10 h-10 text-[#A3B18A]" />
      </div>
      <div className="text-center max-w-md">
        <div className="font-mono text-[#A3B18A] text-lg h-8 flex items-center justify-center">
          <span>{displayText}</span>
          <span className="inline-block w-2.5 h-5 bg-[#A3B18A] ml-0.5 animate-blink" />
        </div>
        <p className="text-[#6B7280] text-sm mt-4">
          Ask anything about your document
        </p>
      </div>
    </div>
  );
}

export default function LiteratureReviewPage() {
  const [phase, setPhase]             = useState<Phase>('upload');
  const [file, setFile]               = useState<File | null>(null);
  const [sessionId, setSessionId]     = useState<string>('');
  const [processing, setProcessing]   = useState(false);
  const [error, setError]             = useState('');
  const [question, setQuestion]       = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming]     = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef  = useRef<AbortController | null>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, streaming]);

  const handleProcess = async () => {
    if (!file) return;
    setError('');
    setProcessing(true);
    try {
      const res = await processDocument(file);
      // Extract session_id from the message field
      const match = res.message.match(/Session: ([a-f0-9-]+)/);
      const sid = match ? match[1] : crypto.randomUUID();
      setSessionId(sid);
      setChatHistory([]);
      setPhase('chat');
    } catch (e: any) {
      setError(e.message ?? 'Failed to process document.');
    } finally {
      setProcessing(false);
    }
  };

  const handleAsk = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = question.trim();
    if (!q || streaming) return;

    setQuestion('');
    setChatHistory((prev) => [...prev, { role: 'user', text: q }]);
    setStreaming(true);

    // Add a blank assistant message we'll fill in
    setChatHistory((prev) => [...prev, { role: 'assistant', text: '', isStreaming: true }]);

    abortRef.current = new AbortController();

    try {
      let accumulated = '';
      for await (const token of streamAnswer(sessionId, q)) {
        accumulated += token;
        setChatHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', text: accumulated, isStreaming: true };
          return updated;
        });
      }
      // Mark done
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', text: accumulated, isStreaming: false };
        return updated;
      });
    } catch (e: any) {
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          text: `⚠️ ${e.message ?? 'Failed to get a response. Check backend connection.'}`,
          isStreaming: false,
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }, [question, sessionId, streaming]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleReset = () => {
    setPhase('upload');
    setFile(null);
    setSessionId('');
    setChatHistory([]);
    setError('');
  };

  // ── Upload Phase ─────────────────────────────────────────────────────────
  if (phase === 'upload') {
    return (
      <div className="relative max-w-xl mx-auto mt-8 w-full">
        <div className="relative bg-[#111318] border border-[#1E2028] p-8 rounded-xl shadow-lg overflow-hidden">
          <LoaderOverlay isProcessing={processing} message="Indexing Document…" />

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <p className="font-mono text-xs text-[#A3B18A] mb-3 tracking-wider">
              litexplorer &gt;=1.0.0;
            </p>
            <div className="p-3 bg-[#A3B18A]/10 border border-[#A3B18A]/20 rounded-xl mb-4">
              <BookOpen className="w-8 h-8 text-[#A3B18A]" />
            </div>
            <h1 className="text-2xl font-bold text-white">Literature Review</h1>
            <p className="text-[#6B7280] mt-2 text-sm max-w-xs">
              Upload a research paper and ask questions about it.
            </p>
          </div>

          <DropZone
            file={file}
            onFile={(f) => { setFile(f); setError(''); }}
            onClear={() => setFile(null)}
            disabled={processing}
          />

          {error && (
            <div className="mt-4 flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button
            className="w-full mt-6"
            size="lg"
            onClick={handleProcess}
            disabled={!file || processing}
            isLoading={processing}
            icon={<Sparkles size={18} />}
          >
            Analyse Document
          </Button>
        </div>
      </div>
    );
  }

  // ── Chat Phase ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] max-w-4xl mx-auto w-full animate-fade-in">

      {/* Doc bar */}
      <div className="flex items-center justify-between mb-3 px-4 py-3 bg-[#111318] border border-[#1E2028] rounded-xl">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-[#A3B18A]/10 border border-[#A3B18A]/20 rounded-lg flex-shrink-0">
            <FileText className="w-4 h-4 text-[#A3B18A]" />
          </div>
          <div className="min-w-0">
            <p className="text-gray-200 font-semibold text-sm truncate">{file?.name}</p>
            <p className="text-[#6B7280] text-xs font-mono">Active · Session ready</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" icon={<RotateCcw size={13} />} onClick={handleReset}>
          New
        </Button>
      </div>

      {/* Chat area */}
      <div className="flex-grow overflow-y-auto px-2 py-4 space-y-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800">
        {chatHistory.length === 0 && <TypewriterPrompts />}

        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={[
                'max-w-[82%] rounded-xl px-5 py-4 text-sm leading-relaxed shadow-lg',
                msg.role === 'user'
                  ? 'bg-[#0057FF] text-white rounded-br-sm'
                  : 'bg-[#111318] text-[#9CA3AF] border border-[#1E2028] rounded-bl-sm',
              ].join(' ')}
            >
              {msg.role === 'user' ? (
                <p>{msg.text}</p>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:text-[#A3B18A] prose-a:text-[#0057FF] prose-strong:text-[#A3B18A]">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                  {msg.isStreaming && (
                    <span className="inline-block w-2 h-4 bg-[#A3B18A] animate-blink ml-0.5 rounded-sm align-middle" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {streaming && chatHistory[chatHistory.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start">
            <div className="bg-[#111318] border border-[#1E2028] rounded-xl rounded-bl-sm px-5 py-4 flex items-center gap-2">
              {[0, 150, 300].map((delay) => (
                <div
                  key={delay}
                  className="w-2 h-2 bg-[#A3B18A] rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="pt-3">
        <form
          onSubmit={handleAsk}
          className="flex items-center gap-3 bg-[#111318] border border-[#1E2028] rounded-xl px-4 py-3 shadow-xl focus-within:border-[#0057FF]/40 transition-colors"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the document…"
            disabled={streaming}
            className="flex-grow bg-transparent text-gray-200 placeholder-[#6B7280] text-sm focus:outline-none disabled:opacity-50"
            autoFocus
          />
          <button
            type="submit"
            disabled={!question.trim() || streaming}
            className="flex-shrink-0 p-2 bg-[#0057FF] hover:bg-[#0047D4] disabled:bg-[#111318] disabled:text-[#6B7280] text-white rounded-lg transition-all duration-200"
          >
            <ArrowUp size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
