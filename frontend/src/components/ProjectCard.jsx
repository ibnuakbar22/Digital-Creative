import { assetUrl } from '../services/api.js';

// Warna aksen bergilir mengikuti urutan card (sesuai 4 card di Figma), jadi project baru tidak perlu field warna.
const ACCENTS = [
  { c: '#ec4899', chip: '#f9a8d4', glow: '88,28,135', gl: 0.3 },
  { c: '#a855f7', chip: '#d8b4fe', glow: '88,28,135', gl: 0.3 },
  { c: '#06b6d4', chip: '#d8b4fe', glow: '8,51,68', gl: 0.2 },
  { c: '#d946ef', chip: '#f0abfc', glow: '74,4,78', gl: 0.2 },
];

export default function ProjectCard({ project, index = 0 }) {
  const a = ACCENTS[index % ACCENTS.length];
  const href = project.demoUrl || project.repoUrl || null;
  const style = { '--accent': a.c, '--chip': a.chip, '--glow': `rgba(${a.glow},${a.gl})` };
  const body = (
    <>
      <span className="pcard__chip">{project.category}</span>
      <h3 className="pcard__title">{project.name}</h3>
      <span className="pcard__badge" aria-hidden={!project.coverUrl}>
        {project.coverUrl ? <img src={assetUrl(project.coverUrl)} alt={`Cover ${project.name}`} loading="lazy" /> : project.emoji}
      </span>
      <p className="pcard__text">{project.description}</p>
    </>
  );
  return href ? (
    <a className="pcard" style={style} href={href} target="_blank" rel="noopener noreferrer">{body}</a>
  ) : (
    <article className="pcard" style={style}>{body}</article>
  );
}
