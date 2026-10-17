import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { config, isProd } from '../config.js';

export const LOCAL_UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

let supabase = null;
if (config.supabaseUrl && config.supabaseServiceKey) {
  supabase = createClient(config.supabaseUrl, config.supabaseServiceKey, { auth: { persistSession: false } });
}

/** Menyimpan gambar ke object storage (Supabase). Disk lokal hanya untuk development. */
export async function saveImage(file) {
  const ext = EXT[file.mimetype];
  if (!ext) throw Object.assign(new Error('Format gambar tidak didukung.'), { status: 400 });
  const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;

  if (supabase) {
    const { error } = await supabase.storage.from(config.supabaseBucket).upload(name, file.buffer, {
      contentType: file.mimetype, upsert: false, cacheControl: '31536000',
    });
    if (error) throw Object.assign(new Error(`Upload gagal: ${error.message}`), { status: 502 });
    return supabase.storage.from(config.supabaseBucket).getPublicUrl(name).data.publicUrl;
  }
  if (isProd) {
    throw Object.assign(new Error('Object storage belum dikonfigurasi (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).'), { status: 503 });
  }
  await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_UPLOAD_DIR, name), file.buffer);
  return `/uploads/${name}`;
}
