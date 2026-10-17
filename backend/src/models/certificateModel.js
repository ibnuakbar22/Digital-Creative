import { pool } from '../db.js';

const COLS = 'id, title, issuer, image_url, year, credential_url, sort_order, published, created_at, updated_at';

const toApi = (r) => ({
    id: r.id, title: r.title, issuer: r.issuer, imageUrl: r.image_url, year: r.year,
    credentialUrl: r.credential_url, sortOrder: r.sort_order, published: r.published,
    createdAt: r.created_at, updatedAt: r.updated_at,
});

export async function list({ includeUnpublished = false } = {}) {
    const where = includeUnpublished ? '' : 'WHERE published = TRUE';
    const { rows } = await pool.query(`SELECT ${COLS} FROM certificates ${where} ORDER BY sort_order ASC, created_at DESC`);
    return rows.map(toApi);
}

export async function create(d) {
    const { rows } = await pool.query(
        `INSERT INTO certificates (title, issuer, image_url, year, credential_url, sort_order, published)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING ${COLS}`,
        [d.title, d.issuer, d.imageUrl, d.year, d.credentialUrl, d.sortOrder, d.published],
    );
    return toApi(rows[0]);
}

const FIELD_MAP = { title: 'title', issuer: 'issuer', imageUrl: 'image_url', year: 'year', credentialUrl: 'credential_url', sortOrder: 'sort_order', published: 'published' };

export async function update(id, d) {
    const sets = [];
    const vals = [];
    for (const [k, col] of Object.entries(FIELD_MAP)) {
        if (d[k] !== undefined) { vals.push(d[k]); sets.push(`${col} = $${vals.length}`); }
    }
    if (!sets.length) {
        const { rows } = await pool.query(`SELECT ${COLS} FROM certificates WHERE id = $1`, [id]);
        return rows[0] ? toApi(rows[0]) : null;
    }
    vals.push(id);
    const { rows } = await pool.query(
        `UPDATE certificates SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${vals.length} RETURNING ${COLS}`, vals);
    return rows[0] ? toApi(rows[0]) : null;
}

export async function remove(id) {
    const { rowCount } = await pool.query('DELETE FROM certificates WHERE id = $1', [id]);
    return rowCount > 0;
}