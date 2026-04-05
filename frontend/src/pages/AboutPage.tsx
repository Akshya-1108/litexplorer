import React from 'react';
import {
  FileText, Cpu, Server, Database, Code2, Layers,
  ArrowRight, Search, MessageSquare, Zap, ShieldCheck,
} from 'lucide-react';

/* ── Data ─────────────────────────────────────────────────────────── */

const PIPELINE_STEPS = [
  { icon: FileText,     label: 'PDF Upload',      desc: 'Raw document ingested'       },
  { icon: Layers,       label: 'Text Chunking',    desc: '800-char overlapping chunks' },
  { icon: Cpu,          label: 'Embed Chunks',     desc: 'nomic-embed-text via Ollama' },
  { icon: Database,     label: 'FAISS Index',      desc: 'Stored in-memory per session'},
  { icon: Search,       label: 'Query Retrieval',  desc: 'Top-k similarity search'     },
  { icon: MessageSquare,label: 'LLM Synthesis',    desc: 'llama3 grounded answer'      },
];

const FRONTEND_STACK = [
  { icon: Code2,  name: 'React 19 + Vite 6',  desc: 'Fast SPA with hot-reload dev server'            },
  { icon: Layers, name: 'Tailwind CSS v4',     desc: 'Utility-first styling with dark design system'  },
];

const BACKEND_STACK = [
  { icon: Server,   name: 'FastAPI 0.111',         desc: 'Async Python API with SSE streaming'           },
  { icon: Database, name: 'FAISS (CPU)',            desc: 'In-memory vector similarity search'            },
  { icon: Cpu,      name: 'Ollama (llama3)',        desc: 'Locally running LLM — zero data egress'        },
  { icon: Zap,      name: 'nomic-embed-text',       desc: 'High-quality local embeddings model'           },
];

const LIMITATIONS = [
  'In-memory session store — resets on server restart.',
  'Summariser uses first 6 chunks only for speed; very long papers may lose later content.',
  'Single-user per session — no multi-tenant isolation yet.',
  'Only PDF input is supported; other formats (DOCX, HTML) are not yet handled.',
];

/* ── Components ──────────────────────────────────────────────────── */

const SectionLabel: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = 'bg-indigo-500',
}) => (
  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
    <span className={`w-8 h-1 ${color} rounded-full`} />
    {children}
  </h3>
);

const StackCard: React.FC<{
  icon: React.ElementType;
  name: string;
  desc: string;
  iconColor?: string;
}> = ({ icon: Icon, name, desc, iconColor = 'text-indigo-400' }) => (
  <div className="flex items-start gap-4 p-5 bg-gray-900/60 border border-gray-800 rounded-2xl hover:border-indigo-500/30 transition-colors group">
    <div className="bg-gray-800 group-hover:bg-indigo-500/10 p-3 rounded-xl transition-colors flex-shrink-0">
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div>
      <p className="text-gray-100 font-semibold text-sm">{name}</p>
      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
    </div>
  </div>
);

/* ── Page ─────────────────────────────────────────────────────────── */

const AboutPage: React.FC = () => (
  <div className="max-w-5xl mx-auto pb-16 animate-fade-in">

    {/* Hero */}
    <div className="text-center pt-10 mb-16">
      <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-5">
        Research Prototype · v1.0
      </span>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-5">
        AI-Powered{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          Literature Explorer
        </span>
      </h1>
      <p className="max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed">
        A local-first research assistant that uses Retrieval-Augmented Generation to help
        you understand, summarise, and query academic papers — with no data leaving your machine.
      </p>
    </div>

    {/* Mission + Privacy */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
      <div className="bg-gray-900/60 border border-gray-800 p-8 rounded-3xl hover:border-indigo-500/20 transition-colors">
        <h2 className="text-xl font-bold text-white mb-3">The Mission</h2>
        <p className="text-gray-400 leading-relaxed text-sm">
          Modern research means swimming through hundreds of PDFs. LitExplorer lets you
          drop in any paper and immediately start asking questions or get a structured
          summary — powered entirely by local models so your data stays private.
        </p>
      </div>
      <div className="relative bg-gradient-to-br from-gray-900 to-indigo-950/40 border border-indigo-900/40 p-8 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent rounded-3xl pointer-events-none" />
        <ShieldCheck className="absolute -right-3 -bottom-3 w-24 h-24 text-indigo-500/10" />
        <h2 className="text-xl font-bold text-white mb-3">Privacy by Design</h2>
        <p className="text-gray-400 leading-relaxed text-sm">
          Every inference call — embeddings and generation — goes to a local Ollama
          instance. No cloud API keys, no telemetry, no external requests. Your documents
          never leave your network.
        </p>
      </div>
    </div>

    {/* RAG Pipeline Diagram */}
    <div className="mb-16">
      <SectionLabel>How the RAG Pipeline Works</SectionLabel>
      <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {PIPELINE_STEPS.map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-2 w-28 text-center">
                <div className="bg-gray-800 border border-gray-700 p-3 rounded-2xl group-hover:border-indigo-500/30">
                  <step.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-gray-200 font-semibold text-xs leading-tight">{step.label}</p>
                <p className="text-gray-600 text-[10px] leading-tight">{step.desc}</p>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-700 flex-shrink-0 hidden sm:block" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs text-gray-500">
          <div>
            <p className="text-gray-200 font-semibold text-sm mb-1">Chunk Size</p>
            800 chars with 100-char overlap
          </div>
          <div>
            <p className="text-gray-200 font-semibold text-sm mb-1">Retrieval</p>
            Top-4 chunks by cosine similarity
          </div>
          <div>
            <p className="text-gray-200 font-semibold text-sm mb-1">Summariser</p>
            Parallel chunk summaries → final synthesis
          </div>
        </div>
      </div>
    </div>

    {/* Tech Stack */}
    <div className="mb-16 space-y-10">
      <div>
        <SectionLabel>Frontend</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FRONTEND_STACK.map((item, i) => (
            <StackCard key={i} {...item} />
          ))}
        </div>
      </div>
      <div>
        <SectionLabel color="bg-purple-500">Backend & AI</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BACKEND_STACK.map((item, i) => (
            <StackCard key={i} {...item} iconColor={i > 1 ? 'text-purple-400' : 'text-indigo-400'} />
          ))}
        </div>
      </div>
    </div>

    {/* Known Limitations */}
    <div>
      <SectionLabel color="bg-yellow-500">Known Limitations</SectionLabel>
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-3">
        {LIMITATIONS.map((lim, i) => (
          <div key={i} className="flex items-start gap-3 text-sm text-gray-400">
            <span className="w-1.5 h-1.5 bg-yellow-500/60 rounded-full flex-shrink-0 mt-1.5" />
            {lim}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AboutPage;
