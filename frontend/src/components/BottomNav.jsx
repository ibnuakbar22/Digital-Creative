import { useEffect, useRef, useState } from 'react';
import { navLinks } from '../data/site.js';

// Navigasi mengambang dengan indikator "liquid" yang meluncur mengikuti section yang sedang dilihat.
export default function BottomNav() {
  const [active, setActive] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const compute = () => {
      ticking.current = false;
      const line = window.innerHeight * 0.4;
      let idx = 0;
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) idx = i;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) idx = ids.length - 1;
      setActive(idx);
    };
    const onScroll = () => {
      if (!ticking.current) { ticking.current = true; requestAnimationFrame(compute); }
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <nav className="lnav" aria-label="Navigasi halaman" style={{ '--active-index': active, '--n': navLinks.length }}>
      <span className="liquid" aria-hidden="true" />
      {navLinks.map((l, i) => (
        <a key={l.href} href={l.href} className="lnav__item" aria-current={i === active ? 'true' : undefined} onClick={() => setActive(i)}>
          {l.label}
        </a>
      ))}
    </nav>
  );
}