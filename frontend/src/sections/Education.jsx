import { education } from '../data/content.js';

export default function Education() {
  return (
    <section className="edu" aria-labelledby="edu-badge" id="education">
      <div className="edu__inner">
        <div className="edu__visual">
          <span className="edu__visual-code">EDU <i /> 01</span>
          <span className="edu__visual-orbit" aria-hidden="true" />
          <img
            className="edu__portrait"
            src="/assets/images/education-potrait.png"
            alt="Portrait of Muhammad Ibnu Akbar"
            loading="lazy"
          />
          <div className="edu__visual-caption">
            <span>ACADEMIC PROFILE</span>
            <strong>Muhammad Ibnu Akbar</strong>
          </div>
        </div>
        <div className="edu__content">
          <p className="edu__eyebrow" id="edu-badge">
            <i className="pill__dot" aria-hidden="true" />
            Education <span> / ACADEMIC PROFILE</span>
          </p>
          <h2 className="edu__title">A journey<br />shaped by <span>learning.</span></h2>
          <p className="edu__intro">Every step has helped shape the way I learn, think, and create.</p>
          <div className="edu__groups">
            {education[0] && (
              <section className="edu__group edu__group--current" aria-labelledby="edu-current-title">
                <h3 className="edu__group-title" id="edu-current-title">
                  <span className="edu__group-marker" aria-hidden="true" />
                  Current education
                  <span className="edu__status">IN PROGRESS</span>
                </h3>
                <div className="edu__item edu__item--current">
                  <span className="edu__index">01</span>
                  <span className="edu__school">{education[0].text}</span>
                </div>
              </section>
            )}
            {education.length > 1 && (
              <section className="edu__group" aria-labelledby="edu-previous-title">
                <h3 className="edu__group-title" id="edu-previous-title">
                  <span className="edu__group-marker" aria-hidden="true" />
                  Previous education
                </h3>
                <ol className="edu__timeline">
                  {education.slice(1).map((e, i) => (
                    <li key={e.text} className="edu__item">
                      <span className="edu__index">{String(i + 2).padStart(2, '0')}</span>
                      <span className="edu__school">{e.text}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}