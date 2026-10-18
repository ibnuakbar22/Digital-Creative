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
   Upload gambar disimpan di Supabase Storage jika dikonfigurasi; jika tidak, file disimpan di PostgreSQL agar tetap tersedia setelah deploy.

Frontend publik menggunakan snapshot lokal dan bisa dijalankan tanpa backend maupun database.

### Situs publik tanpa database
Halaman publik memakai snapshot statis project, sertifikat, dan gambar di frontend; pengunjung situs tidak memerlukan koneksi ke database/backend. Untuk mengambil seluruh data terbaru dari database satu kali sebelum deploy, jalankan `npm run export-static` dari folder `backend`. Perintah ini memperbarui `frontend/src/data/staticProjects.json`, `staticCertificates.json`, dan gambar di `frontend/public/assets/media/`. Commit hasil export dan deploy frontend. Perubahan dari dashboard admin tidak otomatis masuk ke situs statis; jalankan export dan deploy ulang setelah perubahan konten.

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
Card di website hanya menampilkan kategori, nama, emoji/cover, dan deskripsi (sesuai desain). Data publik dibaca dari `staticProjects.json`; kartu dirender oleh `ProjectCard.jsx` dan `ProjectList.jsx`. Jika project punya link demo/repo, card bisa diklik. Warna aksen card bergilir otomatis.

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
1. Dari folder `backend`, jalankan `npm run export-static` satu kali untuk menghasilkan snapshot JSON dan gambar statis dari data yang sudah ada. Jangan input ulang project atau sertifikat.
2. Deploy **frontend saja** ke Vercel / Netlify: root `frontend`, build `npm run build`, output `dist`. Bagian publik tidak memanggil API/database; `VITE_API_URL` tidak dibutuhkan untuk menampilkan project dan sertifikat.
3. Jalankan ulang `npm run export-static` dan deploy ulang frontend setiap kali konten perlu diperbarui. Dashboard admin tetap memerlukan backend/database dan bukan jalur pembaruan situs statis.

## Keamanan
Endpoint tulis dilindungi JWT admin; input divalidasi (zod); query memakai parameter (anti SQL injection); `helmet`, CORS dibatasi ke `FRONTEND_ORIGIN`; rate-limit login; upload dibatasi tipe & ukuran; tidak ada secret di frontend. Token admin disimpan di `sessionStorage` (hilang saat tab ditutup).
