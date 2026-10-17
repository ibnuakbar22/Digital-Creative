import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function requireAdmin(req, res, next) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || '');
  if (!m) return res.status(401).json({ error: 'Autentikasi diperlukan.' });
  try {
    const payload = jwt.verify(m[1], config.jwtSecret, { algorithms: ['HS256'] });
    if (payload.role !== 'admin') throw new Error('role');
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Token tidak valid atau kedaluwarsa.' });
  }
}
