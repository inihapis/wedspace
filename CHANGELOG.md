# Changelog

Semua perubahan penting pada proyek Wedspace didokumentasikan di sini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Guest management (daftar tamu, RSVP)
- Vendor tracking (kontak, status booking, harga)
- Notifikasi / reminder task mendekati deadline
- Export data (PDF/Excel)
- UI polish & animasi
- Multi-user collaboration (pasangan login dengan akun berbeda ke workspace yang sama)
- Analytics lanjutan (trend pengeluaran, prediksi)
- Vendor marketplace
- Undangan digital
- Mobile app (React Native)

---

## [0.0.2] — May 2026 (Mobile Experience & Brand Positioning)

Fokus pada peningkatan mobile experience, reliabilitas data sync, penyempurnaan brand positioning, dan cleanup setup.

### Added
- **AdminMobileHeader** — Mobile header untuk admin panel dengan direct logout button (tanpa dropdown redundan)
- **Auto-refresh on Focus** — Data otomatis refresh ketika app kembali ke foreground via `window.focus` event
- **Private Browsing Detection** — Deteksi localStorage availability di AuthContext, expose `isPrivateBrowsing` flag
- **Dokumentasi terstruktur** — Folder `docs/` diorganisir dengan subfolder `releases/`, `setup/`, `guides/`

### Changed
- **Tagline & Meta Description** — "Persiapan nikah jadi lebih tenang" → "Platform yang membantu Anda mempersiapkan pernikahan dengan lebih terorganisir" (di `index.html` dan `AuthPage.jsx`)
- **Theme Color** — `#1a56db` (biru) → `#2B2B2B` (dark) di `index.html`, konsisten dengan design system dan `manifest.json`
- **Admin Mobile UX** — Dropdown menu dihapus, diganti direct logout button

### Fixed
- **Demo credentials di SETUP.md** — Diperbaiki dari `demo@wedspace.com / Demo123456` ke `demo@wedspace.id / demo123`
- **Duplicate env vars** — `ADMIN_EMAIL` & `ADMIN_PASSWORD` duplikat dihapus dari `server/.env`
- **`.env.example`** — Database name diupdate dari `weddingprep` ke `wedspace`, variabel tidak terpakai dihapus

### Removed
- **`sql.js` dependency** — Dihapus dari root `package.json` (project menggunakan PostgreSQL)
- **Unused imports** — `DEFAULT_BUDGET_ITEMS` dan `all` dihapus dari `server/scripts/migrate.js`
- **Dokumentasi duplikat** — 12+ file dokumentasi di root dikonsolidasi ke `docs/`

### Technical
- `AppContext`: tambah focus event listener untuk auto-refresh
- `AuthContext`: tambah `isLocalStorageAvailable()` helper dan `isPrivateBrowsing` state
- Build: 2318 modules, ~455ms, no errors

---

## [0.0.1a] — 2026 (Component Refactoring & Navigation Polish)

Rilis alpha dengan fokus pada refactoring komponen dan penyempurnaan navigasi.

### Added
- **Centralized Navigation Data** — `client/src/data/navigation.js` untuk konfigurasi navigasi terpusat
- **Reusable Shared Components** — Card, Button, Input, Section, Badge untuk konsistensi UI
- **Feature Components** — ProgressBar, DonutGauge untuk chart reusable
- **Mobile Center Navigation** — `center: true` property untuk item yang ditampilkan di tengah di mobile
- **Premium Chart Standardization** — Semua premium chart menggunakan Card component dengan LockedChartCard pattern
- **AdminBottomNav Center Support** — Admin navigation sekarang support center positioning di mobile

### Changed
- **Component Structure** — Reorganisasi ke `layouts/`, `pages/`, `shared/`, `features/`
- **Inline Styles → Tailwind** — Semua komponen menggunakan Tailwind classes dengan CSS variables
- **Navigation Order** — Dashboard di urutan pertama di desktop, di tengah di mobile
- **Chart Types** — "Rencana vs Aktual" di Budget menggunakan BarChart (horizontal) bukan PieChart
- **Locked Charts** — Menampilkan blurred preview dengan lock overlay dan upgrade button

### Technical
- Tailwind CSS v4 dengan CSS variables mapping (`bg-primary`, `text-text`, dll)
- Flexible LockedChartCard dengan parameter `isBarChart` untuk support multiple chart types
- Consistent Card component usage across all premium features
- Improved mobile navigation UX dengan center positioning

### Build Status
- ✅ 2317 modules transformed
- ✅ No errors or warnings
- ✅ Build time: ~300ms

---

## [0.0.1] — 2026 (Beta Final → Production-ready)

Rilis pertama yang siap digunakan secara publik. Semua fitur inti dari PRD Beta telah diimplementasikan penuh.

### Added
- **Auth system** — register, login, JWT session dengan auto-restore dari localStorage
- **Onboarding 3-step** — input nama pasangan + nickname, tanggal pernikahan, target keuangan
- **Dashboard / Today View** — countdown hari H, progress task, ringkasan budget & tabungan
- **Timeline & Task** — 31 task auto-generate berdasarkan tanggal nikah, dikelompokkan per fase (6–12 bln, 3–6 bln, 1–3 bln, H-30, H-7, H-1), 3 status (todo/in_progress/done), filter assignee, tambah task custom
- **Budget Tracker** — planned vs actual per kategori, progress bar, indikator warna (aman/waspada/over), kategori custom
- **Savings Tracker** — split kontribusi (pasanganA/pasanganB/lainnya), backdate entry, riwayat tabungan, progress persentase
- **Notes** — catatan dengan kategori (vendor/ide/keluarga/lainnya), edit, filter, timestamp
- **Charts** (Premium-gated) — progress per fase, distribusi budget, perbandingan tabungan vs pengeluaran
- **Admin Panel** — statistik workspace, manajemen plan (free/premium), aktivasi/suspensi workspace
- **PWA support** — Web App Manifest + Service Worker (cache-first untuk static assets)
- **Responsive layout** — desktop sidebar + mobile bottom navigation
- **Design tokens** — semua warna via CSS variables di `index.css`, tidak ada hardcode warna
- **Format Rupiah konsisten** — `Rp 10.000.000` di seluruh aplikasi
- **Welcome message** — menggunakan nickname pasangan (`Halo, Budi & Ani!`)
- **Workspace model** — 1 akun = 1 workspace, data terisolasi antar workspace
- **Premium locked state** — user non-premium melihat CTA upgrade, bukan error

### Technical
- Stack: React 19 + Vite, Tailwind CSS v4, React Context API, Recharts
- Backend: Node.js + Express 5, SQLite via sql.js, JWT + bcryptjs
- Database schema: `users`, `workspaces`, `tasks`, `budget_items`, `savings_entries`, `notes`
- Optimistic UI update dengan revert on error
- REST API lengkap (auth, workspace, tasks, budget, savings, notes, admin)

---

## [Beta] — 2026

Fase beta — produk diberi nama resmi **Wedspace**, model bisnis ditetapkan (free-first), fitur premium diidentifikasi.

### Added
- Nama produk resmi: **Wedspace**
- Model workspace: 1 akun = 1 workspace (digunakan bersama pasangan)
- Personalisasi workspace: nama pasangan, nickname, hashtag pasangan
- Task assignment ke: Berdua, Pasangan A, Pasangan B, Keluarga
- Status task 3-level: ⬜ Belum / 🟡 Sedang / ✅ Selesai
- Savings Tracker dengan dukungan backdate entry
- Notes dengan kategori ringan
- **Free Plan** — semua fitur inti tersedia tanpa bayar
- **Premium Plan** — Charts & Insights (Gantt-like, distribusi budget, tabungan vs pengeluaran)
- Admin system: monitoring workspace, kontrol status & plan
- Prinsip premium: *"Kalau user gak bayar pun, dia tetap bisa nikah dengan tenang"*
- UI/UX: mobile-first, card-based layout, soft shadow, rounded modern
- PWA-ready (web app manifest)
- Session-based auth dengan JWT

### Changed
- Nama produk dari "Wedding Planner Personal" → **Wedspace**
- Model user dari individu → workspace per pasangan
- Field `priority` pada task dihapus (tidak ada UI untuk mengaturnya)
- Design direction: lebih clean, minimal, tidak "terlalu wedding"

### Defined (Non-Goals)
- Tidak ada marketplace vendor
- Tidak ada integrasi pembayaran
- Tidak ada undangan digital
- Tidak ada AI recommendation
- Tidak ada multi-user login ke workspace yang sama (ditunda ke Phase 3)

---

## [Alpha] — 2026

Fase alpha — proof of concept, validasi kebutuhan inti, belum ada nama produk resmi.

### Defined
- Nama sementara: **"Wedding Planner Personal"**
- Target user: individu/pasangan yang mempersiapkan pernikahan, tidak harus tech-savvy
- Core user needs:
  - "Gue harus ngapain sekarang?"
  - "Udah sejauh mana persiapannya?"
  - "Uang gue masih aman gak?"
  - "Siapa yang harus ngerjain ini?"

### Scoped (MVP Features)
- **Today View** — task hari ini, mendekati deadline, overdue; checklist cepat
- **Timeline & Task** — auto-generate per fase, assign ke diri sendiri/pasangan/keluarga
- **Budget Tracker** — total budget, kategori, planned vs actual, progress bar, indikator warna
- **Savings Tracker** — target dana, input tabungan, split kontribusi, progress %
- **Task Assignment** — distribusi kerja yang jelas
- **Notes** — catatan cepat dengan kategori (vendor/ide/catatan keluarga)

### Design Direction
- Color palette: Deep Blue `#003082`, Warm White `#FAFAFA`, Soft Peach `#F5DADF`, Soft Gold `#C8A96A`, Dark Gray `#1E293B`
- Visual feel: clean seperti dashboard kerja, tapi lebih hangat, banyak whitespace, card-based

### Non-Goals (Alpha)
- Marketplace vendor
- Integrasi pembayaran
- Fitur undangan digital
- AI recommendation
- Reporting detail

---

[Unreleased]: https://github.com/your-org/wedspace/compare/v0.0.2...HEAD
[0.0.2]: https://github.com/your-org/wedspace/compare/v0.0.1a...v0.0.2
[0.0.1a]: https://github.com/your-org/wedspace/compare/v0.0.1...v0.0.1a
[0.0.1]: https://github.com/your-org/wedspace/compare/beta...v0.0.1
[Beta]: https://github.com/your-org/wedspace/compare/alpha...beta
[Alpha]: https://github.com/your-org/wedspace/releases/tag/alpha
