import SocialIcon from '../components/SocialIcon.jsx';
import { socials, socialsSection } from '../data/site.js';

// Section TAMBAHAN (atas permintaan): media sosial, sebelum footer. Gaya mengikuti panel & tile desain.
export default function Connect() {
  return (
    <section className="connect" id="connect" aria-labelledby="connect-title">
      <div className="panel">
        <h2 className="panel__title" id="connect-title"><i />{socialsSection.title}</h2>
        <p className="panel__sub">{socialsSection.subtitle}</p>
        <ul className="connect__grid">
          {socials.map((s) => (
            <li key={s.id}>
              <SocialIcon id={s.id} label={s.label} url={s.url} size="lg">
                <span className="soc__name">{s.label}</span>
                <span className="soc__handle">{s.handle || (s.url ? '' : '—')}</span>
              </SocialIcon>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
