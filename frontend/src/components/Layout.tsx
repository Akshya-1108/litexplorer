import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { BookOpen, Layers, Info, Cpu, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/literature-review', label: 'Literature Review', icon: BookOpen, idx: 0 },
  { to: '/summarizer',        label: 'Summarizer',        icon: Layers,   idx: 1 },
  { to: '/about',             label: 'About',             icon: Info,     idx: 2 },
];

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0C0E11] text-[#9CA3AF] flex flex-col font-sans">

      {/* ── Sticky Nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#1E2028] bg-[#0C0E11]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2.5 select-none">
            <div className="p-2 rounded-lg bg-[#0057FF]">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Lit<span className="text-[#A3B18A]">Explorer</span>
            </span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon, idx }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200',
                    isActive
                      ? 'bg-[#0057FF]/10 text-[#A3B18A] border-b-2 border-[#A3B18A]'
                      : 'text-[#6B7280] hover:text-white hover:bg-[#111318]',
                  ].join(' ')
                }
              >
                <span className="font-mono text-xs text-[#6B7280]">{`{${idx}}`}</span>
                <Icon size={15} />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#111318] transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#1E2028] bg-[#0C0E11] px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon, idx }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-[#0057FF]/10 text-[#A3B18A] border-l-2 border-[#A3B18A]'
                      : 'text-[#6B7280] hover:text-white hover:bg-[#111318] border-l-2 border-transparent',
                  ].join(' ')
                }
              >
                <span className="font-mono text-xs text-[#6B7280]">{`{${idx}}`}</span>
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main
        className="flex-grow relative overflow-hidden"
        onClick={() => mobileOpen && setMobileOpen(false)}
      >
        {/* Geometric background — faded monospace numbers */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none" aria-hidden="true">
          <span className="absolute -top-10 left-[10%] text-[10rem] font-mono font-bold text-[#A3B18A] opacity-[0.03] leading-none">
            2.5.1
          </span>
          <span className="absolute top-[30%] right-[5%] text-[8rem] font-mono font-bold text-[#A3B18A] opacity-[0.03] leading-none">
            0.9.8
          </span>
          <span className="absolute bottom-[10%] left-[20%] text-[12rem] font-mono font-bold text-[#A3B18A] opacity-[0.02] leading-none">
            6.1.9
          </span>
          <span className="absolute top-[60%] right-[30%] text-[6rem] font-mono font-bold text-[#A3B18A] opacity-[0.04] leading-none">
            0.7.0
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-full">
          <Outlet />
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-[#1E2028] py-5 mt-auto">
        <p className="text-center text-[#6B7280] text-xs font-mono">
          © {new Date().getFullYear()} LitExplorer AI — Local RAG Research Assistant
        </p>
      </footer>
    </div>
  );
};

export default Layout;
