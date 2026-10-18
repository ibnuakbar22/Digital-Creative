import fs from 'node:fs/promises';
import path from 'node:path';
import { LOCAL_UPLOAD_DIR, saveImage } from '../src/services/storageService.js';
import { pool } from '../src/db.js';

const MIME_BY_EXT = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

async function migrateUploads() {
  const dryRun = process.argv.includes('--dry-run');
  const { rows } = await pool.query(`
    SELECT cover_url AS url FROM projects WHERE cover_url LIKE '/uploads/%'
    UNION
    SELECT image_url AS url FROM certificates WHERE image_url LIKE '/uploads/%'
  `);

  for (const { url: oldUrl } of rows) {
    const filename = oldUrl.slice('/uploads/'.length);
    if (!/^[A-Za-z0-9_.-]+$/.test(filename) || filename === '.' || filename === '..' || path.basename(filename) !== filename) {
      throw new Error(`URL upload lokal tidak valid: ${oldUrl}`);
    }

    const mime = MIME_BY_EXT[path.extname(filename).toLowerCase()];
    if (!mime) throw new Error(`Format file tidak didukung untuk migrasi: ${filename}`);

    const buffer = await fs.readFile(path.join(LOCAL_UPLOAD_DIR, filename));
    if (dryRun) {
      console.log(`Ready ${filename} (${buffer.length} bytes)`);
      continue;
    }

    const newUrl = await saveImage({ mimetype: mime, buffer, size: buffer.length });

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE projects SET cover_url = $1, updated_at = NOW() WHERE cover_url = $2', [newUrl, oldUrl]);
      await client.query('UPDATE certificates SET image_url = $1, updated_at = NOW() WHERE image_url = $2', [newUrl, oldUrl]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    console.log(`Migrated ${filename}`);
  }

  console.log(`${dryRun ? 'Dry run complete' : 'Migration complete'}: ${rows.length} image file(s).`);
}

try {
  await migrateUploads();
} finally {
  await pool.end();
}
