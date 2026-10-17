import { useEffect, useState } from 'react';
import { projectService } from '../services/projectService.js';
import { fallbackProjects } from '../data/fallbackProjects.js';

// Satu kali fetch dipakai bersama oleh section Projects dan Showcase (Creative Design).
let cache = null;
function load() {
  if (!cache) {
    cache = projectService.list()
      .then((projects) => ({ projects, offline: false }))
      .catch((e) => {
        console.warn('API project tidak terjangkau, memakai data desain.', e.message);
        return { projects: fallbackProjects, offline: true };
      });
  }
  return cache;
}

// Project berkategori mengandung kata "poster" tampil di Creative Design, selain itu di Selected Disciplines.
export const isPoster = (p) => /poster/i.test(p.category || '');

export function useProjects() {
  const [state, setState] = useState(null);
  useEffect(() => {
    let alive = true;
    load().then((s) => alive && setState(s));
    return () => { alive = false; };
  }, []);
  return state;
}
