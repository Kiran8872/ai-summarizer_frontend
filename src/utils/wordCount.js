export function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function compressionPercent(inputWords, outputWords) {
  if (inputWords <= 0) return 0;
  const saved = Math.max(0, inputWords - outputWords);
  return Math.round((saved / inputWords) * 100);
}
