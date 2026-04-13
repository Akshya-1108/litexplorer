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
      <div className="p-4 bg-[#282828] border border-[#32302F] rounded-xl">
        <MessageSquare className="w-10 h-10 text-[#7F986D]" />
      </div>
      <div className="text-center max-w-md">
        <div className="font-mono text-[#7F986D] text-lg h-8 flex items-center justify-center">
          <span>{displayText}</span>
          <span className="inline-block w-2.5 h-5 bg-[#7F986D] ml-0.5 animate-blink" />
        </div>
        <p className="text-[#777068] text-sm mt-4">
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
          text: `\u26A0\uFE0F ${e.message ?? 'Failed to get a response. Check backend connection.'}`,
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
        <div className="relative bg-[#282828] border border-[#32302F] p-8 rounded-xl shadow-lg overflow-hidden">
          <LoaderOverlay isProcessing={processing} message="Indexing Document\u2026" />

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <p className="font-mono text-xs text-[#7F986D] mb-3 tracking-wider">
              litexplorer &gt;=1.0.0;
            </p>
            <div className="p-3 bg-[#7F986D]/10 border border-[#7F986D]/20 rounded-xl mb-4">
              <BookOpen className="w-8 h-8 text-[#7F986D]" />
            </div>
            <h1 className="text-2xl font-bold text-[#EFE7DF]">Literature Review</h1>
            <p className="text-[#777068] mt-2 text-sm max-w-xs">
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
      <div className="flex items-center justify-between mb-3 px-4 py-3 bg-[#282828] border border-[#32302F] rounded-xl">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-[#7F986D]/10 border border-[#7F986D]/20 rounded-lg flex-shrink-0">
            <FileText className="w-4 h-4 text-[#7F986D]" />
          </div>
          <div className="min-w-0">
            <p className="text-[#CFBFAD] font-semibold text-sm truncate">{file?.name}</p>
            <p className="text-[#777068] text-xs font-mono">Active &middot; Session ready</p>
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
                  ? 'bg-[#D9542C] text-[#EFE7DF] rounded-br-sm'
                  : 'bg-[#282828] text-[#CFBFAD] border border-[#32302F] rounded-bl-sm',
              ].join(' ')}
            >
              {msg.role === 'user' ? (
                <p>{msg.text}</p>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:text-[#7F986D] prose-a:text-[#D9542C] prose-strong:text-[#7F986D]">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                  {msg.isStreaming && (
                    <span className="inline-block w-2 h-4 bg-[#7F986D] animate-blink ml-0.5 rounded-sm align-middle" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {streaming && chatHistory[chatHistory.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start">
            <div className="bg-[#282828] border border-[#32302F] rounded-xl rounded-bl-sm px-5 py-4 flex items-center gap-2">
              {[0, 150, 300].map((delay) => (
                <div
                  key={delay}
                  className="w-2 h-2 bg-[#7F986D] rounded-full animate-bounce"
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
          className="flex items-center gap-3 bg-[#282828] border border-[#32302F] rounded-xl px-4 py-3 shadow-xl focus-within:border-[#D9542C]/40 transition-colors"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the document\u2026"
            disabled={streaming}
            className="flex-grow bg-transparent text-[#CFBFAD] placeholder-[#777068] text-sm focus:outline-none disabled:opacity-50"
            autoFocus
          />
          <button
            type="submit"
            disabled={!question.trim() || streaming}
            className="flex-shrink-0 p-2 bg-[#D9542C] hover:bg-[#C04A27] disabled:bg-[#282828] disabled:text-[#777068] text-[#EFE7DF] rounded-lg transition-all duration-200"
          >
            <ArrowUp size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
