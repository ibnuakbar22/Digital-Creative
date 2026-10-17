import ProjectList from '../components/ProjectList.jsx';
import { projectsIntro } from '../data/content.js';

export default function Projects() {
  return (
    <section className="projects" id="projects" aria-labelledby="projects-title">
      <div className="panel">
        <h2 className="panel__title" id="projects-title"><i />{projectsIntro.title}</h2>
        <p className="panel__sub">{projectsIntro.text}</p>
        <span className="pill pill--sm"><i className="pill__dot" style={{ background: '#cebf7a' }} />{projectsIntro.badge}</span>
        <ProjectList />
      </div>
    </section>
  );
}
