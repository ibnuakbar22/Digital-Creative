import { pool } from '../db.js';

const COLS = 'id, name, category, description, emoji, cover_url, year, demo_url, repo_url, sort_order, published, created_at, updated_at';

// Mengubah baris database (snake_case) menjadi objek API (camelCase).
export const toApi = (r) => ({
  id: r.id, name: r.name, category: r.category, description: r.description, emoji: r.emoji,
  coverUrl: r.cover_url, year: r.year, demoUrl: r.demo_url, repoUrl: r.repo_url,
  sortOrder: r.sort_order, published: r.published, createdAt: r.created_at, updatedAt: r.updated_at,
});

export async function list({ includeUnpublished = false } = {}) {
  const where = includeUnpublished ? '' : 'WHERE published = TRUE';
  const { rows } = await pool.query(`SELECT ${COLS} FROM projects ${where} ORDER BY sort_order ASC, created_at ASC`);
  return rows.map(toApi);
}

export async function get(id) {
  const { rows } = await pool.query(`SELECT ${COLS} FROM projects WHERE id = $1`, [id]);
  return rows[0] ? toApi(rows[0]) : null;
}

export async function create(d) {
  const { rows } = await pool.query(
    `INSERT INTO projects (name, category, description, emoji, cover_url, year, demo_url, repo_url, sort_order, published)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING ${COLS}`,
    [d.name, d.category, d.description, d.emoji, d.coverUrl, d.year, d.demoUrl, d.repoUrl, d.sortOrder, d.published],
  );
  return toApi(rows[0]);
}

const FIELD_MAP = {
  name: 'name', category: 'category', description: 'description', emoji: 'emoji', coverUrl: 'cover_url',
  year: 'year', demoUrl: 'demo_url', repoUrl: 'repo_url', sortOrder: 'sort_order', published: 'published',
};

export async function update(id, d) {
  const sets = [];
  const vals = [];
  for (const [k, col] of Object.entries(FIELD_MAP)) {
    if (d[k] !== undefined) { vals.push(d[k]); sets.push(`${col} = $${vals.length}`); }
  }
  if (!sets.length) return get(id);
  vals.push(id);
  const { rows } = await pool.query(
    `UPDATE projects SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${vals.length} RETURNING ${COLS}`, vals);
  return rows[0] ? toApi(rows[0]) : null;
}

export async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM projects WHERE id = $1', [id]);
  return rowCount > 0;
}
