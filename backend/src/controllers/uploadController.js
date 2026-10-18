import multer from 'multer';
import { z } from 'zod';
import { pool } from '../db.js';
import { saveImage } from '../services/storageService.js';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => (ALLOWED.has(file.mimetype) ? cb(null, true) : cb(Object.assign(new Error('Hanya JPG, PNG, WEBP, atau GIF.'), { status: 400 }))),
}).single('image');

export async function uploadImage(req, res) {
  if (!req.file) return res.status(400).json({ error: 'File "image" wajib diisi.' });
  res.status(201).json({ url: await saveImage(req.file) });
}

// Menyajikan gambar yang tersimpan di database (publik, di-cache lama karena id-nya unik).
export async function serveFile(req, res) {
  const id = z.string().uuid().parse(req.params.id);
  const { rows } = await pool.query('SELECT mime, data FROM uploads WHERE id = $1', [id]);
  if (!rows[0]) return res.status(404).json({ error: 'File tidak ditemukan.' });
  res.set({
    'Content-Type': rows[0].mime,
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
  });
  res.send(rows[0].data);
}