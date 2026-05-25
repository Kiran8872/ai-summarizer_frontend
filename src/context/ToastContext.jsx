import { createContext, useCallback, useContext, useState } from 'react';
import { IconCheck, IconX } from '../components/icons/Icons';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const success = useCallback((msg) => toast(msg, 'success'), [toast]);
  const error = useCallback((msg) => toast(msg, 'error', 6000), [toast]);
  const info = useCallback((msg) => toast(msg, 'info'), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, dismiss }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6"
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg animate-slide-up ${
              t.type === 'success'
                ? 'border-emerald-200/80 bg-emerald-50 text-emerald-900'
                : t.type === 'error'
                  ? 'border-red-200/80 bg-red-50 text-red-900'
                  : 'border-slate-200/80 bg-white text-slate-800'
            }`}
          >
            {t.type === 'success' && <IconCheck className="mt-0.5 h-5 w-5 text-emerald-600" />}
            {t.type === 'error' && <IconX className="mt-0.5 h-5 w-5 text-red-500" />}
            <p className="flex-1 font-medium">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="rounded p-0.5 opacity-60 hover:opacity-100"
              aria-label="Dismiss notification"
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
