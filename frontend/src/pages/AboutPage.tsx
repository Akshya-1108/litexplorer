import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Cpu, Database, Layers,
  ArrowRight, Radio,
} from 'lucide-react';

/* ── Animation Variants ───────────────────────────────────────── */

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
} as const;

/* ── Data ─────────────────────────────────────────────────────── */

const BENTO_CARDS = [
  {
    icon: Layers,
    title: 'RAG Pipeline',
    desc: 'Complete retrieval-augmented generation system — from PDF ingestion through vector embedding to grounded LLM answers with top-k similarity retrieval.',
    span: 2,
  },
  {
    icon: Database,
    title: 'FAISS Vector Store',
    desc: 'In-memory similarity search powered by Facebook AI Similarity Search for fast chunk retrieval.',
    span: 1,
  },
  {
    icon: Cpu,
    title: 'Ollama Integration',
    desc: 'Local LLM inference with llama3 — zero data egress, complete privacy.',
    span: 1,
  },
  {
    icon: FileText,
    title: 'PDF Processing',
    desc: '800-char overlapping chunks with PyPDF extraction for optimal retrieval quality.',
    span: 1,
  },
  {
    icon: Radio,
    title: 'SSE Streaming',
    desc: 'Real-time Server-Sent Events deliver tokens to the UI as they are generated.',
    span: 1,
  },
];

const FOCUS_ITEMS = [
  { title: 'Deep Paper Analysis',    desc: 'Ask complex questions about any research document' },
  { title: 'Structured Summaries',   desc: 'AI-generated academic paper summaries with key findings' },
  { title: 'Complete Privacy',        desc: 'All processing stays on your machine — no cloud dependencies' },
];

const VALUES = [
  {
    num: '01',
    title: 'Privacy by Design',
    desc: 'Every computation happens locally. No cloud API keys, no telemetry, no external requests. Your documents never leave your network.',
  },
  {
    num: '02',
    title: 'Research-Grade Quality',
    desc: 'Built with academic workflows in mind — from intelligent chunking strategies to context-aware synthesis of research findings.',
  },
];

/* ── Bento Card ───────────────────────────────────────────────── */

const BentoCard: React.FC<{
  icon: React.ElementType;
  title: string;
  desc: string;
}> = ({ icon: Icon, title, desc }) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ borderColor: '#777068' }}
    transition={{ duration: 0.2 } as const}
    className="bg-[#282828] border border-[#32302F] p-6 lg:p-8 cursor-default group hover:bg-[#32302F] transition-colors duration-200"
  >
    <div className="bg-[#1E2021] border border-[#32302F] p-3 rounded-lg w-fit mb-5 group-hover:border-[#7F986D]/40 transition-colors">
      <Icon className="w-5 h-5 text-[#7F986D]" />
    </div>
    <h3 className="text-[#EFE7DF] font-bold text-sm font-mono tracking-wide mb-2">{title}</h3>
    <p className="text-[#777068] text-xs leading-relaxed">{desc}</p>
  </motion.div>
);

/* ── Page ─────────────────────────────────────────────────────── */

const AboutPage: React.FC = () => (
  <motion.div
    className="max-w-5xl mx-auto pb-16"
    variants={stagger}
    initial="hidden"
    animate="visible"
  >
    {/* ── Hero ────────────────────────────────────────────── */}
    <motion.div variants={fadeUp} className="pt-6 sm:pt-10 mb-16 sm:mb-20">
      <p className="font-mono text-xs text-[#777068] mb-6 tracking-wider">
        Litexplorer &gt;=1.0.0 &lt;2.0.0;
      </p>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#EFE7DF] font-mono leading-[1.1] mb-2">
        We Research
      </h1>
      <div className="flex items-center gap-3 my-3">
        <div className="w-5 h-8 bg-[#7F986D]" />
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#EFE7DF] font-mono leading-[1.1]">
        Like Nobody Else
      </h1>
      <p className="max-w-xl text-[#777068] text-sm leading-relaxed mt-8">
        Bringing top-tier research expertise in distributed systems and AI research
        to support the most ambitious academic projects
      </p>
      <a
        href="#/literature-review"
        className="inline-flex items-center gap-2 mt-8 px-6 py-3 border border-[#D9542C] text-[#D9542C] font-mono text-sm rounded-full hover:bg-[#D9542C]/10 transition-all duration-200 group"
      >
        <span>[R]esearch</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </a>
    </motion.div>

    {/* ── Architecture — Bento Grid ───────────────────────── */}
    <motion.div variants={fadeUp} className="mb-16 sm:mb-20">
      <div className="flex items-center gap-3 mb-8">
        <span className="w-8 h-[2px] bg-[#D9542C]" />
        <h2 className="text-[#EFE7DF] font-bold font-mono text-sm tracking-wider uppercase">
          Architecture
        </h2>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[#32302F]"
        variants={stagger}
      >
        {BENTO_CARDS.map((card, i) => (
          <div key={i} className={card.span === 2 ? 'md:col-span-2' : ''}>
            <BentoCard icon={card.icon} title={card.title} desc={card.desc} />
          </div>
        ))}
      </motion.div>
    </motion.div>

    {/* ── Research Focus ──────────────────────────────────── */}
    <motion.div variants={fadeUp} className="mb-16 sm:mb-20">
      <div className="flex items-center gap-3 mb-8">
        <span className="w-8 h-[2px] bg-[#7F986D]" />
        <h2 className="text-[#EFE7DF] font-bold font-mono text-sm tracking-wider uppercase">
          Research Focus
        </h2>
      </div>
      <motion.div className="space-y-6" variants={stagger}>
        {FOCUS_ITEMS.map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="flex items-start gap-4 group"
          >
            <span className="text-[#D9542C] font-mono text-lg mt-0.5 flex-shrink-0">&rarr;</span>
            <div>
              <h3 className="text-[#EFE7DF] font-bold text-base mb-1">{item.title}</h3>
              <p className="text-[#777068] text-sm leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>

    {/* ── Core Values ─────────────────────────────────────── */}
    <motion.div variants={fadeUp}>
      <div className="flex items-center gap-3 mb-8">
        <span className="w-8 h-[2px] bg-[#65878E]" />
        <h2 className="text-[#EFE7DF] font-bold font-mono text-sm tracking-wider uppercase">
          Core Values
        </h2>
      </div>
      <motion.div className="space-y-8" variants={stagger}>
        {VALUES.map((val) => (
          <motion.div key={val.num} variants={fadeUp} className="flex gap-6 items-start">
            <span className="text-[#D9542C] font-mono text-3xl font-bold leading-none flex-shrink-0 mt-1">
              {val.num}
            </span>
            <div className="border-l border-[#32302F] pl-6">
              <h3 className="text-[#EFE7DF] font-bold text-lg mb-2">{val.title}</h3>
              <p className="text-[#777068] text-sm leading-relaxed max-w-lg">{val.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </motion.div>
);

export default AboutPage;
