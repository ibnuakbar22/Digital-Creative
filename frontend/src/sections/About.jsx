import HeroArt from '../components/HeroArt.jsx';
import SocialIcon from '../components/SocialIcon.jsx';
import { site, socials } from '../data/site.js';

export default function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-badge">
      <div className="about__text">
        <span className="pill" id="about-badge"><i className="pill__dot" style={{ background: '#ff2d87' }} />{site.aboutBadge}</span>
        <p className="about__p">{site.about}</p>
        <div className="about__actions">
          <a className="btn btn--glow" href={site.primaryButton.href}>{site.primaryButton.label}</a>
          <a className="btn" href={site.cvButton.href} download>{site.cvButton.label}</a>
        </div>
        <div className="about__bar">
          <p>{site.tagline}</p>
          <div className="about__soc">
            {socials.slice(0, 4).map((s) => <SocialIcon key={s.id} id={s.id} label={s.label} url={s.url} size="sm" />)}
          </div>
        </div>
      </div>
      <HeroArt />
    </section>
  );
}
