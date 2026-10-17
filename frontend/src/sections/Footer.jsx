import { site } from '../data/site.js';

export default function Footer() {
  return (
    <footer className="foot">
      <p className="foot__name">{site.footerName}</p>
      <p className="foot__tag">{site.footerTagline}</p>
      <p className="foot__copy">{site.copyright}</p>
    </footer>
  );
}
