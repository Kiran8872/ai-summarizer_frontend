import { useRef, useState } from 'react';
import { IconDocument, IconUpload } from './icons/Icons';
import Spinner from './ui/Spinner';

const ACCEPT = '.pdf,.txt,application/pdf,text/plain';

export default function FileUpload({ onUpload, disabled, loading }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    const ext = file.name.toLowerCase();
    if (!ext.endsWith('.pdf') && !ext.endsWith('.txt')) {
      onUpload(null, 'Unsupported file type. Please upload PDF or TXT only.');
      return;
    }
    setFileName(file.name);
    await onUpload(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled && !loading) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className={`relative rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
        dragOver
          ? 'border-brand-400 bg-brand-50/80 scale-[1.01]'
          : 'border-slate-200 bg-gradient-to-b from-slate-50 to-white'
      } ${disabled || loading ? 'pointer-events-none opacity-60' : 'cursor-pointer hover:border-brand-300 hover:shadow-sm'}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => !disabled && !loading && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      aria-label="Upload PDF or TXT file"
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
        disabled={disabled || loading}
      />

      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <Spinner />
          <p className="text-sm font-medium text-brand-700">Extracting text…</p>
        </div>
      ) : (
        <>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
            <IconUpload className="h-8 w-8" />
          </div>
          <p className="font-semibold text-slate-800">Drop your file here</p>
          <p className="mt-1 text-sm text-slate-500">PDF or TXT · max 15 MB</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-brand-700 shadow-sm ring-1 ring-slate-200">
            <IconDocument className="h-4 w-4" />
            Browse files
          </p>
          {fileName && (
            <p className="mt-3 text-xs text-slate-500">Last: {fileName}</p>
          )}
        </>
      )}
    </div>
  );
}
