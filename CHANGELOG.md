# Changelog

Semua perubahan penting pada Wedspace didokumentasikan di sini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.0.3] — 2026-05-01

### Added
- **Profile page** — Halaman pengaturan workspace: nama pasangan, nickname, hashtag, tanggal nikah, target keuangan
- **IndexedDB integration** (`client/src/utils/idb.js`) — Offline storage scoped per userId
- **PWA utilities** (`client/src/utils/pwa.js`) — SW registration, messaging, offline detection
- **Offline banner** — Banner otomatis muncul saat koneksi terputus
- **Deploy script** di `server/package.json` — `npm run deploy` untuk Railway/production
- **Admin seed** di `migrate.js` — Akun admin dibuat saat init, baca dari env `ADMIN_EMAIL`/`ADMIN_PASSWORD`
- **`install:server` script** di root `package.json`
- **Gold gradient icon** — PWA icon diupdate dengan gold gradient

### Changed
- **Design system** — Color primary dari `#1a56db` (biru) ke `#2B2B2B` (charcoal), background ke warm cream `#F7F3EE`, accent gold `#C6A96B`
- **Elevation system** — CSS shadow variables baru (`--shadow-xs` s/d `--shadow-gold`)
- **Sidebar** — Redesign ke dark charcoal luxury dengan gold active indicator
- **Mobile nav** — Home di tengah (elevated), active state dengan dot indicator
- **Dashboard** — Charts sebagai fokus utama, hero countdown dengan donut gauge, XL 2/3+1/3 grid
- **Budget, Timeline, Savings, Notes** — XL 3-column grid, luxury card styling
- **Charts** — Luxury redesign dengan insight cards
- **AuthPage** — Gold ring logo, warm background, luxury card
- **Service Worker** — Full rewrite: network-first + IDB fallback, multi-tenant safe, auth-aware
- **AppContext** — Offline-aware: network-first, IDB fallback, auto-persist, auto-revalidate
- **AuthContext** — Logout membersihkan IDB + notify SW
- **`install:all`** — Dari `npm install && install:client` ke `install:server && install:client`
- **Root `package.json`** — Hapus semua `dependencies` (duplikat dari server)
- **PWA manifest** — Icon dari `.png` ke `.svg`, warna diupdate

### Fixed
- `server/.env` tidak ter-ignore oleh git (di-untrack + `.gitignore` diperbaiki)
- `.kiro/` format di `.gitignore` diperbaiki dari `.kiro/*` ke `.kiro/`
- Service worker error `chrome-extension://` di console
- PWA manifest referensi icon `.png` yang tidak ada
- `install:all` tidak lagi install deps di root yang tidak perlu

### Security
- IDB data di-scope per `userId` — tidak ada cross-user data leakage
- Logout membersihkan semua data user dari IDB dan SW cache
- Auth endpoints (`/api/auth/login`, `/api/auth/register`) tidak pernah di-cache
- Admin endpoints (`/api/admin/*`) tidak pernah di-cache
- JWT hanya di-decode untuk cache key, tidak untuk auth (server tetap verify)

---

## [0.0.2] — 2026-05-01

### Added
- **Admin Mobile Header** — Simplified header dengan direct logout button
- **Private Browsing Detection** — Deteksi dan warning untuk private browsing
- **Auto-refresh on Focus** — Data refresh otomatis saat app kembali ke foreground

### Changed
- **Meta Description** — Diupdate untuk mencerminkan positioning sebagai helper platform
- **AuthPage Tagline** — Diupdate sesuai brand positioning baru
- **Theme Color** — Dari `#1a56db` ke `#2B2B2B` untuk Safari mobile

### Fixed
- Data stale saat kembali ke app setelah lama di background
- localStorage unavailable di private browsing (silent fail → graceful handling)

---

## [0.0.1a] — 2026-05

### Added
- Reusable shared components: `Card`, `SummaryCard`, `LockedCard`, `Button`, `Input`, `Section`, `Badge`
- Feature components: `ProgressBar`, `DonutGauge`
- Centralized navigation configuration (`client/src/data/navigation.js`)

### Changed
- Semua inline styles diganti Tailwind classes
- Struktur folder komponen: `layouts/`, `pages/`, `shared/`, `features/`
- Mobile center navigation untuk better thumb reach
- Premium chart standardization dengan `LockedChartCard` pattern

### Fixed
- "Rencana vs Aktual" chart type (BarChart horizontal)
- Duplikasi dokumentasi dikonsolidasi

---

## [0.0.1] — 2026-05

### Added
- Dashboard dengan countdown, progress task & budget
- Timeline & Task — 31 task auto-generate, 6 fase, 3 status
- Budget Tracker — planned vs actual, progress bar
- Savings Tracker — split kontribusi, riwayat
- Notes — kategori vendor/ide/keluarga/lainnya
- Charts & Insights (Premium) — progress per fase, distribusi budget
- Admin Panel — stats, workspace management, user management
- Onboarding flow
- JWT authentication
- PostgreSQL database
- PWA manifest + basic service worker

---

[0.0.3]: https://github.com/your-username/wedspace/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/your-username/wedspace/compare/v0.0.1a...v0.0.2
[0.0.1a]: https://github.com/your-username/wedspace/compare/v0.0.1...v0.0.1a
[0.0.1]: https://github.com/your-username/wedspace/releases/tag/v0.0.1
