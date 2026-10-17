import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { config } from '../config.js';

const schema = z.object({ email: z.string().email(), password: z.string().min(1).max(200) });

export async function login(req, res) {
  const { email, password } = schema.parse(req.body);
  // Selalu jalankan bcrypt agar waktu respons tidak membocorkan apakah email benar.
  const okPass = await bcrypt.compare(password, config.adminPasswordHash);
  if (!okPass || email.toLowerCase() !== config.adminEmail) {
    return res.status(401).json({ error: 'Email atau password salah.' });
  }
  const token = jwt.sign({ role: 'admin', email: config.adminEmail }, config.jwtSecret, { algorithm: 'HS256', expiresIn: '12h' });
  res.json({ token, expiresIn: 12 * 3600 });
}
