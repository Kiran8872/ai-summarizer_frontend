import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IconClock,
  IconCopy,
  IconDownload,
  IconSearch,
  IconTrash,
} from '../components/icons/Icons';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import { useToast } from '../context/ToastContext';
import { loadHistory, removeFromHistory, clearHistory } from '../utils/historyStorage';
import { downloadAsTxt } from '../utils/download';
import { SUMMARY_TYPES, TONES, LENGTHS } from '../constants/options';

function labelFor(value, options) {
  return options.find((o) => o.value === value)?.label || value;
}

export default function History() {
  const [history, setHistory] = useState(loadHistory);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});
  const { success } = useToast();

  const refresh = () => setHistory(loadHistory());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return history;
    return history.filter(
      (item) =>
        item.summary?.toLowerCase().includes(q) ||
        item.inputPreview?.toLowerCase().includes(q) ||
        item.summaryType?.toLowerCase().includes(q)
    );
  }, [history, search]);

  const handleDelete = (id) => {
    removeFromHistory(id);
    refresh();
    success('Summary removed.');
  };

  const handleClearAll = () => {
    if (window.confirm('Delete all saved summaries? This cannot be undone.')) {
      clearHistory();
      refresh();
      success('History cleared.');
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      success('Copied to clipboard!');
    } catch {
      /* toast handled by caller if needed */
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <PageHeader
        title="History"
        description="Summaries saved locally in your browser. Nothing is sent to a server."
      >
        {history.length > 0 && (
          <Button variant="danger" size="sm" icon={IconTrash} onClick={handleClearAll}>
            Clear all
          </Button>
        )}
      </PageHeader>

      {history.length > 0 && (
        <div className="relative mb-6">
          <IconSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search summaries…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-select pl-10"
            aria-label="Search history"
          />
        </div>
      )}

      {history.length === 0 ? (
        <EmptyState
          icon={IconClock}
          title="No summaries yet"
          description="Generated summaries will appear here automatically."
          action={
            <Link to="/summarize" className="btn-primary">
              Create your first summary
            </Link>
          }
        />
      ) : filtered.length === 0 ? (
        <div className="card py-12 text-center text-slate-500">
          No results for &ldquo;{search}&rdquo;
        </div>
      ) : (
        <ul className="space-y-4">
          {filtered.map((item) => {
            const isOpen = expanded[item.id];
            return (
              <li key={item.id} className="card overflow-hidden transition hover:shadow-card-hover">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <button
                    type="button"
                    className="flex-1 text-left"
                    onClick={() => toggleExpand(item.id)}
                    aria-expanded={isOpen}
                  >
                    <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                    <p className="mt-1 flex flex-wrap gap-2 text-sm">
                      <span className="rounded-md bg-brand-50 px-2 py-0.5 font-medium text-brand-800">
                        {labelFor(item.summaryType, SUMMARY_TYPES)}
                      </span>
                      <span className="text-slate-500">{labelFor(item.tone, TONES)}</span>
                      <span className="text-slate-400">· {labelFor(item.length, LENGTHS)}</span>
                    </p>
                    {item.stats && (
                      <p className="mt-1 text-xs text-slate-400">
                        {item.stats.inputWordCount.toLocaleString()} →{' '}
                        {item.stats.outputWordCount.toLocaleString()} words ·{' '}
                        {item.stats.compressionPercent}% saved
                      </p>
                    )}
                    {!isOpen && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.summary}</p>
                    )}
                  </button>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={IconCopy}
                      onClick={() => handleCopy(item.summary)}
                      aria-label="Copy"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={IconDownload}
                      onClick={() =>
                        downloadAsTxt(item.summary, `summary-${item.id.slice(0, 8)}.txt`)
                      }
                      aria-label="Download"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={IconTrash}
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:bg-red-50"
                      aria-label="Delete"
                    />
                  </div>
                </div>
                {isOpen && (
                  <div className="mt-4 animate-fade-in border-t border-slate-100 pt-4">
                    {item.inputPreview && (
                      <p className="mb-3 text-xs italic text-slate-400">Source: {item.inputPreview}…</p>
                    )}
                    <pre className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">
                      {item.summary}
                    </pre>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
