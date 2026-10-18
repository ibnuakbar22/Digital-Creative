import crypto from 'node:crypto';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';
import { pool } from '../db.js';

export const LOCAL_UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

// Supabase Storage bersifat OPSIONAL. Kalau tidak dikonfigurasi, gambar disimpan di database PostgreSQL (Neon).
let supabase = null;
if (config.supabaseUrl && config.supabaseServiceKey) {
  supabase = createClient(config.supabaseUrl, config.supabaseServiceKey, { auth: { persistSession: false } });
}

export async function saveImage(file) {
  const ext = EXT[file.mimetype];
  if (!ext) throw Object.assign(new Error('Format gambar tidak didukung.'), { status: 400 });

  if (supabase) {
    const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
    const { error } = await supabase.storage.from(config.supabaseBucket).upload(name, file.buffer, {
      contentType: file.mimetype, upsert: false, cacheControl: '31536000',
    });
    if (error) throw Object.assign(new Error(`Upload gagal: ${error.message}`), { status: 502 });
    return supabase.storage.from(config.supabaseBucket).getPublicUrl(name).data.publicUrl;
  }

  const { rows } = await pool.query(
    'INSERT INTO uploads (mime, data, size) VALUES ($1, $2, $3) RETURNING id',
    [file.mimetype, file.buffer, file.size],
  );
  return `/api/files/${rows[0].id}`;
}