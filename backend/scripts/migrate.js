import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../src/db.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');
await pool.query('CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');
for (const f of (await fs.readdir(dir)).filter((x) => x.endsWith('.sql')).sort()) {
  if ((await pool.query('SELECT 1 FROM schema_migrations WHERE name = $1', [f])).rowCount) { console.log('skip   ', f); continue; }
  await pool.query(await fs.readFile(path.join(dir, f), 'utf8'));
  await pool.query('INSERT INTO schema_migrations (name) VALUES ($1)', [f]);
  console.log('applied', f);
}
await pool.end();
