// Komposisi hero dari Figma (frame 390×219). Setiap layer memakai koordinat Figma asli,
// dikonversi ke persen supaya skalanya mengikuti lebar container (mobile → desktop).
const W = 390;
const H = 219;
const A = '/assets/images/';
const layers = [
  { src: 'icon-ae.webp', x: 29, y: 150, w: 56, h: 50, alt: 'Adobe After Effects' },
  { src: 'icon-ps.webp', x: 115, y: 31, w: 60, h: 59, rot: 22, alt: 'Adobe Photoshop' },
  { src: 'creative.webp', x: 0, y: 41, w: 195, h: 125, alt: '' },
  { src: 'icon-php-hero.webp', x: 223, y: 182, w: 46, h: 24, rot: 7, alt: 'PHP' },
  { src: 'icon-capcut.webp', x: 289, y: 150, w: 61, h: 55, alt: 'CapCut' },
  { src: 'digital.webp', x: 195, y: 49, w: 195, h: 117, alt: '' },
  { src: 'glow.webp', x: 85, y: 0, w: 219, h: 219, alt: '' },
  { src: 'icon-lr.webp', x: 93, y: 178, w: 42, h: 37, alt: 'Adobe Lightroom' },
  { src: 'person.webp', x: 114, y: -70, w: 163, h: 289, alt: 'Muhammad Ibnu Akbar', clipBottom: true },
  { src: 'strip-a.webp', x: -8, y: 169, w: 293, h: 50, alt: '' },
  { src: 'strip-b.webp', x: 98, y: 171, w: 293, h: 50, flip: true, alt: '' },
];

export default function HeroArt() {
  return (
    <div className="heroart" role="img" aria-label="CREATIVE DIGITAL — Muhammad Ibnu Akbar">
      <img className="heroart__bg" src={`${A}hero-bg.webp`} alt="" decoding="async" />
      {layers.map((l) => (
        <img
          key={l.src}
          src={A + l.src}
          alt=""
          aria-hidden="true"
          loading={l.src === 'person.webp' ? 'eager' : 'lazy'}
          style={{
            left: `${(l.x / W) * 100}%`, top: `${(l.y / H) * 100}%`, width: `${(l.w / W) * 100}%`, height: `${(l.h / H) * 100}%`,
            transform: `${l.flip ? 'scaleX(-1)' : ''} ${l.rot ? `rotate(${l.rot}deg)` : ''}`.trim() || undefined,
          }}
        />
      ))}
    </div>
  );
}
