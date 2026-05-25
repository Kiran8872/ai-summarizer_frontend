const STORAGE_KEY = 'ai_summarizer_history';
const MAX_ITEMS = 50;

/**
 * Load summary history from localStorage.
 */
export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save a new summary entry to local history.
 */
export function saveToHistory(entry) {
  const history = loadHistory();
  const item = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...entry,
  };
  const updated = [item, ...history].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return item;
}

/**
 * Remove one history item by id.
 */
export function removeFromHistory(id) {
  const updated = loadHistory().filter((h) => h.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Clear all history.
 */
export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
