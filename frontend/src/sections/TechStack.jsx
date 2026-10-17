import { techIcons } from '../data/content.js';

export default function TechStack() {
  return (
    <section className="tech" aria-label="Tech stack">
      <ul className="tech__grid">
        {techIcons.map(([name, file]) => (
          <li key={name} className="tech__tile" title={name}>
            <img src={`/assets/icons/tech/${file}`} alt={name} loading="lazy" />
          </li>
        ))}
      </ul>
    </section>
  );
}
