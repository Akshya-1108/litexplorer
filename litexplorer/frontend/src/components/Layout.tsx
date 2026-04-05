import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { BookOpen, Layers, Info, Cpu, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/literature-review', label: 'Literature Review', icon: BookOpen },
  { to: '/summarizer',        label: 'Summarizer',        icon: Layers    },
  { to: '/about',             label: 'About',             icon: Info      },
];

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">

      {/* ── Sticky Nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2.5 select-none">
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 shadow-lg shadow-indigo-700/40">
              {/* Glare */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
              <Cpu className="w-5 h-5 text-white relative z-10" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Lit<span className="text-indigo-400">Explorer</span>
            </span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800',
                  ].join(' ')
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-800/60 bg-gray-950/95 px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-300 border-l-2 border-indigo-500'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 border-l-2 border-transparent',
                  ].join(' ')
                }
              >
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
        {/* Ambient background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-indigo-700/10 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-purple-700/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 w-[500px] h-[300px] bg-indigo-900/10 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-full">
          <Outlet />
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-gray-800/50 py-5 mt-auto">
        <p className="text-center text-gray-600 text-xs">
          © {new Date().getFullYear()} LitExplorer AI — Local RAG Research Assistant
        </p>
      </footer>
    </div>
  );
};

export default Layout;
