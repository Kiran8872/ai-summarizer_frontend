export default function StatsBar({ inputWords, outputWords, compression, chunked }) {
  if (inputWords === 0 && outputWords === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Stat label="Input" value={`${inputWords.toLocaleString()} words`} />
      {outputWords > 0 && (
        <>
          <Stat label="Output" value={`${outputWords.toLocaleString()} words`} highlight />
          <Stat label="Saved" value={`${compression}%`} highlight />
          {chunked && (
            <div className="col-span-2 sm:col-span-1">
              <span className="badge-neutral">Chunked processing</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div
      className={`rounded-xl px-3 py-2.5 ${
        highlight ? 'bg-brand-50 ring-1 ring-brand-100' : 'bg-slate-50'
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold ${highlight ? 'text-brand-800' : 'text-slate-800'}`}>
        {value}
      </p>
    </div>
  );
}
