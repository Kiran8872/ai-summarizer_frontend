import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { IconCheck, IconCopy, IconDownload } from './icons/Icons';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import StatsBar from './StatsBar';

export default function ResultPanel({
  summary,
  loading,
  inputWords,
  outputWords,
  compression,
  chunked,
  onCopy,
  onDownload,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card flex flex-1 min-h-0 flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-900">Summary</h2>
          <p className="text-xs text-slate-500">Ctrl+Enter to generate</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={copied ? IconCheck : IconCopy}
            onClick={handleCopy}
            disabled={!summary || loading}
            aria-label="Copy summary"
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={IconDownload}
            onClick={onDownload}
            disabled={!summary || loading}
          >
            Download
          </Button>
        </div>
      </div>

      <StatsBar
        inputWords={inputWords}
        outputWords={outputWords}
        compression={compression}
        chunked={chunked}
      />

      <div className="mt-4 min-h-[150px] flex-1 overflow-auto rounded-xl border border-slate-100 bg-slate-50/80 p-5">
        {loading ? (
          <div className="flex h-full min-h-[150px] flex-col items-center justify-center gap-4 text-slate-500">
            <Spinner size="lg" />
            <div className="text-center">
              <p className="font-medium text-slate-700">Summarizing your content</p>
              <p className="mt-1 text-sm animate-pulse-soft">This may take a moment for long texts…</p>
            </div>
          </div>
        ) : summary ? (
          <article className="prose-summary animate-fade-in text-sm leading-relaxed text-slate-800">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </article>
        ) : (
          <div className="flex h-full min-h-[150px] flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200/80 text-slate-400">
              <span className="text-xl">✦</span>
            </div>
            <p className="font-medium text-slate-500">Your summary will appear here</p>
            <p className="mt-1 max-w-xs text-xs text-slate-400">
              Paste text or upload a file, choose your options, then hit Generate
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
