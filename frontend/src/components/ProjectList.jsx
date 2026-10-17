import ProjectCard from './ProjectCard.jsx';
import { useProjects, isPoster } from '../hooks/useProjects.js';

export default function ProjectList() {
  const state = useProjects();
  if (!state) return <p className="pgrid__state" role="status">Loading…</p>;
  const items = state.projects.filter((p) => !isPoster(p));
  if (!items.length) return <p className="pgrid__state">Belum ada project.</p>;
  return (
    <div className="pgrid" data-offline={state.offline || undefined}>
      {items.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
    </div>
  );
}
