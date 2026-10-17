import { useEffect, useState } from 'react';

const MIN_MS = 1400; // minimal lama loader tampil (milidetik)

export default function Loader() {
  const [phase, setPhase] = useState('show'); // show -> hide -> gone

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const min = reduce ? 300 : MIN_MS;
    const start = performance.now();
    let done = false;
    let t1; let t2;
    document.body.style.overflow = 'hidden';

    const finish = () => {
      if (done) return;
      done = true;
      const wait = Math.max(0, min - (performance.now() - start));
      t1 = setTimeout(() => {
        setPhase('hide');
        document.body.style.overflow = '';
        t2 = setTimeout(() => setPhase('gone'), 500);
      }, wait);
    };

    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });
    const safety = setTimeout(finish, 5000);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(safety);
      window.removeEventListener('load', finish);
      document.body.style.overflow = '';
    };
  }, []);

  if (phase === 'gone') return null;
  return (
    <div className={`loader${phase === 'hide' ? ' is-hide' : ''}`} role="status" aria-live="polite">
      <div className="triangle-loader" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}