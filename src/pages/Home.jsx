import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkHealth } from '../api/client';
import { loadHistory } from '../utils/historyStorage';
import { IconDocument, IconSparkles, IconUpload } from '../components/icons/Icons';

const FEATURES = [
  {
    icon: IconDocument,
    title: 'Paste or upload',
    desc: 'Paste long text or upload PDF/TXT. Text is extracted automatically.',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    icon: IconSparkles,
    title: 'Customize output',
    desc: 'Six summary types, four tones, and three lengths — tuned to your needs.',
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    icon: IconUpload,
    title: 'Save & export',
    desc: 'Copy, download as TXT, and keep history locally in your browser.',
    color: 'bg-emerald-100 text-emerald-600',
  },
];

export default function Home() {
  const [apiStatus, setApiStatus] = useState('checking');
  const recent = loadHistory().slice(0, 3);

  const [activeModel, setActiveModel] = useState('');

  useEffect(() => {
    checkHealth()
      .then((data) => {
        setApiStatus('online');
        setActiveModel(data.gemini?.activeModel || '');
      })
      .catch(() => setApiStatus('offline'));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <section className="relative text-center animate-fade-in">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200/60 bg-brand-50/80 px-4 py-1.5 text-sm font-medium text-brand-700">
          <span
            className={`h-2 w-2 rounded-full ${
              apiStatus === 'online'
                ? 'bg-emerald-500'
                : apiStatus === 'offline'
                  ? 'bg-red-500'
                  : 'bg-slate-300 animate-pulse'
            }`}
          />
          {apiStatus === 'online'
            ? `API online${activeModel ? ` · ${activeModel}` : ''}`
            : apiStatus === 'offline'
              ? 'API offline'
              : 'Checking API…'}
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Summarize anything
          <span className="mt-2 block bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">
            in seconds
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          Turn long articles, PDFs, and documents into clear summaries. Choose your format,
          tone, and length — powered by Google Gemini.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/summarize" className="btn-primary px-8 py-3.5 text-base shadow-md hover:shadow-lg">
            Start summarizing
          </Link>
          <Link to="/history" className="btn-secondary px-8 py-3.5 text-base">
            View history
          </Link>
        </div>
      </section>

      <section className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, desc, color }) => (
          <article key={title} className="card-interactive group">
            <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
          </article>
        ))}
      </section>

      <section className="mt-16 rounded-2xl border border-slate-200/80 bg-white/80 p-6 backdrop-blur sm:p-8">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
          How it works
        </h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          {['Add your content', 'Pick style & tone', 'Get your summary'].map((step, i) => (
            <li key={step} className="text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <p className="mt-3 font-medium text-slate-900">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {recent.length > 0 && (
        <section className="mt-16 animate-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Recent summaries</h2>
            <Link to="/history" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              View all →
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3">
            {recent.map((item) => (
              <li key={item.id} className="card-interactive">
                <p className="text-xs text-slate-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
                <p className="mt-1 text-xs font-medium capitalize text-brand-700">{item.summaryType}</p>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{item.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
