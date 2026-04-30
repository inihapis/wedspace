# Wedspace — Deployment

> Panduan deployment untuk production.

---

## Rekomendasi Arsitektur

```
Frontend (Vercel)  ←→  Backend API (Railway / Render / Fly.io)  ←→  Database (PostgreSQL)
```

**Mengapa tidak menempatkan SQLite di Vercel:**
- Vercel menggunakan storage ephemeral untuk serverless functions
- File SQLite tidak terjamin tersedia antar request atau build
- `wedspace.db` tidak cocok pada deployment Vercel yang bersifat immutable

---

## Opsi Deployment

### Opsi 1: Vercel (frontend) + Railway/Render (backend) + PostgreSQL

- Vercel menyajikan `client/` sebagai static site
- Backend Node/Express berjalan di layanan yang mendukung penyimpanan persisten
- Database di managed PostgreSQL

**Layanan backend yang direkomendasikan:**
- [Railway](https://railway.app)
- [Render](https://render.com)
- [Fly.io](https://fly.io)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)

### Opsi 2: Vercel (frontend) + Supabase (backend/data)

- Frontend tetap di Vercel
- Supabase menyediakan database Postgres, auth, dan edge functions
- Backend Node/Express bisa dikurangi jika logika API dipindahkan ke Supabase

---

## Konfigurasi Vercel (Frontend)

| Setting | Nilai |
|---------|-------|
| Root project | `client/` |
| Build command | `npm install && npm run build` |
| Output directory | `client/dist` |

**Environment variables di Vercel:**

| Variable | Keterangan |
|----------|------------|
| `VITE_API_BASE_URL` | URL backend API |

---

## Environment Variables Backend

| Variable | Keterangan |
|----------|------------|
| `JWT_SECRET` | Secret untuk JWT signing |
| `JWT_EXPIRES_IN` | Durasi token (default: `7d`) |
| `PORT` | Port server |
| `ADMIN_EMAIL` | Email akun admin |
| `ADMIN_PASSWORD` | Password akun admin |
| `DATABASE_URL` | Connection string PostgreSQL (jika migrasi dari SQLite) |

> ⚠️ Ganti semua nilai default sebelum deploy ke production.

---

## Langkah Deployment

1. Hubungkan repository ke Vercel
2. Pilih `client/` sebagai root project
3. Tambahkan environment variables frontend di Vercel
4. Deploy frontend
5. Deploy backend di layanan terpisah (Railway/Render/Fly.io)
6. Pastikan `VITE_API_BASE_URL` di Vercel mengarah ke URL backend yang benar
7. Update CORS di backend untuk mengizinkan domain Vercel

---

## Migrasi Database (SQLite → PostgreSQL)

Untuk production, disarankan migrasi dari sql.js ke PostgreSQL:

1. Ganti driver di `server/db.js` dari `sql.js` ke `pg`
2. Update query jika ada syntax yang berbeda (terutama `INTEGER` vs `SERIAL` untuk auto-increment)
3. Set `DATABASE_URL` di environment backend
4. Jalankan schema migration untuk membuat tabel

> Dependency `pg` sudah tersedia di `server/package.json`.
