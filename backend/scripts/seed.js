// Mengisi 4 project yang ada di desain Figma. Tahun & link sengaja kosong (belum ada di desain).
import { pool } from '../src/db.js';

const rows = [
  ['TS KOST', 'WEBSITE', '🪐', 'A modern web experience designed to present accommodation information in a simple and engaging way.'],
  ['BANK BUMI ARTHA', 'SYSTEM PY', '🔮', 'A transaction management system for organizing accounts, transaction records, and monthly financial datA'],
  ['TED-x IPB', 'WEBSITE', '💎', 'Managed and developed the TEDxIPB website, focusing on functionality, responsive design, and delivering a seamless user experience.'],
  ['CALORIE CALCULATOR', 'SYSTEM PY', '⚡', 'A Python-based system for calculating daily calorie needs based on user data and activity levels.'],
];
const { rows: [{ count }] } = await pool.query('SELECT COUNT(*)::int AS count FROM projects');
if (count > 0) console.log(`Dilewati: tabel projects sudah berisi ${count} data.`);
else {
  for (const [i, [name, category, emoji, description]] of rows.entries()) {
    await pool.query('INSERT INTO projects (name, category, emoji, description, sort_order) VALUES ($1,$2,$3,$4,$5)', [name, category, emoji, description, i]);
  }
  console.log('Seed selesai: 4 project dari desain.');
}
await pool.end();
