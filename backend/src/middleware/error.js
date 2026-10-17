import { ZodError } from 'zod';
import { isProd } from '../config.js';

export const notFound = (_req, res) => res.status(404).json({ error: 'Endpoint tidak ditemukan.' });

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(422).json({ error: 'Data tidak valid.', details: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })) });
  }
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Ukuran gambar maksimal 5 MB.' });
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 && isProd ? 'Terjadi kesalahan pada server.' : err.message });
}
