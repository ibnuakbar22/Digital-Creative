import { site } from '../data/site.js';

export default function Header() {
  return (
    <header className="top" id="top">
      <div className="top__bg" aria-hidden="true" />
      <p className="top__studio">{site.studio}</p>
      <h1 className="glow glow--h1">{site.title}</h1>
      <nav className="island" aria-label="Utama">
        <span className="glow glow--nav">{site.navName}</span>
        <span className="island__dot" aria-hidden="true" />
      </nav>
    </header>
  );
}
