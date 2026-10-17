import { education } from '../data/content.js';

export default function Education() {
  return (
    <section className="edu scale" aria-labelledby="edu-badge" id="education">
      <div className="edu__inner">
        <img className="edu__bg" src="/assets/images/hero-bg.webp" alt="" aria-hidden="true" loading="lazy" />
        <span className="pill edu__pill" id="edu-badge"><i className="pill__dot" style={{ background: '#ff2d87' }} />Education</span>
        <img className="edu__strip edu__strip--l" src="/assets/images/strip-a.webp" alt="" aria-hidden="true" loading="lazy" />
        <img className="edu__strip edu__strip--r" src="/assets/images/strip-b.webp" alt="" aria-hidden="true" loading="lazy" style={{ transform: 'scaleX(-1)' }} />
        <ul className="edu__list">
          {education.map((e) => (
            <li key={e.text} className={`edu__row edu__row--${e.side}`}>
              <span>{e.side === 'left' ? `>   ${e.text}` : `${e.text}   <`}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
