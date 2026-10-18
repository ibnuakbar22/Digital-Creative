import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../src/db.js';
import { LOCAL_UPLOAD_DIR } from '../src/services/storageService.js';

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicMediaDir = path.resolve(backendDir, '..', 'frontend', 'public', 'assets', 'media');
const dataDir = path.resolve(backendDir, '..', 'frontend', 'src', 'data');
const MIME_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

async function getImage(url) {
  if (url.startsWith('/api/files/')) {
    const id = url.slice('/api/files/'.length);
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error(`URL file tidak valid: ${url}`);
    const { rows } = await pool.query('SELECT mime, data FROM uploads WHERE id = $1', [id]);
    if (!rows[0]) throw new Error(`Gambar tidak ditemukan di database: ${url}`);
    return { mime: rows[0].mime, buffer: rows[0].data, key: id };
  }

  if (url.startsWith('/uploads/')) {
    const filename = url.slice('/uploads/'.length);
    if (!/^[A-Za-z0-9_.-]+$/.test(filename) || filename === '.' || filename === '..' || path.basename(filename) !== filename) {
      throw new Error(`URL upload tidak valid: ${url}`);
    }
    const mime = ({
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
    })[path.extname(filename).toLowerCase()];
    if (!mime) throw new Error(`Format gambar tidak didukung: ${filename}`);
    return { mime, buffer: await fs.readFile(path.join(LOCAL_UPLOAD_DIR, filename)), key: url };
  }

  if (/^https?:\/\//.test(url)) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Gagal mengunduh gambar (${response.status}): ${url}`);
    const mime = response.headers.get('content-type')?.split(';')[0];
    if (!MIME_EXT[mime]) throw new Error(`Jenis gambar remote tidak didukung (${mime}): ${url}`);
    return { mime, buffer: Buffer.from(await response.arrayBuffer()), key: url };
  }

  throw new Error(`URL gambar tidak didukung: ${url}`);
}

async function exportStaticData() {
  const { rows: projects } = await pool.query(`
    SELECT id, name, category, description, emoji, cover_url AS "coverUrl",
           year, demo_url AS "demoUrl", repo_url AS "repoUrl",
           sort_order AS "sortOrder", published
    FROM projects
    WHERE published = TRUE
    ORDER BY sort_order ASC, created_at ASC
  `);
  const { rows: certificates } = await pool.query(`
    SELECT id, title, issuer, image_url AS "imageUrl", year,
           credential_url AS "credentialUrl", sort_order AS "sortOrder", published
    FROM certificates
    WHERE published = TRUE
    ORDER BY sort_order ASC, created_at DESC
  `);

  if (!projects.length || !certificates.length) {
    throw new Error(`Export dibatalkan: ditemukan ${projects.length} project dan ${certificates.length} sertifikat.`);
  }

  await fs.mkdir(publicMediaDir, { recursive: true });
  const exportedImages = new Map();

  async function localizeImage(url) {
    if (!url) return url;
    if (exportedImages.has(url)) return exportedImages.get(url);

    const { mime, buffer, key } = await getImage(url);
    const extension = MIME_EXT[mime];
    if (!extension) throw new Error(`Jenis gambar tidak didukung: ${mime}`);
    const filename = `${crypto.createHash('sha256').update(key).digest('hex')}.${extension}`;
    await fs.writeFile(path.join(publicMediaDir, filename), buffer);
    const localUrl = `/assets/media/${filename}`;
    exportedImages.set(url, localUrl);
    return localUrl;
  }

  for (const project of projects) project.coverUrl = await localizeImage(project.coverUrl);
  for (const certificate of certificates) certificate.imageUrl = await localizeImage(certificate.imageUrl);

  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, 'staticProjects.json'), `${JSON.stringify(projects, null, 2)}\n`);
  await fs.writeFile(path.join(dataDir, 'staticCertificates.json'), `${JSON.stringify(certificates, null, 2)}\n`);
  console.log(`Exported ${projects.length} projects, ${certificates.length} certificates, and ${exportedImages.size} images.`);
}

try {
  await exportStaticData();
} finally {
  await pool.end();
}
