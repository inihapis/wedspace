# Wedspace — Sistem Bisnis

---

## Model Workspace

Wedspace menggunakan model **workspace per pasangan**, bukan per individu:

- 1 akun email = 1 workspace
- Workspace digunakan bersama oleh kedua pasangan
- Tidak ada multi-user login ke workspace yang sama (MVP — ditunda ke Phase 3)
- Data workspace terisolasi — tidak ada akses antar workspace

---

## Role

| Role | Akses | Batasan |
|------|-------|---------|
| **User** | Semua fitur workspace sendiri | Tidak bisa akses workspace lain |
| **Admin** | Monitoring & provisioning semua workspace | Tidak bisa lihat task, budget, notes user |

**Admin bisa:**
- Melihat statistik (jumlah workspace, user, premium)
- Mengubah status workspace (active / suspended)
- Mengubah plan workspace (free / premium)

**Admin tidak bisa:**
- Melihat task, budget, catatan, tabungan user
- Login sebagai user lain

---

## Model Bisnis (Free-first)

### Free Plan

Semua fitur inti tersedia tanpa biaya:

- Dashboard
- Timeline & Task
- Budget Tracker
- Savings Tracker
- Notes

### Premium Plan

Fitur tambahan untuk user yang upgrade:

- Charts & Insights (visualisasi Gantt-like, distribusi budget, perbandingan tabungan vs pengeluaran)

**Prinsip:**

> "Kalau user gak bayar pun, dia tetap bisa nikah dengan tenang pakai produk ini."

User non-premium yang mengakses Charts akan melihat **locked state** dengan CTA upgrade — bukan error atau halaman kosong.

---

## Design System

Semua warna menggunakan CSS variables (design tokens) di `client/src/index.css`.

| Token | Keterangan |
|-------|------------|
| `--color-primary` | Biru utama |
| `--color-primary-dark` | Biru gelap (hover) |
| `--color-primary-light` | Biru muda (background) |
| `--color-accent` | Gold (premium, highlight) |
| `--color-success` | Hijau |
| `--color-warning` | Kuning/oranye |
| `--color-danger` | Merah |
| `--color-bg` | Background halaman |
| `--color-surface` | Background card |
| `--color-border` | Border |
| `--color-text` | Teks utama |
| `--color-text-muted` | Teks sekunder |
| `--color-text-subtle` | Teks tersier |

Untuk mengubah tema, cukup edit nilai di `:root` — semua komponen akan ikut berubah.
