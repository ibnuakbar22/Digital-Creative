export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function request(path, { method = 'GET', body, token, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API_BASE}/api${path}`, { method, headers, body: form ?? (body ? JSON.stringify(body) : undefined) });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request gagal (${res.status})`);
    err.status = res.status;
    err.details = data.details;
    throw err;
  }
  return data;
}

// Gambar hasil upload lokal (dev) berbentuk "/uploads/..." — arahkan ke host API.
export const assetUrl = (u) => (u && u.startsWith('/') ? `${API_BASE}${u}` : u);
