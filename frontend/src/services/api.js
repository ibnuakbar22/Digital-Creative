export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function request(path, { method = 'GET', body, token, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API_BASE}/api${path}`, { method, headers, body: form ?? (body ? JSON.stringify(body) : undefined) });
  if (res.status === 204) return null;
  // Kalau server mengembalikan HTML (mis. backend belum terhubung), anggap sebagai error — bukan data kosong.
  const data = await res.json().catch(() => null);
  if (!res.ok || data === null) {
    const err = new Error((data && data.error) || `Request gagal (${res.status})`);
    err.status = res.status;
    err.details = data && data.details;
    throw err;
  }
  return data;
}

// API-managed uploads use the backend; static public assets stay on the frontend host.
export const assetUrl = (u) => (
  u && (u.startsWith('/api/') || u.startsWith('/uploads/')) ? `${API_BASE}${u}` : u
);