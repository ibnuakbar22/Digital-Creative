import { z } from 'zod';
import * as Certificate from '../models/certificateModel.js';

const empty = (v) => (v === '' ? null : v);
const url = z.preprocess(empty, z.string().url().max(500).refine((u) => /^https?:\/\//.test(u), 'Harus diawali http(s)://').nullable());
const imageUrl = z.string().max(500).regex(/^(https?:\/\/|\/uploads\/|\/api\/files\/)/, 'Gambar sertifikat wajib diunggah');
const year = z.preprocess((v) => (v === '' ? null : v == null ? v : Number(v)), z.number().int().min(1990).max(2100).nullable());

const base = z.object({
  title: z.string().trim().min(1).max(160),
  issuer: z.string().trim().max(120).default(''),
  imageUrl,
  year: year.default(null),
  credentialUrl: url.default(null),
  sortOrder: z.coerce.number().int().min(0).max(100000).default(0),
  published: z.boolean().default(true),
});
const updateSchema = base.partial();
const idSchema = z.string().uuid();

export async function listPublic(_req, res) { res.json({ data: await Certificate.list() }); }
export async function listAdmin(_req, res) { res.json({ data: await Certificate.list({ includeUnpublished: true }) }); }
export async function create(req, res) { res.status(201).json({ data: await Certificate.create(base.parse(req.body)) }); }
export async function update(req, res) {
  const c = await Certificate.update(idSchema.parse(req.params.id), updateSchema.parse(req.body));
  if (!c) return res.status(404).json({ error: 'Sertifikat tidak ditemukan.' });
  res.json({ data: c });
}
export async function remove(req, res) {
  if (!(await Certificate.remove(idSchema.parse(req.params.id)))) return res.status(404).json({ error: 'Sertifikat tidak ditemukan.' });
  res.status(204).end();
}