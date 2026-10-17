import { useCallback, useEffect, useState } from 'react';
import './admin.css';
import { projectService as api } from '../services/projectService.js';
import { assetUrl } from '../services/api.js';
import CertificatesPanel from './CertificatesPanel.jsx';

const TOKEN_KEY = 'portfolio_admin_token';
const EMPTY = { name: '', category: '', description: '', emoji: '✨', coverUrl: '', year: '', demoUrl: '', repoUrl: '', sortOrder: 0, published: true };

function Login({ onToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { const t = await api.login(email, password); sessionStorage.setItem(TOKEN_KEY, t); onToken(t); }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  };
  return (
    <div className="adm"><form className="adm__card adm__login" onSubmit={submit}>
      <h1>Admin</h1><h2>Masuk untuk mengelola project</h2>
      <div className="adm__grid">
        <label className="adm__full">Email<input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="adm__full">Password<input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      </div>
      {err && <p className="adm__err" role="alert">{err}</p>}
      <p style={{ marginTop: 14 }}><button disabled={busy}>{busy ? 'Memproses…' : 'Masuk'}</button></p>
    </form></div>
  );
}

function Dashboard({ token, onLogout }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  const fail = useCallback((e) => {
    if (e.status === 401) { sessionStorage.removeItem(TOKEN_KEY); onLogout(); return; }
    const d = e.details?.map((x) => `${x.field}: ${x.message}`).join('; ');
    setMsg({ type: 'err', text: d ? `${e.message} (${d})` : e.message });
  }, [onLogout]);

  const load = useCallback(() => api.listAdmin(token).then(setItems).catch(fail), [token, fail]);
  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const reset = () => { setForm(EMPTY); setEditId(null); };

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setMsg({ type: '', text: '' });
    const payload = { ...form, sortOrder: Number(form.sortOrder) || 0, year: form.year === '' ? null : Number(form.year) };
    try {
      if (editId) await api.update(token, editId, payload); else await api.create(token, payload);
      setMsg({ type: 'ok', text: editId ? 'Project diperbarui.' : 'Project ditambahkan.' });
      reset(); await load();
    } catch (x) { fail(x); } finally { setBusy(false); }
  };
  const upload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setBusy(true);
    try { const url = await api.upload(token, file); setForm((f) => ({ ...f, coverUrl: url })); setMsg({ type: 'ok', text: 'Gambar terunggah.' }); }
    catch (x) { fail(x); } finally { setBusy(false); e.target.value = ''; }
  };
  const edit = (p) => { setEditId(p.id); setForm({ ...EMPTY, ...Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v ?? ''])) }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const del = async (p) => {
    if (!window.confirm(`Hapus project "${p.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try { await api.remove(token, p.id); await load(); setMsg({ type: 'ok', text: 'Project dihapus.' }); } catch (x) { fail(x); }
  };

  return (
    <div className="adm"><div className="adm__wrap">
      <div className="adm__bar"><div><h1>Dashboard Project</h1><span className="adm__meta">Perubahan langsung tampil di website publik.</span></div>
        <div className="adm__actions"><a href="/"><button className="ghost" type="button">Lihat situs</button></a><button className="ghost" type="button" onClick={() => { sessionStorage.removeItem(TOKEN_KEY); onLogout(); }}>Keluar</button></div></div>

      <form className="adm__card" onSubmit={submit}>
        <h2>{editId ? 'Edit project' : 'Tambah project baru'}</h2>
        <div className="adm__grid">
          <label>Nama project<input required maxLength={120} value={form.name} onChange={set('name')} /></label>
          <label>Kategori (WEBSITE / SYSTEM PY / POSTER)<input required maxLength={40} list="cat-list" value={form.category} onChange={set('category')} /><datalist id="cat-list"><option value="WEBSITE" /><option value="SYSTEM PY" /><option value="POSTER" /></datalist></label>
          <label className="adm__full">Deskripsi<textarea maxLength={1000} value={form.description} onChange={set('description')} /></label>
          <label>Emoji (tampil di lingkaran card jika tanpa cover)<input maxLength={8} value={form.emoji} onChange={set('emoji')} /></label>
          <label>Tahun<input type="number" min="1990" max="2100" value={form.year} onChange={set('year')} /></label>
          <label>Link demo / website<input type="url" placeholder="https://" value={form.demoUrl} onChange={set('demoUrl')} /></label>
          <label>Link repository<input type="url" placeholder="https://" value={form.repoUrl} onChange={set('repoUrl')} /></label>
          <label>Urutan (kecil tampil dulu)<input type="number" min="0" value={form.sortOrder} onChange={set('sortOrder')} /></label>
          <label>Cover (gambar, maks 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={upload} /></label>
          {form.coverUrl && <div className="adm__full adm__meta">Cover: <a href={assetUrl(form.coverUrl)} target="_blank" rel="noreferrer">{form.coverUrl}</a> <button type="button" className="ghost" onClick={() => setForm((f) => ({ ...f, coverUrl: '' }))}>Hapus cover</button></div>}
          <label style={{ gridAutoFlow: 'column', justifyContent: 'start', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={form.published} onChange={set('published')} /> Tampilkan di website</label>
        </div>
        {msg.text && <p className={msg.type === 'ok' ? 'adm__ok' : 'adm__err'} role="status">{msg.text}</p>}
        <p className="adm__actions" style={{ marginTop: 14 }}><button disabled={busy}>{editId ? 'Simpan perubahan' : 'Tambah project'}</button>{editId && <button type="button" className="ghost" onClick={reset}>Batal</button>}</p>
      </form>

      <div className="adm__card"><h2>Semua project ({items.length})</h2>
        {items.map((p) => (
          <div className="adm__row" key={p.id}>
            <div className="adm__thumb">{p.coverUrl ? <img src={assetUrl(p.coverUrl)} alt="" /> : p.emoji}</div>
            <div><strong>{p.name}</strong> <span className="adm__meta">· {p.category}{p.year ? ` · ${p.year}` : ''}{p.published ? '' : ' · DISEMBUNYIKAN'} · urutan {p.sortOrder}</span>
              <div className="adm__meta">{p.description.slice(0, 110)}{p.description.length > 110 ? '…' : ''}</div></div>
            <div className="adm__actions"><button type="button" onClick={() => edit(p)}>Edit</button><button type="button" className="danger" onClick={() => del(p)}>Hapus</button></div>
          </div>
        ))}
        {!items.length && <p className="adm__meta">Belum ada project.</p>}
      </div>
    </div></div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  const [tab, setTab] = useState('projects');
  if (!token) return <Login onToken={setToken} />;
  const logout = () => setToken(null);
  return (
    <>
      <div className="adm adm__tabbar">
        <div className="adm__tabs">
          <button type="button" className={tab === 'projects' ? 'on' : ''} onClick={() => setTab('projects')}>Project</button>
          <button type="button" className={tab === 'certs' ? 'on' : ''} onClick={() => setTab('certs')}>Sertifikat</button>
        </div>
      </div>
      {tab === 'projects' ? <Dashboard token={token} onLogout={logout} /> : <CertificatesPanel token={token} onLogout={logout} />}
    </>
  );
}