import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import ResultPanel from '../components/ResultPanel';
import { IconSparkles, IconTrash } from '../components/icons/Icons';
import Button from '../components/ui/Button';
import OptionPills from '../components/ui/OptionPills';
import PageHeader from '../components/ui/PageHeader';
import { useToast } from '../context/ToastContext';
import { useSummarizer } from '../hooks/useSummarizer';
import { SUMMARY_TYPES, TONES, LENGTHS } from '../constants/options';
import { loadHistory } from '../utils/historyStorage';
import { downloadAsTxt } from '../utils/download';

export default function Summarizer() {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState('paste');
  const [chunked, setChunked] = useState(false);
  const [recentKey, setRecentKey] = useState(0);

  const s = useSummarizer({
    onSuccess: (msg) => {
      success(msg);
      setRecentKey((k) => k + 1);
    },
    onError: error,
  });

  const recent = loadHistory().slice(0, 5);

  const handleGenerate = useCallback(async () => {
    const data = await s.generate();
    if (data?.stats) setChunked(data.stats.chunked);
  }, [s]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !s.loading) {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleGenerate, s.loading]);

  const handleCopy = async () => {
    if (!s.summary) return;
    try {
      await navigator.clipboard.writeText(s.summary);
      success('Copied to clipboard!');
    } catch {
      error('Could not copy to clipboard.');
    }
  };

  const handleDownload = () => {
    if (!s.summary) return;
    const name = s.fileName
      ? s.fileName.replace(/\.[^.]+$/, '') + '-summary.txt'
      : 'summary.txt';
    downloadAsTxt(s.summary, name);
    success('Download started.');
  };

  const charProgress = Math.min(100, (s.charCount / 50000) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <PageHeader
        title="Summarizer"
        description="Paste text or upload a document. Customize how the AI formats your summary."
      />

      <div className="grid gap-8 xl:grid-cols-5">
        <div className="space-y-6 xl:col-span-3">
          <div className="card overflow-hidden p-0">
            <div className="flex border-b border-slate-100" role="tablist">
              {[
                { id: 'paste', label: 'Paste text' },
                { id: 'upload', label: 'Upload file' },
                { id: 'url', label: 'From URL' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3.5 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? 'border-b-2 border-brand-600 bg-brand-50/50 text-brand-800'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-5 sm:p-6">
              {activeTab === 'paste' ? (
                <>
                  <label htmlFor="input-text" className="sr-only">
                    Content to summarize
                  </label>
                  <textarea
                    id="input-text"
                    className="textarea-input min-h-[240px]"
                    placeholder="Paste your article, notes, research, or any long text here…"
                    value={s.inputText}
                    onChange={(e) => s.updateText(e.target.value)}
                    disabled={s.loading}
                  />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span>
                      <strong className="text-slate-700">{s.inputWords.toLocaleString()}</strong> words
                      {s.fileName && (
                        <span className="ml-2 text-slate-400">· from {s.fileName}</span>
                      )}
                    </span>
                    <span>{s.charCount.toLocaleString()} characters</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand-400 transition-all duration-300"
                      style={{ width: `${charProgress}%` }}
                      aria-hidden
                    />
                  </div>
                </>
              ) : activeTab === 'upload' ? (
                <FileUpload
                  onUpload={async (file, err) => {
                    const data = await s.upload(file, err);
                    if (data) setActiveTab('paste');
                  }}
                  disabled={s.loading}
                  loading={s.uploadLoading}
                />
              ) : (
                <>
                  <label htmlFor="input-url" className="sr-only">
                    URL to summarize
                  </label>
                  <input
                    id="input-url"
                    type="url"
                    className="input-input w-full"
                    placeholder="https://example.com/article"
                    value={s.url}
                    onChange={(e) => s.updateUrl(e.target.value)}
                    disabled={s.loading}
                  />
                  <p className="mt-2 text-xs text-slate-500">We will fetch the page and extract the main text for summarization.</p>
                </>
              )}
            </div>
          </div>

          <div className="card grid gap-5 sm:grid-cols-3">
            <OptionPills
              label="Summary type"
              options={SUMMARY_TYPES}
              value={s.summaryType}
              onChange={s.setSummaryType}
              disabled={s.loading}
            />
            <OptionPills
              label="Tone"
              options={TONES}
              value={s.tone}
              onChange={s.setTone}
              disabled={s.loading}
            />
            <OptionPills
              label="Length"
              options={LENGTHS}
              value={s.length}
              onChange={s.setLength}
              disabled={s.loading}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              icon={IconSparkles}
              onClick={handleGenerate}
              disabled={s.loading || (!s.inputText.trim() && !s.url.trim())}
              className="min-w-[180px]"
            >
              {s.loading ? 'Summarizing…' : 'Generate summary'}
            </Button>
            <Button variant="ghost" icon={IconTrash} onClick={s.clear} disabled={s.loading}>
              Clear
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:col-span-2 xl:sticky xl:top-24 xl:max-h-[calc(100vh-8rem)]">
          <ResultPanel
            summary={s.summary}
            loading={s.loading}
            inputWords={s.inputWords}
            outputWords={s.outputWords}
            compression={s.compression}
            chunked={chunked}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />

          {recent.length > 0 && (
            <div className="card shrink-0" key={recentKey}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Recent</h3>
                <Link to="/history" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                  View all →
                </Link>
              </div>
              <ul className="max-h-36 space-y-2 overflow-y-auto pr-1">
                {recent.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-xs transition hover:border-brand-200"
                  >
                    <span className="font-medium capitalize text-slate-800">{item.summaryType}</span>
                    <span className="text-slate-400"> · {new Date(item.createdAt).toLocaleDateString()}</span>
                    <p className="mt-0.5 line-clamp-2 text-slate-600">{item.summary}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
