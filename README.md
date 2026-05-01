# Wedspace

**Platform web untuk membantu pasangan mempersiapkan pernikahan dengan lebih terorganisir.**

> "Kalau user gak bayar pun, dia tetap bisa nikah dengan tenang pakai produk ini."

---

## Tentang Aplikasi

Wedspace adalah personal wedding planner berbasis web yang membantu pasangan dalam:

- 📋 Mengetahui apa yang harus dilakukan menuju hari pernikahan
- 📊 Mengontrol progress persiapan
- 💰 Memantau kondisi keuangan (budget & tabungan)
- 🤝 Mengurangi chaos & miskomunikasi

---

## Fitur

### Free Plan ✅

- **Dashboard** — Countdown hari H, progress task & budget
- **Timeline & Task** — 31 task auto-generate, 3 status, assign ke pasangan
- **Budget Tracker** — Planned vs actual, progress bar, indikator warna
- **Savings Tracker** — Split kontribusi, riwayat tabungan
- **Notes** — Catatan dengan kategori (vendor, ide, keluarga, dll)

### Premium Plan 💎

- **Charts & Insights** — Progress per fase, distribusi budget, analisis tabungan

---

## Demo

**Email**: `demo@wedspace.id`  
**Password**: `demo123`

---

## Instalasi

### Requirements
- Node.js 18+
- PostgreSQL 12+

### Setup

```bash
# 1. Clone repository
git clone https://github.com/your-username/wedspace.git
cd wedspace

# 2. Install dependencies
npm run install:all

# 3. Setup database
cd server
npm run init

# 4. Start aplikasi
npm run server    # Terminal 1
npm run client    # Terminal 2
```

Buka `http://localhost:5173` di browser.

**Lihat**: [Panduan Instalasi Lengkap](docs/setup/installation.md)

---

## Dokumentasi

### Untuk Pengguna
- [Instalasi & Setup](docs/setup/installation.md)
- [Troubleshooting](docs/setup/troubleshooting.md)

### Untuk Developer
- [Developer Documentation](docs/README.md)
- [Arsitektur Sistem](docs/architecture.md)
- [Struktur Data](docs/data-structure.md)

### Untuk Deployment
- [Panduan Deployment](docs/deployment.md)

---

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS v4
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Auth**: JWT + bcryptjs
- **Charts**: Recharts
- **PWA**: Web App Manifest + Service Worker + IndexedDB

---

## Roadmap

### v0.0.3 ✅
- UI/UX overhaul — luxury & elegant design system
- PWA upgrade — offline support, multi-tenant safe caching
- Profile settings page
- Infrastructure fixes (deploy command, gitignore, admin seed)

### v0.0.4 (Upcoming)
- Code splitting & bundle optimization
- DB schema: `partner_a_nickname`, `partner_b_nickname` columns
- Extended admin features

---

## Changelog

Lihat [CHANGELOG.md](CHANGELOG.md) untuk riwayat perubahan lengkap.

**Current version**: v0.0.3

---

## Lisensi

Private — All rights reserved.

---

**Untuk dokumentasi teknis lengkap, lihat**: [Developer Documentation](docs/README.md)
