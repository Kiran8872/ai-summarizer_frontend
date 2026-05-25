import { describe, it, expect, beforeEach } from 'vitest';
import { loadHistory, saveToHistory, clearHistory } from '../utils/historyStorage';

describe('historyStorage', () => {
  beforeEach(() => {
    clearHistory();
    localStorage.clear();
  });

  it('saves and loads history', () => {
    saveToHistory({ summary: 'Test summary', summaryType: 'short' });
    const history = loadHistory();
    expect(history.length).toBe(1);
    expect(history[0].summary).toBe('Test summary');
  });
});
