import { Link } from 'react-router-dom';
import { IconSparkles } from '../components/icons/Icons';

const STACK = [
  { name: 'React + Vite', desc: 'Fast, modern frontend tooling' },
  { name: 'Tailwind CSS', desc: 'Utility-first responsive design' },
  { name: 'Node.js + Express', desc: 'REST API backend' },
  { name: 'Google Gemini', desc: 'AI summarization engine' },
  { name: 'localStorage', desc: 'Private on-device history' },
];

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg">
          <IconSparkles className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">About this app</h1>
        <p className="mx-auto mt-4 max-w-lg text-slate-600">
          AI Content Summarizer helps you digest long content quickly — articles, PDFs,
          research, and notes — with customizable AI-powered summaries.
        </p>
      </div>

      <div className="mt-12 space-y-6">
        <section className="card">
          <h2 className="font-semibold text-slate-900">Technology</h2>
          <ul className="mt-4 space-y-3">
            {STACK.map((item) => (
              <li key={item.name} className="flex gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                <div>
                  <p className="font-medium text-slate-800">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card border-emerald-100 bg-emerald-50/30">
          <h2 className="font-semibold text-emerald-900">Privacy</h2>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800/90">
            Content is sent to the Gemini API for summarization. History is stored only in your
            browser via localStorage — never on a remote database.
          </p>
        </section>

        <section className="card">
          <h2 className="font-semibold text-slate-900">Quick start</h2>
          <ol className="mt-4 list-inside list-decimal space-y-2 text-sm text-slate-600">
            <li>
              Add <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">GEMINI_API_KEY</code> to{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono">backend/.env</code>
            </li>
            <li>Run backend on port 5000 and frontend on port 5173</li>
            <li>Open the Summarizer and paste or upload content</li>
          </ol>
          <Link to="/summarize" className="btn-primary mt-6 inline-flex">
            Open summarizer
          </Link>
        </section>
      </div>
    </div>
  );
}
