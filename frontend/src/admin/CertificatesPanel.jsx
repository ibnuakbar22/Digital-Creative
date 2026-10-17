import { useCallback, useEffect, useState } from 'react';
import { certificateService as api } from '../services/certificateService.js';
import { projectService } from '../services/projectService.js';
import { assetUrl } from '../services/api.js';

const EMPTY = { title: '', issuer: '', year: '', credentialUrl: '', imageUrl: '', sortOrder: 0, published: true };

export default function CertificatesPanel({ token, onLogout }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  const fail = useCallback((e) => {
    if (e.status === 401) { sessionStorage.removeItem('portfolio_admin_token'); onLogout(); return; }
    const d = e.details?.map((x) => `${x.field}: ${x.message}`).join('; ');
    setMsg({ type: 'err', text: d ? `${e.message} (${d})` : e.message });
  }, [onLogout]);

  const load = useCallback(() => api.listAdmin(token).then(setItems).catch(fail), [token, fail]);
  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const reset = () => { setForm(EMPTY); setEditId(null); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) { setMsg({ type: 'err', text: 'Unggah gambar sertifikat terlebih dahulu.' }); return; }
    setBusy(true); setMsg({ type: '', text: '' });
    const payload = { ...form, sortOrder: Number(form.sortOrder) || 0, year: form.year === '' ? null : Number(form.year) };
    try {
      if (editId) await api.update(token, editId, payload); else await api.create(token, payload);
      setMsg({ type: 'ok', text: editId ? 'Sertifikat diperbarui.' : 'Sertifikat ditambahkan.' });
      reset(); await load();
    } catch (x) { fail(x); } finally { setBusy(false); }
  };

  const upload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setBusy(true);
    try { const url = await projectService.upload(token, file); setForm((f) => ({ ...f, imageUrl: url })); setMsg({ type: 'ok', text: 'Gambar terunggah.' }); }
    catch (x) { fail(x); } finally { setBusy(false); e.target.value = ''; }
  };

  const edit = (c) => { setEditId(c.id); setForm({ ...EMPTY, ...Object.fromEntries(Object.entries(c).map(([k, v]) => [k, v ?? ''])) }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const del = async (c) => {
    if (!window.confirm(`Hapus sertifikat "${c.title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try { await api.remove(token, c.id); await load(); setMsg({ type: 'ok', text: 'Sertifikat dihapus.' }); } catch (x) { fail(x); }
  };

  return (
    <div className="adm"><div className="adm__wrap">
      <form className="adm__card" onSubmit={submit}>
        <h2>{editId ? 'Edit sertifikat' : 'Tambah sertifikat baru'}</h2>
        <div className="adm__grid">
          <label className="adm__full">Nama sertifikat<input required maxLength={160} value={form.title} onChange={set('title')} /></label>
          <label>Penerbit (mis. Dicoding)<input maxLength={120} value={form.issuer} onChange={set('issuer')} /></label>
          <label>Tahun<input type="number" min="1990" max="2100" value={form.year} onChange={set('year')} /></label>
          <label>Link kredensial / verifikasi (opsional)<input type="url" placeholder="https://" value={form.credentialUrl} onChange={set('credentialUrl')} /></label>
          <label>Urutan (kecil tampil dulu)<input type="number" min="0" value={form.sortOrder} onChange={set('sortOrder')} /></label>
          <label className="adm__full">Gambar sertifikat (JPG/PNG/WEBP, maks 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={upload} /></label>
          {form.imageUrl && <div className="adm__full"><img src={assetUrl(form.imageUrl)} alt="Pratinjau sertifikat" style={{ maxWidth: 260, borderRadius: 10, border: '1px solid rgba(168,85,247,.4)' }} /></div>}
          <label style={{ gridAutoFlow: 'column', justifyContent: 'start', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={form.published} onChange={set('published')} /> Tampilkan di website</label>
        </div>
        {msg.text && <p className={msg.type === 'ok' ? 'adm__ok' : 'adm__err'} role="status">{msg.text}</p>}
        <p className="adm__actions" style={{ marginTop: 14 }}><button disabled={busy}>{editId ? 'Simpan perubahan' : 'Tambah sertifikat'}</button>{editId && <button type="button" className="ghost" onClick={reset}>Batal</button>}</p>
      </form>

      <div className="adm__card"><h2>Semua sertifikat ({items.length})</h2>
        {items.map((c) => (
          <div className="adm__row" key={c.id}>
            <div className="adm__thumb"><img src={assetUrl(c.imageUrl)} alt="" /></div>
            <div><strong>{c.title}</strong> <span className="adm__meta">· {[c.issuer, c.year].filter(Boolean).join(' · ')}{c.published ? '' : ' · DISEMBUNYIKAN'} · urutan {c.sortOrder}</span></div>
            <div className="adm__actions"><button type="button" onClick={() => edit(c)}>Edit</button><button type="button" className="danger" onClick={() => del(c)}>Hapus</button></div>
          </div>
        ))}
        {!items.length && <p className="adm__meta">Belum ada sertifikat.</p>}
      </div>
    </div></div>
  );
}