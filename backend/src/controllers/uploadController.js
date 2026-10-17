import multer from 'multer';
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
