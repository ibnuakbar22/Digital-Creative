import { useEffect, useRef, useState } from 'react';
import { showcase } from '../data/content.js';
import { useProjects, isPoster } from '../hooks/useProjects.js';
import { assetUrl } from '../services/api.js';

const AUTOPLAY_MS = 4500; // jeda ganti poster otomatis (milidetik). Ubah angka ini sesuai selera.

function Face({ p }) {
  return p.coverUrl
    ? <img src={assetUrl(p.coverUrl)} alt={p.name} loading="lazy" />
    : <span className="stage__emoji" aria-hidden="true">{p.emoji}</span>;
}

const Chevron = ({ dir }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'left' ? 'M9 2L4 7l5 5' : 'M5 2l5 5-5 5'} />
  </svg>
);

// Panggung dial dari Figma. Kartu diisi project berkategori POSTER:
// ganti otomatis, bisa digeser dengan panah / titik / swipe / klik kartu samping.
export default function Showcase() {
  const state = useProjects();
  const posters = (state?.projects || []).filter(isPoster);
  const n = posters.length;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);

  const i = n ? idx % n : 0;
  const go = (d) => setIdx((i + d + n) % n);

  // Ganti otomatis; timer diulang setiap kali poster berganti (juga saat digeser manual).
  useEffect(() => {
    if (n < 2 || paused) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => setIdx((v) => (v + 1) % n), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [n, paused, idx]);

  const cur = n ? posters[i] : null;
  const prev = n >= 3 ? posters[(i - 1 + n) % n] : null;
  const next = n >= 2 ? posters[(i + 1) % n] : null;
  const href = cur && (cur.demoUrl || cur.repoUrl || (cur.coverUrl ? assetUrl(cur.coverUrl) : null));
  const Center = href ? 'a' : 'div';
  const hover = (v) => (e) => { if (e.pointerType === 'mouse') setPaused(v); };

  return (
    <section
      className="show"
      aria-labelledby="show-title"
      onPointerEnter={hover(true)}
      onPointerLeave={hover(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <h2 className="glow glow--cyan" id="show-title">{showcase.title}</h2>
      <p className="show__sub">{showcase.subtitle}</p>
      <div
        className="stage"
        aria-hidden={n ? undefined : 'true'}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current == null || n < 2) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        <i className="stage__ring stage__ring--1" />
        <i className="stage__ring stage__ring--2" />
        <i className="stage__glow" />
        {n === 0 ? (
          <>
            <i className="stage__card stage__card--l" />
            <i className="stage__card stage__card--r" />
            <i className="stage__card stage__card--c" />
          </>
        ) : (
          <>
            {prev && (
              <button key={`l-${prev.id}`} type="button" className="stage__card stage__card--l" onClick={() => go(-1)} aria-label={`Poster sebelumnya: ${prev.name}`}>
                <Face p={prev} />
              </button>
            )}
            {next && (
              <button key={`r-${next.id}`} type="button" className="stage__card stage__card--r" onClick={() => go(1)} aria-label={`Poster berikutnya: ${next.name}`}>
                <Face p={next} />
              </button>
            )}
            <Center key={`c-${cur.id}`} className="stage__card stage__card--c" {...(href ? { href, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `Buka ${cur.name}` } : {})}>
              <Face p={cur} />
              <span className="stage__cap"><b>{cur.name}</b><small>{cur.year || cur.category}</small></span>
            </Center>
          </>
        )}
      </div>
      {n > 1 && (
        <div
          className="show__ctrl"
          role="group"
          aria-label="Navigasi poster"
          onKeyDown={(e) => { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); }}
        >
          <button type="button" className="show__arrow" onClick={() => go(-1)} aria-label="Poster sebelumnya"><Chevron dir="left" /></button>
          <div className="show__dots">
            {posters.map((p, k) => (
              <button key={p.id} type="button" aria-label={p.name} aria-current={k === i} onClick={() => setIdx(k)} />
            ))}
          </div>
          <button type="button" className="show__arrow" onClick={() => go(1)} aria-label="Poster berikutnya"><Chevron dir="right" /></button>
        </div>
      )}
      <a className="show__down" href="#achievements" aria-label="Scroll ke Achievements"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 4l4 4 4-4" /></svg></a>
    </section>
  );
}
