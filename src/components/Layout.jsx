import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { IconMenu, IconSparkles, IconX } from './icons/Icons';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/summarize', label: 'Summarizer' },
  { to: '/history', label: 'History' },
  { to: '/about', label: 'About' },
];

const navLinkClass = ({ isActive }, mobile = false) =>
  `${mobile ? 'block' : 'inline-block'} rounded-xl px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-brand-600 text-white shadow-sm'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm transition group-hover:shadow-md">
              <IconSparkles className="h-5 w-5" />
            </span>
            <div className="hidden sm:block">
              <span className="block font-bold text-slate-900 leading-tight">AI Summarizer</span>
              <span className="block text-xs text-slate-500">Powered by Gemini</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {NAV.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className={(p) => navLinkClass(p, false)}>
                {label}
              </NavLink>
            ))}
          </nav>

          <Link to="/summarize" className="btn-primary hidden sm:inline-flex">
            New summary
          </Link>

          <button
            type="button"
            className="btn-ghost p-2 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>

        {mobileOpen && (
          <nav
            id="mobile-nav"
            className="border-t border-slate-200 bg-white px-4 py-4 md:hidden animate-fade-in"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1">
              {NAV.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={(p) => navLinkClass(p, true)}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
              <Link
                to="/summarize"
                className="btn-primary mt-3 w-full justify-center"
                onClick={() => setMobileOpen(false)}
              >
                New summary
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-8 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} AI Content Summarizer
          </p>
          <p className="text-xs text-slate-400">Summaries stored locally · Google Gemini API</p>
        </div>
      </footer>
    </div>
  );
}
