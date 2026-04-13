import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { BookOpen, Layers, Info, Cpu, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/literature-review', label: 'REVIEW',      icon: BookOpen, idx: 0 },
  { to: '/summarizer',        label: 'SUMMARIZER',   icon: Layers,   idx: 1 },
  { to: '/about',             label: 'ABOUT',        icon: Info,     idx: 2 },
];

/* ── Sidebar (shared between desktop + mobile) ────────────────── */
const SidebarContent: React.FC<{ onNavClick?: () => void }> = ({ onNavClick }) => (
  <div className="flex flex-col h-full font-mono text-sm select-none">

    {/* Brand */}
    <div className="px-6 pt-6 pb-2">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded bg-[#D9542C]">
          <Cpu className="w-4 h-4 text-[#EFE7DF]" />
        </div>
        <span className="font-bold text-[#EFE7DF] tracking-tight">
          Lit<span className="text-[#7F986D]">Explorer</span>
        </span>
      </div>
    </div>

    {/* contract Menu { */}
    <div className="px-6 pt-6 flex-grow">
      <p className="text-[#6A6156] text-xs leading-relaxed">
        <span>contract</span>{' '}
        <span className="text-[#CFBFAD]">Menu</span>{' '}
        <span>{`{`}</span>
      </p>

      <nav className="mt-4 ml-2 space-y-0.5">
        {NAV_LINKS.map(({ to, label, idx }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavClick}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200 text-xs tracking-wider',
                isActive
                  ? 'text-[#7F986D] bg-[#7F986D]/8'
                  : 'text-[#777068] hover:text-[#CFBFAD] hover:bg-[#282828]',
              ].join(' ')
            }
          >
            <span className="text-[#6A6156]">{`{${idx}}`}</span>
            <span className="font-semibold">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* struct Focus { */}
      <div className="mt-6">
        <p className="text-[#6A6156] text-xs leading-relaxed">
          <span>struct</span>{' '}
          <span className="text-[#CFBFAD]">Focus</span>{' '}
          <span>{`{`}</span>
        </p>
        <div className="ml-2 mt-1">
          <div className="flex items-center gap-3 px-3 py-2.5 text-xs text-[#D9542C] tracking-wider">
            <span className="text-[#6A6156]">{`{3}`}</span>
            <span className="font-semibold">RESEARCH</span>
          </div>
        </div>
        <p className="text-[#7F986D] text-xs ml-1">{`}`}</p>
      </div>

      <p className="text-[#6A6156] text-xs mt-1">{`}`}</p>
    </div>

    {/* enum Stack { */}
    <div className="px-6 pb-6 mt-auto">
      <p className="text-[#6A6156] text-xs leading-relaxed">
        <span>enum</span>{' '}
        <span className="text-[#CFBFAD]">Stack</span>{' '}
        <span>{`{`}</span>
      </p>
      <div className="ml-5 mt-2 space-y-1.5 text-xs">
        {['Ollama', 'FAISS', 'LangChain', 'React'].map((item) => (
          <p key={item} className="text-[#777068]">{item}</p>
        ))}
      </div>
      <p className="text-[#6A6156] text-xs mt-2">{`}`}</p>
    </div>
  </div>
);

/* ── Main Layout ──────────────────────────────────────────────── */
const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#1E2021] text-[#CFBFAD] flex font-sans">

      {/* ── Desktop Sidebar ────────────────────────────────── */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[250px] border-r border-[#32302F] bg-[#1E2021] flex-col z-40">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ─────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-[250px] bg-[#1E2021] border-r border-[#32302F] animate-slide-in">
            <SidebarContent onNavClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Main Viewport ──────────────────────────────────── */}
      <div className="flex-grow lg:ml-[250px] flex flex-col min-h-screen">

        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 border-b border-[#32302F] bg-[#1E2021]/95 backdrop-blur-md px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#D9542C]">
              <Cpu className="w-4 h-4 text-[#EFE7DF]" />
            </div>
            <span className="font-bold text-[#EFE7DF] text-sm font-mono tracking-tight">
              Lit<span className="text-[#7F986D]">Explorer</span>
            </span>
          </div>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded text-[#777068] hover:text-[#EFE7DF] hover:bg-[#282828] transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-grow relative overflow-hidden">
          {/* Background decoration — faded monospace */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none" aria-hidden="true">
            <span className="absolute -top-10 left-[10%] text-[10rem] font-mono font-bold text-[#7F986D] opacity-[0.025] leading-none">
              2.5.1
            </span>
            <span className="absolute top-[30%] right-[5%] text-[8rem] font-mono font-bold text-[#D9542C] opacity-[0.015] leading-none">
              0xA8F
            </span>
            <span className="absolute bottom-[10%] left-[20%] text-[12rem] font-mono font-bold text-[#65878E] opacity-[0.02] leading-none">
              6.1.9
            </span>
            <span className="absolute top-[60%] right-[30%] text-[6rem] font-mono font-bold text-[#7F986D] opacity-[0.025] leading-none">
              0.7.0
            </span>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-full">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#32302F] py-5 mt-auto">
          <p className="text-center text-[#6A6156] text-xs font-mono">
            &copy; {new Date().getFullYear()} LitExplorer AI &mdash; Local RAG Research Assistant
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
