import { staticProjects } from '../data/staticProjects.js';

// Project berkategori mengandung kata "poster" tampil di Creative Design, selain itu di Selected Disciplines.
export const isPoster = (p) => /poster/i.test(p.category || '');

export function useProjects() {
  return { projects: staticProjects, offline: false };
}
