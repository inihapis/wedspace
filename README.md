# Wedspace

**Platform web untuk membantu pasangan mempersiapkan pernikahan dengan lebih tenang dan terorganisir.**

> "Kalau user gak bayar pun, dia tetap bisa nikah dengan tenang pakai produk ini."

---

## Tentang Aplikasi

Wedspace adalah personal wedding planner berbasis web dengan model **workspace per pasangan**. Membantu pasangan dalam:

- Mengetahui apa yang harus dilakukan menuju hari pernikahan
- Mengontrol progress persiapan
- Memantau kondisi keuangan (budget & tabungan)
- Mengurangi chaos & miskomunikasi

---

## Fitur

### Free Plan

| Fitur | Deskripsi |
|-------|-----------|
| **Dashboard** | Countdown hari H, progress task & budget, task overdue & mendekati deadline |
| **Timeline & Task** | 31 task auto-generate per fase, 3 status, filter assignee, task custom |
| **Budget Tracker** | Planned vs actual per kategori, progress bar, indikator warna |
| **Savings Tracker** | Split kontribusi, backdate entry, riwayat tabungan |
| **Notes** | Kategori (vendor/ide/keluarga/lainnya), edit, filter |

### Premium Plan

| Fitur | Deskripsi |
|-------|-----------|
| **Charts & Insights** | Progress per fase, distribusi budget, tabungan vs pengeluaran |

---

## Quick Start

```bash
# Install dependencies
npm run install:all

# Copy environment file
cp .env.example .env

# Jalankan backend (port 3001)
npm run server

# Jalankan frontend (port 5173)
npm run client
```

Buka `http://localhost:5173` di browser.

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 + CSS Variables |
| State | React Context API |
| Charts | Recharts |
| Backend | Node.js + Express 5 |
| Database | SQLite via sql.js |
| Auth | JWT + bcryptjs |
| PWA | Web App Manifest + Service Worker |

---

## Dokumentasi

| Dokumen | Keterangan |
|---------|------------|
| [Setup & Instalasi](docs/setup.md) | Instalasi, struktur folder, environment variables |
| [Arsitektur Sistem](docs/architecture.md) | Diagram arsitektur, auth flow, API endpoints |
| [Struktur Data](docs/data-structure.md) | Schema database, entity relationship |
| [Sistem Bisnis](docs/business-system.md) | Model workspace, role, free vs premium |
| [Catatan Pengembangan](docs/development-notes.md) | Status implementasi, roadmap, known issues |
| [Deployment](docs/deployment.md) | Panduan deploy ke production |

### PRD (Archived)

| Dokumen | Keterangan |
|---------|------------|
| [PRD Alpha](docs/prd-alpha.md) | Proof of concept, validasi kebutuhan inti |
| [PRD Beta](docs/prd-beta.md) | Nama produk, model bisnis, fitur premium |

---

## Changelog

Lihat [CHANGELOG.md](CHANGELOG.md) untuk riwayat perubahan lengkap.

---

## Lisensi

Private — All rights reserved.
