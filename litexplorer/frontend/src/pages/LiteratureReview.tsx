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
        <div className="relative bg-gray-900/60 border border-gray-800 backdrop-blur-xl p-8 rounded-3xl shadow-2xl overflow-hidden">
          <LoaderOverlay isProcessing={processing} message="Indexing Document…" />

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mb-4">
              <BookOpen className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Literature Review</h1>
            <p className="text-gray-400 mt-2 text-sm max-w-xs">
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
            <div className="mt-4 flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
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
      <div className="flex items-center justify-between mb-3 px-4 py-3 bg-gray-900/60 border border-gray-800 rounded-2xl backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex-shrink-0">
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <p className="text-gray-200 font-semibold text-sm truncate">{file?.name}</p>
            <p className="text-gray-500 text-xs">Active · Session ready</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" icon={<RotateCcw size={13} />} onClick={handleReset}>
          New
        </Button>
      </div>

      {/* Chat area */}
      <div className="flex-grow overflow-y-auto px-2 py-4 space-y-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800">
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40 select-none">
            <MessageSquare className="w-12 h-12 text-gray-600" />
            <p className="text-gray-400 font-medium">No questions yet</p>
            <p className="text-gray-600 text-sm text-center max-w-xs">
              Ask about methodology, findings, conclusions — anything in the paper.
            </p>
          </div>
        )}

        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={[
                'max-w-[82%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-lg',
                msg.role === 'user'
                  ? 'bg-indigo-600/80 text-white rounded-br-sm border border-indigo-500/40'
                  : 'bg-gray-900/80 text-gray-200 border border-gray-700/60 rounded-bl-sm',
              ].join(' ')}
            >
              {msg.role === 'user' ? (
                <p>{msg.text}</p>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:text-white prose-a:text-indigo-400 prose-strong:text-indigo-300">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                  {msg.isStreaming && (
                    <span className="inline-block w-1.5 h-4 bg-indigo-400 animate-pulse ml-0.5 rounded-sm align-middle" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {streaming && chatHistory[chatHistory.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start">
            <div className="bg-gray-900/80 border border-gray-700/60 rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-2">
              {[0, 150, 300].map((delay) => (
                <div
                  key={delay}
                  className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
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
          className="flex items-center gap-3 bg-gray-900/80 border border-gray-700/60 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl focus-within:border-indigo-500/40 transition-colors"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the document…"
            disabled={streaming}
            className="flex-grow bg-transparent text-gray-200 placeholder-gray-600 text-sm focus:outline-none disabled:opacity-50"
            autoFocus
          />
          <button
            type="submit"
            disabled={!question.trim() || streaming}
            className="flex-shrink-0 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100"
          >
            <ArrowUp size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
