const API_BASE = import.meta.env.VITE_API_URL || '';

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/api/health`);
  return handleResponse(res);
}

export async function summarize({ inputText, url, summaryType, tone, length }) {
  const body = url ? { url, summaryType, tone, length } : { inputText, summaryType, tone, length };
  const res = await fetch(`${API_BASE}/api/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse(res);
}
