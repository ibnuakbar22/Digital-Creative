import { useCallback, useEffect, useRef, useState } from 'react';
import { achievements as a } from '../data/content.js';
import { certificateService } from '../services/certificateService.js';
import { assetUrl } from '../services/api.js';

const meta = (c) => [c.issuer, c.year].filter(Boolean).join(' · ');

export default function Achievements() {
  const [items, setItems] = useState(null);
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState(false);
  const ref = useRef(null);
  const n = items ? items.length : 0;

  useEffect(() => {
    let alive = true;
    certificateService.list().then((d) => alive && setItems(d)).catch(() => alive && setItems([]));
    return () => { alive = false; };
  }, []);

  // Animasi masuk dimulai saat section terlihat di layar.
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setSeen(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback((d) => setOpen((i) => (i == null ? i : (i + d + n) % n)), [n]);

  useEffect(() => {
    if (open == null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, close, go]);

  const cur = open != null && items ? items[open] : null;

  return (
    <section ref={ref} className={`ach${seen ? ' is-in' : ''}`} id="achievements" aria-labelledby="ach-title">
      <h2 className="ach__title" id="ach-title"><i />{a.title}</h2>
      <p className="ach__sub">{a.subtitle}</p>

      {items === null && <p className="cert-state" role="status">Loading…</p>}
      {items && n === 0 && <p className="cert-state">Belum ada sertifikat.</p>}
      {n > 0 && (
        <div className="cert-grid">
          {items.map((c, i) => (
            <button key={c.id} type="button" className="cert" style={{ '--i': i }} onClick={() => setOpen(i)} aria-label={`Lihat sertifikat ${c.title}`}>
              <img src={assetUrl(c.imageUrl)} alt={`Sertifikat ${c.title}`} loading="lazy" />
              <span className="cert__cap"><b>{c.title}</b>{meta(c) && <small>{meta(c)}</small>}</span>
            </button>
          ))}
        </div>
      )}

      {cur && (
        <div className="lb" role="dialog" aria-modal="true" aria-label={cur.title} onClick={close}>
          <div className="lb__box" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="lb__x" onClick={close} aria-label="Tutup">×</button>
            {n > 1 && <button type="button" className="lb__nav lb__nav--l" onClick={() => go(-1)} aria-label="Sertifikat sebelumnya">‹</button>}
            <img key={cur.id} className="lb__img" src={assetUrl(cur.imageUrl)} alt={`Sertifikat ${cur.title}`} />
            {n > 1 && <button type="button" className="lb__nav lb__nav--r" onClick={() => go(1)} aria-label="Sertifikat berikutnya">›</button>}
            <div className="lb__cap" key={`cap-${cur.id}`}>
              <b>{cur.title}</b>
              {meta(cur) && <span>{meta(cur)}</span>}
              {cur.credentialUrl && <a href={cur.credentialUrl} target="_blank" rel="noopener noreferrer">Lihat kredensial</a>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}