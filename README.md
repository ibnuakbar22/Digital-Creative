# Portfolio — Muhammad Ibnu Akbar (Creative Digital)

Frontend **React + Vite**, backend **Node.js + Express**, database **PostgreSQL (Supabase)**, gambar di **Supabase Storage**.
Desain mobile 390px diambil dari file Figma Anda; **tablet (≥768px) dan desktop (≥1200px) dirancang baru** sebagai turunan desain mobile.

## Struktur
```
portfolio/
├── frontend/
│   ├── public/assets/{images,icons/tech,icons/social,files}   ← aset hasil ekstrak dari .fig
│   └── src/{components,sections,pages,admin,data,services,styles}
├── backend/
│   ├── migrations/001_init.sql          ← schema database
│   ├── scripts/{migrate,seed,hash-password}.js
│   └── src/{routes,controllers,services,models,middleware}
├── .env.example
└── README.md
```

## Menjalankan (development)
Prasyarat: Node.js ≥ 20 dan sebuah database PostgreSQL (paling mudah: project gratis di supabase.com).

1. **Backend**
   ```bash
   cd backend && npm install
   cp ../.env.example ../.env          # lalu isi (lihat bagian .env)
   npm run hash-password -- "passwordAdminKamu"   # tempel hasilnya ke ADMIN_PASSWORD_HASH
   npm run migrate                     # membuat tabel
   npm run seed                        # (opsional) mengisi 4 project dari desain
   npm run dev                         # http://localhost:4000/api
   ```
2. **Frontend** (terminal lain)
   ```bash
   cd frontend && npm install && npm run dev     # http://localhost:5173
   ```
3. Admin dashboard: **http://localhost:5173/admin** (login dengan ADMIN_EMAIL + password di atas).
   Tanpa konfigurasi Supabase Storage, upload gambar disimpan di `backend/uploads` (hanya untuk development).

Frontend tetap bisa dibuka tanpa backend: card project memakai 4 project dari desain sebagai cadangan.

## .env
Lihat `.env.example` (semua variabel dijelaskan). Jangan pernah commit `.env`. Service-role key Supabase hanya boleh ada di backend.

## Yang harus Anda isi
| Apa | Di mana |
|---|---|
| Link media sosial (GitHub, Dribbble, Behance, X, Instagram, LinkedIn) + handle | `frontend/src/data/site.js` → `socials` |
| Ikon sosial asli (opsional, placeholder monogram sekarang) | ganti `frontend/public/assets/icons/social/<id>.svg` |
| File CV / Pitch Deck | `frontend/public/assets/files/cv.pdf` |
| Tahun, link demo, link repo, cover tiap project | Admin dashboard `/admin` |
| Konten Achievements (teks desain masih nama "AURA VISUALS") & link-nya | `frontend/src/data/content.js` → `achievements`, dan `site.js` → `copyright` |
| Teks footer / copyright jika ingin diubah | `frontend/src/data/site.js` |

## Model data project
`id (uuid) · name · category · description · emoji · coverUrl · year · demoUrl · repoUrl · sortOrder · published · createdAt · updatedAt`
Card di website hanya menampilkan kategori, nama, emoji/cover, dan deskripsi (sesuai desain). Seluruh card adalah satu komponen: `ProjectCard.jsx`, dirender oleh `ProjectList.jsx` dari `projectService.js`. Jika project punya link demo/repo, card bisa diklik. Warna aksen card bergilir otomatis.

## API (`/api`, JSON)
| Method & path | Auth | Keterangan |
|---|---|---|
| `GET /health` | – | `{ ok: true }` |
| `POST /auth/login` | – | body `{email,password}` → `{token,expiresIn}`; dibatasi 10 percobaan/15 menit |
| `GET /projects` | – | `{data:[Project]}` hanya yang `published` |
| `GET /projects/:id` | – | `{data:Project}` / 404 |
| `GET /admin/projects` | Bearer | semua project termasuk yang disembunyikan |
| `POST /projects` | Bearer | body: `name`,`category` wajib; lainnya opsional → 201 `{data}` |
| `PUT /projects/:id` | Bearer | update sebagian field → `{data}` |
| `DELETE /projects/:id` | Bearer | 204 |
| `POST /uploads` | Bearer | multipart field `image` (JPG/PNG/WEBP/GIF ≤ 5 MB) → `{url}` |

Error: `{ "error": "pesan", "details": [{field,message}] }` (422 untuk validasi, 401 auth, 404, 413 file besar).
Header: `Authorization: Bearer <token>`.

## Deployment
1. **Supabase**: buat project → ambil *Connection string* (DATABASE_URL) → buat bucket Storage **publik** bernama `project-covers` → ambil `SUPABASE_URL` dan `service_role` key.
2. **Backend** (Render / Railway / Fly): root `backend`, build `npm install`, start `npm start`. Set env: `NODE_ENV=production`, `DATABASE_URL`, `DATABASE_SSL=true`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `FRONTEND_ORIGIN=https://domain-frontend-anda`, `SUPABASE_*`. Jalankan sekali `npm run migrate` (dan `npm run seed` jika mau).
3. **Frontend** (Vercel / Netlify): root `frontend`, build `npm run build`, output `dist`. Set `VITE_API_URL=https://url-backend-anda`. SPA fallback sudah disiapkan (`vercel.json`, `_redirects`).
4. Gunakan HTTPS di kedua sisi. Ganti password admin dan `JWT_SECRET` dengan nilai kuat.

## Keamanan
Endpoint tulis dilindungi JWT admin; input divalidasi (zod); query memakai parameter (anti SQL injection); `helmet`, CORS dibatasi ke `FRONTEND_ORIGIN`; rate-limit login; upload dibatasi tipe & ukuran; tidak ada secret di frontend. Token admin disimpan di `sessionStorage` (hilang saat tab ditutup).
