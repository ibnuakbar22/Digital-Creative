import { z } from 'zod';
import * as Project from '../models/projectModel.js';

const empty = (v) => (v === '' ? null : v);
const url = z.preprocess(empty, z.string().url().max(500).refine((u) => /^https?:\/\//.test(u), 'Harus diawali http(s)://').nullable());
const coverUrl = z.preprocess(empty, z.string().max(500).regex(/^(https?:\/\/|\/uploads\/|\/api\/files\/)/, 'URL gambar tidak valid').nullable());
const year = z.preprocess((v) => (v === '' ? null : v == null ? v : Number(v)), z.number().int().min(1990).max(2100).nullable());

const base = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(40),
  description: z.string().trim().max(1000).default(''),
  emoji: z.string().trim().min(1).max(8).default('✨'),
  coverUrl: coverUrl.default(null),
  year: year.default(null),
  demoUrl: url.default(null),
  repoUrl: url.default(null),
  sortOrder: z.coerce.number().int().min(0).max(100000).default(0),
  published: z.boolean().default(true),
});
const updateSchema = base.partial();
const idSchema = z.string().uuid();

export async function listPublic(_req, res) { res.json({ data: await Project.list() }); }
export async function listAdmin(_req, res) { res.json({ data: await Project.list({ includeUnpublished: true }) }); }

export async function getOne(req, res) {
  const p = await Project.get(idSchema.parse(req.params.id));
  if (!p || !p.published) return res.status(404).json({ error: 'Project tidak ditemukan.' });
  res.json({ data: p });
}
export async function create(req, res) {
  res.status(201).json({ data: await Project.create(base.parse(req.body)) });
}
export async function update(req, res) {
  const p = await Project.update(idSchema.parse(req.params.id), updateSchema.parse(req.body));
  if (!p) return res.status(404).json({ error: 'Project tidak ditemukan.' });
  res.json({ data: p });
}
export async function remove(req, res) {
  if (!(await Project.remove(idSchema.parse(req.params.id)))) return res.status(404).json({ error: 'Project tidak ditemukan.' });
  res.status(204).end();
}