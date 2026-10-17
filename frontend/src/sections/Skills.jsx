import { skills } from '../data/content.js';

export default function Skills() {
  return (
    <section className="skills" id="skills" aria-labelledby="skills-title">
      <h2 className="glow glow--h1" id="skills-title">TECHNICAL &amp; CREATIVE</h2>
      <div className="skills__grid">
        {skills.map((s) => (
          <article className="skill" key={s.title}>
            <h3><i style={{ background: s.dot }} />{s.title}</h3>
            <p>{s.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
