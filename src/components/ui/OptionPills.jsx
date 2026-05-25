export default function OptionPills({ label, options, value, onChange, disabled }) {
  return (
    <div className={`space-y-2 ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="input-select"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}{opt.hint ? ` - ${opt.hint}` : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
